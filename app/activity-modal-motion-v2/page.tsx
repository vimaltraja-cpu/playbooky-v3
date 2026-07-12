import { ActivityModalShellPrototypeV2 } from "@/components/prototypes/activity-modal-motion-v2/ActivityModalShellPrototypeV2";
import {
  getCanonicalActivityCards,
  type CanonicalActivityCardRecord
} from "@/lib/data/canonical-activity-cards";
import { getActivityDetailModalData } from "@/lib/design-system/activity-detail-modal-demo";

const REPRESENTATIVE_ACTIVITY_SLUGS = [
  "problem-statement",
  "five-whys",
  "journey-map",
  "stakeholder-map",
  "how-might-we",
  "okrs"
] as const;

function getPrototypeCards(activities: CanonicalActivityCardRecord[]) {
  const activitiesBySlug = new Map(
    activities.map((activity) => [activity.slug, activity])
  );

  return REPRESENTATIVE_ACTIVITY_SLUGS.map((slug) => {
    const activity = activitiesBySlug.get(slug);

    if (!activity) {
      throw new Error(`Missing V2 shell prototype activity: ${slug}`);
    }

    return {
      activity: {
        description: activity.description,
        duration: activity.duration,
        illustration: activity.illustration,
        title: activity.title,
        workshopType: activity.workshopType
      },
      id: `activity-modal-motion-v2-${activity.slug}`,
      label: activity.title,
      modalData: getActivityDetailModalData(activity)
    };
  });
}

export default function ActivityModalMotionV2Page() {
  const activities = getCanonicalActivityCards();
  const cards = getPrototypeCards(activities);

  return <ActivityModalShellPrototypeV2 cards={cards} />;
}
