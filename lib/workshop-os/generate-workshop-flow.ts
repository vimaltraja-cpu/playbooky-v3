import {
  buildingBlocks,
  buildingBlockSteps,
  exampleDiagnosis,
  workshopDesignLogicRules
} from "./fixtures";
import type {
  BuildingBlock,
  Diagnosis,
  GeneratedWorkshopFlow,
  WorkshopDesignLogicRule,
  WorkshopFlowBlock
} from "./types";

function getBlock(blockId: string) {
  const block = buildingBlocks.find((item) => item.id === blockId);

  if (!block) {
    throw new Error(`Workshop OS fixture is missing building block: ${blockId}`);
  }

  return block;
}

function getRule(ruleId: string) {
  const rule = workshopDesignLogicRules.find((item) => item.id === ruleId);

  if (!rule) {
    throw new Error(`Workshop OS fixture is missing design logic rule: ${ruleId}`);
  }

  return rule;
}

function getStepsForBlock(blockId: string) {
  return buildingBlockSteps
    .filter((step) => step.parentBlockId === blockId)
    .sort((first, second) => first.order - second.order);
}

function createFlowBlock(
  block: BuildingBlock,
  rule: WorkshopDesignLogicRule,
  orderOffset: number
): WorkshopFlowBlock {
  const steps = getStepsForBlock(block.id);

  return {
    blockId: block.id,
    durationMinutes: steps.reduce(
      (total, step) => total + step.durationMinutes,
      0
    ),
    expectedOutputs: rule.expectedOutputs,
    name: block.name,
    reason: rule.reason,
    stage: block.stages[0],
    steps: steps.map((step, index) => ({
      durationMinutes: step.durationMinutes,
      facilitatorNotes: step.facilitatorNotes,
      instructions: step.instructions,
      name: step.name,
      order: orderOffset + index + 1,
      sourceStepId: step.id
    }))
  };
}

export function generateExampleWorkshopFlow(
  diagnosis: Diagnosis = exampleDiagnosis
): GeneratedWorkshopFlow {
  const rootCauseRule = getRule("root-cause-unknown");
  const problemStatementRule = getRule("problem-not-clearly-defined");
  const selectedRules = [rootCauseRule, problemStatementRule];
  const selectedBlocks = selectedRules.map((rule) =>
    getBlock(rule.recommendedBlockId)
  );

  let orderOffset = 0;
  const agenda = selectedBlocks.map((block, index) => {
    const flowBlock = createFlowBlock(block, selectedRules[index], orderOffset);
    orderOffset += flowBlock.steps.length;
    return flowBlock;
  });
  const totalStepDurationMinutes = agenda.reduce(
    (total, block) => total + block.durationMinutes,
    0
  );

  return {
    agenda,
    createdFrom: {
      designLogicRuleIds: selectedRules.map((rule) => rule.id),
      fixtureId: "discovery-root-cause-to-problem-statement",
      source: "deterministic-local-stub"
    },
    diagnosis,
    durationMinutes: diagnosis.input.constraints.durationMinutes,
    id: "generated-flow-discovery-root-cause",
    objective:
      "Help the team understand likely root causes behind the onboarding drop and turn that understanding into a clear problem statement.",
    participantCount: diagnosis.input.constraints.participantCount,
    successCriteria: [
      "The team has a shared understanding of likely root causes.",
      "The team selects a clear problem statement for future work.",
      "The workshop fits within the stated time and remote delivery constraints."
    ],
    title: "Root Cause Discovery Workshop",
    totalStepDurationMinutes
  };
}

export const exampleGeneratedWorkshopFlow = generateExampleWorkshopFlow();
