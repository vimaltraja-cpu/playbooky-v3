import { getCanonicalActivityCards } from "@/lib/data/canonical-activity-cards";

import { ActivityModalMotionV3PageClient } from "./ActivityModalMotionV3PageClient";

export default function ActivityModalMotionV3PortalPage() {
  const activities = getCanonicalActivityCards();

  return <ActivityModalMotionV3PageClient activities={activities} />;
}
