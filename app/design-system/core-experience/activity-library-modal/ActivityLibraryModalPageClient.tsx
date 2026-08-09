"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  useActivityModalShellTransition,
  type ActivityModalShellCard
} from "@/components/motion/activity-modal/ActivityModalShellTransition";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { ActivityLibraryModal } from "@/components/ui/ActivityLibraryModal";
import type { CanonicalActivityCardRecord } from "@/lib/data/canonical-activity-cards";
import type { ActivityLibraryModalItem } from "@/lib/design-system/activity-library-modal";

const CARD_WIDTH = 256;
const CARD_HEIGHT = 370;
const GAP = 24;
const COLUMNS = 5;
const ADD_CARD_ID = "add-activity";
const FRAME_WIDTH = 1440;
const FRAME_HEIGHT = 900;

const LIBRARY_SHELL_CARD: ActivityModalShellCard = {
  id: ADD_CARD_ID,
  label: "Activity library"
};

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-08-09",
  owner: "Design System",
  status: "Prototype",
  title: "Activity Library Modal"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "review", label: "Review" }
];

const overviewCopy = {
  statusNote:
    "Desktop-only review host. Does not modify the Activity Grid page. Product journey wiring is out of scope.",
  summary:
    "Activity Library Modal is the add-activity picker that expands from the Add activity card into the same shell footprint as the Activity Detail Modal.",
  whatItIs:
    "A 1364 × 758 shell with stage tabs, a scrollable activity list, and a sliding side rail of condensed step labels.",
  whenNotToUse:
    "Do not use it as the full Activity Detail Modal, facilitator guide, or a search-driven catalogue.",
  whenToUse:
    "Use it when adding an activity from the grid Add card or header Add activity control.",
  whereItAppears:
    "Design Portal review host. Future Builder activity grid add / replace flows.",
  whyItExists:
    "To give facilitators a concise library browse surface inside the established grid-sized modal shell."
};

type ActivityLibraryModalPageClientProps = {
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

export function ActivityLibraryModalPageClient({
  activities,
  hostCards
}: ActivityLibraryModalPageClientProps) {
  const [actionStatus, setActionStatus] = useState(
    "Click Add activity on the card or header to open the library shell."
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

  const {
    destinationRef,
    isInteractionLocked,
    openCard,
    phase,
    registerCard,
    transitionLayer
  } = useActivityModalShellTransition({
    renderContent: () => (
      <ActivityLibraryModal
        activities={activities}
        contentOnly
        isOpen
        onAdd={(activity) => {
          setActionStatus(
            `Stub: would add “${activity.title}” to the workshop.`
          );
        }}
      />
    )
  });

  function openLibrary() {
    setActionStatus("Opening activity library from the Add activity card.");
    void openCard(LIBRARY_SHELL_CARD);
  }

  const addColumn = gridCards.length % COLUMNS;
  const addRow = Math.floor(gridCards.length / COLUMNS);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-library-modal" />

        <ComponentPageShell
          description="Desktop library picker that reuses the activity modal shell: stage tabs, activity list, and a sliding condensed side rail."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <section className="scroll-mt-28 py-8" id="review">
            <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
              Desktop review
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
              Minimal host grid for shell motion only. Header Add activity and
              the dashed Add card both open the same library shell from the add
              card origin.
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
                          className="inline-flex items-center gap-2 rounded-full border border-[#E4D8C8] bg-white px-4 py-2 text-[14px] font-semibold text-[#062E27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56] disabled:opacity-50"
                          disabled={isInteractionLocked}
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
                        ref={destinationRef}
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
                          className="absolute left-0 top-0 rounded-[16px] border-2 border-dashed border-[#C8BCAA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D99C56] disabled:opacity-60"
                          disabled={isInteractionLocked}
                          onClick={openLibrary}
                          ref={(element) => {
                            registerCard(ADD_CARD_ID, element);
                          }}
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
                      Shell phase: {phase}. {actionStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {transitionLayer}
        </ComponentPageShell>
      </div>
    </main>
  );
}
