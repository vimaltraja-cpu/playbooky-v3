import type { CanonicalActivityCardRecord } from "@/lib/data/canonical-activity-cards";
import type { ActivityRecord } from "@/lib/product-system/library-read-model";

export const ACTIVITY_LIBRARY_STAGE_TABS = [
  "All",
  "Frame",
  "Understand",
  "Goals",
  "Ideas",
  "Evaluate",
  "Discuss",
  "Decide"
] as const;

export type ActivityLibraryStageTab =
  (typeof ACTIVITY_LIBRARY_STAGE_TABS)[number];

export type ActivityLibraryStep = {
  iconAlt: string;
  iconSrc: string;
  label: string;
};

export type ActivityLibraryModalItem = {
  duration: string;
  durationDisplay: string;
  id: string;
  illustration: {
    alt: string;
    src: string;
  };
  outcome: string;
  slug: string;
  stage: string;
  stageDisplay: string;
  steps: ActivityLibraryStep[];
  title: string;
};

export const ACTIVITY_LIBRARY_SHELF_STAGES = [
  "Frame",
  "Understand",
  "Goals",
  "Ideas",
  "Evaluate",
  "Discuss",
  "Decide"
] as const;

export type ActivityLibraryShelf = {
  id: string;
  items: ActivityLibraryModalItem[];
  label: string;
};

export type ActivityLibraryPack = {
  blurb: string;
  id: string;
  illustration: {
    alt: string;
    src: string;
  };
  items: ActivityLibraryModalItem[];
  label: string;
};

const ACTIVITY_LIBRARY_PACK_BLURBS: Record<string, string> = {
  decide: "Leave with owners and next steps",
  discuss: "Work through tension together",
  evaluate: "Pressure-test what matters",
  frame: "Name the challenge",
  goals: "Point the room at an outcome",
  ideas: "Open options without losing the thread",
  suggested: "Fits this workshop right now",
  understand: "Surface what's really going on"
};

const builderFlowIconSrcs = [
  "/assets/icons/clear-alignment.svg",
  "/assets/icons/focus-priorities.svg",
  "/assets/icons/make-decisions.svg",
  "/assets/icons/actionable-plan.svg",
  "/assets/icons/create-an-action-plan.svg",
  "/assets/icons/stronger-collaboration.svg"
] as const;

const stageFlowLabels: Record<string, string[]> = {
  decide: [
    "Review",
    "Criteria",
    "Vote",
    "Compare",
    "Decide",
    "Commit"
  ],
  discuss: [
    "Share",
    "Views",
    "Tension",
    "Overlap",
    "Align",
    "Capture"
  ],
  evaluate: [
    "Options",
    "Criteria",
    "Impact",
    "Effort",
    "Prioritise",
    "Confirm"
  ],
  frame: [
    "Evidence",
    "Themes",
    "Framing",
    "Challenge",
    "Refine",
    "Focus"
  ],
  goals: [
    "Context",
    "Aim",
    "Options",
    "Focus",
    "Measures",
    "Commit"
  ],
  ideas: [
    "Prompt",
    "Ideate",
    "Share",
    "Cluster",
    "Select",
    "Plan"
  ],
  understand: [
    "Context",
    "Evidence",
    "Signals",
    "Patterns",
    "Insights",
    "Align"
  ]
};

function toDisplayDuration(duration: string) {
  return duration.trim().replace(/\bmins?\b/i, "MINS").toUpperCase();
}

function toDisplayStage(stage: string) {
  return (stage || "Stage pending").trim().toUpperCase();
}

