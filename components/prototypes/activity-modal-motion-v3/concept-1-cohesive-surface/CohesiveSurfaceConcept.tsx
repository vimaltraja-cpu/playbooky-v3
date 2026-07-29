"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ActivityCard } from "@/components/ui/ActivityCard";
import { ActivityDetailModal } from "@/components/ui/ActivityDetailModal";

import {
  blurFilter,
  CARD_DEFOCUS_DURATION_MS,
  CARD_DEFOCUS_EASING,
  CARD_TO_GLASS_BLUR_PX,
  CARD_TO_GLASS_DURATION_MS,
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
  buildFlipTransform,
  rectFromElement,
  scaleDuration,
  STAGE_MIN_HEIGHT_PX,
  type Rect
} from "../shared/geometry";
import type { ConceptMeta, ConceptPhase, PlaybackSpeed, V3PrototypeCard } from "../shared/types";
import { useSystemReducedMotionPreference } from "../shared/useReducedMotionPreference";

export const cohesiveSurfaceMeta: ConceptMeta = {
  id: "cohesive-surface",
  name: "Cohesive Surface Morph",
  tagline: "Concept 1 — shared-element, solved for rigidity",
  principle:
    "The selected card and the modal are treated as one continuous surface. Before any geometry changes, the card's own content simplifies into a blurred, frosted glass panel — a backdrop-filter blur plus a translucent tonal fill, never a flat opaque neutralize block — so the browser never has to reveal a card's internal rows resizing mid-flight. That frosted surface then travels to the modal's footprint using a single transform (translate + scale), not width/height, so the move is GPU-composited and cannot step. Once the surface is most of the way to its final size, the modal content resolves from blurred to sharp focus — a filter: blur() animation, not an opacity-only fade — and the surface's own glass blur clears alongside it. Closing reverses the same three beats: content defocuses first, then the still-frosted surface contracts back to the origin card's exact rect, then the card itself defocuses back to its normal sharp state.",
  sequence: [
    "Selection acknowledgement — the tapped card lifts slightly (80ms).",
    "Card → glass — the card's content simplifies into a frosted, blurred glass panel with a translucent tonal fill (160ms); sibling cards soften as one field.",
    "Glass expand — the frosted surface travels via transform: translate()+scale() from the card's screen rect to the stage rect, staying frosted throughout (380ms, weighted-deceleration easing).",
    "Content focus — once the surface is ~80% settled, content blurs in from 10px to sharp focus while the surface's own glass blur clears alongside it (190ms).",
    "Supporting content — the builder-flow row follows (120ms, staggered).",
    "Actions — footer actions arrive last, once the surface is fully still and sharp (100ms).",
    "Final focused state — modal is open, fully in focus; focus moves to close control.",
    "Close — content defocuses and fades (140ms), the frosted surface contracts back to the origin rect (300ms), then the revealed card itself defocuses back to sharp (180ms)."
  ],
  specs: [
    { property: "Selection acknowledge", duration: "80ms", easing: "ease-out", note: "translateY(-2px) + shadow lift on the origin card only" },
    { property: "Card → glass", duration: "160ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "card content crossfades to a frosted, blurred glass panel (backdrop-filter + translucent tint), not a flat opaque block" },
    { property: "Sibling soften", duration: "180ms", easing: "ease-out", note: "opacity 1→0.45, blur 0→3px, staggered 12ms/card" },
    { property: "Glass expand (transform)", duration: "380ms", easing: "cubic-bezier(0.16, 1, 0.3, 1)", note: "transform only — never left/top/width/height; surface stays frosted throughout" },
    { property: "Content focus", duration: "190ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "filter: blur(10px→0) + opacity + translateY(6px→0); starts once the expand is ~80% settled; surface glass blur clears in the same window" },
    { property: "Supporting content", duration: "120ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "90ms after heading" },
    { property: "Actions", duration: "100ms", easing: "ease-out", note: "80ms after supporting content — final settle" },
    { property: "Close: content defocus", duration: "140ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", note: "content blurs out (0→10px) and fades before the surface moves" },
    { property: "Close: glass contract", duration: "300ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", note: "still-frosted surface contracts back to the origin card's exact rect — JS unmount timer matches this duration exactly, no early cut" },
    { property: "Close: card defocus", duration: "180ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "the revealed card blurs from 8px back to sharp — the final close beat" }
  ],
  strengths: [
    "Strongest sense of \"this card became the modal\" — spatial origin is unambiguous.",
    "Transform-only geometry avoids layout thrash and the stepped/rugged look.",
    "One continuous glass→expand→focus curve per phase — no opacity-only fades or discrete panel swaps to seam against."
  ],
  risks: [
    "Non-uniform scale can very slightly stretch the glass surface's corner radius mid-flight; needs a counter-scaled radius mask in production.",
    "Requires accurate rect measurement — resize/scroll mid-transition needs a guard (currently: interaction lock).",
    "backdrop-filter has a real (if modest) compositing cost; should be feature-detected with a solid-tint fallback on low-end devices."
  ],
  recommendedUse: "Best default direction for PlayBooky's activity grid — it most directly answers the brief's \"this card became the focused experience\" requirement while staying restrained."
};

const ACK_DURATION = 80;
const CONTENT_STAGE_STAGGER_1 = 90;
const CONTENT_STAGE_STAGGER_2 = 170;
const OPEN_SETTLE_BUFFER = 230;

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

export function CohesiveSurfaceConcept({
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
  const [transform, setTransform] = useState("none");
  const [radius, setRadius] = useState(16);
  const [contentStage, setContentStage] = useState(0);
  const [cardFocused, setCardFocused] = useState(true);

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

  useEffect(() => {
    onLockChange?.(isLocked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked]);

  const d = (ms: number) => scaleDuration(ms, speed);

  function reset() {
    clearAll();
    setPhase("idle");
    setActiveCard(null);
    setTransform("none");
    setRadius(16);
    setContentStage(0);
    setCardFocused(true);
  }

  function runOpen(card: V3PrototypeCard, originRect: Rect, destRect: Rect) {
    originRectRef.current = originRect;
    destRectRef.current = destRect;
    setActiveCard(card);

    if (reducedMotion) {
      setTransform("none");
      setRadius(20);
      setContentStage(3);
      setCardFocused(true);
      setPhase("open");
      schedule(() => closeButtonRef.current?.focus(), 30);
      return;
    }

    setTransform(buildFlipTransform(originRect, destRect));
    setRadius(16);
    setContentStage(0);
    setCardFocused(true);
    setPhase("acknowledge");

    const softenAt = d(ACK_DURATION);
    const transformAt = softenAt + d(CARD_TO_GLASS_DURATION_MS);
    const contentEnterAt = transformAt + d(GLASS_EXPAND_DURATION_MS * GLASS_CONTENT_FOCUS_START_FRACTION);
    const openAt = contentEnterAt + d(CONTENT_STAGE_STAGGER_2) - d(CONTENT_STAGE_STAGGER_1) + d(OPEN_SETTLE_BUFFER);

    schedule(() => setPhase("soften"), softenAt);
    schedule(() => setPhase("transform"), transformAt);

    schedule(() => {
      // Kick the transform back to identity on the next frame so the
      // browser has committed the initial FLIP transform first.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransform("none");
          setRadius(20);
        });
      });
    }, transformAt);

    schedule(() => setPhase("content-enter"), contentEnterAt);
    schedule(() => setContentStage(1), contentEnterAt);
    schedule(() => setContentStage(2), contentEnterAt + d(CONTENT_STAGE_STAGGER_1));
    schedule(() => setContentStage(3), contentEnterAt + d(CONTENT_STAGE_STAGGER_2));
    schedule(() => {
      setPhase("open");
      closeButtonRef.current?.focus();
    }, openAt);
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

    const closingSurfaceAt = d(CLOSE_CONTENT_DEFOCUS_DURATION_MS);
    const restoringAt = closingSurfaceAt + d(CLOSE_GLASS_CONTRACT_DURATION_MS);
    const doneAt = restoringAt + d(CARD_DEFOCUS_DURATION_MS);

    schedule(() => {
      setPhase("closing-surface");
      setTransform(buildFlipTransform(origin, dest));
      setRadius(16);
    }, closingSurfaceAt);

    schedule(() => {
      // Card reappears already blurred, then a two-frame flip lets the
      // browser commit that blurred first frame before transitioning to
      // sharp — the same "commit, then flip" pattern used for the FLIP
      // transform reset above, so it reads as one continuous curve rather
      // than a hard snap into focus.
      setCardFocused(false);
      setPhase("restoring");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCardFocused(true);
        });
      });
    }, restoringAt);

    schedule(() => {
      reset();
      cardElement?.focus();
    }, doneAt);
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
  const isGlassy =
    phase === "soften" ||
    phase === "transform" ||
    phase === "closing-content" ||
    phase === "closing-surface";
  const isContentVisible =
    phase === "content-enter" ||
    phase === "open" ||
    phase === "closing-content" ||
    phase === "closing-surface";

  const contentContainer = useMemo(() => {
    if (!activeCard) {
      return null;
    }

    const isClosingContent = phase === "closing-content";
    // `[&>article]:h-full [&>article]:w-full` only matches a *direct* child
    // — ActivityDetailModal's `<article>` must not be nested inside any
    // extra wrapper div, or it falls back to its fixed 1364x758px intrinsic
    // size instead of filling the stage, which is what produced the
    // "broken/shot" render this rewrite fixes. Every animated property
    // (opacity, filter, transform) below is therefore applied to this one
    // wrapper, not split across nested divs.
    const contentBlurred = isClosingContent || contentStage < 1;

    return (
      <div
        className="absolute inset-0 overflow-hidden [&>article]:h-full [&>article]:w-full"
        style={{
          filter: contentBlurred ? blurFilter(CONTENT_BLUR_START_PX) : blurFilter(0),
          opacity: !isContentVisible ? 0 : isClosingContent ? 0 : contentStage >= 1 ? 1 : 0,
          transform: contentStage >= 1 && !isClosingContent ? "translateY(0)" : "translateY(6px)",
          transition: isClosingContent
            ? `filter ${d(CLOSE_CONTENT_DEFOCUS_DURATION_MS)}ms ${CLOSE_EASING}, opacity ${d(CLOSE_CONTENT_DEFOCUS_DURATION_MS)}ms ${CLOSE_EASING}`
            : `filter ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}, opacity ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}, transform ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}`
        }}
      >
        <ActivityDetailModal activity={activeCard.modalData} contentOnly isOpen />
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCard, contentStage, phase, isContentVisible, speed]);

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

      <div className="relative py-6">
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
            const isActiveAndHidden = isActive && phase !== "idle" && phase !== "restoring";

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
                  filter:
                    isActive && phase === "restoring"
                      ? blurFilter(cardFocused ? 0 : CARD_TO_GLASS_BLUR_PX)
                      : isSoftened && !isActive
                        ? blurFilter(3)
                        : blurFilter(0),
                  opacity: isActiveAndHidden ? 0 : isSoftened && !isActive ? 0.45 : 1,
                  transform: isActive && phase === "acknowledge" ? "translateY(-2px)" : "translateY(0)",
                  transition:
                    isActive && phase === "restoring"
                      ? `filter ${d(CARD_DEFOCUS_DURATION_MS)}ms ${CARD_DEFOCUS_EASING}`
                      : `opacity ${d(180)}ms ease-out, filter ${d(180)}ms ease-out, transform ${d(80)}ms ease-out`
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
            className="pointer-events-none fixed z-50 overflow-hidden shadow-[0_18px_50px_rgba(36,31,24,0.18)] will-change-transform"
            ref={surfaceRef}
            role="dialog"
            style={{
              background: isGlassy
                ? GLASS_SURFACE_TINT
                : "linear-gradient(160deg,#FCFBFA 0%,#F3EEE7 100%)",
              backdropFilter: isGlassy ? blurFilter(GLASS_SURFACE_BLUR_PX) : blurFilter(0),
              WebkitBackdropFilter: isGlassy ? blurFilter(GLASS_SURFACE_BLUR_PX) : blurFilter(0),
              borderRadius: radius,
              boxSizing: "border-box",
              height: destRectRef.current?.height,
              left: destRectRef.current?.left,
              top: destRectRef.current?.top,
              transform,
              transformOrigin: "top left",
              transition: reducedMotion
                ? "none"
                : phase === "closing-surface" || phase === "restoring"
                  ? `transform ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}, border-radius ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}, background ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}, backdrop-filter ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}`
                  : `transform ${d(GLASS_EXPAND_DURATION_MS)}ms ${GLASS_EXPAND_EASING}, border-radius ${d(GLASS_EXPAND_DURATION_MS)}ms ${GLASS_EXPAND_EASING}, background ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}, backdrop-filter ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}`,
              width: destRectRef.current?.width
            }}
          >
            {contentContainer}

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
