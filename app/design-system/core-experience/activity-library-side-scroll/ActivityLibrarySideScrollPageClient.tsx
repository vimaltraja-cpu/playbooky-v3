"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { ActivityLibrarySideScroll } from "@/components/ui/ActivityLibrarySideScroll";
import type { CanonicalActivityCardRecord } from "@/lib/data/canonical-activity-cards";
import type { ActivityLibraryModalItem } from "@/lib/design-system/activity-library-modal";

const CARD_WIDTH = 256;
const CARD_HEIGHT = 370;
const GAP = 24;
const COLUMNS = 5;
const FRAME_WIDTH = 1440;
const FRAME_HEIGHT = 900;

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-08-09",
  owner: "Design System",
  status: "Prototype",
  title: "Activity Library Side Scroll"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "review", label: "Review" }
];

const overviewCopy = {
  statusNote:
    "Full-viewport side drawer exploration. Separate from the Activity Library Modal shell experiment — leave that page as-is. Full prototype: /playground/activity-library-side-scroll",
  summary:
    "Activity Library Side Scroll opens as a near-full-screen drawer over the workshop surface, giving the library room to breathe without the modal shell constraint.",
  whatItIs:
    "A fullscreen-right drawer with stage tabs, a card grid, and an optional preview rail for condensed activity steps.",
  whenNotToUse:
    "Do not use this as the Activity Detail Modal or as a replacement for the existing modal-shell experiment until a direction is chosen.",
  whenToUse:
    "Use it to review whether a full-screen library drawer feels clearer and more premium than the grid-bound modal shell.",
  whereItAppears:
    "Design Portal review host, plus full prototype at /playground/activity-library-side-scroll.",
  whyItExists:
    "The modal shell footprint felt restrictive; this explores the same library content with the full screen as working space."
};

type ActivityLibrarySideScrollPageClientProps = {
  activities: ActivityLibraryModalItem[];
  hostCards: CanonicalActivityCardRecord[];
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

function useFitScale(width: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateScale = () => {
      setScale(Math.min(1, element.clientWidth / width));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [width]);

  return { ref, scale };
}

export function ActivityLibrarySideScrollPageClient({
  activities,
  hostCards
}: ActivityLibrarySideScrollPageClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState(
    "Click Add activity on the card or header to open the full-screen library drawer."
  );
  const { ref: fitRef, scale } = useFitScale(FRAME_WIDTH);

  const gridWidth = COLUMNS * CARD_WIDTH + (COLUMNS - 1) * GAP;
  const gridHeight = 2 * CARD_HEIGHT + GAP;

  const gridCards = useMemo(
    () =>
      hostCards.map((card) => ({
        activity: {
          description: card.description,
          duration: card.duration,
          illustration: card.illustration,
          title: card.title,
          workshopType: card.workshopType
        },
        id: card.slug,
        label: card.title
      })),
    [hostCards]
  );

  const addColumn = gridCards.length % COLUMNS;
  const addRow = Math.floor(gridCards.length / COLUMNS);

  function openLibrary() {
    setActionStatus("Opened Activity Library Side Scroll over the full screen.");
    setIsOpen(true);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-library-side-scroll" />

        <ComponentPageShell
          description="Full-screen activity library drawer — room to browse cards and preview steps without the modal shell constraint."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <section className="scroll-mt-28 py-8" id="review">
            <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
              Desktop review
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
              Host grid stays put. Add activity opens a near-full-screen side
              drawer over the viewport — separate from the modal-shell
              experiment. For the full prototype without portal chrome, open{" "}
              <a
                className="text-[#8ec5ff] underline underline-offset-2 hover:text-[#bae6fd]"
                href="/playground/activity-library-side-scroll"
              >
                /playground/activity-library-side-scroll
              </a>
              .
            </p>

            <div className="mt-5 w-full overflow-hidden" ref={fitRef}>
              <div
                className="mx-auto"
                style={{
                  height: FRAME_HEIGHT * scale,
                  width: FRAME_WIDTH * scale
                }}
              >
                <div
                  style={{
                    height: FRAME_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: FRAME_WIDTH
                  }}
                >
                  <div
                    className="relative box-border flex flex-col overflow-hidden rounded-[20px] border border-[#d5cab9] bg-[#F7F2EA]"
                    style={{ height: FRAME_HEIGHT, width: FRAME_WIDTH }}
                  >
                    <header className="flex h-20 shrink-0 items-center justify-between px-8">
                      <span
                        className="text-[22px] font-bold text-[#062E27]"
                        style={{
                          fontFamily:
                            "Newsreader, Georgia, 'Times New Roman', serif"
                        }}
                      >
                        PlayBooky
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-[#E4D8C8] bg-white px-4 py-2 text-[14px] font-medium text-[#324236]">
                          2 Hours
                        </span>
                        <button
                          className="inline-flex items-center gap-2 rounded-full border border-[#E4D8C8] bg-white px-4 py-2 text-[14px] font-semibold text-[#062E27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
                          onClick={openLibrary}
                          type="button"
                        >
                          <span aria-hidden="true">+</span>
                          Add activity
                        </button>
                      </div>
                    </header>

                    <div className="flex flex-1 items-start justify-center px-8 pt-8">
                      <div
                        className="relative"
                        style={{ height: gridHeight, width: gridWidth }}
                      >
                        {gridCards.map((card, index) => {
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
                              <ActivityCard
                                activity={card.activity}
                                variant="builder"
                              />
                            </div>
                          );
                        })}

                        <button
                          aria-label="Add activity"
                          className="absolute left-0 top-0 rounded-[16px] border-2 border-dashed border-[#C8BCAA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D99C56]"
                          onClick={openLibrary}
                          style={{
                            height: CARD_HEIGHT,
                            transform: `translate3d(${
                              addColumn * (CARD_WIDTH + GAP)
                            }px, ${addRow * (CARD_HEIGHT + GAP)}px, 0)`,
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
                      className="absolute bottom-6 left-8 right-8 text-sm text-[#706B62]"
                    >
                      {actionStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ActivityLibrarySideScroll
            activities={activities}
            isOpen={isOpen}
            onAdd={(activity) => {
              setActionStatus(
                `Stub: would add “${activity.title}” to the workshop.`
              );
              setIsOpen(false);
            }}
            onClose={() => {
              setActionStatus("Closed Activity Library Side Scroll.");
              setIsOpen(false);
            }}
          />
        </ComponentPageShell>
      </div>
    </main>
  );
}
