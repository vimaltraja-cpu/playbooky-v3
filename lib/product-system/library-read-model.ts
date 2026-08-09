import { readFile } from "node:fs/promises";
import path from "node:path";

import { parseCsv, type CsvRow } from "@/lib/data/csv";
import { diagnosisQuestions } from "@/lib/design-system/diagnosis-options";
import {
  buildingBlocks as fixtureBuildingBlocks,
  workshopDesignLogicRules,
  workshopOsFixtureSource
} from "@/lib/workshop-os/fixtures";

export type LibraryItemType = "activity" | "building-block" | "step";
export type LibraryStatus = "active" | "incomplete";

export type DiagnosisSignal = {
  label: string;
  questionId?: string;
  ruleId?: string;
  value: string;
};

export type LibraryItem = {
  category?: string;
  description?: string;
  diagnosisSignals: DiagnosisSignal[];
  durationMinutes?: number;
  formats: string[];
  id: string;
  itemType: LibraryItemType;
  parentId?: string;
  parentTitle?: string;
  phase?: string;
  relatedItemIds: string[];
  searchText: string;
  source: string;
  status: LibraryStatus;
  tags: string[];
  title: string;
};

export type BuildingBlockRecord = LibraryItem & {
  energyLevel?: string;
  facilitatorNotes?: string;
  inputs: string[];
  outcomes: string[];
  outputs: string[];
  preparationNeeded?: string;
  stepIds: string[];
  type?: string;
  workshopDesignRules: string[];
};

export type BuildingBlockStepRecord = LibraryItem & {
  displayName?: string;
  facilitatorNotes?: string;
  instructions?: string;
  order?: number;
  purpose?: string;
  techniqueUsed?: string;
};

export type ActivityRecord = LibraryItem & {
  bestUsedWhen?: string;
  facilitatorNotes?: string;
  instructions?: string;
  inputs: string[];
  outputs: string[];
  remoteFriendly?: string;
  raw: CsvRow;
};

export type WorkshopRuleRecord = {
  expectedOutputs: string[];
  id: string;
  nextBlockIds: string[];
  reason: string;
  recommendedBlockId: string;
  rule: string;
  situation: string;
};

export type WorkshopTypeRecord = {
  duration?: string;
  goal?: string;
  id: string;
  name: string;
  outputs: string[];
  participants: string[];
  whenToUse?: string;
};

export type LibraryDataset = {
  activities: ActivityRecord[];
  buildingBlocks: BuildingBlockRecord[];
  decisionRows: CsvRow[];
  diagnosisQuestions: typeof diagnosisQuestions;
  items: LibraryItem[];
  sources: Record<string, string>;
  steps: BuildingBlockStepRecord[];
  workshopRules: WorkshopRuleRecord[];
  workshopTypes: WorkshopTypeRecord[];
};

const activitySource = "data/canonical/activity-library.csv";
const stepSource = "data/canonical/workshop-os/building-block-steps.csv";
const buildingBlockSource = workshopOsFixtureSource.buildingBlockLibrary;
const decisionSource = "data/canonical/decision-engine.csv";
const workshopTypeSource = "data/canonical/workshop-types.csv";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => stripNotionLink(item).trim())
    .filter(Boolean);
}

function stripNotionLink(value: string) {
  return value.replace(/\s*\(https:\/\/app\.notion\.com\/p\/[^)]+\)/g, "");
}

