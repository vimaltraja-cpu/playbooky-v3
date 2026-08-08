import { getCanonicalActivityCards } from "@/lib/data/canonical-activity-cards";

import { ActivityGridPageClient } from "./ActivityGridPageClient";

export default function ActivityGridMotionPortalPage() {
  const activities = getCanonicalActivityCards();

  return <ActivityGridPageClient activities={activities} />;
}
