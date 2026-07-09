import type { ActivityCardData } from "@/components/ui/ActivityCard";

import { ActivityCardPageClient } from "./ActivityCardPageClient";

const approvedPreviewActivity: ActivityCardData = {
  description:
    "Map the customer's journey from beginning to end to uncover opportunities.",
  duration: "15 minutes",
  illustrationSrc: "/assets/activities/Problem%20Framing.png",
  title: "Problem Framing",
  workshopType: "Journey Mapping Workshop"
};

export default function ActivityCardPage() {
  return (
    <ActivityCardPageClient representativeActivity={approvedPreviewActivity} />
  );
}
