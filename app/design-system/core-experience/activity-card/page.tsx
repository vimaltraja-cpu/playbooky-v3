import { existsSync } from "node:fs";
import path from "node:path";

import {
  createActivitySlug,
  selectRepresentativeActivity
} from "@/lib/data/activities";
import { getCanonicalActivities } from "@/lib/data/canonical-activities";

import { ActivityCardPageClient } from "./ActivityCardPageClient";

export default async function ActivityCardPage() {
  const activities = await getCanonicalActivities();
  const activity = selectRepresentativeActivity(activities);
  const slug = createActivitySlug(activity["Activity Name"]);
  const illustrationPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "activities",
    slug,
    "illustration.png"
  );

  return (
    <ActivityCardPageClient
      activity={activity}
      hasIllustration={existsSync(illustrationPath)}
    />
  );
}
