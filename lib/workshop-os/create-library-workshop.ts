import type {
  ActivityRecord,
  BuildingBlockRecord,
  BuildingBlockStepRecord,
  LibraryDataset,
  WorkshopRuleRecord
} from "@/lib/product-system/library-read-model";

export type GenerationCandidate = {
  activity?: ActivityRecord;
  block?: BuildingBlockRecord;
  canonicalItemId?: string;
  canonicalSource?: "activity" | "building-block";
  duration: number;
  excludedReason?: string;
  orderReason: string;
  origin: "diagnosis-adapter" | "fallback" | "playbook-route" | "what-next";
  rule: WorkshopRuleRecord;
  steps: BuildingBlockStepRecord[];
};

export type GeneratedLibraryWorkshop = {
  candidates: GenerationCandidate[];
  excluded: GenerationCandidate[];
  fallbackUsed: boolean;
  matchedRules: WorkshopRuleRecord[];
  selected: GenerationCandidate[];
  selectedRoute?: LibraryDataset["playbookRoutes"][number];
  stageRanking?: Array<{ score: number; stage: string }>;
  totalDuration: number;
  trace: Array<{
    mappedRuleIds: string[];
    optionId: string;
    optionLabel: string;
    questionId: string;
    questionLabel: string;
    status: "mapped" | "unmapped";
  }>;
  warnings: string[];
};

/**
 * Maps diagnosis option IDs (from the diagnosis UI) to Workshop Design Logic
 * rule IDs. Shared by Active Library and Facilitator Guide live demos.
 */
export const diagnosisRuleAdapter: Record<string, string[]> = {
  "actionable-plan": ["need-actions-and-ownership"],
  "align-a-team": ["no-clear-goal", "need-alignment-on-options"],
  "alignment-issues": ["no-clear-goal", "need-alignment-on-options"],
  "better-decisions": ["need-clear-priorities", "need-alignment-on-options"],
  "clear-alignment": ["no-clear-goal", "need-alignment-on-options"],
  "context-not-sure": ["problem-not-clearly-defined"],
  "create-an-action-plan": ["need-actions-and-ownership"],
  "focus-priorities": ["need-clear-priorities"],
  "lack-of-ownership": ["need-actions-and-ownership"],
  "make-decisions": ["need-clear-priorities", "need-alignment-on-options"],
  "new-ideas": ["need-more-ideas"],
  "not-sure": ["root-cause-unknown", "problem-not-clearly-defined"],
  "outcome-focus-priorities": ["need-clear-priorities"],
  "outcome-not-sure-yet": ["problem-not-clearly-defined"],
  "performance-issues": ["root-cause-unknown", "need-team-reflection"],
  "slow-decision-making": [
    "need-clear-priorities",
    "need-alignment-on-options"
  ],
  "too-many-ideas": ["too-many-opportunities"],
  "unclear-priorities": ["need-clear-priorities"],
  "understand-a-problem": ["root-cause-unknown", "problem-not-clearly-defined"]
};

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

