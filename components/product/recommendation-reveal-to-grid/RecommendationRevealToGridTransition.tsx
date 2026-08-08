"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import playBookyHorizontalLogo from "@/assets/logos/Horizontal Logo.svg";
import {
  activityGridDesktopViewport,
  activityGridViewports,
  type ActivityGridViewportMode,
  type ActivityGridVisualCard
} from "@/components/product/ActivityGridVisualLayer";
import { ActivityGridInteractiveLayer } from "@/components/product/recommendation-reveal-to-grid/ActivityGridInteractiveLayer";
import {
  recommendationRevealCards,
  type RecommendationRevealCardId
} from "@/components/product/RecommendationCardReveal";
import type { RecommendationLoadingViewport } from "@/components/product/RecommendationLoadingExperience";
import {
  RecommendationResultExperience,
  recommendedWorkshop
} from "@/components/product/RecommendationResultExperience";
import { ActivityCard, type ActivityCardData } from "@/components/ui/ActivityCard";

export type { ActivityGridViewportMode };

const gridToResultViewport: Record<
  ActivityGridViewportMode,
  RecommendationLoadingViewport
> = {
  desktop: "desktop",
  mobile: "mobile",
  tablet: "tablet-landscape"
};

export const revealToGridRoute =
  "/design-system/core-experience/recommendation-reveal-to-grid";
export const recommendationRevealRoute =
  "/design-system/core-experience/recommendation-card-reveal";
export const activityGridRoute = "/design-system/core-experience/activity-grid";

// Real product header height, matching the 72px reserved by
// RecommendationExperienceShell elsewhere. This is a placeholder --
// logo only, no nav, no login -- until the real header for this screen
// exists. Only rendered in fillViewport mode; the Design Portal's own
// review widget keeps its own chrome and doesn't need this.
const HEADER_HEIGHT = 72;

function PreviewAppHeader() {
  return (
    <header className="relative z-10 flex h-[72px] shrink-0 items-center bg-transparent px-6 md:px-10">
      <Link aria-label="PlayBooky home" href="/">
        <Image
          alt=""
          aria-hidden="true"
          height={35}
          priority
          src={playBookyHorizontalLogo}
          width={142}
        />
      </Link>
    </header>
  );
}

// "armed" = measured, reveal deck has just been hidden, proxy cards are
// painted at their FROM position/rotation for one frame before the CSS
// transition to their TO position kicks in on the next phase.
type Phase = "recommendation" | "armed" | "moving" | "grid";

// A point + a *real, known* card size (never a size read off a rotated
// element's bounding box -- see getRevealCardSize / grid geometry
// tables). Rotation is only ever non-zero on the "from" side.
type CardPlacement = {
  centerX: number;
  centerY: number;
  height: number;
  rotation: number;
  width: number;
};

type TransitionCard = {
  activity: ActivityCardData;
  delayMs: number;
  from: CardPlacement;
  id: RecommendationRevealCardId;
  to: CardPlacement;
  zIndex: number;
};

// ---------------------------------------------------------------------
// MOTION -- every knob that controls how "organic" the reveal-to-grid
// flight feels. Nothing here affects positions or sizes (that's the
// FLIP math above) -- this is purely timing and easing.
//
//   clickResponseMs   Pause after Continue is pressed before anything
//                      starts moving. Pure button-feedback beat.
//   armMs              Technical only -- one frame gap the FLIP trick
//                      needs to paint the "from" position before
//                      flipping to "to" so the browser animates instead
//                      of snapping. Don't raise this for "slower", it's
//                      not a feel parameter.
//   positionDurationMs How long a card's move + resize + de-rotation
//                      takes, all together as one motion, at the base
//                      (non-slow, non-reduced-motion) speed. This is
//                      the main "how fast does it feel" dial. Position,
//                      scale and rotation animate as a single transform
//                      over this one duration on purpose -- splitting
//                      them into separately-timed pieces is what made
//                      an earlier version feel like "it hits a spot,
//                      then keeps adjusting" instead of one continuous
//                      arc.
//   staggerPerPairMs   Extra delay added per fan "ring": the centre
//                      card (pair 0) leads, each ring further out
//                      (pair 1/2/3, the ones with the sharper starting
//                      angles) leaves a beat later. This is what turns
//                      "all 7 cards move in perfect lockstep" into a
//                      cascading collapse. Set to 0 for everything to
//                      move in unison.
//   cardOverrideMs     Per-card manual override (by id) for extra delay
//                      on top of the pair-based stagger, in case one
//                      specific card needs to lead/lag independently of
//                      its ring. Empty by default.
//   easing             Shared easing curve for the whole move. A smooth,
//                      no-snap deceleration curve reads as organic;
//                      anything closer to linear or with a sharp start
//                      reads as mechanical/chunky.
//
// There is no fade anywhere in this transition on purpose -- the reveal
// backdrop cuts out instantly and the grid content appears instantly
// the moment cards land. Two separately-timed opacity fades bookending
// the flight (deck fades out, long gap, grid fades in) read like the
// whole screen blinking. The cards flying are the only motion; nothing
// else needs its own transition.
// ---------------------------------------------------------------------
const MOTION = {
  armMs: 32,
  cardOverrideMs: {} as Partial<Record<RecommendationRevealCardId, number>>,
  clickResponseMs: 110,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  positionDurationMs: 980,
  reducedPositionDurationMs: 180,
  staggerPerPairMs: 70
};

