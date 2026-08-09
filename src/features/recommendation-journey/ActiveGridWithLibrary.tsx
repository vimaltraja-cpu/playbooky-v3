"use client";

import { useMemo, useState } from "react";

import type { ActivityGridVisualCard } from "@/components/product/ActivityGridVisualLayer";
import { ActivityGridExperience } from "@/components/product/ActivityGridExperience";
import {
  recommendationRevealCards
} from "@/components/product/RecommendationCardReveal";
import { ActivityLibraryPacks } from "@/components/ui/ActivityLibraryPacks";
import type { ActivityLibraryModalItem } from "@/lib/design-system/activity-library-modal";

type ActiveGridWithLibraryProps = {
  initialOpenCardId?: string;
  libraryActivities: ActivityLibraryModalItem[];
};

function slugFromCardId(id: string) {
  return id.replace(/^canonical-activity-/, "").replace(/^activity-/, "");
}

function toVisualCardFromLibrary(
  item: ActivityLibraryModalItem
): ActivityGridVisualCard {
  return {
    activity: {
      description: item.outcome,
      duration: item.duration,
      illustration: item.illustration.src,
      title: item.title,
      workshopType: item.stageDisplay
    },
    id: item.slug,
    label: item.title
  };
}

/**
 * Thin overlay on the committed ActivityGridExperience foundation.
 * Does not rewrite the experience shell, header, or grid motion.
 */
export function ActiveGridWithLibrary({
  initialOpenCardId,
  libraryActivities
}: ActiveGridWithLibraryProps) {
  const starterCards = useMemo(
    () =>
      recommendationRevealCards.map((card) => ({
        activity: card.activity,
        id: card.id,
        label: card.activity.title
      })),
    []
  );
  const [workshopCards, setWorkshopCards] =
    useState<ActivityGridVisualCard[]>(starterCards);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const workshopActivityIds = useMemo(
    () =>
      workshopCards.flatMap((card) => {
        const slug = slugFromCardId(card.id);
        return [card.id, slug, `activity-${slug}`];
      }),
    [workshopCards]
  );

  const suggestedIds = useMemo(
    () => workshopCards.map((card) => `activity-${slugFromCardId(card.id)}`),
    [workshopCards]
  );

  function openLibrary() {
    setIsLibraryOpen(true);
  }

  function handleAdd(activity: ActivityLibraryModalItem) {
    const nextCard = toVisualCardFromLibrary(activity);
    setWorkshopCards((current) => {
      if (
        current.some(
          (card) =>
            slugFromCardId(card.id) === activity.slug || card.id === nextCard.id
        )
      ) {
        return current;
      }
      return [...current, nextCard];
    });
  }

  function handleRemove(activity: ActivityLibraryModalItem) {
    setWorkshopCards((current) =>
      current.filter((card) => slugFromCardId(card.id) !== activity.slug)
    );
  }

  function handleRemoveFromModal(card: ActivityGridVisualCard) {
    setWorkshopCards((current) =>
      current.filter((item) => item.id !== card.id)
    );
  }

  return (
    <>
      <ActivityGridExperience
        cards={workshopCards}
        initialOpenCardId={initialOpenCardId}
        onAddActivity={openLibrary}
        onRemoveActivity={handleRemoveFromModal}
      />
      <ActivityLibraryPacks
        activities={libraryActivities}
        isOpen={isLibraryOpen}
        onAdd={handleAdd}
        onClose={() => setIsLibraryOpen(false)}
        onRemove={handleRemove}
        suggestedIds={suggestedIds}
        workshopActivityIds={workshopActivityIds}
      />
    </>
  );
}
