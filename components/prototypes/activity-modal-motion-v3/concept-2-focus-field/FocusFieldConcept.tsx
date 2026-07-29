"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ActivityCard } from "@/components/ui/ActivityCard";
import { ActivityDetailModal } from "@/components/ui/ActivityDetailModal";

import { PlaybackControls } from "../shared/PlaybackControls";
import { rectFromElement, scaleDuration, type Rect } from "../shared/geometry";
import type { ConceptMeta, ConceptPhase, PlaybackSpeed, V3PrototypeCard } from "../shared/types";
import { useSystemReducedMotionPreference } from "../shared/useReducedMotionPreference";

export const focusFieldMeta: ConceptMeta = {
  id: "focus-field",
  name: "Focus Field",
  tagline: "Concept 2 — depth plane, not direct expansion",
  principle:
    "Instead of the card stretching into the modal, the whole interface changes depth planes. The selected card stays anchored for a beat and then recedes into a softened background field (dim + light blur). A modal surface resolves into focus independently, entering near the card's visual centre without literally tracing its edges. Because the surface is never geometrically tied to the card's box, there is nothing to \"stretch\" or step — it simply arrives, already whole, and content only appears once it is settled.",
  sequence: [
    "Selection acknowledgement — the card lifts slightly (70ms).",
    "Field softening — the grid dims and defocuses as one plane (220ms); the card begins receding into that plane.",
    "Surface resolution — a modal surface fades and settles in from a slightly reduced scale near the card's centre (300ms).",
    "Primary content — heading and orientation copy resolve (150ms), only after the surface is nearly settled.",
    "Supporting content — builder-flow row follows (120ms).",
    "Actions — footer actions arrive last (100ms).",
    "Final focused state — surface is the dominant plane; background field stays softened behind it."
  ],
  specs: [
    { property: "Selection acknowledge", duration: "70ms", easing: "ease-out", note: "translateY(-2px) on origin card" },
    { property: "Field dim + blur", duration: "220ms", easing: "cubic-bezier(0.33, 1, 0.68, 1)", note: "one backdrop plane, not per-card" },
    { property: "Card recession", duration: "260ms", easing: "ease-out", note: "scale 1→0.97, opacity 1→0.55, runs with field dim" },
    { property: "Surface resolve", duration: "300ms", easing: "cubic-bezier(0.16, 1, 0.3, 1)", note: "scale 0.92→1 + opacity 0→1, transform-only" },
    { property: "Heading/orientation", duration: "160ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "starts ~70% through surface resolve" },
    { property: "Supporting + actions", duration: "120ms / 100ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "staggered 80ms apart" },
    { property: "Close reversal", duration: "220ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", note: "content exits, surface recedes+fades, field restores, card returns" }
  ],
  strengths: [
    "No exact-rect geometry to compute or expose — nothing to \"step\" because nothing tweens width/height at all.",
    "Reads as a genuine depth/focus change rather than a resize, which matches \"becoming the active experience\" well.",
    "Very resilient across viewport sizes since the surface's size is independent of the card's box."
  ],
  risks: [
    "Spatial link to the origin card is a suggestion (centre-anchored), not a literal one — some users may find the origin slightly less obvious than Concept 1.",
    "Needs a light touch on blur/scale or it drifts toward a generic dialog/cinematic feel.",
    "Backdrop blur has a real (if modest) compositing cost on lower-end devices."
  ],
  recommendedUse: "Good fit when the destination content genuinely doesn't share the card's aspect ratio or when the grid position varies a lot (e.g. after filtering/reordering) and a literal shared-element would be visually noisy."
};

const ACK_DURATION = 70;
const FIELD_DURATION = 220;
const SURFACE_DURATION = 300;
const CLOSE_CONTENT_DURATION = 90;
const CLOSE_SURFACE_DURATION = 220;

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

export function FocusFieldConcept({ cards }: { cards: V3PrototypeCard[] }) {
  const [phase, setPhase] = useState<ConceptPhase>("idle");
  const [activeCard, setActiveCard] = useState<V3PrototypeCard | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [speed, setSpeed] = useState<PlaybackSpeed>("normal");
  const [reducedMotionPreview, setReducedMotionPreview] = useState(false);
  const [contentStage, setContentStage] = useState(0);
  const [originPoint, setOriginPoint] = useState<{ x: number; y: number } | null>(null);

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
    setOriginPoint(null);
  }

  function openCard(card: V3PrototypeCard) {
    if (isLocked) return;

    const cardElement = cardRefs.current[card.id];
    if (!cardElement) return;

    activeCardElementRef.current = cardElement;
    const rect: Rect = rectFromElement(cardElement);
    setOriginPoint({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setActiveCard(card);

    if (reducedMotion) {
      setContentStage(3);
      setPhase("open");
      schedule(() => closeButtonRef.current?.focus(), 30);
      return;
    }

    setContentStage(0);
    setPhase("acknowledge");
    schedule(() => setPhase("soften"), d(ACK_DURATION));
    schedule(() => setPhase("transform"), d(ACK_DURATION + 40));
    schedule(() => setPhase("content-enter"), d(ACK_DURATION + FIELD_DURATION));
    schedule(() => setContentStage(1), d(ACK_DURATION + SURFACE_DURATION * 0.7));
    schedule(() => setContentStage(2), d(ACK_DURATION + SURFACE_DURATION * 0.7 + 90));
    schedule(() => setContentStage(3), d(ACK_DURATION + SURFACE_DURATION * 0.7 + 170));
    schedule(() => {
      setPhase("open");
      closeButtonRef.current?.focus();
    }, d(ACK_DURATION + SURFACE_DURATION * 0.7 + 230));
  }

  function closeShell() {
    if (phase !== "open" || !activeCard) return;

    clearAll();

    if (reducedMotion) {
      reset();
      schedule(() => activeCardElementRef.current?.focus(), 30);
      return;
    }

    setPhase("closing-content");
    setContentStage(0);

    schedule(() => setPhase("closing-surface"), d(CLOSE_CONTENT_DURATION));
    schedule(() => {
      const el = activeCardElementRef.current;
      reset();
      el?.focus();
    }, d(CLOSE_CONTENT_DURATION + CLOSE_SURFACE_DURATION));
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
  const surfaceVisible =
    phase === "transform" ||
    phase === "content-enter" ||
    phase === "open" ||
    phase === "closing-content";
  const surfaceSettled = surfaceVisible && phase !== "transform";

  return (
    <div>
      <div className="mb-3">
        <PlaybackControls
          disabled={isLocked && phase !== "open"}
          onReplay={() => {
            if (!activeCard) return;
            reset();
            requestAnimationFrame(() => openCard(activeCard));
          }}
          onSpeedChange={setSpeed}
          onToggleReducedMotionPreview={() => setReducedMotionPreview((v) => !v)}
          reducedMotionPreview={reducedMotionPreview}
          speed={speed}
        />
      </div>

      <div className="relative overflow-hidden p-6">
        {/* Background field plane */}
        <div
          style={{
            filter: fieldActive ? "blur(2.5px)" : "none",
            transform: fieldActive ? "scale(0.99)" : "scale(1)",
            transition: `filter ${d(FIELD_DURATION)}ms cubic-bezier(0.33,1,0.68,1), transform ${d(FIELD_DURATION)}ms cubic-bezier(0.33,1,0.68,1)`
          }}
        >
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {cards.map((card) => {
              const isActive = activeCard?.id === card.id;

              return (
                <button
                  aria-label={`Open ${card.label} (Focus Field)`}
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
                    opacity: isActive && fieldActive ? 0.55 : fieldActive ? 0.65 : 1,
                    transform:
                      isActive && phase === "acknowledge"
                        ? "translateY(-2px) scale(1)"
                        : isActive && fieldActive
                          ? "scale(0.97)"
                          : "scale(1)",
                    transition: `opacity ${d(FIELD_DURATION)}ms cubic-bezier(0.33,1,0.68,1), transform ${d(ACK_DURATION)}ms ease-out`
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

        {/* Dedicated dim overlay to sell the depth-plane shift */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: "rgba(36,31,24,0.16)",
            opacity: fieldActive ? 1 : 0,
            transition: `opacity ${d(FIELD_DURATION)}ms cubic-bezier(0.33,1,0.68,1)`
          }}
        />
      </div>

      {activeCard && originPoint
        ? createPortal(
          <div
            aria-hidden={phase !== "open"}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              aria-label={`${activeCard.label} activity details`}
              aria-modal={phase === "open" ? true : undefined}
              className={
                phase === "open" || phase === "closing-content"
                  ? "pointer-events-auto relative overflow-hidden rounded-[20px] bg-[#FCFBFA] shadow-[0_24px_60px_rgba(36,31,24,0.22)]"
                  : "pointer-events-none relative overflow-hidden rounded-[20px] bg-[#FCFBFA] shadow-[0_24px_60px_rgba(36,31,24,0.22)]"
              }
              role="dialog"
              style={{
                height: "min(78vh, 800px)",
                opacity: surfaceVisible ? 1 : 0,
                transform: surfaceSettled ? "scale(1)" : "scale(0.93)",
                transformOrigin: `${(originPoint.x / window.innerWidth) * 100}% ${(originPoint.y / window.innerHeight) * 100}%`,
                transition: reducedMotion
                  ? "none"
                  : `opacity ${d(SURFACE_DURATION)}ms cubic-bezier(0.16,1,0.3,1), transform ${d(SURFACE_DURATION)}ms cubic-bezier(0.16,1,0.3,1)`,
                width: "min(88vw, 1420px)"
              }}
            >
              <div
                className="absolute inset-0 [&>article]:h-full [&>article]:w-full"
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
