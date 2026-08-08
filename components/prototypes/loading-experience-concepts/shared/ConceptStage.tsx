"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { recommendationLoadingStages } from "@/components/product/RecommendationLoadingExperience";

export function ConceptStage({
  activeClassName,
  activeDelayMs = 0,
  activeDurationMs,
  activeIndex,
  extraLayer,
  paused,
  previousClassName,
  previousDelayMs = 0,
  previousDurationMs,
  previousIndex,
  transitionKey
}: {
  activeClassName: string;
  activeDelayMs?: number;
  activeDurationMs: number;
  activeIndex: number;
  extraLayer?: ReactNode;
  paused: boolean;
  previousClassName: string;
  previousDelayMs?: number;
  previousDurationMs: number;
  previousIndex: number | null;
  transitionKey: number;
}) {
  const activeStage = recommendationLoadingStages[activeIndex];
  const previousStage =
    previousIndex === null ? null : recommendationLoadingStages[previousIndex];
  const playState = paused ? "paused" : "running";

  return (
    <div className="concept-stage-frame">
      <p
        aria-live="polite"
        className="concept-stage-label"
        key={`label-${transitionKey}`}
      >
        {activeStage.label}
      </p>

      <div className="concept-stage-illustration">
        {previousStage ? (
          <Image
            alt=""
            aria-hidden="true"
            className={previousClassName}
            fill
            key={`${transitionKey}-${previousStage.id}-previous`}
            sizes="(max-width: 767px) 260px, 380px"
            src={previousStage.imageSrc}
            style={{
              animationDelay: `${previousDelayMs}ms`,
              animationDuration: `${previousDurationMs}ms`,
              animationPlayState: playState
            }}
            unoptimized
          />
        ) : null}
        <Image
          alt=""
          aria-hidden="true"
          className={activeClassName}
          fill
          key={`${transitionKey}-${activeStage.id}-active`}
          sizes="(max-width: 767px) 260px, 380px"
          src={activeStage.imageSrc}
          style={{
            animationDelay: `${activeDelayMs}ms`,
            animationDuration: `${activeDurationMs}ms`,
            animationPlayState: playState
          }}
          unoptimized
        />
        {extraLayer}
      </div>
    </div>
  );
}
