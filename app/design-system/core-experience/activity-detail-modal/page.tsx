import {
  getCanonicalActivityCards,
  type CanonicalActivityCardRecord
} from "@/lib/data/canonical-activity-cards";

import { ActivityDetailModalPageClient } from "./ActivityDetailModalPageClient";

export type CanonicalActivityRecord = CanonicalActivityCardRecord;

export default function ActivityDetailModalPortalPage() {
  const activities = getCanonicalActivityCards();

  return <ActivityDetailModalPageClient activities={activities} />;
}
