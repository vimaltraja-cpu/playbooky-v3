"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type RecommendationLoadingStageId =
  "goals" | "challenges" | "context" | "participants" | "outcome";

export type RecommendationLoadingViewport = "desktop" | "mobile";

export type RecommendationLoadingStage = {
  id: RecommendationLoadingStageId;
  imageSrc: string;
  label: string;
  shortLabel: string;
};

export const recommendationLoadingStages: RecommendationLoadingStage[] = [
  {
    id: "goals",
    imageSrc: "/assets/recommendation-loading/goals.png",
    label: "Understanding your goals",
    shortLabel: "Goals"
  },
  {
    id: "challenges",
    imageSrc: "/assets/recommendation-loading/challenges.png",
    label: "Reading the challenge",
    shortLabel: "Challenges"
  },
  {
    id: "context",
    imageSrc: "/assets/recommendation-loading/context.png",
    label: "Mapping the context",
    shortLabel: "Context"
  },
  {
    id: "participants",
    imageSrc: "/assets/recommendation-loading/participants.png",
    label: "Considering participants",
    shortLabel: "Participants"
  },
  {
    id: "outcome",
    imageSrc: "/assets/recommendation-loading/outcome.png",
    label: "Shaping the outcome",
    shortLabel: "Outcome"
  }
];

const supportingLine =
  "PlayBooky is turning your answers into the right workshop structure.";

function getStageIndex(stageId?: RecommendationLoadingStageId) {
  if (!stageId) {
    return 0;
  }

  const index = recommendationLoadingStages.findIndex(
    (stage) => stage.id === stageId
  );

  return index === -1 ? 0 : index;
}

export function RecommendationLoadingExperience({
  className = "",
  lockedStage,
  viewport = "desktop"
}: {
  className?: string;
  lockedStage?: RecommendationLoadingStageId;
  viewport?: RecommendationLoadingViewport;
}) {
  const [activeIndex, setActiveIndex] = useState(getStageIndex(lockedStage));
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [transitionKey, setTransitionKey] = useState(0);
  const isLocked = Boolean(lockedStage);
  const activeStage = recommendationLoadingStages[activeIndex];
  const previousStage =
    previousIndex === null ? null : recommendationLoadingStages[previousIndex];

  useEffect(() => {
    if (!lockedStage) {
      return;
    }

    setPreviousIndex(null);
    setActiveIndex(getStageIndex(lockedStage));
  }, [lockedStage]);

  useEffect(() => {
    if (isLocked) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousIndex(activeIndex);
      setActiveIndex(
        (current) => (current + 1) % recommendationLoadingStages.length
      );
      setTransitionKey((current) => current + 1);
    }, 2200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex, isLocked]);

  return (
    <section
      aria-label="Recommendation loading"
      className={[
        "recommendation-loading-experience relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F1E8] px-5 py-12 text-[#171614]",
        viewport === "mobile" ? "min-h-[720px] px-4" : "",
        className
      ].join(" ")}
      data-viewport={viewport}
    >
      <div aria-hidden="true" className="recommendation-loading-paper" />
      <div
        aria-hidden="true"
        className="recommendation-loading-wash recommendation-loading-wash-one"
      />
      <div
        aria-hidden="true"
        className="recommendation-loading-wash recommendation-loading-wash-two"
      />

      <div
        className={[
          "relative z-10 mx-auto flex w-full max-w-[760px] flex-col items-center text-center",
          viewport === "mobile" ? "max-w-[360px]" : ""
        ].join(" ")}
      >
        <div
          className={[
            "recommendation-loading-illustration relative grid aspect-square w-[min(58vw,420px)] place-items-center",
            viewport === "mobile" ? "w-[min(76vw,270px)]" : ""
          ].join(" ")}
        >
          {previousStage ? (
            <Image
              alt=""
              aria-hidden="true"
              className="recommendation-loading-image recommendation-loading-image-previous"
              fill
              key={`${transitionKey}-${previousStage.id}-previous`}
              sizes="(max-width: 768px) 76vw, 420px"
              src={previousStage.imageSrc}
              unoptimized
            />
          ) : null}
          <Image
            alt=""
            aria-hidden="true"
            className="recommendation-loading-image recommendation-loading-image-active"
            fill
            key={`${transitionKey}-${activeStage.id}-active`}
            sizes="(max-width: 768px) 76vw, 420px"
            src={activeStage.imageSrc}
            unoptimized
          />
          {!isLocked ? (
            <span
              aria-hidden="true"
              className="recommendation-loading-bloom"
              key={`bloom-${transitionKey}`}
            />
          ) : null}
        </div>

        <p
          aria-live="polite"
          className={[
            "mt-8 text-[15px] font-semibold leading-6 text-[#7D5330]",
            viewport === "mobile" ? "mt-7 text-sm" : ""
          ].join(" ")}
        >
          {activeStage.label}
        </p>
        <p
          className={[
            "mt-3 max-w-[520px] text-base leading-7 text-[#5E5A53]",
            viewport === "mobile" ? "text-sm leading-6" : ""
          ].join(" ")}
        >
          {supportingLine}
        </p>

        <div
          aria-label={`Analysis stage ${activeIndex + 1} of ${recommendationLoadingStages.length}: ${activeStage.shortLabel}`}
          className="mt-7 flex items-center justify-center gap-2"
          role="status"
        >
          {recommendationLoadingStages.map((stage, index) => (
            <span
              aria-hidden="true"
              className={[
                "h-1.5 rounded-full transition-[width,background-color,opacity] duration-500 motion-reduce:transition-none",
                index === activeIndex
                  ? "w-8 bg-[#7D5330] opacity-100"
                  : "w-2 bg-[#CDBB9E] opacity-65"
              ].join(" ")}
              key={stage.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
