"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ActivityCard } from "@/components/ui/ActivityCard";
import { ActivityDetailModal } from "@/components/ui/ActivityDetailModal";

import {
  blurFilter,
  CARD_CONTENT_RADIUS_PX,
  CARD_DEFOCUS_DURATION_MS,
  CARD_DEFOCUS_EASING,
  CARD_STROKE_WIDTH_PX,
  CARD_TO_GLASS_BLUR_PX,
  CARD_TO_GLASS_DURATION_MS,
  CLOSE_CONTENT_DEFOCUS_DURATION_MS,
  CLOSE_EASING,
  CLOSE_GLASS_CONTRACT_DURATION_MS,
  CONTENT_BLUR_START_PX,
  CONTENT_CROSSFADE_DURATION_MS,
  CONTENT_FOCUS_DURATION_MS,
  CONTENT_FOCUS_EASING,
  GLASS_CONTENT_CROSSFADE_CENTER_FRACTION,
  GLASS_CONTENT_FOCUS_START_FRACTION,
  GLASS_EXPAND_DURATION_MS,
  GLASS_EXPAND_EASING,
  STROKE_FADE_DURATION_MS,
  strokeColor
} from "../shared/glassMotion";
import { PlaybackControls } from "../shared/PlaybackControls";
import {
  buildFillTransform,
  buildFlipTransform,
  CARD_NATURAL_HEIGHT_PX,
  CARD_NATURAL_WIDTH_PX,
  MODAL_CONTENT_NATURAL_HEIGHT_PX,
  MODAL_CONTENT_NATURAL_WIDTH_PX,
  rectFromElement,
  scaleDuration,
  STAGE_MIN_HEIGHT_PX,
  type Rect
} from "../shared/geometry";
import type { ConceptMeta, ConceptPhase, PlaybackSpeed, V3PrototypeCard } from "../shared/types";
import { useSystemReducedMotionPreference } from "../shared/useReducedMotionPreference";

/**
 * Shared write-up copy for the sequence both stroke variants run — only the
 * closing sentence of `principle` and the stroke-specific lines in
 * `sequence`/`specs` differ between the two exported `ConceptMeta`s below.
 */
const SHARED_PRINCIPLE =
  "The selected card and the modal are treated as one continuous surface that never loses the card's own shape. On click, the card's real rendered content (not a flat neutral panel) blurs in place while its border/stroke and 16px corner radius stay exactly as they are on the card — no snap to a different shape at the moment of click. That still-bordered, still-correctly-rounded, blurred surface then travels to the modal's footprint using a single transform (translate + scale), not width/height, so the move is GPU-composited and cannot step. Roughly halfway through that flight, the blurred card content cross-dissolves into a blurred rendering of the modal's own content — two blurred layers fading through each other mid-flight, not an instant swap. As the surface finishes settling into place, that blur resolves to 0, revealing the real, crisp modal content. Closing reverses the same beats: content defocuses first, then the blurred layers cross-dissolve back from modal to card roughly halfway through the contraction, then the revealed card itself defocuses back to sharp.";

const SHARED_SEQUENCE = [
  "Selection acknowledgement — the tapped card lifts slightly (80ms).",
  "Card content blurs in place — the card's own real content (icon/title/etc.), not a flat panel, blurs from sharp to frosted while its border and 16px radius stay unchanged (160ms).",
  "Surface expand — the still-bordered, still-rounded, blurred surface travels via transform: translate()+scale() from the card's screen rect to the stage rect (380ms, weighted-deceleration easing).",
  "Content crossfade — at roughly the halfway point of the expand, the blurred card-content layer cross-dissolves into a blurred rendering of the modal's content (180ms fade, centered on the expand's midpoint).",
  "Content focus — once the surface is ~80% settled, the (now modal) content resolves from blurred to sharp focus (190ms).",
  "Supporting content — the builder-flow row follows (120ms, staggered).",
  "Actions — footer actions arrive last, once the surface is fully still and sharp (100ms).",
  "Final focused state — modal is open, fully in focus; focus moves to close control.",
  "Close — content defocuses (140ms), the blurred layers cross-dissolve back from modal to card roughly halfway through the surface's contraction (300ms total), then the revealed card itself defocuses back to sharp (180ms)."
];

