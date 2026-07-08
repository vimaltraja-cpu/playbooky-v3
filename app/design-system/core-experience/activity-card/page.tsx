import { existsSync } from "node:fs";
import path from "node:path";

import { temporaryActivityIllustrationMap } from "@/lib/data/activity-illustration-map";
import type { Activity } from "@/lib/data/activities";
import { getCanonicalActivities } from "@/lib/data/canonical-activities";

import { ActivityCardPageClient } from "./ActivityCardPageClient";

function hasValidCardData(activity: Activity) {
  return Boolean(
    activity["Activity Name"]?.trim() &&
      activity.Purpose?.trim() &&
      activity.Duration?.trim() &&
      (activity.Stage?.trim() || activity["Layout Type"]?.trim())
  );
}

function getIllustrationSrc(activityName: string) {
  const filename = temporaryActivityIllustrationMap[activityName];

  if (!filename) {
    return null;
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "assets",
    "activities",
    filename
  );

  if (!existsSync(filePath)) {
    throw new Error(
      `Missing temporary Activity Card illustration asset: public/assets/activities/${filename}`
    );
  }

  return `/assets/activities/${encodeURIComponent(filename)}`;
}

export default async function ActivityCardPage() {
  const activities = await getCanonicalActivities();
  const activityCards = activities
    .filter(hasValidCardData)
    .map((activity) => {
      const illustrationSrc = getIllustrationSrc(activity["Activity Name"]);

      if (!illustrationSrc) {
        return null;
      }

      return {
        activity,
        illustrationSrc
      };
    })
    .filter(
      (
        card
      ): card is {
        activity: Activity;
        illustrationSrc: string;
      } => Boolean(card)
    );

  if (activityCards.length === 0) {
    throw new Error(
      "No Activity Card rows have both valid canonical CSV data and a temporary illustration mapping."
    );
  }

  return (
    <ActivityCardPageClient
      activityCards={activityCards}
      representativeCard={activityCards[0]}
    />
  );
}