function createGenerationCandidate(
  dataset: LibraryDataset,
  rule: WorkshopRuleRecord,
  origin: GenerationCandidate["origin"],
  orderReason: string
): GenerationCandidate {
  const block = dataset.buildingBlocks.find(
    (candidate) => candidate.id === rule.recommendedBlockId
  );
  const steps = block
    ? dataset.steps
        .filter((step) => step.parentId === block.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return {
    block,
    duration: block ? getBlockDuration(block, steps) : 0,
    orderReason,
    origin,
    rule,
    steps
  };
}

export function createLibraryWorkshop(
  dataset: LibraryDataset,
  selectedOptionIds: Record<string, string | string[]>,
  durationLimit?: number
): GeneratedLibraryWorkshop {
  const trace = dataset.diagnosisQuestions.flatMap((question) => {
    const selected = selectedOptionIds[question.id];
    const optionIds = Array.isArray(selected)
      ? selected
      : selected
        ? [selected]
        : [""];

    return optionIds.map((optionId) => {
      const option = question.options.find(
        (candidate) => candidate.id === optionId
      );
      const mappedRuleIds = diagnosisRuleAdapter[optionId] ?? [];

      return {
        mappedRuleIds,
        optionId,
        optionLabel: option?.label ?? optionId,
        questionId: question.id,
        questionLabel: question.label,
        status: mappedRuleIds.length
          ? ("mapped" as const)
          : ("unmapped" as const)
      };
    });
  });

  const matchedRuleIds = Array.from(
    new Set(trace.flatMap((entry) => entry.mappedRuleIds))
  );
  const matchedRules = matchedRuleIds
    .map((id) => dataset.workshopRules.find((rule) => rule.id === id))
    .filter(Boolean) as WorkshopRuleRecord[];
  const fallbackUsed = matchedRules.length === 0;
  const seedRules = fallbackUsed
    ? dataset.workshopRules.filter((rule) =>
        ["root-cause-unknown", "problem-not-clearly-defined"].includes(rule.id)
      )
    : matchedRules;

  const candidateMap = new Map<string, GenerationCandidate>();

  seedRules.forEach((rule) => {
    candidateMap.set(
      rule.recommendedBlockId,
      createGenerationCandidate(
        dataset,
        rule,
        fallbackUsed ? "fallback" : "diagnosis-adapter",
        fallbackUsed
          ? "Fallback deterministic Workshop OS path."
          : `Direct match from mapped diagnosis answer to ${rule.rule}.`
      )
    );
  });

  seedRules.forEach((rule) => {
    rule.nextBlockIds.forEach((nextBlockId) => {
      if (candidateMap.has(nextBlockId)) {
        return;
      }

      const nextRule = dataset.workshopRules.find(
        (candidate) => candidate.recommendedBlockId === nextBlockId
      );

      if (!nextRule) {
        return;
      }

      candidateMap.set(
        nextBlockId,
        createGenerationCandidate(
          dataset,
          nextRule,
          "what-next",
          `Included because ${rule.rule} lists ${nextRule.rule} in What Next.`
        )
      );
    });
  });

  let usedDuration = 0;
  const selected: GenerationCandidate[] = [];
  const excluded: GenerationCandidate[] = [];
  const candidates = Array.from(candidateMap.values());

  candidates.forEach((candidate) => {
    if (!candidate.block) {
      excluded.push({
        ...candidate,
        excludedReason:
          "This rule matched, but it has no canonical activity relationship."
      });
      return;
    }

    if (
      durationLimit === undefined ||
      usedDuration + candidate.duration <= durationLimit
    ) {
      usedDuration += candidate.duration;
      selected.push(candidate);
      return;
    }

    excluded.push({
      ...candidate,
      excludedReason: `Adding ${candidate.block.title} would exceed the requested ${durationLimit}-minute workshop duration.`
    });
  });

  const warnings: string[] = [];

  if (!selected.length) {
    warnings.push(
      durationLimit !== undefined &&
        candidates.some((candidate) => candidate.block)
        ? `No compatible activities fit within the requested ${durationLimit}-minute workshop duration.`
        : "No compatible activities were found for this diagnosis."
    );
  }

  if (selected.length === 1) {
    warnings.push(
      "Only one compatible activity was found. The current canonical mappings do not contain enough linked activities to construct a full workshop."
    );
  }

  if (
    durationLimit !== undefined &&
    usedDuration < durationLimit &&
    selected.length > 0
  ) {
    warnings.push(
      "The generated sequence does not yet fill the requested workshop duration."
    );
  }

  return {
    candidates,
    excluded,
    fallbackUsed,
    matchedRules,
    selected,
    totalDuration: usedDuration,
    trace,
    warnings
  };
}

type StageSignal = { score: number; stage: string };

const diagnosisStageSignals: Record<string, StageSignal[]> = {
  "actionable-plan": [
    { score: 2, stage: "decide" },
    { score: 1, stage: "goals" }
  ],
  "align-a-team": [
    { score: 3, stage: "goals" },
    { score: 1, stage: "discuss" }
  ],
  "alignment-issues": [
    { score: 3, stage: "discuss" },
    { score: 1, stage: "goals" }
  ],
  "better-decisions": [
    { score: 3, stage: "decide" },
    { score: 1, stage: "evaluate" }
  ],
  "clear-alignment": [
    { score: 3, stage: "discuss" },
    { score: 1, stage: "goals" }
  ],
  "context-not-sure": [
    { score: 1, stage: "understand" },
    { score: 1, stage: "frame" }
  ],
  "create-an-action-plan": [{ score: 3, stage: "decide" }],
  "lack-of-ownership": [
    { score: 2, stage: "decide" },
    { score: 1, stage: "discuss" }
  ],
  "make-decisions": [
    { score: 3, stage: "decide" },
    { score: 1, stage: "evaluate" }
  ],
  "new-ideas": [{ score: 3, stage: "ideas" }],
  "not-sure": [
    { score: 2, stage: "understand" },
    { score: 2, stage: "frame" }
  ],
  "outcome-focus-priorities": [{ score: 3, stage: "evaluate" }],
  "outcome-not-sure-yet": [
    { score: 1, stage: "understand" },
    { score: 1, stage: "frame" }
  ],
  "performance-issues": [
    { score: 3, stage: "understand" },
    { score: 1, stage: "frame" }
  ],
  "slow-decision-making": [
    { score: 3, stage: "decide" },
    { score: 1, stage: "discuss" }
  ],
  "stronger-collaboration": [{ score: 3, stage: "discuss" }],
  "too-many-ideas": [{ score: 3, stage: "evaluate" }],
  "unclear-priorities": [
    { score: 3, stage: "evaluate" },
    { score: 1, stage: "decide" }
  ],
  "understand-a-problem": [
    { score: 3, stage: "understand" },
    { score: 1, stage: "frame" }
  ]
};

const stageOrder = [
  "goals",
  "understand",
  "frame",
  "ideas",
  "evaluate",
  "decide",
  "discuss"
];

function rankDiagnosisStages(
  selectedOptionIds: Record<string, string | string[]>
) {
  const scores = new Map(stageOrder.map((stage) => [stage, 0]));
  const questionScores = new Map(
    stageOrder.map((stage) => [stage, { challenges: 0, goals: 0, outcome: 0 }])
  );

  (["goals", "challenges", "outcome"] as const).forEach((questionId) => {
    const value = selectedOptionIds[questionId];
    const optionIds = Array.isArray(value) ? value : value ? [value] : [];

    optionIds.forEach((optionId) => {
      diagnosisStageSignals[optionId]?.forEach(({ score, stage }) => {
        scores.set(stage, (scores.get(stage) ?? 0) + score);
        questionScores.get(stage)![questionId] += score;
      });
    });
  });

  return stageOrder
    .map((stage) => ({ score: scores.get(stage) ?? 0, stage }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      const aQuestions = questionScores.get(a.stage)!;
      const bQuestions = questionScores.get(b.stage)!;

      return (
        b.score - a.score ||
        bQuestions.goals - aQuestions.goals ||
        bQuestions.challenges - aQuestions.challenges ||
        bQuestions.outcome - aQuestions.outcome ||
        stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage)
      );
    });
}

