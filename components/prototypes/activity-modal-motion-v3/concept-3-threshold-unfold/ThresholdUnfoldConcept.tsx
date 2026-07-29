"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ActivityCard } from "@/components/ui/ActivityCard";
import { ActivityDetailModal } from "@/components/ui/ActivityDetailModal";

import { PlaybackControls } from "../shared/PlaybackControls";
import {
  rectFromElement,
  scaleDuration,
  STAGE_MIN_HEIGHT_PX,
  type Rect
} from "../shared/geometry";
import type { ConceptMeta, ConceptPhase, PlaybackSpeed, V3PrototypeCard } from "../shared/types";
import { useSystemReducedMotionPreference } from "../shared/useReducedMotionPreference";

export const thresholdUnfoldMeta: ConceptMeta = {
  id: "threshold-unfold",
  name: "Threshold Unfold",
  tagline: "Concept 3 — directional reveal, not a resizing box or a depth swap",
  principle:
    "Rather than tracing the origin card's box (Concept 1) or resolving from a scaled-down point near it (Concept 2), the modal panel is anchored to the stage's own top edge and unfolds downward to fill the exact measured grid/stage rect, like a blind dropping into place. The panel's box is set to the stage rect from the first frame — it never grows past the grid's bounds — and a single directional clip-path reveals it top-to-bottom instead of tweening width or height. Because the reveal originates from the stage itself rather than the tapped card, it reads as 'this space is opening up' rather than 'this card became the modal', which is a deliberately different spatial idea from the other two concepts while still staying fully grid-bounded.",
  sequence: [
    "Selection acknowledgement — the tapped card lifts slightly (80ms).",
    "Environmental soften — sibling cards dim/blur as one field (150ms).",
    "Threshold unfold — a directional clip-path reveals the panel from the stage's top edge downward to full stage coverage (380ms).",
    "Primary content — heading and orientation text resolve once the unfold is mostly complete (160ms).",
    "Supporting content — the builder-flow row follows (120ms, staggered).",
    "Actions — footer actions arrive last, once the panel is fully still (100ms).",
    "Final focused state — panel fills the stage; focus moves to the close control."
  ],
  specs: [
    { property: "Selection acknowledge", duration: "80ms", easing: "ease-out", note: "translateY(-2px) on the origin card only" },
    { property: "Sibling soften", duration: "150ms", easing: "cubic-bezier(0.33, 1, 0.68, 1)", note: "opacity 1→0.5, blur 0→2px, one field, not per card" },
    { property: "Threshold unfold", duration: "380ms", easing: "cubic-bezier(0.16, 1, 0.3, 1)", note: "clip-path inset() only, top edge fixed, bottom edge sweeps from 100% to 0% — panel box is already the full stage rect" },
    { property: "Heading/orientation", duration: "160ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "starts once the unfold reaches ~75% coverage" },
    { property: "Supporting content", duration: "120ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "90ms after heading" },
    { property: "Actions", duration: "100ms", easing: "ease-out", note: "80ms after supporting content — final settle" },
    { property: "Close reversal", duration: "300ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", note: "content exits together (90ms) before the panel retracts upward into the stage's top edge (300ms) — a composed close, not the open played backwards frame-for-frame" }
  ],
  strengths: [
    "Structurally distinct from both a shared-element move and a scale/opacity depth resolve — the geometry is a single directional clip anchored to the stage, not the card.",
    "The panel's box equals the measured stage rect on the very first frame, so it is trivially impossible for it to render outside the grid's bounds.",
    "Reads as calm and directional rather than either 'this card grew' or 'a dialog faded in', which is a genuinely different register worth having alongside the other two."
  ],
  risks: [
    "clip-path animation is not as universally GPU-composited as transform/opacity; on low-end devices the reveal edge can show minor jank and should be feature-detected with a graceful fade-only fallback (the reduced-motion path already does this).",
    "Because the reveal doesn't originate from the tapped card, the spatial link to 'which card did I open' is weaker than Concept 1 and relies on the sibling-soften step to carry that context.",
    "A strongly top-down directional reveal can feel like a drawer/sheet pattern if overused elsewhere in the product, so it should stay reserved for this one transition."
  ],
  recommendedUse: "Worth prototyping further as an alternative to Concept 1 when the team wants the modal's arrival to feel like 'the grid's own space opening up' rather than 'the card turning into the modal' — e.g. if user testing shows people read Concept 1's morph as the card itself being edited rather than a new view opening."
};

const ACK_DURATION = 80;
const SOFTEN_DURATION = 150;
const UNFOLD_DURATION = 380;
const CLOSE_CONTENT_DURATION = 90;
const CLOSE_UNFOLD_DURATION = 300;
const REDUCED_MOTION_CROSSFADE_DURATION = 150;

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

export function ThresholdUnfoldConcept({
  cards,
  onLockChange
}: {
  cards: V3PrototypeCard[];
  onLockChange?: (locked: boolean) => void;
}) {
  const [phase, setPhase] = useState<ConceptPhase>("idle");
  const [activeCard, setActiveCard] = useState<V3PrototypeCard | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [speed, setSpeed] = useState<PlaybackSpeed>("normal");
  const [reducedMotionPreview, setReducedMotionPreview] = useState(false);
  const [contentStage, setContentStage] = useState(0);
  const [unfolded, setUnfolded] = useState(false);

  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const gridRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeCardElementRef = useRef<HTMLButtonElement | null>(null);
  const destRectRef = useRef<Rect | null>(null);
  const { clearAll, schedule } = useClearableTimers();
  const systemReducedMotion = useSystemReducedMotionPreference();
  const reducedMotion = systemReducedMotion || reducedMotionPreview;
  const isLocked = phase !== "idle";

  useEffect(() => {
    onLockChange?.(isLocked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked]);

  const d = (ms: number) => scaleDuration(ms, speed);

  function reset() {
    clearAll();
    setPhase("idle");
    setActiveCard(null);
    setContentStage(0);
    setUnfolded(false);
    destRectRef.current = null;
  }

  function openCard(card: V3PrototypeCard) {
    // Consistent interruption policy across all three concepts: while any
    // transition is in flight (phase !== "idle") every trigger is locked.
    if (isLocked) {
      return;
    }

    const cardElement = cardRefs.current[card.id];
    const gridElement = gridRef.current;
    if (!cardElement || !gridElement) return;

    activeCardElementRef.current = cardElement;
    destRectRef.current = rectFromElement(gridElement);
    setActiveCard(card);

    if (reducedMotion) {
      setUnfolded(true);
      setContentStage(3);
      setPhase("open");
      schedule(() => closeButtonRef.current?.focus(), 30);
      return;
    }

    setContentStage(0);
    setUnfolded(false);
    setPhase("acknowledge");

    schedule(() => setPhase("soften"), d(ACK_DURATION));
    schedule(() => {
      setPhase("transform");
      requestAnimationFrame(() => requestAnimationFrame(() => setUnfolded(true)));
    }, d(ACK_DURATION + SOFTEN_DURATION));
    schedule(
      () => setPhase("content-enter"),
      d(ACK_DURATION + SOFTEN_DURATION + UNFOLD_DURATION * 0.75)
    );
    schedule(() => setContentStage(1), d(ACK_DURATION + SOFTEN_DURATION + UNFOLD_DURATION * 0.78));
    schedule(() => setContentStage(2), d(ACK_DURATION + SOFTEN_DURATION + UNFOLD_DURATION * 0.78 + 90));
    schedule(() => setContentStage(3), d(ACK_DURATION + SOFTEN_DURATION + UNFOLD_DURATION * 0.78 + 170));
    schedule(() => {
      setPhase("open");
      closeButtonRef.current?.focus();
    }, d(ACK_DURATION + SOFTEN_DURATION + UNFOLD_DURATION * 0.78 + 230));
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
      setUnfolded(false);
    }, d(CLOSE_CONTENT_DURATION));

    schedule(() => {
      const el = activeCardElementRef.current;
      reset();
      el?.focus();
    }, d(CLOSE_CONTENT_DURATION + CLOSE_UNFOLD_DURATION));
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
  const panelVisible =
    phase === "transform" ||
    phase === "content-enter" ||
    phase === "open" ||
    phase === "closing-content" ||
    phase === "closing-surface";

  const closeDuration = phase === "closing-surface" ? CLOSE_UNFOLD_DURATION : UNFOLD_DURATION;
  const clipPath = unfolded ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";

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
            className="mx-auto grid content-start"
            ref={gridRef}
            style={{
              gap: 24,
              gridTemplateColumns: "repeat(5, 256px)",
              minHeight: STAGE_MIN_HEIGHT_PX
            }}
          >
            {cards.map((card) => {
              const isActive = activeCard?.id === card.id;

              return (
                <button
                  aria-label={`Open ${card.label} (Threshold Unfold)`}
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

      {activeCard && destRectRef.current
        ? createPortal(
          (() => {
            const dest = destRectRef.current as Rect;

            return (
              <div
                aria-hidden={phase !== "open"}
                className="pointer-events-none fixed z-50"
                style={{
                  height: dest.height,
                  left: dest.left,
                  top: dest.top,
                  width: dest.width
                }}
              >
                <div
                  aria-label={`${activeCard.label} activity details`}
                  aria-modal={phase === "open" ? true : undefined}
                  className={
                    phase === "open" || phase === "closing-content"
                      ? "pointer-events-auto relative h-full w-full overflow-hidden rounded-[20px] bg-[linear-gradient(160deg,#FCFBFA_0%,#F3EEE7_100%)] shadow-[0_24px_60px_rgba(36,31,24,0.22)]"
                      : "pointer-events-none relative h-full w-full overflow-hidden rounded-[20px] bg-[linear-gradient(160deg,#FCFBFA_0%,#F3EEE7_100%)] shadow-[0_24px_60px_rgba(36,31,24,0.22)]"
                  }
                  role="dialog"
                  style={
                    reducedMotion
                      ? {
                        opacity: panelVisible ? 1 : 0,
                        transition: `opacity ${d(REDUCED_MOTION_CROSSFADE_DURATION)}ms ease-out`
                      }
                      : {
                        clipPath,
                        opacity: 1,
                        transition: `clip-path ${d(closeDuration)}ms cubic-bezier(0.16,1,0.3,1)`
                      }
                  }
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
              </div>
            );
          })(),
          document.body
        )
        : null}
    </div>
  );
}
