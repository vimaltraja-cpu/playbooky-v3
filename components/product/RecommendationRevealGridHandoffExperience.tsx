"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ActivityGridExperience } from "@/components/product/ActivityGridExperience";
import {
  activityGridViewports,
  type ActivityGridViewportMode
} from "@/components/product/ActivityGridVisualLayer";
import {
  recommendationRevealCards,
  type RecommendationCardRevealPhase,
  type RecommendationRevealCardId
} from "@/components/product/RecommendationCardReveal";
import type { RecommendationLoadingViewport } from "@/components/product/RecommendationLoadingExperience";
import { RecommendationRevealTemplateExperience } from "@/components/product/RecommendationRevealTemplateExperience";
import { ActivityCard, type ActivityCardData } from "@/components/ui/ActivityCard";
import styles from "./RecommendationScreens.module.css";

type HandoffPhase = "reveal" | "armed" | "moving" | "grid";

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

const REVEAL_TO_GRID_HOLD_MS = 3600;

const MOTION = {
  armMs: 32,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  positionDurationMs: 980,
  staggerPerPairMs: 70
};

const gridToResultViewport: Record<
  ActivityGridViewportMode,
  RecommendationLoadingViewport
> = {
  desktop: "desktop",
  mobile: "mobile",
  tablet: "tablet-landscape"
};

function getResponsiveViewport(): ActivityGridViewportMode {
  if (typeof window === "undefined") {
    return "desktop";
  }

  if (window.innerWidth < 768) {
    return "mobile";
  }

  if (window.innerWidth < 1200) {
    return "tablet";
  }

  return "desktop";
}

function getRevealCardSize(resultViewport: RecommendationLoadingViewport) {
  return resultViewport === "mobile"
    ? { height: 190, width: 333 }
    : { height: 370, width: 256 };
}

function readCenter(element: Element, root: Element) {
  const rect = element.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();

  return {
    centerX: rect.left - rootRect.left + rect.width / 2,
    centerY: rect.top - rootRect.top + rect.height / 2
  };
}

function cardTransform(
  placement: CardPlacement,
  boxWidth: number,
  boxHeight: number
) {
  const translateX = placement.centerX - boxWidth / 2;
  const translateY = placement.centerY - boxHeight / 2;
  const scaleX = placement.width / boxWidth;
  const scaleY = placement.height / boxHeight;

  return `translate3d(${translateX}px, ${translateY}px, 0) rotate(${placement.rotation}deg) scale(${scaleX}, ${scaleY})`;
}