function resolveRouteCandidate(
  dataset: LibraryDataset,
  route: LibraryDataset["playbookRoutes"][number],
  reference: LibraryDataset["playbookRoutes"][number]["itemReferences"][number]
): GenerationCandidate | undefined {
  const block =
    reference.source === "building-block"
      ? dataset.buildingBlocks.find((item) => item.id === reference.id)
      : undefined;
  const activity =
    reference.source === "activity"
      ? dataset.activities.find((item) => item.id === reference.id)
      : undefined;
  const steps = block
    ? dataset.steps
        .filter((step) => step.parentId === block.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];
  const rule =
    route.provenanceRuleIds
      .map((id) => dataset.workshopRules.find((item) => item.id === id))
      .find((item) => item?.recommendedBlockId === block?.id) ??
    route.provenanceRuleIds
      .map((id) => dataset.workshopRules.find((item) => item.id === id))
      .find(Boolean) ??
    dataset.workshopRules[0];

  if ((!block && !activity) || !rule) {
    return undefined;
  }

  return {
    activity,
    block,
    canonicalItemId: reference.id,
    canonicalSource: reference.source,
    duration: block
      ? getBlockDuration(block, steps)
      : (activity?.durationMinutes ?? 0),
    orderReason: `Canonical order from playbook route ${route.id}.`,
    origin: "playbook-route",
    rule,
    steps
  };
}