// The real, un-scaled card size the reveal deck renders at for a given
// viewport. Must always match the ActivityCardSize used inside
// RecommendationCardReveal so "from" and "to" shapes agree and the
// transition never has to stretch a card non-uniformly.
function getRevealCardSize(resultViewport: RecommendationLoadingViewport) {
  return resultViewport === "mobile"
    ? { height: 190, width: 333 }
    : { height: 370, width: 256 };
}

// Reads a card's true CENTER point from the DOM (position is real,
// layout-dependent information we have to measure) but ignores the
// element's measured width/height entirely -- for rotated fan cards,
// getBoundingClientRect() returns the axis-aligned bounding box of the
// *rotated* shape, which is larger than the card and inflated unevenly
// per axis. Using that inflated box as the card's size is what produced
// the non-uniform "squash" during flight. The center point itself is
// still correct even when rotated, because CSS rotation pivots on the
// element's own center by default.
function readCenter(element: Element, root: Element) {
  const rect = element.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();

  return {
    centerX: rect.left - rootRect.left + rect.width / 2,
    centerY: rect.top - rootRect.top + rect.height / 2
  };
}

function getVisualCards(): ActivityGridVisualCard[] {
  return recommendationRevealCards.map((card) => ({
    activity: card.activity,
    id: card.id,
    label: card.activity.title
  }));
}

function useScaleToFit() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = wrapperRef.current;

    if (!element) {
      return;
    }

    const updateScale = () => {
      setScale(
        Math.min(1, element.clientWidth / activityGridDesktopViewport.width)
      );
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { scale, wrapperRef };
}

function cardTransform(placement: CardPlacement, boxWidth: number, boxHeight: number) {
  const translateX = placement.centerX - boxWidth / 2;
  const translateY = placement.centerY - boxHeight / 2;
  const scaleX = placement.width / boxWidth;
  const scaleY = placement.height / boxHeight;

  // Rotate/scale pivot on the element's own center (default
  // transform-origin), so they never move where the center ends up --
  // only translate does that. Order here doesn't change the result,
  // but keeping rotate before scale mirrors how the source card's own
  // CSS composes its resting transform.
  return `translate3d(${translateX}px, ${translateY}px, 0) rotate(${placement.rotation}deg) scale(${scaleX}, ${scaleY})`;
}

function getCardDelayMs(card: { id: RecommendationRevealCardId; pair: number }) {
  const override = MOTION.cardOverrideMs[card.id];

  if (override !== undefined) {
    return override;
  }

  return card.pair * MOTION.staggerPerPairMs;
}

