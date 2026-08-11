import type {
  FacilitatorGuideActivityContent,
  FacilitatorGuideContent
} from "@/lib/facilitator-guide/map-workshop-to-guide";
import {
  mapActivityRecordToFacilitatorGuideActivity,
  mapWorkshopToFacilitatorGuide
} from "@/lib/facilitator-guide/map-workshop-to-guide";
import { temporaryActivityIllustrationMap } from "@/lib/data/activity-illustration-map";
import type {
  ActivityRecord,
  BuildingBlockRecord,
  BuildingBlockStepRecord,
  LibraryDataset
} from "@/lib/product-system/library-read-model";
import {
  createRecommendedPlaybook,
  type GenerationCandidate
} from "@/lib/workshop-os/create-library-workshop";
import type { DiagnosisQuestionId } from "@/lib/design-system/diagnosis-options";
import type { DiagnosisAnswerProvenance } from "@/src/features/recommendation-journey/diagnosisIntelligence";
import type {
  JourneyActivityCard,
  JourneyGeneratedWorkshop
} from "@/src/features/recommendation-journey/journeySession";

const playbookIntentQuestionIds = new Set<DiagnosisQuestionId>([
  "goals",
  "challenges",
  "outcome"
]);

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

function resolveIllustrationSrc(title: string) {
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

  return fuzzyEntry
    ? `/assets/activities/${fuzzyEntry[1]}`
    : "/assets/activities/Problem Framing.png";
}

function formatDuration(minutes: number) {
  return minutes > 0 ? `${minutes} mins` : "Duration TBC";
}

function toSentenceCase(value: string) {
  const normalisedValue = value.trim();

  if (!normalisedValue) {
    return normalisedValue;
  }

  return `${normalisedValue.charAt(0).toUpperCase()}${normalisedValue
    .slice(1)
    .toLowerCase()}`;
}

function candidateToActivityCard(
  candidate: GenerationCandidate,
  dataset: LibraryDataset,
  index: number
): JourneyActivityCard | null {
  if (!candidate.block && !candidate.activity) {
    return null;
  }

  const block = candidate.block;
  const activity =
    candidate.activity ??
    (block ? findActivityRecord(dataset, block) : undefined);
  const duration =
    candidate.duration ||
    activity?.durationMinutes ||
    block?.durationMinutes ||
    0;
  const title = activity?.title ?? block?.title ?? "Activity";

  return {
    activity: {
      description:
        activity?.description?.trim() ||
        block?.description?.trim() ||
        activity?.bestUsedWhen?.trim() ||
        candidate.rule.reason,
      duration: formatDuration(duration),
      illustration: resolveIllustrationSrc(title),
      title,
      workshopType: block?.phase || activity?.phase || "Activity"
    },
    candidateBlockId: block?.id,
    id:
      candidate.canonicalItemId ??
      block?.id ??
      activity?.id ??
      `activity-${index}`,
    label: title,
    source: "generated"
  };
}

