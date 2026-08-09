export type FacilitatorGuideDemoPreset = {
  description: string;
  durationMinutes: number;
  id: string;
  label: string;
  selections: Record<string, string>;
};

/**
 * Stress-test diagnosis presets for the live Facilitator Guide.
 * Uses Active Library diagnosis → Workshop Design Logic packing.
 */
export const facilitatorGuideDemoPresets: FacilitatorGuideDemoPreset[] = [
  {
    id: "discovery-120",
    label: "Discovery · 120 min",
    description:
      "Understand a problem + performance issues. Expect Five Whys → Problem Statement when duration allows.",
    durationMinutes: 120,
    selections: {
      challenges: "performance-issues",
      goals: "understand-a-problem",
      outcome: "clear-alignment"
    }
  },
  {
    id: "discovery-150",
    label: "Discovery · 150 min",
    description:
      "Same discovery diagnosis at 150 minutes — tests whether packing fills the extra time.",
    durationMinutes: 150,
    selections: {
      challenges: "performance-issues",
      goals: "understand-a-problem",
      outcome: "clear-alignment"
    }
  },
  {
    id: "prioritisation-120",
    label: "Prioritisation · 120 min",
    description:
      "Focus priorities + too many ideas. Stresses priority / opportunity mapping paths.",
    durationMinutes: 120,
    selections: {
      challenges: "too-many-ideas",
      goals: "make-decisions",
      outcome: "outcome-focus-priorities"
    }
  },
  {
    id: "prioritisation-150",
    label: "Prioritisation · 150 min",
    description:
      "Same prioritisation diagnosis at 150 minutes for duration packing comparison.",
    durationMinutes: 150,
    selections: {
      challenges: "too-many-ideas",
      goals: "make-decisions",
      outcome: "outcome-focus-priorities"
    }
  },
  {
    id: "action-120",
    label: "Action planning · 120 min",
    description:
      "Create an action plan + lack of ownership. Tests ownership / next-step activities.",
    durationMinutes: 120,
    selections: {
      challenges: "lack-of-ownership",
      goals: "create-an-action-plan",
      outcome: "actionable-plan"
    }
  },
  {
    id: "action-150",
    label: "Action planning · 150 min",
    description:
      "Same action-planning diagnosis at 150 minutes for duration packing comparison.",
    durationMinutes: 150,
    selections: {
      challenges: "lack-of-ownership",
      goals: "create-an-action-plan",
      outcome: "actionable-plan"
    }
  }
];
