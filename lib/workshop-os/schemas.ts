import { stepTypeIds } from "./step-types";
import { workshopStageIds } from "./types";

type FieldSchema = {
  description: string;
  required: boolean;
  type: string;
};

export type ObjectSchema = {
  description: string;
  fields: Record<string, FieldSchema>;
  name: string;
};

export const workshopOsSchemas = {
  buildingBlock: {
    description:
      "Reusable facilitation unit selected by Workshop Design Logic and expanded into ordered steps.",
    fields: {
      energyLevel: {
        description: "Expected participant energy for the block.",
        required: true,
        type: "string"
      },
      id: {
        description: "Stable kebab-case identifier.",
        required: true,
        type: "string"
      },
      inputs: {
        description: "Inputs required before the block can run.",
        required: true,
        type: "string[]"
      },
      name: {
        description: "Human-readable block name.",
        required: true,
        type: "string"
      },
      outcomes: {
        description: "Outcome categories this block supports.",
        required: true,
        type: "string[]"
      },
      outputs: {
        description: "Concrete outputs produced by the block.",
        required: true,
        type: "string[]"
      },
      preparationNeeded: {
        description: "Facilitator preparation required before running.",
        required: true,
        type: "string"
      },
      purpose: {
        description: "Why the block exists.",
        required: true,
        type: "string"
      },
      stages: {
        description: `One or more Workshop OS stages: ${workshopStageIds.join(", ")}.`,
        required: true,
        type: "WorkshopStageId[]"
      },
      typicalDurationMinutes: {
        description: "Typical block duration in minutes.",
        required: true,
        type: "number"
      },
      type: {
        description:
          "Whether the block is an activity, technique, hybrid, or synthesis unit.",
        required: true,
        type: "BuildingBlockType"
      }
    },
    name: "BuildingBlock"
  },
  buildingBlockStep: {
    description:
      "Ordered executable instruction that makes a building block runnable inside a workshop.",
    fields: {
      durationMinutes: {
        description: "Step duration in minutes.",
        required: true,
        type: "number"
      },
      facilitatorNotes: {
        description: "Guidance for the facilitator.",
        required: true,
        type: "string"
      },
      id: {
        description: "Stable kebab-case step identifier.",
        required: true,
        type: "string"
      },
      instructions: {
        description: "Participant-facing or facilitator-facing step instructions.",
        required: true,
        type: "string"
      },
      name: {
        description: "Human-readable step name.",
        required: true,
        type: "string"
      },
      order: {
        description: "Order within the parent building block.",
        required: true,
        type: "number"
      },
      parentBlockId: {
        description: "BuildingBlock id this step belongs to.",
        required: true,
        type: "string"
      },
      purpose: {
        description: "Why this step exists in the block.",
        required: true,
        type: "string"
      },
      stepType: {
        description: `Dominant participant behaviour for this executable step: ${stepTypeIds.join(", ")}.`,
        required: true,
        type: "StepTypeId"
      },
      techniqueUsed: {
        description: "Optional facilitation technique used by the step.",
        required: false,
        type: "string"
      }
    },
    name: "BuildingBlockStep"
  },
  diagnosis: {
    description:
      "Structured interpretation of a user challenge before workshop design begins.",
    fields: {
      confidence: {
        description: "Confidence level derived from stage score spread.",
        required: true,
        type: "DiagnosisConfidence"
      },
      input: {
        description: "Original challenge, state, blockers, desired outcome, and constraints.",
        required: true,
        type: "DiagnosisInput"
      },
      primaryStage: {
        description: "Highest-scoring Workshop OS stage.",
        required: true,
        type: "WorkshopStageId"
      },
      recommendedFocus: {
        description: "Plain-language summary of what the workshop should focus on.",
        required: true,
        type: "string"
      },
      secondaryStage: {
        description: "Second-highest-scoring Workshop OS stage.",
        required: true,
        type: "WorkshopStageId"
      },
      stageScores: {
        description: "Scores for each Workshop OS stage.",
        required: true,
        type: "DiagnosisStageScore[]"
      }
    },
    name: "Diagnosis"
  },
  generatedWorkshopFlow: {
    description:
      "Executable workshop structure produced by deterministic local generation.",
    fields: {
      agenda: {
        description: "Ordered building blocks with executable steps.",
        required: true,
        type: "WorkshopFlowBlock[]"
      },
      createdFrom: {
        description: "Traceability metadata for the local stub.",
        required: true,
        type: "object"
      },
      diagnosis: {
        description: "Diagnosis used to generate the flow.",
        required: true,
        type: "Diagnosis"
      },
      durationMinutes: {
        description: "Target workshop duration.",
        required: true,
        type: "number"
      },
      id: {
        description: "Stable generated flow identifier.",
        required: true,
        type: "string"
      },
      objective: {
        description: "Workshop objective.",
        required: true,
        type: "string"
      },
      participantCount: {
        description: "Expected number of participants.",
        required: true,
        type: "number"
      },
      successCriteria: {
        description: "Conditions that make the workshop successful.",
        required: true,
        type: "string[]"
      },
      title: {
        description: "Human-readable workshop title.",
        required: true,
        type: "string"
      },
      totalStepDurationMinutes: {
        description: "Sum of all generated step durations.",
        required: true,
        type: "number"
      }
    },
    name: "GeneratedWorkshopFlow"
  },
  workshopDesignLogic: {
    description:
      "Rule that maps a diagnosed situation to a recommended building block and next moves.",
    fields: {
      expectedOutputs: {
        description: "Outputs expected from the recommended block.",
        required: true,
        type: "string[]"
      },
      id: {
        description: "Stable kebab-case rule identifier.",
        required: true,
        type: "string"
      },
      nextBlockIds: {
        description: "Suggested follow-on building blocks.",
        required: true,
        type: "string[]"
      },
      reason: {
        description: "Why this rule recommends the block.",
        required: true,
        type: "string"
      },
      recommendedBlockId: {
        description: "Primary building block selected by this rule.",
        required: true,
        type: "string"
      },
      rule: {
        description: "Rule name from Workshop Design Logic.",
        required: true,
        type: "string"
      },
      situation: {
        description: "Situation or signal this rule handles.",
        required: true,
        type: "string"
      }
    },
    name: "WorkshopDesignLogicRule"
  }
} as const satisfies Record<string, ObjectSchema>;
