import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  activityLibrarySource,
  type Activity
} from "@/lib/data/activities";
import { parseCsv } from "@/lib/data/csv";

export async function getCanonicalActivities() {
  const csvPath = path.join(process.cwd(), activityLibrarySource);
  const csv = await readFile(csvPath, "utf8");

  return parseCsv(csv) as Activity[];
}
