"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ActivityCard } from "@/components/ui/ActivityCard";
import { ActivityDetailModal } from "@/components/ui/ActivityDetailModal";

import { PlaybackControls } from "../shared/PlaybackControls";
import { buildFlipTransform, rectFromElement, scaleDuration, type Rect } from "../shared/geometry";
import type { ConceptMeta, ConceptPhase, PlaybackSpeed, V3PrototypeCard } from "../shared/types";
import { useSystemReducedMotionPreference } from "../shared/useReducedMotionPreference";

export const cohesiveSurfaceMeta: ConceptMeta = {
  id: "cohesive-surface",
  name: "Cohesive Surface Morph",
  tagline: "Concept 1 — shared-element, solved for rigidity",
  principle:
    "The selected card and the modal are treated as one continuous surface. Before any geometry changes, the card's own content is neutralized into a solid tonal panel — so the browser never has to reveal a card's internal rows resizing mid-flight. That neutral panel then travels to the modal's footprint using a single transform (translate + scale), not width/height, so the move is GPU-composited and cannot step. Modal content is only introduced once the surface is within reach of its final shape.",
  sequence: [
    "Selection acknowledgement — the tapped card lifts slightly (80ms).",
    "Environmental softening — sibling cards dim/blur; the selected card's content crossfades to a neutral tonal surface (140ms).",
    "Surface transform — the neutral surface travels via transform: translate()+scale() from the card's screen rect to the modal footprint (360ms).",
    "Primary content — heading and orientation text fade/settle in (140ms).",
    "Supporting content — the builder-flow row follows (120ms, staggered).",
    "Actions — footer actions arrive last, once the surface is fully still (100ms).",
    "Final focused state — modal is open, focus moves to close control."
  ],
  specs: [
    { property: "Selection acknowledge", duration: "80ms", easing: "ease-out", note: "translateY(-2px) + shadow lift on the origin card only" },
    { property: "Sibling soften", duration: "180ms", easing: "ease-out", note: "opacity 1→0.45, blur 0→3px, staggered 12ms/card" },
    { property: "Content neutralize", duration: "140ms", easing: "ease-in-out", note: "card content crossfades to a solid tonal panel" },
    { property: "Surface transform", duration: "360ms", easing: "cubic-bezier(0.16, 1, 0.3, 1)", note: "transform only — never left/top/width/height" },
    { property: "Radius", duration: "260ms", easing: "ease-out", note: "decoupled from the scale transform to avoid corner popping" },
    { property: "Heading/orientation", duration: "150ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "opacity + translateY(6px→0), starts near end of surface transform" },
    { property: "Supporting content", duration: "130ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "80ms after heading" },
    { property: "Actions", duration: "110ms", easing: "ease-out", note: "40ms after supporting content — final settle" },
    { property: "Close reversal", duration: "260ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", note: "content exits (actions→body→heading, 90ms total) before the surface compresses back" }
  ],
  strengths: [
    "Strongest sense of \"this card became the modal\" — spatial origin is unambiguous.",
    "Transform-only geometry avoids layout thrash and the stepped/rugged look.",
    "Neutralize-then-morph hides all internal reflow during the size change."
  ],
  risks: [
    "Non-uniform scale can very slightly stretch the neutral surface's corner radius mid-flight; needs a counter-scaled radius mask in production.",
    "Requires accurate rect measurement — resize/scroll mid-transition needs a guard (currently: interaction lock).",
    "On very small viewports the origin-to-destination scale ratio is large, which can make the neutralize step feel slightly longer than ideal."
  ],
  recommendedUse: "Best default direction for PlayBooky's activity grid — it most directly answers the brief's \"this card became the focused experience\" requirement while staying restrained."
};

const SOFTEN_DELAY = 80;
const NEUTRALIZE_DURATION = 140;
const TRANSFORM_DURATION = 360;
const CLOSE_CONTENT_DURATION = 90;
const CLOSE_TRANSFORM_DURATION = 260;

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

export function CohesiveSurfaceConcept({ cards }: { cards: V3PrototypeCard[] }) {
  const [phase, setPhase] = useState<ConceptPhase>("idle");
  const [activeCard, setActiveCard] = useState<V3PrototypeCard | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [speed, setSpeed] = useState<PlaybackSpeed>("normal");
  const [reducedMotionPreview, setReducedMotionPreview] = useState(false);
  const [transform, setTransform] = useState("none");
  const [radius, setRadius] = useState(16);
  const [contentStage, setContentStage] = useState(0);

  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const gridRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const originRectRef = useRef<Rect | null>(null);
  const destRectRef = useRef<Rect | null>(null);
  const { clearAll, schedule } = useClearableTimers();
  const systemReducedMotion = useSystemReducedMotionPreference();
  const reducedMotion = systemReducedMotion || reducedMotionPreview;
  const isLocked = phase !== "idle";

  const d = (ms: number) => scaleDuration(ms, speed);

  function reset() {
    clearAll();
    setPhase("idle");
    setActiveCard(null);
    setTransform("none");
    setRadius(16);
    setContentStage(0);
  }

  function runOpen(card: V3PrototypeCard, originRect: Rect, destRect: Rect) {
    originRectRef.current = originRect;
    destRectRef.current = destRect;
    setActiveCard(card);

    if (reducedMotion) {
      setTransform("none");
      setRadius(20);
      setContentStage(3);
      setPhase("open");
      schedule(() => closeButtonRef.current?.focus(), 30);
      return;
    }

    setTransform(buildFlipTransform(originRect, destRect));
    setRadius(16);
    setContentStage(0);
    setPhase("acknowledge");

    schedule(() => setPhase("soften"), d(SOFTEN_DELAY));
    schedule(() => setPhase("transform"), d(SOFTEN_DELAY + NEUTRALIZE_DURATION));

    schedule(() => {
      // Kick the transform back to identity on the next frame so the
      // browser has committed the initial FLIP transform first.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransform("none");
          setRadius(20);
        });
      });
    }, d(SOFTEN_DELAY + NEUTRALIZE_DURATION));

    schedule(
      () => setPhase("content-enter"),
      d(SOFTEN_DELAY + NEUTRALIZE_DURATION + TRANSFORM_DURATION * 0.75)
    );
    schedule(() => setContentStage(1), d(SOFTEN_DELAY + NEUTRALIZE_DURATION + TRANSFORM_DURATION * 0.8));
    schedule(() => setContentStage(2), d(SOFTEN_DELAY + NEUTRALIZE_DURATION + TRANSFORM_DURATION * 0.8 + 90));
    schedule(() => setContentStage(3), d(SOFTEN_DELAY + NEUTRALIZE_DURATION + TRANSFORM_DURATION * 0.8 + 170));
    schedule(
      () => {
        setPhase("open");
        closeButtonRef.current?.focus();
      },
      d(SOFTEN_DELAY + NEUTRALIZE_DURATION + TRANSFORM_DURATION * 0.8 + 230)
    );
  }

  function openCard(card: V3PrototypeCard) {
    if (isLocked) {
      return;
    }

    const cardElement = cardRefs.current[card.id];
    const gridElement = gridRef.current;

    if (!cardElement || !gridElement) {
      return;
    }

    runOpen(card, rectFromElement(cardElement), rectFromElement(gridElement));
  }

  function closeShell() {
    if (phase !== "open" || !activeCard) {
      return;
    }

    clearAll();

    const cardElement = cardRefs.current[activeCard.id];
    const origin = cardElement ? rectFromElement(cardElement) : originRectRef.current;
    const dest = destRectRef.current;

    if (!origin || !dest) {
      reset();
      return;
    }

    if (reducedMotion) {
      reset();
      schedule(() => cardElement?.focus(), 30);
      return;
    }

    setPhase("closing-content");
    setContentStage(0);

    schedule(() => {
      setPhase("closing-surface");
      setTransform(buildFlipTransform(origin, dest));
      setRadius(16);
    }, d(CLOSE_CONTENT_DURATION));

    schedule(() => {
      reset();
      cardElement?.focus();
    }, d(CLOSE_CONTENT_DURATION + CLOSE_TRANSFORM_DURATION));
  }

  useEffect(() => {
    if (phase !== "open") {
      return;
    }

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

  const isSoftened = phase !== "idle";
  const isNeutralized =
    phase === "soften" ||
    phase === "transform" ||
    phase === "content-enter" ||
    phase === "open" ||
    phase === "closing-content" ||
    phase === "closing-surface";

  const contentContainer = useMemo(() => {
    if (!activeCard) {
      return null;
    }

    return (
      <div
        className="absolute inset-0 overflow-hidden [&>article]:h-full [&>article]:w-full"
        style={{ opacity: phase === "acknowledge" || phase === "soften" || phase === "transform" ? 0 : 1 }}
      >
        <div className="grid h-full grid-rows-[auto_1fr_auto]">
          <div
            style={{
              opacity: contentStage >= 1 ? 1 : 0,
              transform: contentStage >= 1 ? "translateY(0)" : "translateY(6px)",
              transition: `opacity ${d(150)}ms cubic-bezier(0.22,1,0.36,1), transform ${d(150)}ms cubic-bezier(0.22,1,0.36,1)`
            }}
          >
            <ActivityDetailModal activity={activeCard.modalData} contentOnly isOpen />
          </div>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCard, contentStage, phase, speed]);

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

      <div className="relative py-6" ref={gridRef}>
        <div
          className="mx-auto grid"
          style={{ gap: 24, gridTemplateColumns: "repeat(5, 256px)" }}
        >
          {cards.map((card) => {
            const isActive = activeCard?.id === card.id;

            return (
              <button
                aria-label={`Open ${card.label} (Cohesive Surface Morph)`}
                className="rounded-[16px] text-left transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d3a]/50"
                disabled={isLocked}
                key={card.id}
                onBlur={() => setHoveredId((current) => (current === card.id ? null : current))}
                onClick={() => openCard(card)}
                onFocus={() => setHoveredId(card.id)}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId((current) => (current === card.id ? null : current))}
                ref={(element) => {
                  cardRefs.current[card.id] = element;
                }}
                style={{
                  filter: isSoftened && !isActive ? "blur(3px)" : "none",
                  opacity: isActive && phase !== "idle" ? 0 : isSoftened && !isActive ? 0.45 : 1,
                  transform: isActive && (phase === "acknowledge") ? "translateY(-2px)" : "translateY(0)",
                  transition: `opacity ${d(180)}ms ease-out, filter ${d(180)}ms ease-out, transform ${d(80)}ms ease-out`
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

      {activeCard
        ? createPortal(
          <div
            aria-label={`${activeCard.label} activity details`}
            aria-modal={phase === "open" ? true : undefined}
            className="pointer-events-none fixed z-50 overflow-hidden bg-[linear-gradient(160deg,#FCFBFA_0%,#F3EEE7_100%)] shadow-[0_18px_50px_rgba(36,31,24,0.18)] will-change-transform"
            ref={surfaceRef}
            role="dialog"
            style={{
              borderRadius: radius,
              boxSizing: "border-box",
              height: destRectRef.current?.height,
              left: destRectRef.current?.left,
              top: destRectRef.current?.top,
              transform,
              transformOrigin: "top left",
              transition: reducedMotion
                ? "none"
                : `transform ${d(TRANSFORM_DURATION)}ms cubic-bezier(0.16,1,0.3,1), border-radius ${d(260)}ms ease-out`,
              width: destRectRef.current?.width
            }}
          >
            {contentContainer}

            {!isNeutralized ? null : (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#FCFBFA_0%,#F3EEE7_100%)]"
                style={{
                  opacity: phase === "transform" || phase === "closing-surface" ? 1 : 0,
                  transition: `opacity ${d(NEUTRALIZE_DURATION)}ms ease-in-out`
                }}
              />
            )}

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
          </div>,
          document.body
        )
        : null}
    </div>
  );
}
