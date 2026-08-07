"use client";

import { useEffect, useState } from "react";

import {
  CARD_FAN_MS,
  CENTRE_CARD_ENTER_MS,
  RecommendationCardReveal,
  REVEAL_PRELOAD_LAG_MS,
  preloadRecommendationRevealAssets,
  recommendationRevealCards,
  type RecommendationCardRevealPhase
} from "@/components/product/RecommendationCardReveal";
import {
  RecommendationExperienceShell,
  type RecommendationLoadingViewport
} from "@/components/product/RecommendationLoadingExperience";
import { exampleGeneratedWorkshopFlow } from "@/lib/workshop-os/generate-workshop-flow";

function getResponsiveViewport(): RecommendationLoadingViewport {
  if (typeof window === "undefined") {
    return "desktop";
  }

  if (window.innerWidth < 768) {
    return "mobile";
  }

  if (window.innerWidth < 1200) {
    return window.innerWidth > window.innerHeight
      ? "tablet-landscape"
      : "tablet-portrait";
  }

  return "desktop";
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}m`;
}

function pluralise(count: number, singular: string) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function toSentenceCase(value: string) {
  const normalisedValue = value.trim();

  if (!normalisedValue) {
    return normalisedValue;
  }

  return `${normalisedValue.charAt(0).toUpperCase()}${normalisedValue
    .slice(1)
    .toLowerCase()}`;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const recommendationRevealWorkshop = {
  activityCards: recommendationRevealCards.map((card) => card.activity),
  description: exampleGeneratedWorkshopFlow.objective,
  metadata: {
    activities: pluralise(recommendationRevealCards.length, "Activity"),
    duration: formatDuration(exampleGeneratedWorkshopFlow.durationMinutes),
    outputs: pluralise(
      new Set(
        exampleGeneratedWorkshopFlow.agenda.flatMap(
          (block) => block.expectedOutputs
        )
      ).size,
      "Output"
    ),
    participants: pluralise(
      exampleGeneratedWorkshopFlow.participantCount,
      "Participant"
    )
  },
  title: toSentenceCase(exampleGeneratedWorkshopFlow.title)
};

export function RecommendationRevealTemplateExperience({
  className = "",
  viewport
}: {
  className?: string;
  viewport?: RecommendationLoadingViewport;
}) {
  const [responsiveViewport, setResponsiveViewport] =
    useState<RecommendationLoadingViewport>("desktop");
  const [revealPhase, setRevealPhase] =
    useState<RecommendationCardRevealPhase>("pending");
  const effectiveViewport = viewport ?? responsiveViewport;

  useEffect(() => {
    if (viewport) {
      return;
    }

    const updateViewport = () => setResponsiveViewport(getResponsiveViewport());

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, [viewport]);

  useEffect(() => {
    let cancelled = false;

    async function runRevealSequence() {
      setRevealPhase("pending");

      // Mount cards invisibly first and wait for illustrations so the centre
      // card never pops in empty.
      await preloadRecommendationRevealAssets(
        recommendationRevealWorkshop.activityCards
      );

      if (cancelled) {
        return;
      }

      await wait(REVEAL_PRELOAD_LAG_MS);

      if (cancelled) {
        return;
      }

      setRevealPhase("centre");
      await wait(CENTRE_CARD_ENTER_MS);

      if (cancelled) {
        return;
      }

      setRevealPhase("revealing");
      await wait(CARD_FAN_MS);

      if (cancelled) {
        return;
      }

      setRevealPhase("complete");
    }

    void runRevealSequence();

    return () => {
      cancelled = true;
    };
  }, [effectiveViewport]);

  return (
    <RecommendationExperienceShell
      ariaLabel="Recommendation reveal"
      className={["recommendation-reveal-template-experience", className].join(
        " "
      )}
      copy={recommendationRevealWorkshop.description}
      eyebrow={
        <span className="recommendation-reveal-template-eyebrow-text">
          YOUR RECOMMENDED WORKSHOP
        </span>
      }
      heading={
        <span className="recommendation-reveal-template-title">
          {recommendationRevealWorkshop.title}
        </span>
      }
      metadata={
        <div
          aria-label="Workshop metadata temporarily hidden to preserve loading layout geometry"
          className="recommendation-loading-label recommendation-reveal-template-info-row"
          role="note"
        />
      }
      viewport={effectiveViewport}
    >
      <div className="recommendation-loading-illustration recommendation-reveal-template-illustration relative grid aspect-square place-items-center">
        <div className="recommendation-reveal-template-scale">
          <RecommendationCardReveal
            activityCards={recommendationRevealWorkshop.activityCards}
            interactive={revealPhase === "complete"}
            phase={revealPhase}
            viewport={effectiveViewport}
          />
        </div>
      </div>
    </RecommendationExperienceShell>
  );
}
