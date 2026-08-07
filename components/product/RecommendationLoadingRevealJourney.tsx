"use client";

import { useCallback, useState } from "react";

import { RecommendationLoadingExperience } from "@/components/product/RecommendationLoadingExperience";
import { RecommendationRevealTemplateExperience } from "@/components/product/RecommendationRevealTemplateExperience";

type JourneyPhase = "loading" | "reveal";

/**
 * Continuous post-diagnosis journey:
 * watercolor loading (one full five-stage pass) → recommendation reveal.
 * Isolated reveal review remains at /recommendation-reveal-template.
 */
export function RecommendationLoadingRevealJourney() {
  const [phase, setPhase] = useState<JourneyPhase>("loading");

  const handleLoadingComplete = useCallback(() => {
    setPhase("reveal");
  }, []);

  if (phase === "reveal") {
    return <RecommendationRevealTemplateExperience />;
  }

  return (
    <RecommendationLoadingExperience
      loop={false}
      onComplete={handleLoadingComplete}
    />
  );
}
