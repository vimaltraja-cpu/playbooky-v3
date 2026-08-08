import { getCanonicalActivityCards } from "@/lib/data/canonical-activity-cards";

import { ActivityModalMotionPageClient } from "./ActivityModalMotionPageClient";

export default function ActivityModalMotionPortalPage() {
  const activities = getCanonicalActivityCards();

  return <ActivityModalMotionPageClient activities={activities} />;
}
