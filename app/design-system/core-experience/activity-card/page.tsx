import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

import {
  createActivitySlug,
  selectRepresentativeActivity
} from "@/lib/data/activities";
import { getCanonicalActivities } from "@/lib/data/canonical-activities";

import { ActivityCardPageClient } from "./ActivityCardPageClient";

function getIllustrationSources() {
  const activitiesPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "activities"
  );

  const sources: Record<string, string> = {};

  if (!existsSync(activitiesPath)) {
    return sources;
  }

  for (const item of readdirSync(activitiesPath, { withFileTypes: true })) {
    if (item.isFile() && item.name.toLowerCase().endsWith(".png")) {
      const stem = item.name.replace(/\.png$/i, "");
      sources[createActivitySlug(stem)] =
        `/assets/activities/${encodeURIComponent(item.name)}`;
    }

    if (item.isDirectory()) {
      const nestedIllustration = path.join(
        activitiesPath,
        item.name,
        "illustration.png"
      );

      if (existsSync(nestedIllustration)) {
        sources[createActivitySlug(item.name)] =
          `/assets/activities/${encodeURIComponent(item.name)}/illustration.png`;
      }
    }
  }

  return sources;
}

export default async function ActivityCardPage() {
  const activities = await getCanonicalActivities();
  const activity = selectRepresentativeActivity(activities);
  const slug = createActivitySlug(activity["Activity Name"]);
  const illustrationSrcBySlug = getIllustrationSources();

  return (
    <ActivityCardPageClient
      activities={activities}
      activity={activity}
      illustrationSrcBySlug={illustrationSrcBySlug}
      representativeIllustrationSrc={illustrationSrcBySlug[slug] ?? null}
    />
  );
}
