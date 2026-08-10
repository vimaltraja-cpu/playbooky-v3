import { temporaryActivityIllustrationMap } from "@/lib/data/activity-illustration-map";
import type { FacilitatorActivityHeroData } from "@/components/ui/FacilitatorActivityHero";
import type { FacilitatorActivityStep } from "@/components/ui/FacilitatorActivitySteps";
import type { FacilitatorActivityTab } from "@/components/ui/FacilitatorActivityTabs";
import type {
  ActivityRecord,
  BuildingBlockRecord,
  BuildingBlockStepRecord,
  LibraryDataset
} from "@/lib/product-system/library-read-model";
import type { GenerationCandidate } from "@/lib/workshop-os/create-library-workshop";

export type FacilitatorGuideContentGap = {
  activityId: string;
  activityTitle: string;
  detail: string;
  field: "whatToSay" | "discussionPrompt" | "expectedOutcome" | "illustration";
  severity: "missing" | "interim";
  stepId?: string;
  stepTitle?: string;
};

export type FacilitatorGuideActivityContent = {
  hero: FacilitatorActivityHeroData;
  id: string;
  steps: FacilitatorActivityStep[];
  title: string;
};

export type FacilitatorGuideContent = {
  activities: FacilitatorGuideActivityContent[];
  gaps: FacilitatorGuideContentGap[];
  tabs: FacilitatorActivityTab[];
};

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findActivityRecord(
  dataset: LibraryDataset,
  block: BuildingBlockRecord
): ActivityRecord | undefined {
  const blockKey = normalizeTitle(block.title);
  return dataset.activities.find((activity) => {
    const activityKey = normalizeTitle(activity.title);
    return (
      activityKey === blockKey ||
      activityKey.includes(blockKey) ||
      blockKey.includes(activityKey)
    );
  });
}

function resolveIllustrationSrc(title: string): string | null {
  const mapped = temporaryActivityIllustrationMap[title];

  if (mapped) {
    return `/assets/activities/${mapped}`;
  }

  const fuzzyEntry = Object.entries(temporaryActivityIllustrationMap).find(
    ([key]) =>
      normalizeTitle(key) === normalizeTitle(title) ||
      normalizeTitle(title).includes(normalizeTitle(key)) ||
      normalizeTitle(key).includes(normalizeTitle(title))
  );

  return fuzzyEntry ? `/assets/activities/${fuzzyEntry[1]}` : null;
}

function formatDurationLabel(minutes?: number) {
  if (!minutes || minutes <= 0) {
    return "DURATION TBC";
  }

  return `${minutes} MINUTES`;
}

function splitActivityInstructions(instructions?: string) {
  const normalizedInstructions = instructions?.trim() ?? "";

  if (!normalizedInstructions) {
    return [];
  }

  return normalizedInstructions
    .split(/\n\s*\n/)
    .map((line) => line.trim().replace(/^\d+\.\s*/, ""))
    .filter(Boolean);
}

function titleFromInstruction(instruction: string) {
  const [firstSentence = instruction] = instruction.split(/(?<=[.!?])\s+/);
  const words = firstSentence.replace(/[.!?]+$/, "").split(/\s+/);

  return words.slice(0, 5).join(" ");
}

function formatInstructionDuration(
  totalMinutes: number | undefined,
  stepCount: number
) {
  if (!totalMinutes || totalMinutes <= 0 || stepCount <= 0) {
    return "DURATION TBC";
  }

  return formatDurationLabel(Math.max(1, Math.round(totalMinutes / stepCount)));
}

export function mapActivityRecordToFacilitatorGuideActivity(
  activity: ActivityRecord,
  id = activity.id
): FacilitatorGuideActivityContent {
  const instructions = splitActivityInstructions(activity.instructions);
  const steps =
    instructions.length > 0
      ? instructions
      : [
          activity.description?.trim() ||
            activity.bestUsedWhen?.trim() ||
            "Run this activity using the canonical activity guidance."
        ];
  const outputSummary =
    activity.outputs.length > 0
      ? `Expected output: ${activity.outputs.join(", ")}.`
      : activity.description ||
        "The group captures a useful output from this activity.";
  const discussionPrompt =
    activity.bestUsedWhen ||
    "What does this activity reveal about the work the group needs to do next?";

  return {
    hero: {
      description:
        activity.description ||
        activity.bestUsedWhen ||
        "Activity purpose is not documented in the canonical library.",
      illustration: {
        alt: `${activity.title} illustration`,
        src: resolveIllustrationSrc(activity.title) ?? "/assets/activities/Problem Framing.png"
      },
      title: activity.title,
      type: activity.phase || activity.category || "Activity"
    },
    id,
    steps: steps.map((instruction, index) => ({
      description: instruction,
      discussionPrompt,
      durationLabel: formatInstructionDuration(
        activity.durationMinutes,
        steps.length
      ),
      expectedOutcome: outputSummary,
      id: `${id}-activity-step-${index + 1}`,
      title: titleFromInstruction(instruction),
      whatToSay:
        activity.facilitatorNotes ||
        "Introduce the activity, connect it to the workshop goal, and guide the group through the expected output."
    })),
    title: activity.title
  };
}

