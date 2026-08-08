import {
  getCanonicalActivityCards,
  type CanonicalActivityCardRecord
} from "@/lib/data/canonical-activity-cards";

import { ActivityCardPageClient } from "./ActivityCardPageClient";

export type CanonicalActivityRecord = CanonicalActivityCardRecord;

export default function ActivityCardPage() {
  const activities = getCanonicalActivityCards();

  return <ActivityCardPageClient activities={activities} />;
}
