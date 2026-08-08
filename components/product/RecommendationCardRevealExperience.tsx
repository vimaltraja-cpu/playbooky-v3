"use client";

import { useEffect, useState } from "react";

import {
  RecommendationCardReveal,
  recommendationRevealCards,
  type RecommendationCardRevealMotion,
  type RecommendationCardRevealPlayback,
  type RecommendationCardRevealPhase,
  type RecommendationRevealActivityCard
} from "@/components/product/RecommendationCardReveal";
import {
  RecommendationExperienceShell,
  type RecommendationLoadingViewport
} from "@/components/product/RecommendationLoadingExperience";

export type RecommendationCardRevealWorkshop = {
  activityCards: RecommendationRevealActivityCard[];
  description: string;
  eyebrow: string;
  title: string;
};

export const recommendationCardRevealWorkshop: RecommendationCardRevealWorkshop =
  {
    activityCards: recommendationRevealCards.map((card) => card.activity),
    description:
      "Align product, engineering and leadership around what matters most and agree on clear next steps.",
    eyebrow: "YOUR RECOMMENDATION WORKSHOP",
    title: "Prioritisation Workshop"
  };

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

export function RecommendationCardRevealExperience({
  className = "",
  motion = "paired",
  phase,
  playback = "normal",
  viewport,
  workshop = recommendationCardRevealWorkshop
}: {
  className?: string;
  motion?: RecommendationCardRevealMotion;
  phase?: RecommendationCardRevealPhase;
  playback?: RecommendationCardRevealPlayback;
  viewport?: RecommendationLoadingViewport;
  workshop?: RecommendationCardRevealWorkshop;
}) {
  const [responsiveViewport, setResponsiveViewport] =
    useState<RecommendationLoadingViewport>("desktop");
  const [revealPhase, setRevealPhase] =
    useState<RecommendationCardRevealPhase>("pending");
  const effectiveViewport = viewport ?? responsiveViewport;
  const effectivePhase = phase ?? revealPhase;

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
    if (phase) {
      return;
    }

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
  }, [effectiveViewport, phase]);

  return (
    <RecommendationExperienceShell
      ariaLabel="Recommendation card reveal"
      className={["recommendation-card-reveal-experience", className].join(" ")}
      copy={workshop.description}
      eyebrow={workshop.eyebrow}
      heading={workshop.title}
      viewport={effectiveViewport}
    >
      <div className="recommendation-card-reveal-visual">
        <RecommendationCardReveal
          activityCards={workshop.activityCards}
          interactive={effectivePhase === "complete"}
          motion={motion}
          phase={effectivePhase}
          playback={playback}
          viewport={effectiveViewport}
        />
      </div>
    </RecommendationExperienceShell>
  );
}
