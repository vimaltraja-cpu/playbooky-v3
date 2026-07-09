import { existsSync } from "node:fs";
import path from "node:path";

import { activityCardDemoData } from "@/data/demo/activity-card-demo-data";

import { ActivityCardPageClient } from "./ActivityCardPageClient";

function assertDemoIllustrationExists(illustration: string) {
  const normalizedPath = decodeURIComponent(
    illustration.replace(/^\/assets\/activities\//, "")
  );
  const filePath = path.join(
    process.cwd(),
    "public",
    "assets",
    "activities",
    normalizedPath
  );

  if (!existsSync(filePath)) {
    throw new Error(
      `Missing Activity Card demo illustration: public/assets/activities/${normalizedPath}`
    );
  }
}

export default function ActivityCardPage() {
  activityCardDemoData.forEach((activity) => {
    assertDemoIllustrationExists(activity.illustration);
  });

  return (
    <ActivityCardPageClient
      representativeActivity={activityCardDemoData[0]}
    />
  );
}
