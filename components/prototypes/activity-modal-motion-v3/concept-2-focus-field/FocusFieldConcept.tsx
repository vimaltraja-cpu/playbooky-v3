"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ActivityCard } from "@/components/ui/ActivityCard";
import { ActivityDetailModal } from "@/components/ui/ActivityDetailModal";

import {
  blurFilter,
  CARD_DEFOCUS_DURATION_MS,
  CARD_DEFOCUS_EASING,
  CLOSE_CONTENT_DEFOCUS_DURATION_MS,
  CLOSE_EASING,
  CLOSE_GLASS_CONTRACT_DURATION_MS,
  CONTENT_BLUR_START_PX,
  CONTENT_FOCUS_DURATION_MS,
  CONTENT_FOCUS_EASING,
  GLASS_CONTENT_FOCUS_START_FRACTION,
  GLASS_EXPAND_DURATION_MS,
  GLASS_EXPAND_EASING,
  GLASS_SURFACE_BLUR_PX,
  GLASS_SURFACE_TINT
} from "../shared/glassMotion";
import { PlaybackControls } from "../shared/PlaybackControls";
import {
  rectFromElement,
  scaleDuration,
  STAGE_MIN_HEIGHT_PX,
  type Rect
} from "../shared/geometry";
import type { ConceptMeta, ConceptPhase, PlaybackSpeed, V3PrototypeCard } from "../shared/types";
import { useSystemReducedMotionPreference } from "../shared/useReducedMotionPreference";