export function RecommendationRevealGridHandoffExperience() {
  const [viewport, setViewport] = useState<ActivityGridViewportMode>("desktop");
  const [revealPhase, setRevealPhase] =
    useState<RecommendationCardRevealPhase>("pending");
  const [handoffPhase, setHandoffPhase] = useState<HandoffPhase>("reveal");
  const [transitionCards, setTransitionCards] = useState<TransitionCard[]>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sourceRefs = useRef(new Map<string, HTMLDivElement>());
  const gridRefs = useRef(new Map<string, HTMLButtonElement>());
  const timersRef = useRef<number[]>([]);
  const resultViewport = gridToResultViewport[viewport];
  const gridGeometry = activityGridViewports[viewport];
  const hiddenCardIds = useMemo(
    () => recommendationRevealCards.map((card) => card.id),
    []
  );
  const isFlying = handoffPhase === "armed" || handoffPhase === "moving";
  const showGrid = handoffPhase !== "reveal";
  const gridInteractive = handoffPhase === "grid";

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    const updateViewport = () => setViewport(getResponsiveViewport());

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

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

  const measureCards = useCallback(() => {
    const root = rootRef.current;

    if (!root) {
      return [];
    }

    const fromSize = getRevealCardSize(resultViewport);
    const toSize = {
      height: gridGeometry.cardHeight,
      width: gridGeometry.cardWidth
    };

    if (fromSize.height !== toSize.height || fromSize.width !== toSize.width) {
      console.warn(
        "Reveal to grid card size mismatch",
        { fromSize, toSize, viewport }
      );
      return [];
    }

    return recommendationRevealCards.flatMap((card) => {
      const source = sourceRefs.current.get(card.id);
      const destination = gridRefs.current.get(card.id);

      if (!source || !destination) {
        return [];
      }

      return {
        activity: card.activity,
        delayMs: card.pair * MOTION.staggerPerPairMs,
        from: {
          ...readCenter(source, root),
          height: fromSize.height,
          rotation: card.rotate,
          width: fromSize.width
        },
        id: card.id,
        to: {
          ...readCenter(destination, root),
          height: toSize.height,
          rotation: 0,
          width: toSize.width
        },
        zIndex: card.zIndex
      };
    });
  }, [gridGeometry.cardHeight, gridGeometry.cardWidth, resultViewport, viewport]);

  const beginHandoff = useCallback(() => {
    if (handoffPhase !== "reveal") {
      return;
    }

    const measuredCards = measureCards();

    if (measuredCards.length !== recommendationRevealCards.length) {
      return;
    }

    clearTimers();
    setTransitionCards(measuredCards);
    setHandoffPhase("armed");

    const longestCardMs = Math.max(
      ...measuredCards.map((card) => card.delayMs + MOTION.positionDurationMs)
    );

    timersRef.current = [
      window.setTimeout(() => setHandoffPhase("moving"), MOTION.armMs),
      window.setTimeout(
        () => {
          setHandoffPhase("grid");
          setTransitionCards([]);
        },
        MOTION.armMs + longestCardMs
      )
    ];
  }, [clearTimers, handoffPhase, measureCards]);

  useEffect(() => {
    if (revealPhase !== "complete" || handoffPhase !== "reveal") {
      return;
    }

    const holdTimerId = window.setTimeout(beginHandoff, REVEAL_TO_GRID_HOLD_MS);

    return () => window.clearTimeout(holdTimerId);
  }, [beginHandoff, handoffPhase, revealPhase]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <div
      className={styles.revealGridPageHandoff}
      data-phase={handoffPhase}
      data-viewport={viewport}
      ref={rootRef}
    >
      <div
        aria-hidden={!showGrid}
        className={styles.revealGridPageLayer}
        data-visible={showGrid ? "true" : "false"}
      >
        <ActivityGridExperience
          hiddenCardIds={gridInteractive ? [] : hiddenCardIds}
          inert={!gridInteractive}
          registerCard={registerGridCard}
          showContinue={gridInteractive}
          viewport={viewport}
        />
      </div>

      {handoffPhase !== "grid" ? (
        <div
          className={styles.revealGridRevealLayer}
          data-exiting={showGrid ? "true" : "false"}
        >
          <RecommendationRevealTemplateExperience
            hiddenCardIds={isFlying ? hiddenCardIds : []}
            interactive={handoffPhase === "reveal"}
            onRevealPhaseChange={setRevealPhase}
            registerCard={registerSourceCard}
            viewport={resultViewport}
          />
        </div>
      ) : null}

      {transitionCards.length > 0 ? (
        <div aria-hidden="true" className={styles.revealGridPageTransitionLayer}>
          {transitionCards.map((card) => {
            const placement = handoffPhase === "moving" ? card.to : card.from;
            const delay = isFlying ? card.delayMs : 0;

            return (
              <div
                className={styles.revealGridPageTransitionCard}
                data-card-id={card.id}
                key={card.id}
                style={{
                  height: card.from.height,
                  transform: cardTransform(
                    placement,
                    card.from.width,
                    card.from.height
                  ),
                  transition: isFlying
                    ? `transform ${MOTION.positionDurationMs}ms ${MOTION.easing} ${delay}ms`
                    : "none",
                  width: card.from.width,
                  zIndex: card.zIndex
                }}
              >
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
