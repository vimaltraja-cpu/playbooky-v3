"use client";

import { ActivityCard, type ActivityCardData } from "@/components/ui/ActivityCard";
import { getActivityGridRowCount } from "@/lib/design-system/activity-grid-layout";

export type ActivityGridVisualCard = {
  activity: ActivityCardData;
  id: string;
  label: string;
};

export type ActivityGridViewportMode = "desktop" | "tablet" | "mobile";

// Real, un-scaled breakpoint geometry. Every value here is the actual
// rendered pixel size for that breakpoint -- nothing is ever shrunk or
// grown with a CSS transform. Desktop and tablet reuse the real desktop
// ActivityCard (256 x 370); mobile uses the real mobile ActivityCard
// size (333 x 190, size="mobile") that already exists in ActivityCard.
export const activityGridDesktopViewport = {
  cardHeight: 370,
  cardWidth: 256,
  columns: 5,
  gap: 24,
  height: 900,
  width: 1440
} as const;

export const activityGridTabletViewport = {
  cardHeight: 370,
  cardWidth: 256,
  columns: 4,
  gap: 22,
  height: 834,
  width: 1194
} as const;

export const activityGridMobileViewport = {
  cardHeight: 190,
  cardWidth: 333,
  columns: 1,
  gap: 18,
  height: 852,
  scrollHeight: 746,
  width: 394
} as const;

export const activityGridViewports = {
  desktop: activityGridDesktopViewport,
  mobile: activityGridMobileViewport,
  tablet: activityGridTabletViewport
} as const;

export function ActivityGridCardSurface({
  activity,
  viewport = "desktop"
}: {
  activity: ActivityCardData;
  viewport?: ActivityGridViewportMode;
}) {
  const geometry = activityGridViewports[viewport];

  return (
    <div style={{ height: geometry.cardHeight, width: geometry.cardWidth }}>
      <ActivityCard
        activity={activity}
        size={viewport === "mobile" ? "mobile" : "desktop"}
        variant="builder"
      />
    </div>
  );
}

// Real, non-scaled activity grid, one board per breakpoint. Cards are
// rendered at their true pixel size for that breakpoint (no CSS
// transform: scale anywhere). No frame, border, background panel or
// label is rendered around the board -- it sits directly on the page,
// full width, like the real product surface it is.
export function ActivityGridResponsiveVisualLayer({
  cards,
  hiddenCardIds = [],
  inert = false,
  registerCard,
  viewport = "desktop"
}: {
  cards: ActivityGridVisualCard[];
  hiddenCardIds?: string[];
  inert?: boolean;
  registerCard?: (id: string, element: HTMLButtonElement | null) => void;
  viewport?: ActivityGridViewportMode;
}) {
  const hiddenCards = new Set(hiddenCardIds);
  const geometry = activityGridViewports[viewport];
  const { cardHeight, cardWidth, columns, gap } = geometry;
  const itemCount = cards.length + 1;
  const rows = getActivityGridRowCount(viewport, itemCount, columns);
  const gridWidth = columns * cardWidth + (columns - 1) * gap;
  const gridHeight = rows * cardHeight + (rows - 1) * gap;

  const board = (
    <div
      className="grid"
      style={{
        gap,
        gridTemplateColumns: `repeat(${columns}, ${cardWidth}px)`,
        height: gridHeight,
        width: gridWidth
      }}
    >
      {cards.map((card) => (
        <button
          aria-label={`Open ${card.label} activity details`}
          className="touch-none select-none rounded-[16px] bg-transparent text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d3a]/50"
          data-card-id={card.id}
          data-transition-hidden={hiddenCards.has(card.id) ? "true" : "false"}
          disabled={inert}
          key={card.id}
          ref={(element) => registerCard?.(card.id, element)}
          style={{ height: cardHeight, width: cardWidth }}
          type="button"
        >
          <ActivityGridCardSurface activity={card.activity} viewport={viewport} />
        </button>
      ))}
      <div
        aria-label="Add Activity placeholder"
        className="flex items-center justify-center rounded-[14px] border-2 border-dashed border-[#c8bcaa] bg-[#fbf7ef]/70 text-[40px] font-light text-[#9e927f]"
        style={{ height: cardHeight, width: cardWidth }}
      >
        +
      </div>
    </div>
  );

  if (viewport === "mobile") {
    // Real mobile behaviour keeps its own vertical scroll region (this
    // is the approved scroll-fade pattern, not preview chrome) -- but
    // no border/background panel wraps it.
    return (
      <div aria-hidden={inert} className="relative w-full">
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
          {board}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-10 bg-gradient-to-b from-[#F6F1E8] via-[#F6F1E8]/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-14 bg-gradient-to-t from-[#F6F1E8] via-[#F6F1E8]/80 to-transparent"
        />
      </div>
    );
  }

  return (
    <div aria-hidden={inert} className="flex w-full items-start justify-center">
      {board}
    </div>
  );
}

// Backwards-compatible desktop-only alias.
export function ActivityGridDesktopVisualLayer(props: {
  cards: ActivityGridVisualCard[];
  hiddenCardIds?: string[];
  inert?: boolean;
  registerCard?: (id: string, element: HTMLButtonElement | null) => void;
}) {
  return <ActivityGridResponsiveVisualLayer {...props} viewport="desktop" />;
}
