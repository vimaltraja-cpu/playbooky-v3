import { activityCardDemoItems } from "@/lib/data/activity-card-demo-data";

import { ActivityCardPageClient } from "./ActivityCardPageClient";

export default function ActivityCardPage() {
  return (
    <ActivityCardPageClient
      representativeCard={activityCardDemoItems[0]}
    />
  );
}