const SHARED_SPECS_HEAD = [
  { property: "Selection acknowledge", duration: "80ms", easing: "ease-out", note: "translateY(-2px) + shadow lift on the origin card only" },
  { property: "Card content blur-in", duration: "160ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "the card's real rendered content blurs in place (filter: blur(0→8px)); border/stroke and 16px radius do not change" },
  { property: "Sibling soften", duration: "180ms", easing: "ease-out", note: "opacity 1→0.45, blur 0→3px, staggered 12ms/card" },
  { property: "Surface expand (transform)", duration: "380ms", easing: "cubic-bezier(0.16, 1, 0.3, 1)", note: "transform only — never left/top/width/height; radius and stroke are constants, not animated" },
  { property: "Content crossfade", duration: "180ms", easing: "ease (opacity only)", note: "blurred card-content layer fades out as a blurred modal-content layer fades in, centered on the expand's ~50% mark" },
  { property: "Content focus", duration: "190ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "filter: blur(10px→0) on the modal layer + opacity + translateY(6px→0); starts once the expand is ~80% settled" },
  { property: "Supporting content", duration: "120ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "90ms after heading" },
  { property: "Actions", duration: "100ms", easing: "ease-out", note: "80ms after supporting content — final settle" }
];

const SHARED_SPECS_TAIL = [
  { property: "Close: content defocus", duration: "140ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", note: "modal content blurs out (0→10px) and stays visible before the surface moves" },
  { property: "Close: content crossfade back", duration: "180ms", easing: "ease (opacity only)", note: "blurred modal-content layer fades out as the blurred card-content layer fades in, centered on the contraction's ~50% mark" },
  { property: "Close: surface contract", duration: "300ms", easing: "cubic-bezier(0.4, 0, 0.2, 1)", note: "still-bordered, still-rounded surface contracts back to the origin card's exact rect — JS unmount timer matches this duration exactly, no early cut" },
  { property: "Close: card defocus", duration: "180ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "the revealed card blurs from 8px back to sharp — the final close beat" }
];

export const cohesiveSurfaceFramedMeta: ConceptMeta = {
  id: "cohesive-surface-framed",
  name: "Cohesive Surface — Framed",
  tagline: "Concept 1a — blur-crossfade morph, stroke retained",
  principle: `${SHARED_PRINCIPLE} In this "Framed" variant the card's 2px border/stroke stays visible, unchanged, for the entire sequence — through the blur-in, the expand, the crossfade, and the settle — and remains visible on the fully open modal. Closing reverses that symmetrically: the border stays visible until the surface itself starts contracting back down toward the card.`,
  sequence: [
    ...SHARED_SEQUENCE.slice(0, -1),
    "Close — content defocuses (140ms), the border stays visible throughout, the blurred layers cross-dissolve back from modal to card roughly halfway through the surface's contraction (300ms total), then the revealed card itself defocuses back to sharp (180ms)."
  ],
  specs: [
    ...SHARED_SPECS_HEAD,
    { property: "Border/stroke", duration: "n/a", easing: "n/a", note: "2px #B77B32 border stays visible, unchanged, from click through the fully open modal — no fade at any point while open" },
    ...SHARED_SPECS_TAIL
  ],
  strengths: [
    "Strongest sense of \"this exact card became the modal\" — the border never disappears, so the shared identity of card and modal stays visually explicit the whole time.",
    "Transform-only geometry + a constant radius/stroke avoids layout thrash and the stepped/rugged look, and rules out any shape snap at the click moment.",
    "The blurred-content crossfade (real card pixels → real modal pixels) reads as an actual dissolve, not a panel swap — no flat neutralize block to seam against."
  ],
  risks: [
    "A 2px border at large open-modal scale can look visually heavy/unusual compared to a typical borderless modal — accepted as explicit direction, not a bug.",
    "Requires accurate rect measurement — resize/scroll mid-transition needs a guard (currently: interaction lock).",
    "Two full-content blurred layers (ActivityCard + ActivityDetailModal) mounted simultaneously during the crossfade window has a real (if modest) paint/compositing cost."
  ],
  recommendedUse: "Use when the border is a meaningful part of the card's identity (e.g. a builder-flow selection state) and should keep reading as \"this card, now open\" even once fully expanded."
};

export const cohesiveSurfaceFramelessMeta: ConceptMeta = {
  id: "cohesive-surface-frameless",
  name: "Cohesive Surface — Frameless",
  tagline: "Concept 1b — blur-crossfade morph, stroke resolves away",
  principle: `${SHARED_PRINCIPLE} In this "Frameless" variant the card's 2px border/stroke stays visible and unchanged through the blur-in, expand, and crossfade — identical to the Framed variant up to that point — but fades out once content reaches sharp focus at the very end of the open transition, leaving the fully open modal borderless. On close, the border fades back in as the content starts to defocus, before the surface begins contracting back down to the card.`,
  sequence: [
    ...SHARED_SEQUENCE.slice(0, -1),
    "Close — the border fades back in as content starts to defocus (140ms), the blurred layers cross-dissolve back from modal to card roughly halfway through the surface's contraction (300ms total), then the revealed card itself defocuses back to sharp (180ms)."
  ],
  specs: [
    ...SHARED_SPECS_HEAD,
    { property: "Border/stroke fade-out", duration: "190ms", easing: "ease-out", note: "2px #B77B32 border stays visible through the crossfade, then fades to transparent as content resolves to sharp focus — fully open modal is borderless" },
    ...SHARED_SPECS_TAIL.slice(0, 1),
    { property: "Border/stroke fade-in", duration: "190ms", easing: "ease-out", note: "border fades back to #B77B32 as content starts to defocus on close, before the surface contracts" },
    ...SHARED_SPECS_TAIL.slice(1)
  ],
  strengths: [
    "Fully open modal reads as a clean, borderless surface — closer to how the rest of the product's modals look at rest.",
    "Still keeps the strong \"this card became the modal\" read during the transition itself, since the border is present through the whole blur/expand/crossfade beat — only the settled end state differs from Framed.",
    "The border fading back in right as the content starts to defocus on close gives an early, legible cue that the surface is about to start shrinking, before any geometry actually moves."
  ],
  risks: [
    "The border appearing/disappearing is an extra animated property to keep in sync with the content-focus timing — a slow device could show the border lingering past the point content looks sharp.",
    "Requires accurate rect measurement — resize/scroll mid-transition needs a guard (currently: interaction lock).",
    "Two full-content blurred layers (ActivityCard + ActivityDetailModal) mounted simultaneously during the crossfade window has a real (if modest) paint/compositing cost."
  ],
  recommendedUse: "Best default direction for PlayBooky's activity grid if the fully open modal should match the product's existing (borderless) modal language — the border only exists as a transitional cue, not a resting-state treatment."
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

/** Whether the border/stroke should currently read as visible. The
 * "framed" variant is always visible; the "frameless" variant hides only
 * once content has resolved to sharp focus (content-enter/open), and is
 * visible again the instant a close begins. */
function isStrokeVisible(phase: ConceptPhase, keepStroke: boolean) {
  if (keepStroke) {
    return true;
  }

  return !(phase === "content-enter" || phase === "open");
}

/**
 * Shared engine for both Concept 1 stroke variants (Framed / Frameless).
 * The only behavioural difference between the two is whether the border
 * fades out once content is sharp — everything else (blur-in, transform
 * expand, crossfade, focus resolve, close sequence) is identical, so it
 * lives here once and is parameterized by `keepStroke`.
 */
function CohesiveSurfaceEngine({
  cards,
  keepStroke,
  onLockChange,
  variantLabel
}: {
  cards: V3PrototypeCard[];
  keepStroke: boolean;
  onLockChange?: (locked: boolean) => void;
  variantLabel: string;
}) {
  const [phase, setPhase] = useState<ConceptPhase>("idle");
  const [activeCard, setActiveCard] = useState<V3PrototypeCard | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [speed, setSpeed] = useState<PlaybackSpeed>("normal");
  const [reducedMotionPreview, setReducedMotionPreview] = useState(false);
  const [transform, setTransform] = useState("none");
  const [cardLayerSoftened, setCardLayerSoftened] = useState(false);
  const [crossfaded, setCrossfaded] = useState(false);
  const [contentStage, setContentStage] = useState(0);
  const [cardFocused, setCardFocused] = useState(true);
  // The decorative border frame is driven by real layout properties
  // (left/top/width/height), not the content surface's `transform`, so its
  // border-width/radius never get distorted by an anisotropic scale — see
  // `borderFrameRef` below. `frameRect` mirrors the same origin-rect ->
  // dest-rect journey `transform` takes via `buildFlipTransform`, just
  // expressed as a literal rect instead of a translate/scale string.
  const [frameRect, setFrameRect] = useState<Rect | null>(null);

  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const gridRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const borderFrameRef = useRef<HTMLDivElement | null>(null);
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
    setFrameRect(null);
    setCardLayerSoftened(false);
    setCrossfaded(false);
    setContentStage(0);
    setCardFocused(true);
  }

  function runOpen(card: V3PrototypeCard, originRect: Rect, destRect: Rect) {
    originRectRef.current = originRect;
    destRectRef.current = destRect;
    setActiveCard(card);

    if (reducedMotion) {
      setTransform("none");
      setFrameRect(destRect);
      setCardLayerSoftened(false);
      setCrossfaded(true);
      setContentStage(3);
      setCardFocused(true);
      setPhase("open");
      schedule(() => closeButtonRef.current?.focus(), 30);
      return;
    }

    setTransform(buildFlipTransform(originRect, destRect));
    setFrameRect(originRect);
    setCardLayerSoftened(false);
    setCrossfaded(false);
    setContentStage(0);
    setCardFocused(true);
    setPhase("acknowledge");

    const softenAt = d(ACK_DURATION);
    const transformAt = softenAt + d(CARD_TO_GLASS_DURATION_MS);
    const crossfadeAt = transformAt + d(GLASS_EXPAND_DURATION_MS * GLASS_CONTENT_CROSSFADE_CENTER_FRACTION);
    const contentEnterAt = transformAt + d(GLASS_EXPAND_DURATION_MS * GLASS_CONTENT_FOCUS_START_FRACTION);
    const openAt = contentEnterAt + d(CONTENT_STAGE_STAGGER_2) - d(CONTENT_STAGE_STAGGER_1) + d(OPEN_SETTLE_BUFFER);

    schedule(() => {
      setPhase("soften");
      setCardLayerSoftened(true);
    }, softenAt);

    schedule(() => setPhase("transform"), transformAt);

    schedule(() => {
      // Kick the transform back to identity on the next frame so the
      // browser has committed the initial FLIP transform first. The
      // border frame's rect flips to the dest rect in the same
      // double-rAF window so it stays in visual lockstep with the
      // content surface's transform.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransform("none");
          setFrameRect(destRect);
        });
      });
    }, transformAt);

    schedule(() => setCrossfaded(true), crossfadeAt);

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
    const crossfadeBackAt = closingSurfaceAt + d(CLOSE_GLASS_CONTRACT_DURATION_MS * GLASS_CONTENT_CROSSFADE_CENTER_FRACTION);
    const restoringAt = closingSurfaceAt + d(CLOSE_GLASS_CONTRACT_DURATION_MS);
    const doneAt = restoringAt + d(CARD_DEFOCUS_DURATION_MS);

    schedule(() => {
      setPhase("closing-surface");
      setTransform(buildFlipTransform(origin, dest));
      setFrameRect(origin);
    }, closingSurfaceAt);

    schedule(() => setCrossfaded(false), crossfadeBackAt);

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
  const isClosingContent = phase === "closing-content";
  const strokeVisible = isStrokeVisible(phase, keepStroke);

  const layers = useMemo(() => {
    if (!activeCard) {
      return null;
    }

    const cardLayerBlurPx = cardLayerSoftened ? CARD_TO_GLASS_BLUR_PX : 0;
    const modalContentBlurred = isClosingContent || contentStage < 1;

    // The surface's own box (surfaceRef) is a fixed destRect-sized box —
    // only its outer `transform` animates (FLIP: origin rect -> identity).
    // So the content layers below just need a *static* scale mapping each
    // component's real fixed intrinsic size onto that constant destRect
    // size; they don't need to counter-animate anything themselves.
    const dest = destRectRef.current;
    const cardFillTransform = dest
      ? buildFillTransform({ height: CARD_NATURAL_HEIGHT_PX, width: CARD_NATURAL_WIDTH_PX }, dest)
      : "none";
    const modalFillTransform = dest
      ? buildFillTransform(
        { height: MODAL_CONTENT_NATURAL_HEIGHT_PX, width: MODAL_CONTENT_NATURAL_WIDTH_PX },
        dest
      )
      : "none";

    return (
      <>
        {/*
          Layer 1 — the origin card's own real content, blurred in place.
          `ActivityCard`'s root <article> has its own fixed intrinsic size
          (Tailwind h-[..]/w-[..]), so it's rendered at that real size inside
          a fixed-size wrapper, then scaled up with a static `transform:
          scale()` to fill however big the surface currently is. The
          surface's own outer transform (FLIP) is what actually animates
          from the card's rect to the stage rect — this inner scale just
          keeps the real content mapped onto that constant destRect size.
        */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            filter: blurFilter(cardLayerBlurPx),
            opacity: crossfaded ? 0 : 1,
            transition: `filter ${d(CARD_TO_GLASS_DURATION_MS)}ms ${GLASS_EXPAND_EASING}, opacity ${d(CONTENT_CROSSFADE_DURATION_MS)}ms ease`
          }}
        >
          <div
            style={{
              height: CARD_NATURAL_HEIGHT_PX,
              left: 0,
              position: "absolute",
              top: 0,
              transform: cardFillTransform,
              transformOrigin: "top left",
              width: CARD_NATURAL_WIDTH_PX
            }}
          >
            {/*
              `ActivityCard`'s own root <article> bakes in its own
              `border-[2px] border-[#B77B32] rounded-[16px]` — left alone,
              that renders a second border/radius ring nested under this
              layer's own scale, on top of the surface's (surfaceRef) own
              border+radius, which is the single source of truth for the
              whole animated surface. This inner wrapper crops exactly
              `CARD_STROKE_WIDTH_PX` off each edge of the natural-size card
              (shifting the card by the same amount in the opposite
              direction so its content stays registered at 0,0), so only
              the card's interior content shows here — no border of its
              own. Any square-cornered sliver left where the card's real
              16px-radius corner used to be is clipped away by the outer
              surface's own overflow-hidden + border-radius.
            */}
            <div
              style={{
                borderRadius: Math.max(0, CARD_CONTENT_RADIUS_PX - CARD_STROKE_WIDTH_PX),
                height: CARD_NATURAL_HEIGHT_PX - 2 * CARD_STROKE_WIDTH_PX,
                left: CARD_STROKE_WIDTH_PX,
                overflow: "hidden",
                position: "absolute",
                top: CARD_STROKE_WIDTH_PX,
                width: CARD_NATURAL_WIDTH_PX - 2 * CARD_STROKE_WIDTH_PX
              }}
            >
              <div
                style={{
                  height: CARD_NATURAL_HEIGHT_PX,
                  left: -CARD_STROKE_WIDTH_PX,
                  position: "absolute",
                  top: -CARD_STROKE_WIDTH_PX,
                  width: CARD_NATURAL_WIDTH_PX
                }}
              >
                <ActivityCard activity={activeCard.activity} variant="builder" />
              </div>
            </div>
          </div>
        </div>

        {/* Layer 2 — a blurred rendering of the modal's own content, that
            crossfades in against layer 1 and then resolves to sharp focus.
            `ActivityDetailModal` (`contentOnly`) also has a fixed intrinsic
            size, so it gets the same fixed-size + static-scale treatment. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            filter: modalContentBlurred ? blurFilter(CONTENT_BLUR_START_PX) : blurFilter(0),
            opacity: crossfaded ? 1 : 0,
            transform: contentStage >= 1 && !isClosingContent ? "translateY(0)" : "translateY(6px)",
            transition: isClosingContent
              ? `filter ${d(CLOSE_CONTENT_DEFOCUS_DURATION_MS)}ms ${CLOSE_EASING}, opacity ${d(CONTENT_CROSSFADE_DURATION_MS)}ms ease`
              : `filter ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}, opacity ${d(CONTENT_CROSSFADE_DURATION_MS)}ms ease, transform ${d(CONTENT_FOCUS_DURATION_MS)}ms ${CONTENT_FOCUS_EASING}`
          }}
        >
          <div
            style={{
              height: MODAL_CONTENT_NATURAL_HEIGHT_PX,
              left: 0,
              position: "absolute",
              top: 0,
              transform: modalFillTransform,
              transformOrigin: "top left",
              width: MODAL_CONTENT_NATURAL_WIDTH_PX
            }}
          >
            <ActivityDetailModal activity={activeCard.modalData} contentOnly isOpen />
          </div>
        </div>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCard, cardLayerSoftened, crossfaded, contentStage, isClosingContent, speed]);

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
                aria-label={`Open ${card.label} (Cohesive Surface — ${variantLabel})`}
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
          <>
            <div
              aria-label={`${activeCard.label} activity details`}
              aria-modal={phase === "open" ? true : undefined}
              className="pointer-events-none fixed z-50 overflow-hidden shadow-[0_18px_50px_rgba(36,31,24,0.18)] will-change-transform"
              ref={surfaceRef}
              role="dialog"
              style={{
                background: "linear-gradient(160deg,#FCFBFA 0%,#F3EEE7 100%)",
                // Corner-radius crop mask only — the actual border stroke
                // now lives entirely on `borderFrameRef` below, which is
                // driven by real width/height/top/left rather than this
                // element's `transform`, so the stroke never gets
                // squashed by an anisotropic scale mid-flight.
                borderRadius: CARD_CONTENT_RADIUS_PX,
                height: destRectRef.current?.height,
                left: destRectRef.current?.left,
                top: destRectRef.current?.top,
                transform,
                transformOrigin: "top left",
                transition: reducedMotion
                  ? "none"
                  : phase === "closing-surface" || phase === "restoring"
                    ? `transform ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}`
                    : `transform ${d(GLASS_EXPAND_DURATION_MS)}ms ${GLASS_EXPAND_EASING}`,
                width: destRectRef.current?.width
              }}
            >
              {layers}

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

            {/*
              Decorative border frame — purely visual (`aria-hidden`), kept
              as a sibling overlay on top of the content surface rather than
              a child so it never inherits `surfaceRef`'s `transform`. Its
              width/height/top/left are driven directly (real layout
              properties, animated via a plain CSS `transition`) from the
              origin card's rect to the destination stage rect, using the
              same open/close timing+easing as the content surface's
              transform (`GLASS_EXPAND_*`/`CLOSE_*`) so the two stay in
              visual lockstep. Because this element has no content to
              reflow, animating layout properties directly is cheap here —
              unlike the content surface, which deliberately avoids
              width/height animation. Border-width and border-radius stay
              fixed, constant pixel values the whole time, so they render
              correctly undistorted at every point in the animation, not
              just the two endpoints.
            */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed z-50"
              ref={borderFrameRef}
              style={{
                borderColor: strokeColor(strokeVisible),
                borderRadius: CARD_CONTENT_RADIUS_PX,
                borderStyle: "solid",
                borderWidth: CARD_STROKE_WIDTH_PX,
                boxSizing: "border-box",
                height: (frameRect ?? destRectRef.current)?.height,
                left: (frameRect ?? destRectRef.current)?.left,
                top: (frameRect ?? destRectRef.current)?.top,
                transition: reducedMotion
                  ? "none"
                  : phase === "closing-surface" || phase === "restoring"
                    ? `left ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}, top ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}, width ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}, height ${d(CLOSE_GLASS_CONTRACT_DURATION_MS)}ms ${CLOSE_EASING}, border-color ${d(STROKE_FADE_DURATION_MS)}ms ease-out`
                    : `left ${d(GLASS_EXPAND_DURATION_MS)}ms ${GLASS_EXPAND_EASING}, top ${d(GLASS_EXPAND_DURATION_MS)}ms ${GLASS_EXPAND_EASING}, width ${d(GLASS_EXPAND_DURATION_MS)}ms ${GLASS_EXPAND_EASING}, height ${d(GLASS_EXPAND_DURATION_MS)}ms ${GLASS_EXPAND_EASING}, border-color ${d(STROKE_FADE_DURATION_MS)}ms ease-out`,
                width: (frameRect ?? destRectRef.current)?.width
              }}
            />
          </>,
          document.body
        )
        : null}
    </div>
  );
}

export function CohesiveSurfaceFramedConcept({
  cards,
  onLockChange
}: {
  cards: V3PrototypeCard[];
  onLockChange?: (locked: boolean) => void;
}) {
  return (
    <CohesiveSurfaceEngine
      cards={cards}
      keepStroke
      onLockChange={onLockChange}
      variantLabel="Framed"
    />
  );
}

export function CohesiveSurfaceFramelessConcept({
  cards,
  onLockChange
}: {
  cards: V3PrototypeCard[];
  onLockChange?: (locked: boolean) => void;
}) {
  return (
    <CohesiveSurfaceEngine
      cards={cards}
      keepStroke={false}
      onLockChange={onLockChange}
      variantLabel="Frameless"
    />
  );
}