function normalizeActivityIdentity(value: string) {
  return value
    .toLowerCase()
    .replace(/^canonical-activity-/, "")
    .replace(/^activity-/, "")
    .replace(/^block-/, "")
    .replace(/&/g, " and ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

function getActivityIdentityKeys(activity: ActivityLibraryModalItem) {
  const titleSlug = normalizeActivityIdentity(activity.title);
  const slug = normalizeActivityIdentity(activity.slug);
  const idSlug = normalizeActivityIdentity(activity.id);

  return new Set([
    activity.id,
    activity.slug,
    `activity-${activity.slug}`,
    idSlug,
    slug,
    titleSlug,
    `activity-${idSlug}`,
    `activity-${slug}`,
    `activity-${titleSlug}`,
    `block-${idSlug}`,
    `block-${slug}`,
    `block-${titleSlug}`
  ]);
}

export function isActivityLibraryItemInWorkshop(
  activity: ActivityLibraryModalItem,
  workshopActivityIds: string[]
) {
  const activityKeys = getActivityIdentityKeys(activity);

  return workshopActivityIds.some((workshopId) => {
    const normalizedWorkshopId = normalizeActivityIdentity(workshopId);

    return (
      activityKeys.has(workshopId) ||
      activityKeys.has(normalizedWorkshopId) ||
      activityKeys.has(`activity-${normalizedWorkshopId}`) ||
      activityKeys.has(`block-${normalizedWorkshopId}`)
    );
  });
}

function makePlaceholderIllustration(title: string) {
  const encodedTitle = encodeURIComponent(title || "Activity");

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23E9DFD0'/%3E%3Cpath d='M0 140 C60 100 110 160 170 120 C230 80 270 150 320 110 L320 180 L0 180 Z' fill='%23D8C08A' fill-opacity='0.45'/%3E%3Ctext x='160' y='88' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' font-weight='700' fill='%23062E27'%3E${encodedTitle}%3C/text%3E%3C/svg%3E`;
}

function getStageFlowSteps(stage: string): ActivityLibraryStep[] {
  const labels =
    stageFlowLabels[stage.toLowerCase()] ?? [
      "Context",
      "Inputs",
      "Signals",
      "Options",
      "Select",
      "Commit"
    ];

  return labels.map((label, index) => ({
    iconAlt: `${label} step icon`,
    iconSrc: builderFlowIconSrcs[index] ?? builderFlowIconSrcs[0],
    label
  }));
}

export function buildActivityLibraryModalItems(
  activities: ActivityRecord[],
  cards: CanonicalActivityCardRecord[]
): ActivityLibraryModalItem[] {
  const cardBySlug = new Map(cards.map((card) => [card.slug, card]));
  const cardByTitle = new Map(
    cards.map((card) => [card.title.trim().toLowerCase(), card])
  );

  return activities
    .filter((activity) => activity.status === "active" || Boolean(activity.title))
    .map((activity) => {
      const slug = activity.id.replace(/^activity-/, "");
      const card =
        cardBySlug.get(slug) ??
        cardByTitle.get(activity.title.trim().toLowerCase());
      const stage = activity.phase || activity.category || card?.stage || "";
      const duration =
        card?.duration ||
        (activity.durationMinutes
          ? `${activity.durationMinutes} mins`
          : "Duration pending");
      const isMissingIllustration = card?.isMissingIllustration ?? true;
      const illustrationSrc = isMissingIllustration
        ? makePlaceholderIllustration(activity.title)
        : (card?.illustration ?? makePlaceholderIllustration(activity.title));
      const outcome =
        (activity.description ||
          activity.bestUsedWhen ||
          card?.description ||
          card?.bestUsedWhen ||
          "")
          .trim()
          .replace(/\s+/g, " ");

      return {
        duration,
        durationDisplay: toDisplayDuration(duration),
        id: activity.id,
        illustration: {
          alt: isMissingIllustration
            ? `Temporary illustration placeholder for ${activity.title}`
            : `${activity.title} activity illustration`,
          src: illustrationSrc
        },
        outcome:
          outcome.length > 110 ? `${outcome.slice(0, 107).replace(/\s+\S*$/, "")}…` : outcome,
        slug,
        stage,
        stageDisplay: toDisplayStage(stage),
        steps: getStageFlowSteps(stage),
        title: activity.title
      } satisfies ActivityLibraryModalItem;
    })
    .sort((left, right) => left.title.localeCompare(right.title));
}

export function filterActivityLibraryItems(
  items: ActivityLibraryModalItem[],
  tab: ActivityLibraryStageTab
) {
  if (tab === "All") {
    return items;
  }

  return items.filter(
    (item) => item.stage.trim().toLowerCase() === tab.toLowerCase()
  );
}

function durationMinutesFromDisplay(duration: string) {
  const match = duration.match(/(\d+)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function createPackDeduper() {
  const usedKeys = new Set<string>();

  return function uniqueForPack(items: ActivityLibraryModalItem[]) {
    return items.filter((item) => {
      const keys = getActivityIdentityKeys(item);
      const alreadyUsed = Array.from(keys).some((key) => usedKeys.has(key));

      if (alreadyUsed) {
        return false;
      }

      keys.forEach((key) => usedKeys.add(key));
      return true;
    });
  };
}

export function groupActivityLibraryShelves(
  items: ActivityLibraryModalItem[],
  suggestedIds: string[] = []
): ActivityLibraryShelf[] {
  const suggestedFromIds = suggestedIds
    .map((id) => items.find((item) => item.id === id || item.slug === id))
    .filter((item): item is ActivityLibraryModalItem => Boolean(item));

  const quickSwaps = items
    .filter((item) => durationMinutesFromDisplay(item.duration) <= 30)
    .slice(0, 8);

  const suggestedItems =
    suggestedFromIds.length > 0
      ? suggestedFromIds.slice(0, 8)
      : quickSwaps;

  const shelves: ActivityLibraryShelf[] = [];

  if (suggestedItems.length > 0) {
    shelves.push({
      id: "suggested",
      items: suggestedItems,
      label:
        suggestedFromIds.length > 0
          ? "Suggested for this workshop"
          : "Quick swaps"
    });
  }

  ACTIVITY_LIBRARY_SHELF_STAGES.forEach((stage) => {
    const stageItems = items.filter(
      (item) => item.stage.trim().toLowerCase() === stage.toLowerCase()
    );

    if (stageItems.length > 0) {
      shelves.push({
        id: `stage-${stage.toLowerCase()}`,
        items: stageItems,
        label: stage
      });
    }
  });

  return shelves;
}

function packFromItems(
  id: string,
  label: string,
  blurbKey: string,
  items: ActivityLibraryModalItem[]
): ActivityLibraryPack | null {
  if (items.length === 0) {
    return null;
  }

  const cover = items[0]!;

  return {
    blurb:
      ACTIVITY_LIBRARY_PACK_BLURBS[blurbKey] ??
      ACTIVITY_LIBRARY_PACK_BLURBS.suggested,
    id,
    illustration: {
      alt: `${label} pack cover`,
      src: cover.illustration.src
    },
    items,
    label
  };
}

export function groupActivityLibraryPacks(
  items: ActivityLibraryModalItem[],
  suggestedIds: string[] = []
): ActivityLibraryPack[] {
  const uniqueForPack = createPackDeduper();
  const suggestedFromIds = suggestedIds
    .map((id) => items.find((item) => item.id === id || item.slug === id))
    .filter((item): item is ActivityLibraryModalItem => Boolean(item));

  const quickSwaps = items
    .filter((item) => durationMinutesFromDisplay(item.duration) <= 30)
    .slice(0, 8);

  const suggestedItems =
    suggestedFromIds.length > 0
      ? suggestedFromIds.slice(0, 8)
      : quickSwaps;

  const packs: ActivityLibraryPack[] = [];

  const suggestedPack = packFromItems(
    "suggested",
    suggestedFromIds.length > 0
      ? "Suggested for this workshop"
      : "Quick swaps",
    "suggested",
    uniqueForPack(suggestedItems)
  );

  if (suggestedPack) {
    packs.push(suggestedPack);
  }

  ACTIVITY_LIBRARY_SHELF_STAGES.forEach((stage) => {
    const stageItems = uniqueForPack(
      items.filter(
        (item) => item.stage.trim().toLowerCase() === stage.toLowerCase()
      )
    );
    const pack = packFromItems(
      `stage-${stage.toLowerCase()}`,
      stage,
      stage.toLowerCase(),
      stageItems
    );

    if (pack) {
      packs.push(pack);
    }
  });

  return packs;
}
