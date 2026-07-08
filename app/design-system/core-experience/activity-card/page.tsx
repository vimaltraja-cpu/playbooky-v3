import { activityCardDemoItems } from "@/lib/data/activity-card-demo-data";

import { ActivityCardPageClient } from "./ActivityCardPageClient";

export default function ActivityCardPage() {
  return (
    <ActivityCardPageClient
      activityCards={activityCardDemoItems}
      representativeCard={activityCardDemoItems[0]}
    />
  );
}