function mapStep(
  step: BuildingBlockStepRecord,
  activityId: string,
  activityTitle: string,
  gaps: FacilitatorGuideContentGap[],
  activityGapFlags: {
    expectedOutcomeInterim: boolean;
    whatToSayInterim: boolean;
  }
): FacilitatorActivityStep {
  const whatToSay = step.facilitatorNotes?.trim() ?? "";
  const expectedOutcome = step.purpose?.trim() ?? "";
  const description = step.instructions?.trim() ?? "";

  if (!whatToSay) {
    gaps.push({
      activityId,
      activityTitle,
      detail:
        "No Facilitator Notes on this building-block step. What to say has nothing to map from.",
      field: "whatToSay",
      severity: "missing",
      stepId: step.id,
      stepTitle: step.title
    });
  } else if (!activityGapFlags.whatToSayInterim) {
    activityGapFlags.whatToSayInterim = true;
    gaps.push({
      activityId,
      activityTitle,
      detail:
        "What to say is temporarily mapped from Facilitator Notes. Canonical data has no dedicated spoken-script field.",
      field: "whatToSay",
      severity: "interim"
    });
  }

  if (!expectedOutcome) {
    gaps.push({
      activityId,
      activityTitle,
      detail:
        "No Purpose on this step. Expected outcome has nothing to map from.",
      field: "expectedOutcome",
      severity: "missing",
      stepId: step.id,
      stepTitle: step.title
    });
  } else if (!activityGapFlags.expectedOutcomeInterim) {
    activityGapFlags.expectedOutcomeInterim = true;
    gaps.push({
      activityId,
      activityTitle,
      detail:
        "Expected outcome is temporarily mapped from step Purpose. This is intent copy, not a dedicated outcome script.",
      field: "expectedOutcome",
      severity: "interim"
    });
  }

  return {
    description:
      description ||
      "Step instructions are not documented in the canonical step record.",
    discussionPrompt:
      "Discussion prompts are not yet authored in the canonical database.",
    durationLabel: formatDurationLabel(step.durationMinutes),
    expectedOutcome:
      expectedOutcome ||
      "Expected outcome is not documented in the canonical step record.",
    id: step.id,
    title: step.title,
    whatToSay:
      whatToSay ||
      "Facilitator speaking notes are not documented for this step."
  };
}

function mapCandidate(
  candidate: GenerationCandidate,
  dataset: LibraryDataset,
  gaps: FacilitatorGuideContentGap[]
): FacilitatorGuideActivityContent | null {
  if (!candidate.block) {
    return null;
  }

  const block = candidate.block;
  const activity = findActivityRecord(dataset, block);
  const illustrationSrc = resolveIllustrationSrc(block.title);
  const description =
    activity?.description?.trim() ||
    block.description?.trim() ||
    activity?.bestUsedWhen?.trim() ||
    "Activity purpose is not documented in the canonical library.";
  const activityGapFlags = {
    expectedOutcomeInterim: false,
    whatToSayInterim: false
  };

  if (!illustrationSrc) {
    gaps.push({
      activityId: block.id,
      activityTitle: block.title,
      detail:
        "No temporary illustration mapping found for this building-block title.",
      field: "illustration",
      severity: "missing"
    });
  }

  return {
    hero: {
      description,
      illustration: {
        alt: `${block.title} illustration`,
        src: illustrationSrc ?? "/assets/activities/Problem Framing.png"
      },
      title: block.title,
      type: block.phase || activity?.phase || "Activity"
    },
    id: block.id,
    steps: candidate.steps.map((step) =>
      mapStep(step, block.id, block.title, gaps, activityGapFlags)
    ),
    title: block.title
  };
}

export function mapWorkshopToFacilitatorGuide(
  dataset: LibraryDataset,
  selected: GenerationCandidate[]
): FacilitatorGuideContent {
  const gaps: FacilitatorGuideContentGap[] = [
    {
      activityId: "*",
      activityTitle: "All activities",
      detail:
        "Discussion prompt has no column in building-block-steps.csv or activity-library.csv. Add a Discussion Prompt (or Prompts) field to the step canon to fill this column.",
      field: "discussionPrompt",
      severity: "missing"
    }
  ];
  const activities = selected
    .map((candidate) => mapCandidate(candidate, dataset, gaps))
    .filter(Boolean) as FacilitatorGuideActivityContent[];

  return {
    activities,
    gaps,
    tabs: activities.map((activity) => ({
      id: activity.id,
      label: activity.title
    }))
  };
}

export function summarizeFacilitatorGuideGaps(
  gaps: FacilitatorGuideContentGap[]
) {
  const missingDiscussion = gaps.filter(
    (gap) => gap.field === "discussionPrompt" && gap.severity === "missing"
  ).length;
  const interimWhatToSay = gaps.filter(
    (gap) => gap.field === "whatToSay" && gap.severity === "interim"
  ).length;
  const interimExpected = gaps.filter(
    (gap) => gap.field === "expectedOutcome" && gap.severity === "interim"
  ).length;
  const missingIllustration = gaps.filter(
    (gap) => gap.field === "illustration" && gap.severity === "missing"
  ).length;

  return {
    interimExpected,
    interimWhatToSay,
    missingDiscussion,
    missingIllustration
  };
}