/**
 * Constructs the complete initial PlayBooky recommendation without an
 * artificial duration cap. Directly matched blocks establish intent; only
 * canonically linked continuations with an unambiguous dependency are added.
 */
export function createRecommendedPlaybook(
  dataset: LibraryDataset,
  selectedOptionIds: Record<string, string | string[]>,
  constraints: { requestedDurationMinutes?: number } = {}
): GeneratedLibraryWorkshop {
  const generated = createLibraryWorkshop(dataset, selectedOptionIds);
  const optionIds = Object.values(selectedOptionIds).flatMap((value) =>
    Array.isArray(value) ? value : value ? [value] : []
  );
  const optionSet = new Set(optionIds);
  const outcomeSet = new Set(
    Array.isArray(selectedOptionIds.outcome)
      ? selectedOptionIds.outcome
      : selectedOptionIds.outcome
        ? [selectedOptionIds.outcome]
        : []
  );
  const matchedRuleIds = new Set(generated.matchedRules.map((rule) => rule.id));
  const stageRanking = rankDiagnosisStages(selectedOptionIds);
  const primaryStage = stageRanking[0]?.stage;
  const secondaryStage = stageRanking[1]?.stage;

  const routeMatches = dataset.playbookRoutes
    .map((route, index) => {
      const triggerMatches = route.triggerOptionIds.filter((id) =>
        optionSet.has(id)
      ).length;
      const outcomeMatches = route.outcomeOptionIds.filter((id) =>
        outcomeSet.has(id)
      ).length;
      const ruleMatches = route.provenanceRuleIds.filter((id) =>
        matchedRuleIds.has(id)
      ).length;
      const durationFits =
        constraints.requestedDurationMinutes === undefined ||
        (route.naturalDurationMinutes ?? Number.POSITIVE_INFINITY) <=
          constraints.requestedDurationMinutes;
      const score =
        triggerMatches * 10 +
        outcomeMatches * 5 +
        ruleMatches * 2 +
        (route.primaryStage === primaryStage ? 4 : 0) +
        (route.secondaryStage === secondaryStage ? 2 : 0);

      return {
        durationFits,
        index,
        outcomeMatches,
        route,
        score,
        triggerMatches
      };
    })
    .filter((match) => match.triggerMatches > 0 && match.durationFits)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.outcomeMatches - a.outcomeMatches ||
        a.index - b.index
    );

  const selectedRoute = routeMatches[0]?.route;
  const resolved =
    selectedRoute?.itemReferences.map((reference) =>
      resolveRouteCandidate(dataset, selectedRoute, reference)
    ) ?? [];
  const selected = resolved.filter(Boolean) as GenerationCandidate[];
  const routeIsValid =
    Boolean(selectedRoute) &&
    selected.length === selectedRoute?.itemReferences.length &&
    selected.length >= 2 &&
    selected.length <= 7 &&
    selected.length >= (selectedRoute?.minimumActivities ?? 2) &&
    selected.length <= (selectedRoute?.maximumActivities ?? 7);
  const totalDuration = routeIsValid
    ? selected.reduce((total, candidate) => total + candidate.duration, 0)
    : 0;
  const warnings = routeIsValid
    ? []
    : [
        constraints.requestedDurationMinutes !== undefined &&
        dataset.playbookRoutes.some((route) =>
          route.triggerOptionIds.some((id) => optionSet.has(id))
        )
          ? `No complete canonical playbook route fits the requested ${constraints.requestedDurationMinutes}-minute duration.`
          : "The supplied intent does not yet resolve to a complete canonical playbook route of 2–7 activities."
      ];

  return {
    ...generated,
    excluded: generated.excluded,
    selected: routeIsValid ? selected : [],
    selectedRoute: routeIsValid ? selectedRoute : undefined,
    stageRanking,
    totalDuration,
    warnings
  };
}
