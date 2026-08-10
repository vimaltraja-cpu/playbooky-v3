import { recommendationRevealCards } from "@/components/product/RecommendationCardReveal";
import type {
  FacilitatorGuideActivityContent,
  FacilitatorGuideContent
} from "@/lib/facilitator-guide/map-workshop-to-guide";
import {
  mapWorkshopToFacilitatorGuide
} from "@/lib/facilitator-guide/map-workshop-to-guide";
import { temporaryActivityIllustrationMap } from "@/lib/data/activity-illustration-map";
import type {
  ActivityRecord,
  BuildingBlockRecord,
  LibraryDataset
} from "@/lib/product-system/library-read-model";
import {
  createLibraryWorkshop,
  type GenerationCandidate
} from "@/lib/workshop-os/create-library-workshop";
import type { DiagnosisQuestionId } from "@/lib/design-system/diagnosis-options";
import type { DiagnosisAnswerProvenance } from "@/src/features/recommendation-journey/diagnosisIntelligence";
import type {
  JourneyActivityCard,
  JourneyGeneratedWorkshop
} from "@/src/features/recommendation-journey/journeySession";

const DEFAULT_WORKSHOP_DURATION_MINUTES = 120;

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

function fallbackCardAt(index: number): JourneyActivityCard {
  const fallback = recommendationRevealCards[index % recommendationRevealCards.length];

  return {
    activity: fallback.activity,
    id: fallback.id,
    label: fallback.activity.title,
    source: "fallback"
  };
}

function candidateToActivityCard(
  candidate: GenerationCandidate,
  dataset: LibraryDataset,
  index: number
): JourneyActivityCard | null {
  if (!candidate.block) {
    return null;
  }

  const block = candidate.block;
  const activity = findActivityRecord(dataset, block);
  const revealSlot = recommendationRevealCards[index];
  const duration =
    candidate.duration || activity?.durationMinutes || block.durationMinutes || 0;

  return {
    activity: {
      description:
        activity?.description?.trim() ||
        block.description?.trim() ||
        activity?.bestUsedWhen?.trim() ||
        candidate.rule.reason,
      duration: formatDuration(duration),
      illustration: resolveIllustrationSrc(block.title),
      title: block.title,
      workshopType: block.phase || activity?.phase || "Activity"
    },
    candidateBlockId: block.id,
    id: revealSlot?.id ?? block.id,
    label: block.title,
    source: "generated"
  };
}

function createFallbackPaddedCards(cards: JourneyActivityCard[]) {
  const nextCards = [...cards];

  while (nextCards.length < recommendationRevealCards.length) {
    const fallback = fallbackCardAt(nextCards.length);
    const alreadyUsed = nextCards.some((card) => card.id === fallback.id);

    nextCards.push(
      alreadyUsed
        ? {
            ...fallback,
            id: `${fallback.id}-${nextCards.length}`
          }
        : fallback
    );
  }

  return nextCards;
}

export function diagnosisAnswersToSelectedOptionIds(
  diagnosisAnswers?: Partial<Record<DiagnosisQuestionId, DiagnosisAnswerProvenance>>
) {
  const selectedOptionIds: Record<string, string> = {};

  Object.entries(diagnosisAnswers ?? {}).forEach(([questionId, answer]) => {
    const optionId = answer?.optionIds?.[0];

    if (optionId) {
      selectedOptionIds[questionId] = optionId;
    }
  });

  return selectedOptionIds;
}

export function createSessionWorkshopFromDiagnosis({
  brief,
  dataset,
  diagnosisAnswers
}: {
  brief?: string;
  dataset: LibraryDataset;
  diagnosisAnswers?: Partial<Record<DiagnosisQuestionId, DiagnosisAnswerProvenance>>;
}) {
  const selectedOptionIds = diagnosisAnswersToSelectedOptionIds(diagnosisAnswers);
  const workshop = createLibraryWorkshop(
    dataset,
    selectedOptionIds,
    DEFAULT_WORKSHOP_DURATION_MINUTES
  );
  const generatedCards = workshop.selected
    .map((candidate, index) => candidateToActivityCard(candidate, dataset, index))
    .filter(Boolean) as JourneyActivityCard[];
  const cards = createFallbackPaddedCards(generatedCards);
  const title =
    workshop.selected[0]?.block?.title ??
    "Root cause discovery workshop";
  const generatedWorkshop: JourneyGeneratedWorkshop = {
    description:
      brief?.trim() ||
      workshop.selected[0]?.rule.reason ||
      "A workshop path shaped around the current diagnosis.",
    durationMinutes: DEFAULT_WORKSHOP_DURATION_MINUTES,
    id: `journey-workshop-${workshop.selected
      .map((candidate) => candidate.block?.id)
      .filter(Boolean)
      .join("-") || "fallback"}`,
    reasoning: workshop.matchedRules.map((rule) => rule.reason),
    selectedBlockIds: workshop.selected
      .map((candidate) => candidate.block?.id)
      .filter(Boolean) as string[],
    title: toSentenceCase(`${title} workshop`),
    totalDuration: workshop.totalDuration,
    warnings: workshop.warnings
  };

  return {
    activityCards: cards,
    generatedWorkshop,
    workshop
  };
}

function genericGuideActivity(card: JourneyActivityCard): FacilitatorGuideActivityContent {
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

export function mapJourneyCardsToFacilitatorGuide(
  dataset: LibraryDataset,
  cards: JourneyActivityCard[],
  selectedBlockIds: string[] = []
): FacilitatorGuideContent {
  const selectedBlocks = new Set(selectedBlockIds);
  const generatedWorkshop = createLibraryWorkshop(
    dataset,
    {},
    DEFAULT_WORKSHOP_DURATION_MINUTES
  );
  const candidateByBlockId = new Map(
    generatedWorkshop.candidates
      .filter((candidate) => candidate.block)
      .map((candidate) => [candidate.block!.id, candidate])
  );
  const guideByBlockId = new Map(
    mapWorkshopToFacilitatorGuide(
      dataset,
      Array.from(selectedBlocks)
        .map((blockId) => candidateByBlockId.get(blockId))
        .filter(Boolean) as GenerationCandidate[]
    ).activities.map((activity) => [activity.id, activity])
  );
  const activities = cards.map((card) => {
    if (card.candidateBlockId) {
      const guideActivity = guideByBlockId.get(card.candidateBlockId);

      if (guideActivity) {
        return {
          ...guideActivity,
          id: card.id,
          title: card.activity.title
        };
      }
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

