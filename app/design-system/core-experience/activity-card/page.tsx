import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { ActivityCardPageClient } from "./ActivityCardPageClient";

type CsvRow = Record<string, string>;

export type CanonicalActivityRecord = {
  bestUsedWhen: string;
  description: string;
  duration: string;
  illustration: string;
  illustrationFile: string | null;
  isMissingIllustration: boolean;
  stage: string;
  title: string;
  workshopType: string;
};

const csvPath = path.join(
  process.cwd(),
  "data",
  "canonical",
  "activity-library.csv"
);
const illustrationDirectory = path.join(
  process.cwd(),
  "assets",
  "illustrations",
  "activity",
  "_processed"
);
const missingIllustrationSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='488' height='460' viewBox='0 0 488 460'%3E%3C/svg%3E";

function parseCsv(text: string) {
  const rows: string[][] = [];
  let currentField = "";
  let currentRow: string[] = [];
  let inQuotes = false;
  const source = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const nextCharacter = source[index + 1];

    if (inQuotes) {
      if (character === "\"" && nextCharacter === "\"") {
        currentField += "\"";
        index += 1;
      } else if (character === "\"") {
        inQuotes = false;
      } else {
        currentField += character;
      }
    } else if (character === "\"") {
      inQuotes = true;
    } else if (character === ",") {
      currentRow.push(currentField);
      currentField = "";
    } else if (character === "\n") {
      currentRow.push(currentField);
      rows.push(currentRow);
      currentField = "";
      currentRow = [];
    } else if (character !== "\r") {
      currentField += character;
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  const [headers = [], ...bodyRows] = rows;

  return bodyRows
    .filter((row) => row.some((field) => field.trim()))
    .map((row) =>
      Object.fromEntries(
        headers.map((header, index) => [header, row[index] ?? ""])
      )
    );
}

function normalizeForMatch(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function compactMatch(value: string) {
  return normalizeForMatch(value).replace(/\s+/g, "");
}

function getMatchCandidates(value: string) {
  const normalized = normalizeForMatch(value);
  const compact = compactMatch(value);

  return [
    normalized,
    compact,
    normalized.replace(/\band\b/g, "").replace(/\s+/g, " ").trim(),
    compact.replace(/and/g, "")
  ].filter(Boolean);
}

function getIllustrationKeys(filename: string) {
  const name = path.basename(filename, path.extname(filename));
  const keys = new Set(getMatchCandidates(name));
  const parentheticalMatches = name.matchAll(/\(([^)]*)\)/g);

  for (const match of parentheticalMatches) {
    getMatchCandidates(match[1]).forEach((candidate) => keys.add(candidate));
  }

  return keys;
}

function getCanonicalActivities() {
  if (!existsSync(csvPath)) {
    throw new Error("Missing canonical activity library CSV.");
  }

  if (!existsSync(illustrationDirectory)) {
    throw new Error("Missing canonical processed activity illustration folder.");
  }

  const illustrationFiles = readdirSync(illustrationDirectory).filter((file) =>
    /\.(png|jpe?g|webp)$/i.test(file)
  );
  const illustrationIndex = new Map<string, string>();

  illustrationFiles.forEach((file) => {
    getIllustrationKeys(file).forEach((key) => {
      if (!illustrationIndex.has(key)) {
        illustrationIndex.set(key, file);
      }
    });
  });

  return parseCsv(readFileSync(csvPath, "utf8")).map((row: CsvRow) => {
    const title = row["Activity Name"]?.trim() ?? "";
    const illustrationFile =
      getMatchCandidates(title)
        .map((candidate) => illustrationIndex.get(candidate))
        .find(Boolean) ?? null;

    return {
      bestUsedWhen: row["Best Used When"] ?? "",
      description: row.Purpose || row["Best Used When"] || "Not documented.",
      duration: row.Duration || "Duration pending",
      illustration: illustrationFile
        ? `/design-system/core-experience/activity-card/illustrations/${encodeURIComponent(
            illustrationFile
          )}`
        : missingIllustrationSrc,
      illustrationFile,
      isMissingIllustration: !illustrationFile,
      stage: row.Stage || "Stage pending",
      title,
      workshopType: row.Stage || row["Layout Type"] || "Workshop"
    } satisfies CanonicalActivityRecord;
  });
}

export default function ActivityCardPage() {
  const activities = getCanonicalActivities();

  return <ActivityCardPageClient activities={activities} />;
}
