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
  durationLimit: number
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

  Array.from(candidateMap.values()).forEach((candidate) => {
    if (!candidate.block) {
      excluded.push({
        ...candidate,
        excludedReason:
          "This rule matched, but it has no canonical activity relationship."
      });
      return;
    }

    if (
      usedDuration + candidate.duration <= durationLimit ||
      selected.length === 0
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
    warnings.push("No compatible activities were found for this diagnosis.");
  }

  if (selected.length === 1) {
    warnings.push(
      "Only one compatible activity was found. The current canonical mappings do not contain enough linked activities to construct a full workshop."
    );
  }

  if (usedDuration < durationLimit && selected.length > 0) {
    warnings.push(
      "The generated sequence does not yet fill the requested workshop duration."
    );
  }

  return {
    candidates: Array.from(candidateMap.values()),
    excluded,
    fallbackUsed,
    matchedRules,
    selected,
    totalDuration: usedDuration,
    trace,
    warnings
  };
}