function numberFromText(value?: string) {
  const match = (value ?? "").match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function hasMissing(row: CsvRow, fields: string[]) {
  return fields.some((field) => !(row[field] ?? "").trim());
}

function createSearchText(parts: Array<string | string[] | undefined>) {
  return parts
    .flatMap((part) => (Array.isArray(part) ? part : [part]))
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

async function readCsv(relativePath: string) {
  const csv = await readFile(path.join(process.cwd(), relativePath), "utf8");
  return parseCsv(csv);
}

function getRuleIdsForBlock(blockName: string, blockId: string) {
  return workshopDesignLogicRules
    .filter((rule) => rule.recommendedBlockId === blockId || rule.recommendedBlockId === slugify(blockName))
    .map((rule) => rule.id);
}

function getSignalsForBlock(blockName: string, blockId: string): DiagnosisSignal[] {
  return workshopDesignLogicRules
    .filter((rule) => rule.recommendedBlockId === blockId || rule.recommendedBlockId === slugify(blockName))
    .map((rule) => ({
      label: rule.rule,
      ruleId: rule.id,
      value: rule.situation
    }));
}

export async function getLibraryDataset(): Promise<LibraryDataset> {
  const [activityRows, stepRows, buildingBlockRows, decisionRows, workshopTypeRows] =
    await Promise.all([
      readCsv(activitySource),
      readCsv(stepSource),
      readCsv(buildingBlockSource),
      readCsv(decisionSource),
      readCsv(workshopTypeSource)
    ]);

  const steps: BuildingBlockStepRecord[] = stepRows.map((row) => {
    const parentTitle = row["Parent Block"] || "Missing parent block";
    const title = row["Step Name"] || row["Display Name"] || "Untitled step";
    const id = `step-${slugify(parentTitle)}-${slugify(title)}-${row["Step Order"] || "0"}`;
    const durationMinutes = numberFromText(row.Duration);
    const tags = splitList(row["Technique Used"]);

    return {
      category: row["Technique Used"] || undefined,
      description: row.Purpose,
      diagnosisSignals: [],
      displayName: row["Display Name"] || undefined,
      durationMinutes,
      facilitatorNotes: row["Facilitator Notes"] || undefined,
      formats: [],
      id,
      instructions: row.Instructions || undefined,
      itemType: "step",
      order: numberFromText(row["Step Order"]),
      parentId: `block-${slugify(parentTitle)}`,
      parentTitle,
      phase: undefined,
      purpose: row.Purpose || undefined,
      relatedItemIds: [`block-${slugify(parentTitle)}`],
      searchText: createSearchText([
        title,
        row["Display Name"],
        parentTitle,
        row.Purpose,
        row.Instructions,
        row["Facilitator Notes"],
        row["Technique Used"]
      ]),
      source: stepSource,
      status: hasMissing(row, ["Step Name", "Parent Block", "Step Order", "Duration", "Purpose", "Instructions"])
        ? "incomplete"
        : "active",
      tags,
      techniqueUsed: row["Technique Used"] || undefined,
      title
    };
  });

  const stepsByBlockTitle = new Map<string, BuildingBlockStepRecord[]>();
  steps.forEach((step) => {
    const key = step.parentTitle ?? "";
    stepsByBlockTitle.set(key, [...(stepsByBlockTitle.get(key) ?? []), step]);
  });

  const fixtureByName = new Map(fixtureBuildingBlocks.map((block) => [block.name, block]));

  const buildingBlocks: BuildingBlockRecord[] = buildingBlockRows.map((row) => {
    const title = row.Name || "Untitled building block";
    const id = `block-${slugify(title)}`;
    const blockSteps = stepsByBlockTitle.get(title) ?? [];
    const inputs = splitList(row.Inputs);
    const outputs = splitList(row.Outputs);
    const outcomes = splitList(row.Outcomes);
    const stages = splitList(row.Stage);
    const rules = getRuleIdsForBlock(title, slugify(title));
    const fixture = fixtureByName.get(title);

    return {
      category: row["Block Type"] || fixture?.type,
      description: row.Purpose || fixture?.purpose,
      diagnosisSignals: getSignalsForBlock(title, slugify(title)),
      durationMinutes: numberFromText(row["Typical Duration"]),
      energyLevel: row["Energy Level"] || fixture?.energyLevel,
      facilitatorNotes: row["Facilitator Notes"] || undefined,
      formats: [],
      id,
      inputs,
      itemType: "building-block",
      outcomes,
      outputs,
      phase: stages[0],
      preparationNeeded: row["Preparation Needed"] || undefined,
      relatedItemIds: [
        ...blockSteps.map((step) => step.id),
        ...rules.map((rule) => `rule-${rule}`)
      ],
      searchText: createSearchText([
        title,
        row["Block Type"],
        row.Stage,
        row.Purpose,
        inputs,
        outputs,
        outcomes,
        row["Preparation Needed"],
        row["Facilitator Notes"],
        row["Energy Level"],
        rules
      ]),
      source: buildingBlockSource,
      status: hasMissing(row, ["Name", "Block Type", "Stage", "Purpose", "Typical Duration"])
        ? "incomplete"
        : "active",
      stepIds: blockSteps.map((step) => step.id),
      tags: Array.from(new Set([...stages, ...outcomes, ...inputs, row["Energy Level"]].filter(Boolean))),
      title,
      type: row["Block Type"] || fixture?.type,
      workshopDesignRules: rules
    };
  });

  const blockByTitle = new Map(buildingBlocks.map((block) => [block.title, block]));
  const blockById = new Map(buildingBlocks.map((block) => [block.id, block]));

  const enrichedSteps = steps.map((step) => {
    const parent = blockByTitle.get(step.parentTitle ?? "") ?? blockById.get(step.parentId ?? "");
    return {
      ...step,
      diagnosisSignals: parent?.diagnosisSignals ?? [],
      phase: parent?.phase,
      tags: Array.from(new Set([...step.tags, ...(parent?.tags ?? [])]))
    };
  });

  const activities: ActivityRecord[] = activityRows.map((row) => {
    const title = row["Activity Name"] || "Untitled activity";
    const inputs = splitList(row["Inputs Required"]);
    const outputs = splitList(row["Outputs Produced"]);
    const tags = Array.from(
      new Set([...splitList(row.Stage), ...inputs, ...outputs, row["Layout Type"], row["Remote Friendly"]].filter(Boolean))
    );

    return {
      bestUsedWhen: row["Best Used When"] || undefined,
      category: row.Stage || undefined,
      description: row.Purpose || row["Best Used When"],
      diagnosisSignals: [],
      durationMinutes: numberFromText(row.Duration),
      facilitatorNotes: row["Facilitator Notes"] || undefined,
      formats: [row["Layout Type"], row["Remote Friendly"]].filter(Boolean),
      id: `activity-${slugify(title)}`,
      inputs,
      instructions: row.Instructions || undefined,
      itemType: "activity",
      outputs,
      phase: row.Stage || undefined,
      raw: row,
      relatedItemIds: [],
      remoteFriendly: row["Remote Friendly"] || undefined,
      searchText: createSearchText([
        title,
        row.Purpose,
        row["Best Used When"],
        row.Stage,
        row.Duration,
        inputs,
        outputs,
        row["Layout Type"],
        row["Facilitator Notes"],
        row.Instructions,
        row["Remote Friendly"]
      ]),
      source: activitySource,
      status: hasMissing(row, ["Activity Name", "Purpose", "Duration", "Stage"])
        ? "incomplete"
        : "active",
      tags,
      title
    };
  });

  const workshopRules = workshopDesignLogicRules.map((rule) => ({
    expectedOutputs: rule.expectedOutputs,
    id: rule.id,
    nextBlockIds: rule.nextBlockIds.map((id) => `block-${id}`),
    reason: rule.reason,
    recommendedBlockId: `block-${rule.recommendedBlockId}`,
    rule: rule.rule,
    situation: rule.situation
  }));

  const workshopTypes = workshopTypeRows.map((row) => ({
    duration: row.Duration || undefined,
    goal: row.Goal || undefined,
    id: `workshop-type-${slugify(row.Name)}`,
    name: row.Name || "Untitled workshop type",
    outputs: splitList(row.Outputs),
    participants: splitList(row.Participants),
    whenToUse: row["When to Use"] || undefined
  }));

  return {
    activities,
    buildingBlocks,
    decisionRows,
    diagnosisQuestions,
    items: [...buildingBlocks, ...enrichedSteps, ...activities],
    sources: {
      activities: activitySource,
      buildingBlocks: buildingBlockSource,
      decisionEngine: decisionSource,
      generatedWorkshop: "lib/workshop-os/generate-workshop-flow.ts",
      generationFixture: "lib/workshop-os/fixtures.ts",
      steps: stepSource,
      workshopTypes: workshopTypeSource
    },
    steps: enrichedSteps,
    workshopRules,
    workshopTypes
  };
}