export function RecommendationRevealToGridTransition({
  fillViewport = false,
  reducedMotion = false,
  resetKey,
  slow = false,
  viewport = "desktop"
}: {
  // fillViewport = the real screen: canvas is position:fixed, inset:0,
  // no fixed pixel width/height, no frame. This is what the standalone
  // /preview route uses. Leaving it false keeps the old bounded-box
  // sizing used by the Design Portal's own review widget, which
  // intentionally shows a bordered preview card.
  fillViewport?: boolean;
  reducedMotion?: boolean;
  resetKey: number;
  slow?: boolean;
  viewport?: ActivityGridViewportMode;
}) {
  const canvasGeometry = activityGridViewports[viewport];
  const resultViewport = gridToResultViewport[viewport];
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const sourceRefs = useRef(new Map<string, HTMLDivElement>());
  const gridRefs = useRef(new Map<string, HTMLButtonElement>());
  const timersRef = useRef<number[]>([]);
  const [phase, setPhase] = useState<Phase>("recommendation");
  const [transitionCards, setTransitionCards] = useState<TransitionCard[]>([]);
  const visualCards = useMemo(() => getVisualCards(), []);
  const multiplier = slow && !reducedMotion ? 2.5 : 1;
  const moveDuration = reducedMotion
    ? MOTION.reducedPositionDurationMs
    : Math.round(MOTION.positionDurationMs * multiplier);
  const staggerScale = reducedMotion ? 0 : multiplier;
  const showReveal = phase === "recommendation";
  const showGridContent = phase === "grid";
  const isFlying = phase === "armed" || phase === "moving";

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    clearTimers();
    setPhase("recommendation");
    setTransitionCards([]);

    return clearTimers;
  }, [clearTimers, resetKey]);

  const registerSourceCard = useCallback(
    (id: RecommendationRevealCardId, element: HTMLDivElement | null) => {
      if (!element) {
        sourceRefs.current.delete(id);
        return;
      }

      sourceRefs.current.set(id, element);
    },
    []
  );

  const registerGridCard = useCallback(
    (id: string, element: HTMLButtonElement | null) => {
      if (!element) {
        gridRefs.current.delete(id);
        return;
      }

      gridRefs.current.set(id, element);
    },
    []
  );

  function measureCards(): TransitionCard[] {
    const canvas = canvasRef.current;

    if (!canvas) {
      return [];
    }

    const fromSize = getRevealCardSize(resultViewport);
    const toSize = { height: canvasGeometry.cardHeight, width: canvasGeometry.cardWidth };

    return recommendationRevealCards.flatMap((card) => {
      const source = sourceRefs.current.get(card.id);
      const destination = gridRefs.current.get(card.id);

      if (!source || !destination) {
        return [];
      }

      const sourceCenter = readCenter(source, canvas);
      const destinationCenter = readCenter(destination, canvas);

      return {
        activity: card.activity,
        delayMs: Math.round(getCardDelayMs(card) * staggerScale),
        from: {
          ...sourceCenter,
          height: fromSize.height,
          rotation: card.rotate,
          width: fromSize.width
        },
        id: card.id,
        to: {
          ...destinationCenter,
          height: toSize.height,
          rotation: 0,
          width: toSize.width
        },
        // Same stacking order the resting fan uses (centre card on top,
        // rings behind it) -- without this the proxies stack by DOM
        // order instead and the centre card visibly ducks behind the
        // cards next to it the instant it starts moving.
        zIndex: card.zIndex
      };
    });
  }

  function handleContinue() {
    if (phase !== "recommendation") {
      return;
    }

    const measuredCards = measureCards();

    if (measuredCards.length !== recommendationRevealCards.length) {
      return;
    }

    clearTimers();
    setTransitionCards(measuredCards);

    const longestCardMs = Math.max(
      ...measuredCards.map((card) => card.delayMs + moveDuration)
    );

    timersRef.current = [
      window.setTimeout(() => setPhase("armed"), MOTION.clickResponseMs),
      window.setTimeout(
        () => setPhase("moving"),
        MOTION.clickResponseMs + MOTION.armMs
      ),
      window.setTimeout(
        () => {
          setPhase("grid");
          setTransitionCards([]);
        },
        MOTION.clickResponseMs + MOTION.armMs + longestCardMs
      )
    ];
  }

  return (
    <div
      className="recommendation-grid-transition-canvas"
      data-fill-viewport={fillViewport ? "true" : "false"}
      data-phase={phase}
      data-viewport={viewport}
      ref={canvasRef}
      style={
        fillViewport
          ? // Real page flow, not a fixed/clipped viewport box: if grid
            // content is taller than the screen, the actual page
            // scrolls, the normal way a webpage does. No child of this
            // needs its own overflow:auto -- that clipping is exactly
            // what was cutting off cards dragged upward past the
            // header, since a card being dragged is still a child of
            // whatever container clips it.
            { minHeight: "100vh", position: "relative", width: "100%" }
          : { height: canvasGeometry.height, width: canvasGeometry.width }
      }
    >
      {fillViewport ? <PreviewAppHeader /> : null}

      {/* Grid: in NORMAL DOCUMENT FLOW when fillViewport (not absolute).
          This is the fix for scroll not reaching it -- a
          position:absolute box's overflow isn't reliably picked up by
          the page's own scroll bounds, so a tall grid could report a
          scrollbar (because SOME content on the page made it necessary)
          without the browser actually being able to scroll down into
          it. Real, in-flow content always contributes its real height
          to the page, which is the only way to be sure the whole grid
          is reachable by scrolling. It's still always mounted (so its
          slot positions exist for the FLIP measurement before the deck
          disappears), just invisible until arrival. Sits directly under
          the header: 16px padding on top, none on the bottom, 16/32px
          horizontal depending on breakpoint. */}
      <div
        style={{
          padding: fillViewport
            ? `16px ${viewport === "mobile" ? 16 : 32}px 0`
            : 0,
          position: fillViewport ? "static" : "absolute",
          ...(fillViewport ? {} : { bottom: 0, left: 0, right: 0, top: 0 }),
          visibility: showGridContent ? "visible" : "hidden"
        }}
      >
        <ActivityGridInteractiveLayer
          cards={visualCards}
          inert={!showGridContent}
          registerCard={registerGridCard}
          viewport={viewport}
        />
      </div>

      {/* Reveal deck: a temporary overlay covering the exact same spot
          the grid starts at (position:absolute is fine here -- this
          content never needs to be scrolled into, it's a fixed-size fan
          that disappears the instant Continue is pressed, so it doesn't
          have the same "does this contribute to page scroll height"
          problem the grid did). Cut out INSTANTLY (no opacity
          transition, no fade) the moment Continue is pressed. */}
      {showReveal ? (
        <div
          className="absolute inset-x-0 z-10"
          style={{
            bottom: fillViewport ? undefined : 0,
            top: fillViewport ? HEADER_HEIGHT : 0
          }}
        >
          <RecommendationResultExperience
            className="recommendation-grid-transition-result"
            continueDisabled={phase !== "recommendation"}
            forceComplete
            onContinue={handleContinue}
            recommendation={recommendedWorkshop}
            registerCard={registerSourceCard}
            viewport={resultViewport}
          />
        </div>
      ) : null}

      {transitionCards.length > 0 ? (
        <div aria-hidden="true" className="recommendation-grid-transition-layer">
          {transitionCards.map((card) => {
            const placement = phase === "moving" ? card.to : card.from;
            const boxWidth = card.from.width;
            const boxHeight = card.from.height;
            const delay = isFlying ? card.delayMs : 0;

            return (
              // One element, one transform, one duration -- translate,
              // rotate and scale all animate together as a single
              // continuous motion. Z-index matches the resting fan's
              // stacking order so the centre card stays on top instead
              // of ducking behind its neighbours mid-flight.
              <div
                className="recommendation-grid-transition-card"
                data-card-id={card.id}
                key={card.id}
                style={{
                  height: boxHeight,
                  left: 0,
                  position: "absolute",
                  top: 0,
                  transform: cardTransform(placement, boxWidth, boxHeight),
                  transformOrigin: "50% 50%",
                  transition: isFlying
                    ? `transform ${moveDuration}ms ${MOTION.easing} ${delay}ms`
                    : "none",
                  width: boxWidth,
                  willChange: "transform",
                  zIndex: card.zIndex
                }}
              >
                {/* Always the reveal deck's own "library" card, never
                    the grid's "builder" card -- the proxy must look
                    pixel-identical to the real card it's replacing at
                    the moment it appears, or the swap itself reads as a
                    jump. The visual switch to the "builder" look
                    happens for free, invisibly, when this proxy is
                    removed and the real (visibility-gated) grid card
                    underneath appears at the exact same spot. */}
                <ActivityCard
                  activity={card.activity}
                  size={viewport === "mobile" ? "mobile" : "desktop"}
                  variant="library"
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function RecommendationRevealToGridPreview({
  reducedMotion,
  resetKey,
  slow
}: {
  reducedMotion: boolean;
  resetKey: number;
  slow: boolean;
}) {
  const { scale, wrapperRef } = useScaleToFit();

  return (
    <div className="recommendation-grid-transition-scale-wrap" ref={wrapperRef}>
      <div
        className="recommendation-grid-transition-scaled"
        style={{
          height: activityGridDesktopViewport.height * scale,
          width: activityGridDesktopViewport.width * scale
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left"
          }}
        >
          <RecommendationRevealToGridTransition
            reducedMotion={reducedMotion}
            resetKey={resetKey}
            slow={slow}
          />
        </div>
      </div>
    </div>
  );
}
