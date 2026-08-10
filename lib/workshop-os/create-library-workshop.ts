import type {
  BuildingBlockRecord,
  BuildingBlockStepRecord,
  LibraryDataset,
  WorkshopRuleRecord
} from "@/lib/product-system/library-read-model";

export type GenerationCandidate = {
  block?: BuildingBlockRecord;
  duration: number;
  excludedReason?: string;
  orderReason: string;
  origin: "diagnosis-adapter" | "fallback" | "what-next";
  rule: WorkshopRuleRecord;
  steps: BuildingBlockStepRecord[];
};

export type GeneratedLibraryWorkshop = {
  candidates: GenerationCandidate[];
  excluded: GenerationCandidate[];
  fallbackUsed: boolean;
  matchedRules: WorkshopRuleRecord[];
  selected: GenerationCandidate[];
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
  "slow-decision-making": ["need-clear-priorities", "need-alignment-on-options"],
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

const playbookSequenceOrder: Record<string, number> = {
  "block-objectives-and-key-results-okrs": 10,
  "block-five-whys": 20,
  "block-problem-statement": 30,
  "block-how-might-we": 40,
  "block-theme-sort": 50,
  "block-impact-effort-map": 60,
  "block-priority-map": 70,
  "block-dot-vote": 80,
  "block-blind-vote": 80,
  "block-start-stop-continue": 90,
  "block-who-what-when": 100
};

const justifiedContinuationBlocks: Record<string, string[]> = {
  "need-more-ideas": ["block-impact-effort-map", "block-priority-map"],
  "root-cause-unknown": ["block-problem-statement"],
  "too-many-opportunities": ["block-priority-map"]
};

function isJustifiedContinuation(
  candidate: GenerationCandidate,
  matchedRuleIds: Set<string>
) {
  const blockId = candidate.block?.id;

  if (!blockId || candidate.origin !== "what-next") {
    return candidate.origin !== "what-next";
  }

  return Array.from(matchedRuleIds).some((ruleId) =>
    justifiedContinuationBlocks[ruleId]?.includes(blockId)
  );
}

/**
 * Constructs the complete initial PlayBooky recommendation without an
 * artificial duration cap. Directly matched blocks establish intent; only
 * canonically linked continuations with an unambiguous dependency are added.
 */
export function createRecommendedPlaybook(
  dataset: LibraryDataset,
  selectedOptionIds: Record<string, string | string[]>
): GeneratedLibraryWorkshop {
  const generated = createLibraryWorkshop(dataset, selectedOptionIds);
  const hasSelectedIntent = Object.values(selectedOptionIds).some((selected) =>
    Array.isArray(selected) ? selected.length > 0 : Boolean(selected)
  );

  if (generated.fallbackUsed && hasSelectedIntent) {
    return {
      ...generated,
      excluded: [
        ...generated.excluded,
        ...generated.selected.map((candidate) => ({
          ...candidate,
          excludedReason:
            "Discovery fallback was not applied because the supplied intent has no approved canonical recommendation mapping."
        }))
      ],
      selected: [],
      totalDuration: 0,
      warnings: [
        "The supplied intent does not yet have enough approved canonical recommendation logic to construct a playbook."
      ]
    };
  }

  const matchedRuleIds = new Set(generated.matchedRules.map((rule) => rule.id));
  const ambiguousContinuations = generated.selected.filter(
    (candidate) => !isJustifiedContinuation(candidate, matchedRuleIds)
  );
  const selected = generated.selected
    .filter((candidate) => isJustifiedContinuation(candidate, matchedRuleIds))
    .map((candidate, index) => ({ candidate, index }))
    .sort((a, b) => {
      const orderA = a.candidate.block
        ? (playbookSequenceOrder[a.candidate.block.id] ?? 50)
        : 50;
      const orderB = b.candidate.block
        ? (playbookSequenceOrder[b.candidate.block.id] ?? 50)
        : 50;

      return orderA - orderB || a.index - b.index;
    })
    .map(({ candidate }) => candidate);
  const totalDuration = selected.reduce(
    (total, candidate) => total + candidate.duration,
    0
  );
  const warnings = generated.warnings.filter(
    (warning) => !warning.includes("Only one compatible activity")
  );

  if (selected.length === 1) {
    const onlyBlockId = selected[0]?.block?.id;

    warnings.push(
      onlyBlockId === "block-who-what-when"
        ? "Action-plan intent did not provide enough upstream workshop context to construct a complete multi-activity playbook."
        : "Only one canonical activity is justified by the current recommendation signals."
    );
  }

  return {
    ...generated,
    excluded: [
      ...generated.excluded,
      ...ambiguousContinuations.map((candidate) => ({
        ...candidate,
        excludedReason:
          "This What Next relationship is a candidate continuation, but the canonical model does not establish it as required for this playbook."
      }))
    ],
    selected,
    totalDuration,
    warnings
  };
}
