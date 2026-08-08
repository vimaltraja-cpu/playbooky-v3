"use client";

import { useEffect, useState } from "react";

import {
  RecommendationCardReveal,
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
  title: exampleGeneratedWorkshopFlow.title
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
    setRevealPhase("pending");

    const revealTimeoutId = window.setTimeout(() => {
      setRevealPhase("revealing");
    }, 300);
    const completeTimeoutId = window.setTimeout(() => {
      setRevealPhase("complete");
    }, effectiveViewport === "mobile" ? 2400 : 2600);

    return () => {
      window.clearTimeout(revealTimeoutId);
      window.clearTimeout(completeTimeoutId);
    };
  }, [effectiveViewport]);

  return (
    <RecommendationExperienceShell
      ariaLabel="Recommendation reveal"
      className={["recommendation-reveal-template-experience", className].join(
        " "
      )}
      copy={recommendationRevealWorkshop.description}
      eyebrow="YOUR RECOMMENDED WORKSHOP"
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
