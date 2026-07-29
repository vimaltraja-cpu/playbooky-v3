"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ActivityCard } from "@/components/ui/ActivityCard";
import { ActivityDetailModal } from "@/components/ui/ActivityDetailModal";

import { PlaybackControls } from "../shared/PlaybackControls";
import { rectFromElement, scaleDuration, type Rect } from "../shared/geometry";
import type { ConceptMeta, ConceptPhase, PlaybackSpeed, V3PrototypeCard } from "../shared/types";
import { useSystemReducedMotionPreference } from "../shared/useReducedMotionPreference";

export const apertureRevealMeta: ConceptMeta = {
  id: "aperture-reveal",
  name: "Aperture Reveal",
  tagline: "Concept 3 — clipped canvas takeover, not a resizing box",
  principle:
    "Rather than a card growing into a modal-shaped rectangle, the whole surface becomes a single full-bleed working canvas that reveals itself through a circular aperture centred on the card the person just chose. Nothing changes width or height as separate steps — one radial clip-path expands from a point to full coverage while the canvas beneath fades from tonal to true content. The remaining activities don't disappear; they settle into a slim context rail along the edge, so the person always has a quiet way back without the transition looking like a modal box being resized. This models PlayBooky's diagnosis flow as 'stepping into' one activity rather than 'popping open' a dialog — deliberately calmer and more spatial than a shared-element morph.",
  sequence: [
    "Selection acknowledgement — the tapped card lifts slightly (70ms).",
    "Environmental soften — sibling cards dim/blur as one field; the aperture centre locks to the card's centre (150ms).",
    "Aperture transform — a radial clip-path expands from the card's centre to full canvas coverage while the canvas base tone fades in (380ms).",
    "Context rail settles — remaining activities collapse into a slim edge rail, quietly present but out of the way (200ms, overlaps aperture tail).",
    "Primary content — heading and orientation text resolve once the aperture is most of the way open (160ms).",
    "Supporting content — the builder-flow row follows (120ms).",
    "Actions — footer actions arrive last, once the canvas is fully still (100ms).",
    "Final focused state — full canvas is the working surface; rail and close control provide the way back."
  ],
  specs: [
    { property: "Selection acknowledge", duration: "70ms", easing: "ease-out", note: "translateY(-2px) + shadow lift on the origin card only" },
    { property: "Sibling soften", duration: "150ms", easing: "cubic-bezier(0.33, 1, 0.68, 1)", note: "opacity 1→0.5, blur 0→2px, one field, not per card" },
    { property: "Aperture clip-path", duration: "380ms", easing: "cubic-bezier(0.16, 1, 0.3, 1)", note: "circle(r at origin-x origin-y), r: 2%→150% — clip-path + opacity only, no width/height tween" },
    { property: "Canvas base fade", duration: "220ms", easing: "ease-out", note: "tonal panel → true canvas background, runs inside the clip" },
    { property: "Context rail", duration: "200ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "sibling thumbnails settle into the edge rail, starts 120ms into the aperture transform" },
    { property: "Heading/orientation", duration: "160ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "starts once aperture reaches ~75% coverage" },
    { property: "Supporting content", duration: "120ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "90ms after heading" },
    { property: "Actions", duration: "100ms", easing: "ease-out", note: "80ms after supporting content — final settle" },
    { property: "Close reversal", duration: "300ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", note: "content exits together (90ms) before the aperture contracts back to the origin card's centre (300ms)" }
  ],
  strengths: [
    "Structurally distinct from a resizing box — nothing ever looks like a rectangle stepping between two sizes, because the geometry is a radial clip, not a box tween.",
    "The context rail keeps peripheral orientation available without competing with the focused canvas, which fits a guided, one-task-at-a-time diagnosis flow.",
    "Reads as 'stepping into a focused space' rather than 'a dialog opened over the page', which is a calmer register for a business-diagnosis product."
  ],
  risks: [
    "clip-path animation is not universally GPU-composited the way transform/opacity are; on low-end devices the aperture edge can show minor jank and should be feature-detected with a graceful (fade-only) fallback.",
    "The rail is a genuinely new piece of UI (not present in V2), so it carries its own design and interaction cost if promoted beyond a prototype.",
    "Full-canvas takeover is a bigger visual jump than Concepts 1–2; if used for lightweight/quick-glance activities it may feel heavier than the moment warrants."
  ],
  recommendedUse: "Best fit for a dedicated 'focus mode' entry point into a single activity — e.g. from the workshop builder when someone commits to working an activity end-to-end — rather than for a quick preview glance from the grid."
};

const ACK_DURATION = 70;
const SOFTEN_DURATION = 150;
const APERTURE_DURATION = 380;
const CLOSE_CONTENT_DURATION = 90;
const CLOSE_APERTURE_DURATION = 300;

function useClearableTimers() {
  const timers = useRef<number[]>([]);
  const clearAll = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };
  useEffect(() => clearAll, []);
  return { clearAll, schedule };
}

export function ApertureRevealConcept({ cards }: { cards: V3PrototypeCard[] }) {
  const [phase, setPhase] = useState<ConceptPhase>("idle");
  const [activeCard, setActiveCard] = useState<V3PrototypeCard | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [speed, setSpeed] = useState<PlaybackSpeed>("normal");
  const [reducedMotionPreview, setReducedMotionPreview] = useState(false);
  const [contentStage, setContentStage] = useState(0);
  const [railSettled, setRailSettled] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [apertureOpen, setApertureOpen] = useState(false);

  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeCardElementRef = useRef<HTMLButtonElement | null>(null);
  const { clearAll, schedule } = useClearableTimers();
  const systemReducedMotion = useSystemReducedMotionPreference();
  const reducedMotion = systemReducedMotion || reducedMotionPreview;
  const isLocked = phase !== "idle";

  const d = (ms: number) => scaleDuration(ms, speed);

  function reset() {
    clearAll();
    setPhase("idle");
    setActiveCard(null);
    setContentStage(0);
    setRailSettled(false);
    setOrigin(null);
    setApertureOpen(false);
  }

  function openCard(card: V3PrototypeCard) {
    // Consistent interruption policy across all three concepts: while any
    // transition is in flight (phase !== "idle") every trigger is locked.
    // A same-card click during the transition is a no-op (button disabled);
    // a different-card click is also blocked rather than redirected, so the
    // in-flight aperture never has to re-target mid-flight.
    if (isLocked) {
      return;
    }

    const cardElement = cardRefs.current[card.id];
    if (!cardElement) return;

    activeCardElementRef.current = cardElement;
    const rect: Rect = rectFromElement(cardElement);
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setActiveCard(card);

    if (reducedMotion) {
      setApertureOpen(true);
      setRailSettled(true);
      setContentStage(3);
      setPhase("open");
      schedule(() => closeButtonRef.current?.focus(), 30);
      return;
    }

    setContentStage(0);
    setApertureOpen(false);
    setRailSettled(false);
    setPhase("acknowledge");

    schedule(() => setPhase("soften"), d(ACK_DURATION));
    schedule(() => {
      setPhase("transform");
      requestAnimationFrame(() => requestAnimationFrame(() => setApertureOpen(true)));
    }, d(ACK_DURATION + SOFTEN_DURATION));
    schedule(() => setRailSettled(true), d(ACK_DURATION + SOFTEN_DURATION + 120));
    schedule(
      () => setPhase("content-enter"),
      d(ACK_DURATION + SOFTEN_DURATION + APERTURE_DURATION * 0.75)
    );
    schedule(() => setContentStage(1), d(ACK_DURATION + SOFTEN_DURATION + APERTURE_DURATION * 0.78));
    schedule(() => setContentStage(2), d(ACK_DURATION + SOFTEN_DURATION + APERTURE_DURATION * 0.78 + 90));
    schedule(() => setContentStage(3), d(ACK_DURATION + SOFTEN_DURATION + APERTURE_DURATION * 0.78 + 170));
    schedule(() => {
      setPhase("open");
      closeButtonRef.current?.focus();
    }, d(ACK_DURATION + SOFTEN_DURATION + APERTURE_DURATION * 0.78 + 230));
  }

  function closeShell() {
    if (phase !== "open" || !activeCard) return;

    clearAll();

    if (reducedMotion) {
      const el = activeCardElementRef.current;
      reset();
      schedule(() => el?.focus(), 30);
      return;
    }

    setPhase("closing-content");
    setContentStage(0);

    schedule(() => {
      setPhase("closing-surface");
      setApertureOpen(false);
      setRailSettled(false);
    }, d(CLOSE_CONTENT_DURATION));

    schedule(() => {
      const el = activeCardElementRef.current;
      setPhase("restoring");
      reset();
      el?.focus();
    }, d(CLOSE_CONTENT_DURATION + CLOSE_APERTURE_DURATION));
  }

  useEffect(() => {
    if (phase !== "open") return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeShell();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const fieldActive = phase !== "idle";
  const canvasVisible =
    phase === "transform" ||
    phase === "content-enter" ||
    phase === "open" ||
    phase === "closing-content" ||
    phase === "closing-surface";

  const clipPath = origin
    ? apertureOpen
      ? `circle(150% at ${origin.x}px ${origin.y}px)`
      : `circle(2% at ${origin.x}px ${origin.y}px)`
    : "circle(0% at 50% 50%)";

  const otherCards = activeCard ? cards.filter((card) => card.id !== activeCard.id) : [];

  return (
    <div>
      <div className="mb-3">
        <PlaybackControls
          disabled={isLocked && phase !== "open"}
          onReplay={() => {
            if (!activeCard) return;
            const card = activeCard;
            reset();
            requestAnimationFrame(() => openCard(card));
          }}
          onSpeedChange={setSpeed}
          onToggleReducedMotionPreview={() => setReducedMotionPreview((v) => !v)}
          reducedMotionPreview={reducedMotionPreview}
          speed={speed}
        />
      </div>

      <div className="relative overflow-hidden py-6">
        <div
          style={{
            filter: fieldActive ? "blur(2px)" : "none",
            opacity: fieldActive ? 0.5 : 1,
            transition: `filter ${d(SOFTEN_DURATION)}ms cubic-bezier(0.33,1,0.68,1), opacity ${d(SOFTEN_DURATION)}ms cubic-bezier(0.33,1,0.68,1)`
          }}
        >
          <div
            className="mx-auto grid"
            style={{ gap: 24, gridTemplateColumns: "repeat(5, 256px)" }}
          >
            {cards.map((card) => {
              const isActive = activeCard?.id === card.id;

              return (
                <button
                  aria-label={`Open ${card.label} (Aperture Reveal)`}
                  className="rounded-[16px] text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d3a]/50"
                  disabled={isLocked}
                  key={card.id}
                  onBlur={() => setHoveredId((c) => (c === card.id ? null : c))}
                  onClick={() => openCard(card)}
                  onFocus={() => setHoveredId(card.id)}
                  onMouseEnter={() => setHoveredId(card.id)}
                  onMouseLeave={() => setHoveredId((c) => (c === card.id ? null : c))}
                  ref={(element) => {
                    cardRefs.current[card.id] = element;
                  }}
                  style={{
                    transform: isActive && phase === "acknowledge" ? "translateY(-2px)" : "translateY(0)",
                    transition: `transform ${d(ACK_DURATION)}ms ease-out`
                  }}
                  type="button"
                >
                  <ActivityCard
                    activity={card.activity}
                    state={hoveredId === card.id && !isLocked ? "hover" : "default"}
                    variant="builder"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeCard && origin
        ? createPortal(
          <div
            aria-hidden={phase !== "open"}
            className="pointer-events-none fixed inset-0 z-50"
          >
            <div
              aria-label={`${activeCard.label} activity details`}
              aria-modal={phase === "open" ? true : undefined}
              className={
                phase === "open" || phase === "closing-content"
                  ? "pointer-events-auto absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,#FCFBFA_0%,#F3EEE7_100%)]"
                  : "pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,#FCFBFA_0%,#F3EEE7_100%)]"
              }
              role="dialog"
              style={{
                clipPath: reducedMotion ? undefined : clipPath,
                opacity: reducedMotion ? (canvasVisible ? 1 : 0) : 1,
                transition: reducedMotion
                  ? `opacity ${d(180)}ms ease-out`
                  : `clip-path ${d(phase === "closing-surface" ? CLOSE_APERTURE_DURATION : APERTURE_DURATION)}ms cubic-bezier(0.16,1,0.3,1)`
              }}
            >
              {/* Context rail — sibling activities settle to a slim edge strip */}
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 flex w-[92px] flex-col gap-2 overflow-hidden border-r border-[#e7dbc8] bg-[#F3EEE7]/90 p-3"
                style={{
                  opacity: railSettled ? 1 : 0,
                  transform: railSettled ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity ${d(200)}ms cubic-bezier(0.22,1,0.36,1), transform ${d(200)}ms cubic-bezier(0.22,1,0.36,1)`
                }}
              >
                {otherCards.slice(0, 6).map((card) => (
                  <div
                    className="rounded-[10px] border border-[#e7dbc8] bg-white/70 px-2 py-2 text-center text-[10px] font-semibold leading-tight text-[#7D5330]"
                    key={card.id}
                  >
                    {card.label}
                  </div>
                ))}
              </div>

              <div
                className="absolute inset-0 pl-[92px] [&>article]:h-full [&>article]:w-full"
                style={{
                  opacity: contentStage >= 1 ? 1 : 0,
                  transform: contentStage >= 1 ? "translateY(0)" : "translateY(6px)",
                  transition: `opacity ${d(160)}ms cubic-bezier(0.22,1,0.36,1), transform ${d(160)}ms cubic-bezier(0.22,1,0.36,1)`
                }}
              >
                <ActivityDetailModal activity={activeCard.modalData} contentOnly isOpen />
              </div>

              {phase === "open" ? (
                <button
                  aria-label="Close activity details"
                  className="pointer-events-auto absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/80 text-2xl leading-none text-[#324236] shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#aa7d3a]/50"
                  onClick={closeShell}
                  ref={closeButtonRef}
                  type="button"
                >
                  <span aria-hidden="true">×</span>
                </button>
              ) : null}
            </div>
          </div>,
          document.body
        )
        : null}
    </div>
  );
}
