"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type {
  ActivityGridViewportMode,
  ActivityGridVisualCard
} from "@/components/product/ActivityGridVisualLayer";
import { ActivityGridExperience } from "@/components/product/ActivityGridExperience";
import {
  recommendationRevealCards
} from "@/components/product/RecommendationCardReveal";
import { ActivityLibraryPacks } from "@/components/ui/ActivityLibraryPacks";
import type { ActivityLibraryModalItem } from "@/lib/design-system/activity-library-modal";
import type {
  JourneyActivityCard,
  JourneyActivityMutation
} from "@/src/features/recommendation-journey/journeySession";

type ActiveGridWithLibraryProps = {
  hiddenCardIds?: string[];
  inert?: boolean;
  initialCards?: JourneyActivityCard[];
  initialOpenCardId?: string;
  libraryActivities: ActivityLibraryModalItem[];
  onActivityMutation?: (mutation: JourneyActivityMutation) => void;
  onCardsChange?: (cards: JourneyActivityCard[]) => void;
  onContinue?: () => void;
  registerCard?: (id: string, element: HTMLButtonElement | null) => void;
  showContinue?: boolean;
  viewport?: ActivityGridViewportMode;
};

function slugFromCardId(id: string) {
  return id
    .replace(/^canonical-activity-/, "")
    .replace(/^activity-/, "")
    .replace(/^block-/, "");
}

function slugFromText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

function toVisualCardFromLibrary(
  item: ActivityLibraryModalItem
): JourneyActivityCard {
  return {
    activity: {
      description: item.outcome,
      duration: item.duration,
      illustration: item.illustration.src,
      title: item.title,
      workshopType: item.stageDisplay
    },
    id: item.slug,
    label: item.title,
    source: "library"
  };
}

/**
 * Thin overlay on the committed ActivityGridExperience foundation.
 * Does not rewrite the experience shell, header, or grid motion.
 */
export function ActiveGridWithLibrary({
  hiddenCardIds,
  inert,
  initialCards,
  initialOpenCardId,
  libraryActivities,
  onActivityMutation,
  onCardsChange,
  onContinue,
  registerCard,
  showContinue,
  viewport
}: ActiveGridWithLibraryProps) {
  const starterCards = useMemo(
    () =>
      recommendationRevealCards.map((card) => ({
        activity: card.activity,
        id: card.id,
        label: card.activity.title,
        source: "fallback" as const
      })),
    []
  );
  const [workshopCards, setWorkshopCards] =
    useState<JourneyActivityCard[]>(initialCards ?? starterCards);
  const workshopCardsRef = useRef(workshopCards);
  const hasLocalCardChangesRef = useRef(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  useEffect(() => {
    if (
      initialCards &&
      initialCards.length > 0 &&
      !hasLocalCardChangesRef.current
    ) {
      workshopCardsRef.current = initialCards;
      setWorkshopCards(initialCards);
    }
  }, [initialCards, starterCards]);

  const workshopActivityIds = useMemo(
    () =>
      workshopCards.flatMap((card) => {
        const slug = slugFromCardId(card.id);
        const titleSlug = slugFromText(card.activity.title);
        const labelSlug = slugFromText(card.label);
        const candidateBlockSlug = card.candidateBlockId
          ? slugFromCardId(card.candidateBlockId)
          : "";

        return [
          card.id,
          slug,
          `activity-${slug}`,
          card.candidateBlockId,
          candidateBlockSlug,
          candidateBlockSlug ? `activity-${candidateBlockSlug}` : undefined,
          candidateBlockSlug ? `block-${candidateBlockSlug}` : undefined,
          titleSlug,
          `activity-${titleSlug}`,
          labelSlug,
          `activity-${labelSlug}`
        ].filter(Boolean) as string[];
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
    const currentCards = workshopCardsRef.current;

    if (
      currentCards.some(
        (card) =>
          slugFromCardId(card.id) === activity.slug || card.id === nextCard.id
      )
    ) {
      return;
    }

    const nextCards = [...currentCards, nextCard];
    hasLocalCardChangesRef.current = true;
    workshopCardsRef.current = nextCards;
    setWorkshopCards(nextCards);
    onCardsChange?.(nextCards);
    onActivityMutation?.({
      activityId: nextCard.id,
      at: new Date().toISOString(),
      title: nextCard.activity.title,
      type: "add"
    });
  }

  function handleRemove(activity: ActivityLibraryModalItem) {
    const currentCards = workshopCardsRef.current;
    const nextCards = currentCards.filter(
      (card) => slugFromCardId(card.id) !== activity.slug
    );

    if (nextCards.length === currentCards.length) {
      return;
    }

    hasLocalCardChangesRef.current = true;
    workshopCardsRef.current = nextCards;
    setWorkshopCards(nextCards);
    onCardsChange?.(nextCards);
    onActivityMutation?.({
      activityId: activity.slug,
      at: new Date().toISOString(),
      title: activity.title,
      type: "remove"
    });
  }

  function handleRemoveFromModal(card: ActivityGridVisualCard) {
    const currentCards = workshopCardsRef.current;
    const nextCards = currentCards.filter((item) => item.id !== card.id);

    if (nextCards.length === currentCards.length) {
      return;
    }

    hasLocalCardChangesRef.current = true;
    workshopCardsRef.current = nextCards;
    setWorkshopCards(nextCards);
    onCardsChange?.(nextCards);
    onActivityMutation?.({
      activityId: card.id,
      at: new Date().toISOString(),
      title: card.activity.title,
      type: "remove"
    });
  }

  return (
    <>
      <ActivityGridExperience
        cards={workshopCards}
        hiddenCardIds={hiddenCardIds}
        inert={inert}
        initialOpenCardId={initialOpenCardId}
        onAddActivity={openLibrary}
        onContinue={onContinue}
        onRemoveActivity={handleRemoveFromModal}
        registerCard={registerCard}
        showContinue={showContinue}
        viewport={viewport}
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
