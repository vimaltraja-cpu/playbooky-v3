"use client";

import { useMemo, useState } from "react";

import { ActivityCard } from "@/components/ui/ActivityCard";
import { ActivityLibraryPacks } from "@/components/ui/ActivityLibraryPacks";
import { SiteBackgroundWash } from "@/components/ui/SiteBackgroundWash";
import type { CanonicalActivityCardRecord } from "@/lib/data/canonical-activity-cards";
import type { ActivityLibraryModalItem } from "@/lib/design-system/activity-library-modal";

const CARD_WIDTH = 256;
const CARD_HEIGHT = 370;
const GAP = 24;
const COLUMNS = 5;

type WorkshopGridCard = {
  activity: {
    description: string;
    duration: string;
    illustration: string;
    title: string;
    workshopType: string;
  };
  id: string;
  slug: string;
};

type ActivityLibraryPacksPlaygroundProps = {
  activities: ActivityLibraryModalItem[];
  hostCards: CanonicalActivityCardRecord[];
  suggestedIds: string[];
};

function AddActivityCardFace() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[16px] bg-[#FCFBF9] p-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-[6px] border-[#FCFBFA] bg-[#F4F2EF]">
        <span aria-hidden="true" className="text-[20px] leading-none text-[#B77B32]">
          +
        </span>
      </span>
      <span
        className="text-center text-[14px] font-semibold leading-5"
        style={{
          WebkitBackgroundClip: "text",
          background: "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)",
          backgroundClip: "text",
          color: "transparent"
        }}
      >
        Add activity
      </span>
    </div>
  );
}

function toWorkshopCard(
  activity: ActivityLibraryModalItem
): WorkshopGridCard {
  return {
    activity: {
      description: activity.outcome,
      duration: activity.duration,
      illustration: activity.illustration.src,
      title: activity.title,
      workshopType: activity.stageDisplay
    },
    id: activity.id,
    slug: activity.slug
  };
}

function fromHostCard(card: CanonicalActivityCardRecord): WorkshopGridCard {
  return {
    activity: {
      description: card.description,
      duration: card.duration,
      illustration: card.illustration,
      title: card.title,
      workshopType: card.workshopType
    },
    id: `activity-${card.slug}`,
    slug: card.slug
  };
}

export function ActivityLibraryPacksPlayground({
  activities,
  hostCards,
  suggestedIds
}: ActivityLibraryPacksPlaygroundProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [workshopCards, setWorkshopCards] = useState<WorkshopGridCard[]>(() =>
    hostCards.map(fromHostCard)
  );
  const [status, setStatus] = useState(
    "Open the library — curated packs, then an illustrated inventory."
  );

  const workshopActivityIds = useMemo(
    () => workshopCards.flatMap((card) => [card.id, card.slug]),
    [workshopCards]
  );

  const gridWidth = COLUMNS * CARD_WIDTH + (COLUMNS - 1) * GAP;
  const rows = Math.max(1, Math.ceil((workshopCards.length + 1) / COLUMNS));
  const gridHeight = rows * CARD_HEIGHT + (rows - 1) * GAP;

  const addColumn = workshopCards.length % COLUMNS;
  const addRow = Math.floor(workshopCards.length / COLUMNS);

  function openLibrary() {
    setStatus("Pack library open.");
    setIsOpen(true);
  }

  function handleAdd(activity: ActivityLibraryModalItem) {
    setWorkshopCards((current) => {
      if (
        current.some(
          (card) => card.id === activity.id || card.slug === activity.slug
        )
      ) {
        return current;
      }
      return [...current, toWorkshopCard(activity)];
    });
    setStatus(`Added “${activity.title}” to the workshop.`);
  }

  function handleRemove(activity: ActivityLibraryModalItem) {
    setWorkshopCards((current) =>
      current.filter(
        (card) => card.id !== activity.id && card.slug !== activity.slug
      )
    );
    setStatus(`Removed “${activity.title}” from the workshop.`);
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
          <div
            className="relative"
            style={{ height: gridHeight, width: gridWidth }}
          >
            {workshopCards.map((card, index) => {
              const column = index % COLUMNS;
              const row = Math.floor(index / COLUMNS);
              const x = column * (CARD_WIDTH + GAP);
              const y = row * (CARD_HEIGHT + GAP);

              return (
                <div
                  className="absolute left-0 top-0"
                  key={card.id}
                  style={{
                    height: CARD_HEIGHT,
                    transform: `translate3d(${x}px, ${y}px, 0)`,
                    width: CARD_WIDTH
                  }}
                >
                  <ActivityCard activity={card.activity} variant="builder" />
                </div>
              );
            })}

            <button
              aria-label="Add activity"
              className="absolute left-0 top-0 rounded-[16px] border-2 border-dashed border-[#C8BCAA] bg-[#FCFBF9]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D99C56]"
              onClick={openLibrary}
              style={{
                height: CARD_HEIGHT,
                transform: `translate3d(${addColumn * (CARD_WIDTH + GAP)}px, ${
                  addRow * (CARD_HEIGHT + GAP)
                }px, 0)`,
                width: CARD_WIDTH
              }}
              type="button"
            >
              <AddActivityCardFace />
            </button>
          </div>
        </div>

        <p
          aria-live="polite"
          className="mt-auto pt-6 text-center text-sm text-[#706B62]"
        >
          {status}
        </p>
      </div>

      <ActivityLibraryPacks
        activities={activities}
        isOpen={isOpen}
        onAdd={handleAdd}
        onClose={() => {
          setStatus("Library closed. Open again from Add activity.");
          setIsOpen(false);
        }}
        onRemove={handleRemove}
        suggestedIds={suggestedIds}
        workshopActivityIds={workshopActivityIds}
      />
    </main>
  );
}
