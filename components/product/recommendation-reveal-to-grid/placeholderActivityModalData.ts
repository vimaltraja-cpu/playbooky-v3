import type { ActivityDetailModalData } from "@/components/ui/ActivityDetailModal";
import type { ActivityCardData } from "@/components/ui/ActivityCard";

// Placeholder-only modal content for the 7 reveal-to-grid demo
// activities. These don't have real canonical records (no CSV row, no
// approved builder-flow copy, no sourceBlock) the way the Design
// Portal's activity library does -- this adapter fabricates a
// reasonable-looking modal from what's already on the card so the
// modal can open and work end to end. Swap this out once real content
// exists for these activities.

const genericFlowIconSrcs = [
  "/assets/icons/clear-alignment.svg",
  "/assets/icons/focus-priorities.svg",
  "/assets/icons/make-decisions.svg",
  "/assets/icons/actionable-plan.svg",
  "/assets/icons/create-an-action-plan.svg",
  "/assets/icons/stronger-collaboration.svg"
] as const;

const genericFlowLabels = [
  "Review Context",
  "Map Inputs",
  "Discuss Signals",
  "Generate Options",
  "Select Direction",
  "Commit Actions"
] as const;

function toDisplayDuration(duration: string) {
  return duration.trim().replace(/\bmins?\b/i, "MINS").toUpperCase();
}

export function buildPlaceholderModalData(
  activity: ActivityCardData
): ActivityDetailModalData {
  return {
    activityName: activity.title,
    builderFlowStages: genericFlowLabels.map((label, index) => ({
      iconAlt: `Temporary ${label.toLowerCase()} icon`,
      iconSrc: genericFlowIconSrcs[index],
      label
    })),
    description: activity.description,
    duration: toDisplayDuration(activity.duration),
    illustration: {
      alt: `${activity.title} activity illustration`,
      src: activity.illustration
    },
    rationale: `PlayBooky placed this here as part of your ${activity.workshopType.toLowerCase()} step.`,
    stage: activity.workshopType.toUpperCase()
  };
}
