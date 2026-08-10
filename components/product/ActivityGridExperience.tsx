"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  ActivityGridViewportMode,
  ActivityGridVisualCard
} from "@/components/product/ActivityGridVisualLayer";
import { DiagnosisPrimaryCTA } from "@/components/product/DiagnosisProgressNavigation";
import {
  recommendationRevealCards
} from "@/components/product/RecommendationCardReveal";
import { ActivityGridInteractiveLayer } from "@/components/product/recommendation-reveal-to-grid/ActivityGridInteractiveLayer";
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

export function ActivityGridHeader({
  onAddActivity
}: {
  onAddActivity?: () => void;
}) {
  return (
    <FacilitatorGuideHeader
      onAddActivity={onAddActivity}
      title="Activity Grid"
      variant="activity-grid"
    />
  );
}

export function ActivityGridExperience({
  cards: cardsProp,
  inert = false,
  hiddenCardIds = [],
  initialOpenCardId,
  onAddActivity,
  onContinue,
  onRemoveActivity,
  registerCard,
  showContinue = true,
  viewport
}: {
  cards?: ActivityGridVisualCard[];
  inert?: boolean;
  hiddenCardIds?: string[];
  initialOpenCardId?: string;
  onAddActivity?: () => void;
  onContinue?: () => void;
  onRemoveActivity?: (card: ActivityGridVisualCard) => void;
  registerCard?: (id: string, element: HTMLButtonElement | null) => void;
  showContinue?: boolean;
  viewport?: ActivityGridViewportMode;
}) {
  const responsiveViewport = useActivityGridViewport();
  const effectiveViewport = viewport ?? responsiveViewport;
  const defaultCards = useMemo(
    () =>
      recommendationRevealCards.map((card) => ({
        activity: card.activity,
        id: card.id,
        label: card.activity.title
      })),
    []
  );
  const cards = cardsProp ?? defaultCards;

  return (
    <main className="activity-grid-experience min-h-screen overflow-x-hidden bg-[#F6F1E8] text-[#171614]">
      <ActivityGridHeader onAddActivity={onAddActivity} />
      <section className="activity-grid-experience__surface px-4 pb-12 pt-4 md:px-8">
        <ActivityGridInteractiveLayer
          cards={cards}
          hiddenCardIds={hiddenCardIds}
          inert={inert}
          initialOpenCardId={initialOpenCardId}
          onAddActivity={onAddActivity}
          onRemoveActivity={onRemoveActivity}
          registerCard={registerCard}
          viewport={effectiveViewport}
        />
        {showContinue ? (
          <div className="activity-grid-experience__actions relative z-30 mt-8 flex justify-center">
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