function createCandidateFromBlock(
  dataset: LibraryDataset,
  block: BuildingBlockRecord
): GenerationCandidate {
  const steps = dataset.steps
    .filter((step) => step.parentId === block.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const rule =
    dataset.workshopRules.find(
      (candidate) => candidate.recommendedBlockId === block.id
    ) ?? dataset.workshopRules[0];

  return {
    block,
    duration: getBlockDuration(block, steps),
    orderReason: "Resolved from the current journey activity set.",
    origin: "diagnosis-adapter",
    rule: rule ?? {
      expectedOutputs: block.outputs,
      id: `journey-${block.id}`,
      nextBlockIds: [],
      reason: block.description ?? block.title,
      recommendedBlockId: block.id,
      rule: block.title,
      situation: block.description ?? block.title
    },
    steps
  };
}

function getBlockDuration(
  block: BuildingBlockRecord,
  steps: BuildingBlockStepRecord[]
) {
  return (
    steps.reduce((total, step) => total + (step.durationMinutes ?? 0), 0) ||
    block.durationMinutes ||
    0
  );
}

function stripKnownCardPrefix(id: string) {
  return id.replace(/^canonical-activity-/, "").replace(/^activity-/, "");
}

function findActivityForJourneyCard(
  dataset: LibraryDataset,
  card: JourneyActivityCard
): ActivityRecord | undefined {
  const cardSlug = stripKnownCardPrefix(card.id);
  const cardTitle = normalizeTitle(card.activity.title);

  return dataset.activities.find((activity) => {
    const activitySlug = stripKnownCardPrefix(activity.id);
    const activityTitle = normalizeTitle(activity.title);

    return (
      activity.id === card.id ||
      activitySlug === cardSlug ||
      activityTitle === cardTitle ||
      activityTitle.includes(cardTitle) ||
      cardTitle.includes(activityTitle)
    );
  });
}

function findBlockForJourneyCard(
  dataset: LibraryDataset,
  card: JourneyActivityCard,
  selectedBlockId?: string
): BuildingBlockRecord | undefined {
  const explicitBlockId = card.candidateBlockId ?? selectedBlockId;

  if (explicitBlockId) {
    const explicitBlock = dataset.buildingBlocks.find(
      (block) => block.id === explicitBlockId
    );

    if (explicitBlock) {
      return explicitBlock;
    }
  }

  const cardTitle = normalizeTitle(card.activity.title);
  const activity = findActivityForJourneyCard(dataset, card);
  const activityTitle = activity ? normalizeTitle(activity.title) : "";

  return dataset.buildingBlocks.find((block) => {
    const blockTitle = normalizeTitle(block.title);

    return (
      block.id === card.id ||
      block.id === `block-${stripKnownCardPrefix(card.id)}` ||
      blockTitle === cardTitle ||
      (activityTitle.length > 0 && blockTitle === activityTitle) ||
      blockTitle.includes(cardTitle) ||
      cardTitle.includes(blockTitle) ||
      (activityTitle.length > 0 &&
        (blockTitle.includes(activityTitle) ||
          activityTitle.includes(blockTitle)))
    );
  });
}

export function diagnosisAnswersToSelectedOptionIds(
  diagnosisAnswers?: Partial<
    Record<DiagnosisQuestionId, DiagnosisAnswerProvenance>
  >
) {
  const selectedOptionIds: Record<string, string[]> = {};

  Object.entries(diagnosisAnswers ?? {}).forEach(([questionId, answer]) => {
    const optionIds = answer?.optionIds?.filter(Boolean) ?? [];

    if (optionIds.length > 0) {
      selectedOptionIds[questionId] = optionIds;
    }
  });

  return selectedOptionIds;
}

export function diagnosisAnswersToPlaybookOptionIds(
  diagnosisAnswers?: Partial<
    Record<DiagnosisQuestionId, DiagnosisAnswerProvenance>
  >
) {
  const selectedOptionIds =
    diagnosisAnswersToSelectedOptionIds(diagnosisAnswers);

  return Object.fromEntries(
    Object.entries(selectedOptionIds).flatMap(([questionId, optionIds]) => {
      const playbookOptionIds = optionIds.filter(
        (optionId) =>
          playbookIntentQuestionIds.has(questionId as DiagnosisQuestionId) ||
          optionId === "context-not-sure"
      );

      return playbookOptionIds.length > 0
        ? [[questionId, playbookOptionIds]]
        : [];
    })
  );
}

export function createSessionWorkshopFromDiagnosis({
  brief,
  dataset,
  diagnosisAnswers
}: {
  brief?: string;
  dataset: LibraryDataset;
  diagnosisAnswers?: Partial<
    Record<DiagnosisQuestionId, DiagnosisAnswerProvenance>
  >;
}) {
  const selectedOptionIds =
    diagnosisAnswersToPlaybookOptionIds(diagnosisAnswers);
  const workshop = createRecommendedPlaybook(dataset, selectedOptionIds);
  const generatedCards = workshop.selected
    .map((candidate, index) =>
      candidateToActivityCard(candidate, dataset, index)
    )
    .filter(Boolean) as JourneyActivityCard[];
  const title =
    workshop.selectedRoute?.name ??
    workshop.selected[0]?.activity?.title ??
    workshop.selected[0]?.block?.title ??
    "Root cause discovery workshop";
  const generatedWorkshop: JourneyGeneratedWorkshop = {
    description:
      brief?.trim() ||
      workshop.selected[0]?.rule.reason ||
      "A workshop path shaped around the current diagnosis.",
    durationMinutes: workshop.totalDuration,
    id: `journey-workshop-${
      workshop.selected
        .map((candidate) => candidate.canonicalItemId ?? candidate.block?.id)
        .filter(Boolean)
        .join("-") || "fallback"
    }`,
    reasoning: workshop.matchedRules.map((rule) => rule.reason),
    selectedBlockIds: workshop.selected
      .map((candidate) => candidate.block?.id)
      .filter(Boolean) as string[],
    title: toSentenceCase(workshop.selectedRoute ? title : `${title} workshop`),
    totalDuration: workshop.totalDuration,
    warnings: workshop.warnings
  };

  return {
    activityCards: generatedCards,
    generatedWorkshop,
    workshop
  };
}

function genericGuideActivity(
  card: JourneyActivityCard
): FacilitatorGuideActivityContent {
  return {
    hero: {
      description: card.activity.description,
      illustration: {
        alt: `${card.activity.title} illustration`,
        src: card.activity.illustration
      },
      title: card.activity.title,
      type: card.activity.workshopType
    },
    id: card.id,
    steps: [
      {
        description: card.activity.description,
        discussionPrompt:
          "What does this activity reveal about the work the group needs to do next?",
        durationLabel: card.activity.duration.toUpperCase(),
        expectedOutcome:
          "The group captures useful output from this activity and carries it into the next step.",
        id: `${card.id}-session-step`,
        title: card.activity.title,
        whatToSay:
          "Introduce the activity, connect it to the workshop goal, and guide the group through the expected output."
      }
    ],
    title: card.activity.title
  };
}

function mapActivityRecordForJourneyCard(
  activityRecord: ActivityRecord,
  card: JourneyActivityCard
): FacilitatorGuideActivityContent {
  const guideActivity = mapActivityRecordToFacilitatorGuideActivity(
    activityRecord,
    card.id
  );

  return {
    ...guideActivity,
    hero: {
      ...guideActivity.hero,
      illustration: {
        alt: `${card.activity.title} illustration`,
        src: card.activity.illustration
      }
    }
  };
}

export function mapJourneyCardsToFacilitatorGuide(
  dataset: LibraryDataset,
  cards: JourneyActivityCard[],
  selectedBlockIds: string[] = []
): FacilitatorGuideContent {
  const activities = cards.map((card, index) => {
    const selectedBlockId =
      card.source === "generated" ? selectedBlockIds[index] : undefined;
    const activityRecord = findActivityForJourneyCard(dataset, card);
    const hasCanonicalBlockIdentity = Boolean(
      card.candidateBlockId ?? selectedBlockId
    );

    if (
      activityRecord &&
      (card.source === "library" || !hasCanonicalBlockIdentity)
    ) {
      return mapActivityRecordForJourneyCard(activityRecord, card);
    }

    const block = findBlockForJourneyCard(
      dataset,
      card,
      selectedBlockId
    );

    if (block) {
      const guideActivity = mapWorkshopToFacilitatorGuide(dataset, [
        createCandidateFromBlock(dataset, block)
      ]).activities[0];

      if (guideActivity) {
        return {
          ...guideActivity,
          id: card.id,
          hero: {
            ...guideActivity.hero,
            description:
              card.activity.description || guideActivity.hero.description,
            illustration: {
              alt: `${card.activity.title} illustration`,
              src:
                card.activity.illustration ||
                guideActivity.hero.illustration.src
            },
            title: card.activity.title,
            type: card.activity.workshopType || guideActivity.hero.type
          },
          title: card.activity.title
        };
      }
    }

    if (activityRecord) {
      return mapActivityRecordForJourneyCard(activityRecord, card);
    }

    return genericGuideActivity(card);
  });

  return {
    activities,
    gaps: [],
    tabs: activities.map((activity) => ({
      id: activity.id,
      label: activity.title
    }))
  };
}
