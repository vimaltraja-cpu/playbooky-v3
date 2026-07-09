export const workshopStageIds = [
  "goals",
  "understand",
  "frame",
  "ideas",
  "evaluate",
  "decide",
  "discuss"
] as const;

export type WorkshopStageId = (typeof workshopStageIds)[number];

export type DiagnosisConfidence = "high" | "medium" | "low";

export type DeliveryMode = "remote" | "in-person" | "hybrid";

/**
 * User-provided challenge context consumed before Workshop OS designs anything.
 */
export type DiagnosisInput = {
  blockers: string[];
  challenge: string;
  constraints: {
    deliveryMode: DeliveryMode;
    durationMinutes: number;
    participantCount: number;
    stakeholdersPresent?: boolean;
  };
  currentState: string[];
  desiredOutcome: string;
};

export type DiagnosisStageScore = {
  score: number;
  stage: WorkshopStageId;
};

/**
 * Structured interpretation of the user challenge.
 * Diagnosis does not select UI or render a workshop; it prepares the signal
 * that workshop design logic can use.
 */
export type Diagnosis = {
  confidence: DiagnosisConfidence;
  input: DiagnosisInput;
  primaryStage: WorkshopStageId;
  recommendedFocus: string;
  secondaryStage: WorkshopStageId;
  stageScores: DiagnosisStageScore[];
};

export type BuildingBlockType =
  | "activity"
  | "hybrid"
  | "synthesis"
  | "technique";

/**
 * Engine/execution language.
 * A Building Block is selected by Workshop OS and expanded into ordered
 * Building Block Steps. It is distinct from Activity, which is user-facing
 * library language.
 */
export type BuildingBlock = {
  energyLevel: string;
  id: string;
  inputs: string[];
  name: string;
  outcomes: string[];
  outputs: string[];
  preparationNeeded: string;
  purpose: string;
  stages: WorkshopStageId[];
  typicalDurationMinutes: number;
  type: BuildingBlockType;
};

/**
 * Ordered runnable instruction inside a Building Block.
 * Steps are what make a generated workshop executable.
 */
export type BuildingBlockStep = {
  durationMinutes: number;
  facilitatorNotes: string;
  id: string;
  instructions: string;
  name: string;
  order: number;
  parentBlockId: string;
  purpose: string;
  techniqueUsed?: string;
};

/**
 * Rule that maps diagnosed situations to executable Building Blocks.
 */
export type WorkshopDesignLogicRule = {
  expectedOutputs: string[];
  id: string;
  nextBlockIds: string[];
  reason: string;
  recommendedBlockId: string;
  rule: string;
  situation: string;
};

/**
 * Executable step inside a generated workshop flow.
 */
export type WorkshopFlowStep = {
  durationMinutes: number;
  facilitatorNotes: string;
  instructions: string;
  name: string;
  order: number;
  sourceStepId: string;
};

/**
 * A selected Building Block expanded into runnable flow steps.
 */
export type WorkshopFlowBlock = {
  blockId: string;
  durationMinutes: number;
  expectedOutputs: string[];
  name: string;
  reason: string;
  stage: WorkshopStageId;
  steps: WorkshopFlowStep[];
};

/**
 * Workshop OS output contract.
 * This represents an executable workshop flow, not activity-card metadata.
 * Activity Cards may present parts of this data later, but they do not own it.
 */
export type GeneratedWorkshopFlow = {
  agenda: WorkshopFlowBlock[];
  createdFrom: {
    designLogicRuleIds: string[];
    fixtureId: string;
    source: "deterministic-local-stub";
  };
  diagnosis: Diagnosis;
  durationMinutes: number;
  id: string;
  objective: string;
  participantCount: number;
  successCriteria: string[];
  title: string;
  totalStepDurationMinutes: number;
};
