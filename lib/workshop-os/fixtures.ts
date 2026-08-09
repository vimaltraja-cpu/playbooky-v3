import type {
  BuildingBlock,
  BuildingBlockStep,
  Diagnosis,
  DiagnosisInput,
  WorkshopDesignLogicRule
} from "./types";

function list(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const workshopOsFixtureSource = {
  buildingBlockLibrary:
    "docs/notion-export/02-Building Block Library/Building Block Library/Building Block Library 373eb253b7f680e38c27f34d05e5e025.csv",
  buildingBlockSteps:
    "docs/notion-export/03-Building Block Steps/Building Block Steps/Building Block Steps 373eb253b7f680b3a60bd26cb0c144dc.csv",
  workshopDesignLogic:
    "docs/notion-export/04-Workshop Design Logic/Workshop Design Logic/Workshop Design Logic 373eb253b7f680e3ac4bcd95465b414a.csv"
} as const;

export const buildingBlocks: BuildingBlock[] = [
  {
    energyLevel: "Medium",
    id: "theme-sort",
    inputs: list("Assumptions, Ideas, Insights, Opportunities, Research"),
    name: "Theme Sort",
    outcomes: list("Alignment, Opportunity discovery, Problem clarity"),
    outputs: list("Insights, Themes"),
    preparationNeeded:
      "Prepare a board or workspace where notes can be moved freely.",
    purpose:
      "Group similar ideas, observations or pieces of information into meaningful themes to reveal patterns and support discussion.",
    stages: ["discuss", "evaluate", "frame", "ideas", "understand"],
    typicalDurationMinutes: 15,
    type: "technique"
  },
  {
    energyLevel: "Low",
    id: "blind-vote",
    inputs: list("Options, Recommendations, Priorities"),
    name: "Blind Vote",
    outcomes: list("Decision, Prioritisation"),
    outputs: list("Decision, Prioritised list"),
    preparationNeeded: "Prepare voting areas and clear decision options.",
    purpose:
      "Allow participants to make independent decisions without being influenced by dominant voices, hierarchy or groupthink.",
    stages: ["decide", "discuss", "evaluate", "frame", "goals"],
    typicalDurationMinutes: 5,
    type: "technique"
  },
  {
    energyLevel: "Low",
    id: "parking-lot",
    inputs: list("Questions, Risks, Tangents"),
    name: "Parking Lot",
    outcomes: list("Focus, Risk capture"),
    outputs: list("Next steps, Risks"),
    preparationNeeded: "Create a visible parking lot area.",
    purpose:
      "Capture off-topic questions, risks or ideas without derailing the workshop.",
    stages: ["decide", "discuss"],
    typicalDurationMinutes: 5,
    type: "technique"
  },
  {
    energyLevel: "Medium",
    id: "who-what-when",
    inputs: list("Decisions, Ideas, Recommendations"),
    name: "Who, What, When",
    outcomes: list("Commitment, Ownership"),
    outputs: list("Action plan, Next steps, Ownership"),
    preparationNeeded: "Prepare columns for owner, action, and date.",
    purpose:
      "Turn decisions, ideas or recommendations into clear actions with ownership and accountability.",
    stages: ["decide", "discuss"],
    typicalDurationMinutes: 15,
    type: "technique"
  },
  {
    energyLevel: "Medium",
    id: "dot-vote",
    inputs: list("Options, Ideas, Opportunities"),
    name: "Dot Vote",
    outcomes: list("Prioritisation"),
    outputs: list("Prioritised list"),
    preparationNeeded: "Prepare voting dots and clear options.",
    purpose:
      "Quickly identify group preferences by allowing participants to distribute votes across multiple options.",
    stages: ["decide", "evaluate"],
    typicalDurationMinutes: 10,
    type: "technique"
  },
  {
    energyLevel: "Medium",
    id: "five-whys",
    inputs: list("Problem, Symptom, Evidence"),
    name: "Five Whys",
    outcomes: list("Root cause clarity, Shared understanding"),
    outputs: list("Insights, Root causes"),
    preparationNeeded:
      "Prepare a linear board for the problem and five layers of causes.",
    purpose:
      "Explore the underlying causes of a problem by repeatedly asking why it is occurring.",
    stages: ["frame", "understand"],
    typicalDurationMinutes: 45,
    type: "hybrid"
  },
  {
    energyLevel: "Medium",
    id: "objectives-and-key-results",
    inputs: list("Business goal, Stakeholders, Team context"),
    name: "Objectives and Key Results (OKRs)",
    outcomes: list("Alignment, Goal setting, Success measurement"),
    outputs: list("Key results, Objective, Success metrics"),
    preparationNeeded:
      "Ask participants to submit one proposed objective before the workshop.",
    purpose:
      "Create alignment around a shared objective and define measurable indicators of success.",
    stages: ["goals"],
    typicalDurationMinutes: 60,
    type: "activity"
  },
  {
    energyLevel: "Medium",
    id: "problem-statement",
    inputs: list("Evidence, Research, Observations"),
    name: "Problem Statement",
    outcomes: list("Problem clarity, Shared framing"),
    outputs: list("Problem statement"),
    preparationNeeded:
      "Prepare areas for evidence review, statement drafting, and selection.",
    purpose:
      "Create a clear and shared understanding of the problem that needs to be solved.",
    stages: ["frame"],
    typicalDurationMinutes: 60,
    type: "activity"
  },
  {
    energyLevel: "High",
    id: "how-might-we",
    inputs: list("Problem statement, Insights, Opportunities"),
    name: "How Might We",
    outcomes: list("Opportunity framing, Ideation readiness"),
    outputs: list("Ideas, Opportunities"),
    preparationNeeded: "Prepare space for reframed opportunity questions.",
    purpose:
      "Reframe problems into opportunity-focused questions that encourage solution exploration.",
    stages: ["frame", "ideas"],
    typicalDurationMinutes: 40,
    type: "activity"
  },
  {
    energyLevel: "Medium",
    id: "impact-effort-map",
    inputs: list("Ideas, Opportunities, Actions"),
    name: "Impact Effort Map",
    outcomes: list("Decision quality, Prioritisation"),
    outputs: list("Decision, Prioritised list"),
    preparationNeeded: "Prepare an impact and effort matrix.",
    purpose:
      "Evaluate opportunities, ideas or actions by comparing their expected impact against the effort required to deliver them.",
    stages: ["decide", "evaluate"],
    typicalDurationMinutes: 45,
    type: "hybrid"
  },
  {
    energyLevel: "Medium",
    id: "priority-map",
    inputs: list("Options, Opportunities, Criteria"),
    name: "Priority Map",
    outcomes: list("Prioritisation, Alignment"),
    outputs: list("Decision, Prioritised list"),
    preparationNeeded: "Prepare priority criteria and a comparison area.",
    purpose:
      "Help teams compare options and agree what should be prioritised first.",
    stages: ["decide", "evaluate"],
    typicalDurationMinutes: 45,
    type: "hybrid"
  },
  {
    energyLevel: "Medium",
    id: "start-stop-continue",
    inputs: list("Behaviours, Processes, Ways of working"),
    name: "Start Stop Continue",
    outcomes: list("Reflection, Team alignment"),
    outputs: list("Action plan, Insights, Next steps"),
    preparationNeeded: "Prepare Start, Stop, and Continue columns.",
    purpose:
      "Reflect on current behaviours, processes or ways of working and identify what should start, stop or continue.",
    stages: ["discuss", "evaluate"],
    typicalDurationMinutes: 65,
    type: "hybrid"
  }
];

export const buildingBlockSteps: BuildingBlockStep[] = [
  {
    durationMinutes: 5,
    facilitatorNotes: "Keep the problem specific and observable.",
    id: "five-whys-define-the-problem",
    instructions:
      "Introduce the symptom or problem and ask the group to agree the exact wording before exploring causes.",
    name: "Define the Problem",
    order: 1,
    parentBlockId: "five-whys",
    purpose:
      "Create a shared understanding of the problem that will be explored during the activity.",
    stepType: "define"
  },
  {
    durationMinutes: 5,
    facilitatorNotes: "Capture the most immediate cause without debating solutions.",
    id: "five-whys-why-1",
    instructions: "Ask why the problem is happening and capture the first cause.",
    name: "Why #1",
    order: 2,
    parentBlockId: "five-whys",
    purpose: "Identify the most immediate cause of the problem.",
    stepType: "explore"
  },
  {
    durationMinutes: 5,
    facilitatorNotes: "Push beyond the first answer if it sounds like a symptom.",
    id: "five-whys-why-2",
    instructions:
      "Ask why the first cause is happening and capture the next layer.",
    name: "Why #2",
    order: 3,
    parentBlockId: "five-whys",
    purpose: "Explore the underlying cause of the first identified cause.",
    stepType: "explore"
  },
  {
    durationMinutes: 5,
    facilitatorNotes: "Keep the chain linked to evidence where possible.",
    id: "five-whys-why-3",
    instructions: "Ask why again and identify deeper contributing factors.",
    name: "Why #3",
    order: 4,
    parentBlockId: "five-whys",
    purpose:
      "Continue exploring deeper causes to move beyond surface-level explanations.",
    stepType: "explore"
  },
  {
    durationMinutes: 5,
    facilitatorNotes: "Look for systemic or organisational causes.",
    id: "five-whys-why-4",
    instructions: "Ask why a fourth time and capture systemic contributors.",
    name: "Why #4",
    order: 5,
    parentBlockId: "five-whys",
    purpose:
      "Explore deeper systemic causes and identify factors contributing to the problem.",
    stepType: "explore"
  },
  {
    durationMinutes: 5,
    facilitatorNotes: "Do not force one root cause if the group finds several.",
    id: "five-whys-why-5",
    instructions: "Ask why a final time and identify likely root causes.",
    name: "Why #5",
    order: 6,
    parentBlockId: "five-whys",
    purpose:
      "Identify the root cause or causes that the group believes are driving the problem.",
    stepType: "explore"
  },
  {
    durationMinutes: 5,
    facilitatorNotes: "Confirm the causal chain with the room.",
    id: "five-whys-review-root-causes",
    instructions: "Review the chain of causes and agree which root causes matter most.",
    name: "Review Root Causes",
    order: 7,
    parentBlockId: "five-whys",
    purpose:
      "Review the chain of causes and confirm the root cause or causes identified by the group.",
    stepType: "confirm"
  },
  {
    durationMinutes: 10,
    facilitatorNotes: "Translate root causes into useful next moves.",
    id: "five-whys-define-next-steps",
    instructions: "Agree how the root causes should inform the next activity.",
    name: "Define Next Steps",
    order: 8,
    parentBlockId: "five-whys",
    purpose:
      "Agree how the root causes will be used to inform future activities or decisions.",
    stepType: "commit"
  },
  {
    durationMinutes: 10,
    facilitatorNotes: "Anchor the discussion in evidence before writing statements.",
    id: "problem-statement-review-context-evidence",
    instructions:
      "Review the evidence, research, and observations that led to the workshop.",
    name: "Review Context & Evidence",
    order: 1,
    parentBlockId: "problem-statement",
    purpose:
      "Create a shared understanding of the evidence, research and observations that led to the workshop.",
    stepType: "review"
  },
  {
    durationMinutes: 10,
    facilitatorNotes: "Encourage multiple interpretations before converging.",
    id: "problem-statement-capture-problem-statements",
    instructions: "Ask participants to draft possible problem statements.",
    name: "Capture Problem Statements",
    order: 2,
    parentBlockId: "problem-statement",
    purpose: "Generate multiple perspectives on what the problem actually is.",
    stepType: "capture"
  },
  {
    durationMinutes: 15,
    facilitatorNotes: "Cluster similar statements without editing too early.",
    id: "problem-statement-theme-sort",
    instructions:
      "Group similar problem statements and identify shared themes.",
    name: "Theme Sort Problem Statements",
    order: 3,
    parentBlockId: "problem-statement",
    purpose:
      "Identify common themes and patterns across the submitted problem statements.",
    stepType: "cluster",
    techniqueUsed: "Theme Sort"
  },
  {
    durationMinutes: 10,
    facilitatorNotes: "Draft statements that are specific enough to guide work.",
    id: "problem-statement-draft",
    instructions:
      "Create a small number of candidate problem statements from the strongest themes.",
    name: "Draft Problem Statements",
    order: 4,
    parentBlockId: "problem-statement",
    purpose:
      "Create a small number of candidate problem statements based on the themes identified.",
    stepType: "create"
  },
  {
    durationMinutes: 10,
    facilitatorNotes: "Remove vague wording and merge overlap.",
    id: "problem-statement-refine-consolidate",
    instructions: "Refine the strongest statements into a concise shortlist.",
    name: "Refine & Consolidate",
    order: 5,
    parentBlockId: "problem-statement",
    purpose:
      "Refine the strongest candidate statements and consolidate them into a shortlist.",
    stepType: "refine"
  },
  {
    durationMinutes: 5,
    facilitatorNotes: "Make the final choice explicit.",
    id: "problem-statement-select",
    instructions:
      "Select the problem statement that will guide future activities.",
    name: "Select Problem Statement",
    order: 6,
    parentBlockId: "problem-statement",
    purpose:
      "Align on the problem statement that will guide future activities.",
    stepType: "vote"
  }
];

export const workshopDesignLogicRules: WorkshopDesignLogicRule[] = [
  {
    expectedOutputs: list("Key results, Objective, Success metrics"),
    id: "no-clear-goal",
    nextBlockIds: ["how-might-we", "priority-map", "start-stop-continue"],
    reason:
      "Teams need a clear objective before they can effectively prioritise, plan, evaluate or execute work.",
    recommendedBlockId: "objectives-and-key-results",
    rule: "No Clear Goal",
    situation:
      "The team cannot clearly describe what success looks like, what they are trying to achieve, or how success will be measured."
  },
  {
    expectedOutputs: list("Insights, Root causes"),
    id: "root-cause-unknown",
    nextBlockIds: ["problem-statement"],
    reason:
      "Understanding root causes should happen before attempting to solve a problem.",
    recommendedBlockId: "five-whys",
    rule: "Root Cause Unknown",
    situation:
      "The team can see a problem or symptom but does not understand the underlying causes driving it."
  },
  {
    expectedOutputs: list("Problem statement"),
    id: "problem-not-clearly-defined",
    nextBlockIds: ["how-might-we"],
    reason:
      "Teams need a clear problem statement before exploring solutions or prioritising options.",
    recommendedBlockId: "problem-statement",
    rule: "Problem Not Clearly Defined",
    situation:
      "The challenge is broad, vague or interpreted differently by different people."
  },
  {
    expectedOutputs: list("Ideas, Opportunities"),
    id: "need-more-ideas",
    nextBlockIds: ["impact-effort-map", "priority-map"],
    reason:
      "The team needs to generate possible directions before evaluating them.",
    recommendedBlockId: "how-might-we",
    rule: "Need More Ideas",
    situation:
      "The team understands the problem but does not yet have enough possible solutions or opportunity areas."
  },
  {
    expectedOutputs: list("Decision, Prioritised list"),
    id: "too-many-opportunities",
    nextBlockIds: ["priority-map"],
    reason:
      "A large set of options needs to be compared before the team can focus.",
    recommendedBlockId: "impact-effort-map",
    rule: "Too Many Opportunities",
    situation:
      "The team has too many opportunities, ideas or actions and needs to identify the strongest options."
  },
  {
    expectedOutputs: list("Decision, Prioritised list"),
    id: "need-clear-priorities",
    nextBlockIds: ["start-stop-continue"],
    reason:
      "Teams need explicit priorities before committing time and ownership.",
    recommendedBlockId: "priority-map",
    rule: "Need Clear Priorities",
    situation:
      "The team has options but lacks a clear view of what should happen first."
  },
  {
    expectedOutputs: list("Action plan, Insights, Next steps"),
    id: "need-team-reflection",
    nextBlockIds: [],
    reason:
      "Teams need structured reflection before agreeing behaviour or process changes.",
    recommendedBlockId: "start-stop-continue",
    rule: "Need Team Reflection",
    situation:
      "The team needs to reflect on what is working, what is not, and what should change."
  },
  {
    expectedOutputs: list("Action plan, Next steps, Ownership"),
    id: "need-actions-and-ownership",
    nextBlockIds: [],
    reason:
      "Decisions only become useful when owners and next actions are agreed.",
    recommendedBlockId: "who-what-when",
    rule: "Need Actions And Ownership",
    situation:
      "The team has decisions or recommendations but needs clear owners and next steps."
  },
  {
    expectedOutputs: list("Decision, Prioritised list"),
    id: "need-alignment-on-options",
    nextBlockIds: ["who-what-when"],
    reason:
      "Independent voting helps the group converge without dominance or groupthink.",
    recommendedBlockId: "blind-vote",
    rule: "Need Alignment On Options",
    situation:
      "The team has multiple options and needs a fair way to align on the strongest choice."
  }
];

const discoveryInput: DiagnosisInput = {
  blockers: ["Root cause unknown", "No formal research completed"],
  challenge:
    "A new onboarding experience has launched, conversion has dropped, and the team does not understand why.",
  constraints: {
    deliveryMode: "remote",
    durationMinutes: 90,
    participantCount: 8
  },
  currentState: ["No formal research", "Several assumptions", "Little evidence"],
  desiredOutcome:
    "Understand what is happening, identify potential causes, and create a clear problem statement."
};

export const exampleDiagnosis: Diagnosis = {
  confidence: "high",
  input: discoveryInput,
  primaryStage: "understand",
  recommendedFocus: "Understand root causes and frame the problem clearly.",
  secondaryStage: "frame",
  stageScores: [
    { score: 0, stage: "goals" },
    { score: 6, stage: "understand" },
    { score: 4, stage: "frame" },
    { score: 0, stage: "ideas" },
    { score: 0, stage: "evaluate" },
    { score: 0, stage: "decide" },
    { score: 0, stage: "discuss" }
  ]
};
