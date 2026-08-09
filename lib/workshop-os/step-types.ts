export const stepTypeIds = [
  "introduction",
  "review",
  "define",
  "capture",
  "cluster",
  "generate",
  "explore",
  "map",
  "vote",
  "select",
  "refine",
  "create",
  "confirm",
  "commit",
  "discuss"
] as const;

export type StepTypeId = (typeof stepTypeIds)[number];

export type StepTypeDefinition = {
  description: string;
  id: StepTypeId;
  label: string;
  pathMarkKey: StepTypeId;
};

export const stepTypeDefinitions: StepTypeDefinition[] = [
  {
    description:
      "Enter a new space, orient participants, and begin a shared activity journey.",
    id: "introduction",
    label: "Introduction",
    pathMarkKey: "introduction"
  },
  {
    description:
      "Pause, observe, and reflect on existing information before moving forward.",
    id: "review",
    label: "Review",
    pathMarkKey: "review"
  },
  {
    description:
      "Bring uncertainty into a clearer definition, boundary, criterion, or frame.",
    id: "define",
    label: "Define",
    pathMarkKey: "define"
  },
  {
    description:
      "Collect independent thoughts, observations, evidence, or inputs.",
    id: "capture",
    label: "Capture",
    pathMarkKey: "capture"
  },
  {
    description:
      "Identify patterns by grouping related inputs into meaningful sets.",
    id: "cluster",
    label: "Cluster",
    pathMarkKey: "cluster"
  },
  {
    description:
      "Produce multiple new possibilities, options, questions, or ideas.",
    id: "generate",
    label: "Generate",
    pathMarkKey: "generate"
  },
  {
    description:
      "Go deeper into an area to discover causes, evidence, or additional understanding.",
    id: "explore",
    label: "Explore",
    pathMarkKey: "explore"
  },
  {
    description:
      "Organise complexity visually or spatially to show relationships and position.",
    id: "map",
    label: "Map",
    pathMarkKey: "map"
  },
  {
    description:
      "Gather independent judgement, scoring, ranking, or preference across options.",
    id: "vote",
    label: "Vote",
    pathMarkKey: "vote"
  },
  {
    description:
      "Resolve available possibilities into the direction that will be carried forward.",
    id: "select",
    label: "Select",
    pathMarkKey: "select"
  },
  {
    description:
      "Improve, consolidate, or evolve something through review and iteration.",
    id: "refine",
    label: "Refine",
    pathMarkKey: "refine"
  },
  {
    description:
      "Combine inputs into a new coherent artefact, statement, output, or deliverable.",
    id: "create",
    label: "Create",
    pathMarkKey: "create"
  },
  {
    description:
      "Establish shared confidence, agreement, or validation before continuing.",
    id: "confirm",
    label: "Confirm",
    pathMarkKey: "confirm"
  },
  {
    description:
      "Turn intention into an agreed action, owner, accountability, or direction.",
    id: "commit",
    label: "Commit",
    pathMarkKey: "commit"
  },
  {
    description:
      "Exchange perspectives to develop shared understanding through conversation.",
    id: "discuss",
    label: "Discuss",
    pathMarkKey: "discuss"
  }
];

export const stepTypesById = Object.fromEntries(
  stepTypeDefinitions.map((definition) => [definition.id, definition])
) as Record<StepTypeId, StepTypeDefinition>;

export function isStepTypeId(value: string): value is StepTypeId {
  return stepTypeIds.includes(value as StepTypeId);
}

export function getStepTypeDefinition(stepType: StepTypeId) {
  return stepTypesById[stepType];
}

export function getPathMarkKeyForStepType(stepType: StepTypeId) {
  return getStepTypeDefinition(stepType).pathMarkKey;
}
