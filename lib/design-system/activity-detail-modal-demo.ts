import type { ActivityDetailModalData } from "@/components/ui/ActivityDetailModal";
import type { CanonicalActivityCardRecord } from "@/lib/data/canonical-activity-cards";
import {
  buildingBlocks,
  workshopOsFixtureSource
} from "@/lib/workshop-os/fixtures";

export const okrsActivityDetailModalIconNames = [
  "clear-alignment",
  "focus-priorities",
  "make-decisions",
  "actionable-plan",
  "create-an-action-plan",
  "stronger-collaboration"
] as const;

export const okrsActivityDetailModalSource =
  workshopOsFixtureSource.buildingBlockLibrary;

const placeholderIconSrc = "/assets/icons/clear-alignment.svg";

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
    "Review Options",
    "Clarify Criteria",
    "Blind Vote",
    "Compare Signals",
    "Confirm Decision",
    "Commit Actions"
  ],
  evaluate: [
    "List Options",
    "Define Criteria",
    "Map Impact",
    "Compare Effort",
    "Select Priorities",
    "Confirm Next Steps"
  ],
  frame: [
    "Review Evidence",
    "Identify Themes",
    "Draft Framing",
    "Challenge Assumptions",
    "Refine Statement",
    "Confirm Focus"
  ],
  goals: [
    "Review Context",
    "Define Aim",
    "Generate Options",
    "Select Focus",
    "Set Measures",
    "Commit Actions"
  ],
  ideas: [
    "Review Prompt",
    "Generate Ideas",
    "Share Concepts",
    "Cluster Ideas",
    "Select Directions",
    "Plan Next Steps"
  ],
  understand: [
    "Set Context",
    "Map Evidence",
    "Capture Signals",
    "Identify Patterns",
    "Discuss Insights",
    "Align Learning"
  ]
};

function toDisplayDuration(duration: string) {
  return duration.trim().replace(/\bmins?\b/i, "MINS").toUpperCase();
}

function toDisplayStage(stage: string) {
  return (stage || "Stage pending").trim().toUpperCase();
}

function makePlaceholderIllustration(title: string) {
  const encodedTitle = encodeURIComponent(title || "Activity");

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1368' height='230' viewBox='0 0 1368 230'%3E%3Crect width='1368' height='230' fill='%23E9DFD0'/%3E%3Cpath d='M0 185 C220 125 360 220 560 160 C790 90 970 205 1368 118 L1368 230 L0 230 Z' fill='%23D8C08A' fill-opacity='0.45'/%3E%3Ctext x='684' y='118' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' font-weight='700' fill='%23062E27'%3E${encodedTitle}%3C/text%3E%3Ctext x='684' y='150' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%23706B62'%3ETemporary modal illustration placeholder%3C/text%3E%3C/svg%3E`;
}

function getStageFlowLabels(stage: string) {
  return stageFlowLabels[stage.toLowerCase()] ?? [
    "Review Context",
    "Map Inputs",
    "Discuss Signals",
    "Generate Options",
    "Select Direction",
    "Commit Actions"
  ];
}

function toBuilderFlowStages(activity: CanonicalActivityCardRecord) {
  return getStageFlowLabels(activity.stage).map((label, index) => ({
    iconAlt:
      index === 0
        ? "Temporary placeholder activity modal icon"
        : `Temporary ${label.toLowerCase()} icon`,
    iconSrc: builderFlowIconSrcs[index] ?? placeholderIconSrc,
    label
  }));
}

export function getOkrsActivityDetailModalData() {
  const sourceBlock = buildingBlocks.find(
    (block) => block.id === "objectives-and-key-results"
  );

  if (!sourceBlock) {
    throw new Error("Missing Objectives and Key Results Workshop OS block.");
  }

  return {
    activityName: "Objectives & Key Results",
    builderFlowStages: [
      {
        iconAlt: "Temporary clear alignment icon",
        iconSrc: "/assets/icons/clear-alignment.svg",
        label: "Review Objectives"
      },
      {
        iconAlt: "Temporary focus priorities icon",
        iconSrc: "/assets/icons/focus-priorities.svg",
        label: "Cluster Objectives"
      },
      {
        iconAlt: "Temporary make decisions icon",
        iconSrc: "/assets/icons/make-decisions.svg",
        label: "Blind Vote"
      },
      {
        iconAlt: "Temporary actionable plan icon",
        iconSrc: "/assets/icons/actionable-plan.svg",
        label: "Generate Metrics"
      },
      {
        iconAlt: "Temporary create action plan icon",
        iconSrc: "/assets/icons/create-an-action-plan.svg",
        label: "Create Key Results"
      },
      {
        iconAlt: "Temporary stronger collaboration icon",
        iconSrc: "/assets/icons/stronger-collaboration.svg",
        label: "Commit Actions"
      }
    ],
    description:
      "Create measurable objectives and key results that align the team.",
    duration: "90 MINS",
    illustration: {
      alt: "Objectives and Key Results activity illustration",
      src: "/assets/activity-modal/objectives-key-results-okrs.png"
    },
    rationale:
      "Your workshop finishes by turning agreed priorities into measurable outcomes and ownership.",
    sourceBlock,
    stage: "GOALS"
  } satisfies ActivityDetailModalData;
}

export function getActivityDetailModalData(activity: CanonicalActivityCardRecord) {
  if (activity.slug === "okrs") {
    return getOkrsActivityDetailModalData();
  }

  return {
    activityName: activity.title,
    builderFlowStages: toBuilderFlowStages(activity),
    description:
      activity.description ||
      `Placeholder review description for ${activity.title}.`,
    duration: toDisplayDuration(activity.duration),
    illustration: {
      alt: activity.isMissingIllustration
        ? `Temporary modal illustration placeholder for ${activity.title}`
        : `${activity.title} activity illustration`,
      src: activity.isMissingIllustration
        ? makePlaceholderIllustration(activity.title)
        : activity.illustration
    },
    rationale: activity.bestUsedWhen
      ? `PlayBooky placed this here because ${activity.bestUsedWhen.charAt(0).toLowerCase()}${activity.bestUsedWhen.slice(1)}`
      : `Placeholder review rationale for ${activity.title}.`,
    stage: toDisplayStage(activity.stage)
  } satisfies ActivityDetailModalData;
}

export function getMissingIconActivityDetailModalData(
  activity: CanonicalActivityCardRecord
) {
  const modalData = getActivityDetailModalData(activity);

  return {
    ...modalData,
    builderFlowStages: modalData.builderFlowStages.map((stage) => ({
      ...stage,
      iconAlt: "Temporary placeholder activity modal icon",
      iconSrc: placeholderIconSrc
    }))
  } satisfies ActivityDetailModalData;
}
