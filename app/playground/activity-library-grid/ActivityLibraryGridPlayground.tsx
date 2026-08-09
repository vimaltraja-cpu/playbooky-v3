"use client";

import { useMemo, useState } from "react";

import type { ActivityGridVisualCard } from "@/components/product/ActivityGridVisualLayer";
import { ActivityGridInteractiveLayer } from "@/components/product/recommendation-reveal-to-grid/ActivityGridInteractiveLayer";
import { ActivityLibraryPacks } from "@/components/ui/ActivityLibraryPacks";
import { SiteBackgroundWash } from "@/components/ui/SiteBackgroundWash";
import type { CanonicalActivityCardRecord } from "@/lib/data/canonical-activity-cards";
import type { ActivityLibraryModalItem } from "@/lib/design-system/activity-library-modal";

type ActivityLibraryGridPlaygroundProps = {
  canonicalCards: CanonicalActivityCardRecord[];
  libraryActivities: ActivityLibraryModalItem[];
  starterCards: CanonicalActivityCardRecord[];
};

function toVisualCard(
  card: CanonicalActivityCardRecord
): ActivityGridVisualCard {
  return {
    activity: {
      description: card.description,
      duration: card.duration,
      illustration: card.illustration,
      title: card.title,
      workshopType: card.workshopType
    },
    id: `canonical-activity-${card.slug}`,
    label: card.title
  };
}

function toVisualCardFromLibrary(
  item: ActivityLibraryModalItem,
  canonicalCards: CanonicalActivityCardRecord[]
): ActivityGridVisualCard {
  const canonical = canonicalCards.find((card) => card.slug === item.slug);

  if (canonical) {
    return toVisualCard(canonical);
  }

  return {
    activity: {
      description: item.outcome,
      duration: item.duration,
      illustration: item.illustration.src,
      title: item.title,
      workshopType: item.stageDisplay
    },
    id: `canonical-activity-${item.slug}`,
    label: item.title
  };
}

function slugFromCardId(id: string) {
  return id.replace(/^canonical-activity-/, "").replace(/^activity-/, "");
}

export function ActivityLibraryGridPlayground({
  canonicalCards,
  libraryActivities,
  starterCards
}: ActivityLibraryGridPlaygroundProps) {
  const [workshopCards, setWorkshopCards] = useState<ActivityGridVisualCard[]>(
    () => starterCards.map(toVisualCard)
  );
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [status, setStatus] = useState(
    "Drag to reorder. Click a card for details. Add activity opens the pack library."
  );

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
    setStatus("Activity library open.");
  }

  function handleAdd(activity: ActivityLibraryModalItem) {
    const nextCard = toVisualCardFromLibrary(activity, canonicalCards);
    setWorkshopCards((current) => {
      if (
        current.some(
          (card) =>
            card.id === nextCard.id ||
            slugFromCardId(card.id) === activity.slug
        )
      ) {
        return current;
      }
      return [...current, nextCard];
    });
    setStatus(`Added “${activity.title}” to the workshop.`);
  }

  function handleRemove(activity: ActivityLibraryModalItem) {
    setWorkshopCards((current) =>
      current.filter((card) => slugFromCardId(card.id) !== activity.slug)
    );
    setStatus(`Removed “${activity.title}” from the workshop.`);
  }

  function handleRemoveFromModal(card: ActivityGridVisualCard) {
    setWorkshopCards((current) =>
      current.filter((item) => item.id !== card.id)
    );
    setStatus(`Removed “${card.label}” from the workshop.`);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#F6F1E8] text-[#171614]">
      <SiteBackgroundWash />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-8 pb-10 pt-4">
        <header className="flex h-20 shrink-0 items-center justify-between">
          <span
            className="text-[22px] font-bold text-[#062E27]"
            style={{
              fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
            }}
          >
            PlayBooky
          </span>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#E4D8C8] bg-white/80 px-4 py-2 text-[14px] font-medium text-[#324236] backdrop-blur">
              2 Hours
            </span>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#E4D8C8] bg-white px-4 py-2 text-[14px] font-semibold text-[#062E27] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
              onClick={openLibrary}
              type="button"
            >
              <span aria-hidden="true">+</span>
              Add activity
            </button>
          </div>
        </header>

        <div className="flex flex-1 items-start justify-center pt-8">
          <ActivityGridInteractiveLayer
            cards={workshopCards}
            onAddActivity={openLibrary}
            onRemoveActivity={handleRemoveFromModal}
            viewport="desktop"
          />
        </div>

        <p
          aria-live="polite"
          className="mt-auto pt-6 text-center text-sm text-[#706B62]"
        >
          {status}
        </p>
      </div>

      <ActivityLibraryPacks
        activities={libraryActivities}
        isOpen={isLibraryOpen}
        onAdd={handleAdd}
        onClose={() => {
          setIsLibraryOpen(false);
          setStatus("Library closed. Open again from Add activity.");
        }}
        onRemove={handleRemove}
        suggestedIds={suggestedIds}
        workshopActivityIds={workshopActivityIds}
      />
    </main>
  );
}
