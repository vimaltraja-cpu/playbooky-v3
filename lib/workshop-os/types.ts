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

export type WorkshopDesignLogicRule = {
  expectedOutputs: string[];
  id: string;
  nextBlockIds: string[];
  reason: string;
  recommendedBlockId: string;
  rule: string;
  situation: string;
};

export type WorkshopFlowStep = {
  durationMinutes: number;
  facilitatorNotes: string;
  instructions: string;
  name: string;
  order: number;
  sourceStepId: string;
};

export type WorkshopFlowBlock = {
  blockId: string;
  durationMinutes: number;
  expectedOutputs: string[];
  name: string;
  reason: string;
  stage: WorkshopStageId;
  steps: WorkshopFlowStep[];
};

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