export const focusFieldMeta: ConceptMeta = {
  id: "focus-field",
  name: "Focus Field",
  tagline: "Concept 2 — depth plane, not direct expansion",
  principle:
    "Instead of the card stretching into the modal, the whole interface changes depth planes. The selected card stays anchored for a beat and then recedes into a softened background field (dim + light blur). In that same beat a frosted glass surface — backdrop-filter blur plus a translucent tonal fill, anchored near the card's visual centre rather than tracing its edges — resolves independently and expands to the exact measured grid/stage rect. Once it is most of the way there, the modal content resolves from blurred to sharp focus and the surface's own glass blur clears alongside it, so the arrival reads as 'coming into focus' rather than a plain fade-in. Closing reverses the same beats: content defocuses, the still-frosted surface contracts back toward the card's centre, and finally the card itself — and the background field around it — defocuses back to its normal sharp, undimmed resting state.",
  sequence: [
    "Selection acknowledgement — the card lifts slightly (70ms).",
    "Field softening — the grid dims and defocuses as one plane (220ms); the card begins receding into that plane.",
    "Glass resolve — a frosted glass surface (blurred, translucent) expands from a reduced scale near the card's centre to the full stage rect (380ms).",
    "Content focus — once the surface is ~80% settled, content blurs in from 10px to sharp focus while the surface's glass blur clears (190ms).",
    "Supporting content — builder-flow row follows (120ms).",
    "Actions — footer actions arrive last (100ms).",
    "Final focused state — surface is fully sharp and the dominant plane; background field stays softened behind it.",
    "Close — content defocuses (140ms), the still-frosted surface contracts back toward the card's centre (300ms), then the card and the background field both defocus back to normal (180ms)."
  ],
  specs: [
    { property: "Selection acknowledge", duration: "70ms", easing: "ease-out", note: "translateY(-2px) on origin card" },
    { property: "Field dim + blur", duration: "220ms", easing: "cubic-bezier(0.33, 1, 0.68, 1)", note: "one backdrop plane, not per-card" },
    { property: "Card recession", duration: "260ms", easing: "ease-out", note: "scale 1→0.97, opacity 1→0.55, runs with field dim" },
    { property: "Glass resolve", duration: "380ms", easing: "cubic-bezier(0.16, 1, 0.3, 1)", note: "scale 0.9→1 + backdrop-filter blur + translucent tint, transform/filter-only" },
    { property: "Content focus", duration: "190ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "filter: blur(10px→0), starts once the glass resolve is ~80% settled; surface glass blur clears in the same window" },
    { property: "Supporting + actions", duration: "120ms / 100ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "staggered 80ms apart" },
    { property: "Close: content defocus", duration: "140ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", note: "content blurs out before the surface moves" },
    { property: "Close: glass contract", duration: "300ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", note: "still-frosted surface contracts back toward the card's centre — JS unmount timer matches this duration exactly, no early cut" },
    { property: "Close: card + field defocus", duration: "180ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "card and background field both return to normal sharp/undimmed — the final close beat" }
  ],
  strengths: [
    "Nothing tweens width/height directly — only transform (scale), opacity and filter — so there is nothing to \"step\" during the resolve.",
    "Reads as a genuine depth/focus change rather than a resize, which matches \"becoming the active experience\" well.",
    "Still resolves to the exact same grid/stage rect as the other concepts, so the open state is never viewport-relative or off-grid."
  ],
  risks: [
    "Spatial link to the origin card is a suggestion (scale-anchored near its centre), not a literal one — some users may find the origin slightly less obvious than Concept 1.",
    "Needs a light touch on blur/scale or it drifts toward a generic dialog/cinematic feel.",
    "backdrop-filter has a real (if modest) compositing cost on lower-end devices."
  ],
  recommendedUse: "Good fit when the destination content genuinely doesn't share the card's aspect ratio or when the grid position varies a lot (e.g. after filtering/reordering) and a literal shared-element would be visually noisy."
};

const ACK_DURATION = 70;
const FIELD_DURATION = 220;

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

export function FocusFieldConcept({
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
  const [originPoint, setOriginPoint] = useState<{ x: number; y: number } | null>(null);

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
    setOriginPoint(null);
    destRectRef.current = null;
  }

  function openCard(card: V3PrototypeCard) {
    if (isLocked) return;

    const cardElement = cardRefs.current[card.id];
    const gridElement = gridRef.current;
    if (!cardElement || !gridElement) return;

    activeCardElementRef.current = cardElement;
    const rect: Rect = rectFromElement(cardElement);
    destRectRef.current = rectFromElement(gridElement);
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

    const softenAt = d(ACK_DURATION);
    const transformAt = softenAt + d(40);
    const contentEnterAt = transformAt + d(GLASS_EXPAND_DURATION_MS * GLASS_CONTENT_FOCUS_START_FRACTION);
    const openAt = contentEnterAt + d(170) + d(230) - d(90);

    schedule(() => setPhase("soften"), softenAt);
    schedule(() => setPhase("transform"), transformAt);
    schedule(() => setPhase("content-enter"), contentEnterAt);
    schedule(() => setContentStage(1), contentEnterAt);
    schedule(() => setContentStage(2), contentEnterAt + d(90));
    schedule(() => setContentStage(3), contentEnterAt + d(170));
    schedule(() => {
      setPhase("open");
      closeButtonRef.current?.focus();
    }, openAt);
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

    const closingSurfaceAt = d(CLOSE_CONTENT_DEFOCUS_DURATION_MS);
    const restoringAt = closingSurfaceAt + d(CLOSE_GLASS_CONTRACT_DURATION_MS);
    const doneAt = restoringAt + d(CARD_DEFOCUS_DURATION_MS);

    schedule(() => setPhase("closing-surface"), closingSurfaceAt);
    schedule(() => setPhase("restoring"), restoringAt);
    schedule(() => {
      const el = activeCardElementRef.current;
      reset();
      el?.focus();
    }, doneAt);
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

  // The field/card stay receded through every phase except the final
  // "restoring" beat, where both defocus back to normal together — a
  // single, deliberate close beat rather than a hard cut at unmount.
  const fieldActive = phase !== "idle" && phase !== "restoring";
  const surfaceVisible =
    phase === "transform" ||
    phase === "content-enter" ||
    phase === "open" ||
    phase === "closing-content";
  const surfaceSettled = phase === "open" || phase === "closing-content";
  const isGlassy =
    phase === "transform" || phase === "closing-content" || phase === "closing-surface";
  const isClosingContent = phase === "closing-content";

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

      <div className="relative overflow-hidden py-6">
        {/* Background field plane */}
        <div
          style={{
            filter: fieldActive ? "blur(2.5px)" : "none",
            transform: fieldActive ? "scale(0.99)" : "scale(1)",
            transition: `filter ${d(fieldActive ? FIELD_DURATION : CARD_DEFOCUS_DURATION_MS)}ms ${fieldActive ? "cubic-bezier(0.33,1,0.68,1)" : CARD_DEFOCUS_EASING}, transform ${d(fieldActive ? FIELD_DURATION : CARD_DEFOCUS_DURATION_MS)}ms ${fieldActive ? "cubic-bezier(0.33,1,0.68,1)" : CARD_DEFOCUS_EASING}`
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
                    transition: `opacity ${d(fieldActive ? FIELD_DURATION : CARD_DEFOCUS_DURATION_MS)}ms ${fieldActive ? "cubic-bezier(0.33,1,0.68,1)" : CARD_DEFOCUS_EASING}, transform ${d(ACK_DURATION)}ms ease-out`
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

        {/* Dedicated dim overlay to sell the depth-plane shift — fades out
            together with the field/card on the "restoring" close beat
            instead of cutting instantly at unmount. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: "rgba(36,31,24,0.16)",
            opacity: fieldActive ? 1 : 0,
            transition: `opacity ${d(fieldActive ? FIELD_DURATION : CARD_DEFOCUS_DURATION_MS)}ms ${fieldActive ? "cubic-bezier(0.33,1,0.68,1)" : CARD_DEFOCUS_EASING}`
          }}
        />
      </div>

      {activeCard && originPoint && destRectRef.current
        ? createPortal(
          (() => {
            const dest = destRectRef.current as Rect;
            // Origin-relative transform-origin, expressed as a percentage of
            // the stage/destination rect (not the viewport) so the "resolve
            // from near the card" motion still reads correctly no matter
            // where the stage sits on the page.
            const originXPercent =
              dest.width > 0
                ? Math.min(100, Math.max(0, ((originPoint.x - dest.left) / dest.width) * 100))
                : 50;
            const originYPercent =
              dest.height > 0
                ? Math.min(100, Math.max(0, ((originPoint.y - dest.top) / dest.height) * 100))
                : 50;

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
                      ? "pointer-events-auto relative h-full w-full overflow-hidden rounded-[20px] shadow-[0_24px_60px_rgba(36,31,24,0.22)]"
                      : "pointer-events-none relative h-full w-full overflow-hidden rounded-[20px] shadow-[0_24px_60px_rgba(36,31,24,0.22)]"
                  }
                  role="dialog"
                  style={{
                    background: isGlassy ? GLASS_SURFACE_TINT : "#FCFBFA",
                    backdropFilter: isGlassy ? blurFilter(GLASS_SURFACE_BLUR_PX) : blurFilter(0),
                    WebkitBackdropFilter: isGlassy ? blurFilter(GLASS_SURFACE_BLUR_PX) : blurFilter(0),
                    opacity: surfaceVisible ? 1 : 0,
                    transform: surfaceSettled ? "scale(1)" : "scale(0.9)",
                    transformOrigin: `${originXPercent}% ${originYPercent}%`,
                    transition: reducedMotion
                      ? "none"
                      : phase === "closing-surface" || phase === "restoring"
                        ? `opacity ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}, transform ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}, background ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}, backdrop-filter ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}`
                        : `opacity ${d(GLASS_EXPAND_DURATION_MS)}ms ${GLASS_EXPAND_EASING}, transform ${d(GLASS_EXPAND_DURATION_MS)}ms ${GLASS_EXPAND_EASING}, background ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}, backdrop-filter ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}`
                  }}
                >
                  <div
                    className="absolute inset-0 [&>article]:h-full [&>article]:w-full"
                    style={{
                      filter: isClosingContent || contentStage < 1 ? blurFilter(CONTENT_BLUR_START_PX) : blurFilter(0),
                      opacity: isClosingContent ? 0 : contentStage >= 1 ? 1 : 0,
                      transform: contentStage >= 1 && !isClosingContent ? "translateY(0)" : "translateY(6px)",
                      transition: isClosingContent
                        ? `filter ${d(CLOSE_CONTENT_DEFOCUS_DURATION_MS)}ms ${CLOSE_EASING}, opacity ${d(CLOSE_CONTENT_DEFOCUS_DURATION_MS)}ms ${CLOSE_EASING}`
                        : `filter ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}, opacity ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}, transform ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}`
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
