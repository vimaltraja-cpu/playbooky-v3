"use client";

import { useEffect, useMemo, useState } from "react";

import type { ActivityGridViewportMode } from "@/components/product/ActivityGridVisualLayer";
import {
  recommendationRevealCards
} from "@/components/product/RecommendationCardReveal";
import { ActivityGridInteractiveLayer } from "@/components/product/recommendation-reveal-to-grid/ActivityGridInteractiveLayer";
import { DiagnosisPrimaryCTA } from "@/components/product/DiagnosisProgressNavigation";
import { FacilitatorGuideHeader } from "@/components/ui/FacilitatorGuideHeader";

function getActivityGridViewport(): ActivityGridViewportMode {
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

function useActivityGridViewport() {
  const [viewport, setViewport] =
    useState<ActivityGridViewportMode>("desktop");

  useEffect(() => {
    const updateViewport = () => setViewport(getActivityGridViewport());

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return viewport;
}

export function ActivityGridHeader() {
  return (
    <FacilitatorGuideHeader
      title="Activity Grid"
      variant="activity-grid"
    />
  );
}

export function ActivityGridExperience({
  inert = false,
  hiddenCardIds = [],
  initialOpenCardId,
  onContinue,
  registerCard,
  showContinue = true,
  viewport
}: {
  inert?: boolean;
  hiddenCardIds?: string[];
  initialOpenCardId?: string;
  onContinue?: () => void;
  registerCard?: (id: string, element: HTMLButtonElement | null) => void;
  showContinue?: boolean;
  viewport?: ActivityGridViewportMode;
}) {
  const responsiveViewport = useActivityGridViewport();
  const effectiveViewport = viewport ?? responsiveViewport;
  const cards = useMemo(
    () =>
      recommendationRevealCards.map((card) => ({
        activity: card.activity,
        id: card.id,
        label: card.activity.title
      })),
    []
  );

  return (
    <main className="activity-grid-experience min-h-screen overflow-x-hidden bg-[#F6F1E8] text-[#171614]">
      <ActivityGridHeader />
      <section className="activity-grid-experience__surface px-4 pb-12 pt-4 md:px-8">
        <ActivityGridInteractiveLayer
          cards={cards}
          hiddenCardIds={hiddenCardIds}
          inert={inert}
          initialOpenCardId={initialOpenCardId}
          registerCard={registerCard}
          viewport={effectiveViewport}
        />
        {showContinue ? (
          <div className="activity-grid-experience__actions mt-8 flex justify-center">
            <DiagnosisPrimaryCTA
              className="activity-grid-experience__continue"
              disabled={inert}
              onClick={onContinue}
            >
              Continue
            </DiagnosisPrimaryCTA>
          </div>
        ) : null}
      </section>
    </main>
  );
}
