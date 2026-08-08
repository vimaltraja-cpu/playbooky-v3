import {
  getCanonicalActivityCards,
  type CanonicalActivityCardRecord
} from "@/lib/data/canonical-activity-cards";
import { getActivityDetailModalData } from "@/lib/design-system/activity-detail-modal-demo";

import type { V3PrototypeCard } from "./types";

const REPRESENTATIVE_ACTIVITY_SLUGS = [
  "problem-statement",
  "five-whys",
  "journey-map",
  "stakeholder-map",
  "how-might-we",
  "okrs"
] as const;

function getPrototypeCards(
  activities: CanonicalActivityCardRecord[]
): V3PrototypeCard[] {
  const activitiesBySlug = new Map(
    activities.map((activity) => [activity.slug, activity])
  );

  return REPRESENTATIVE_ACTIVITY_SLUGS.map((slug) => {
    const activity = activitiesBySlug.get(slug);

    if (!activity) {
      throw new Error(`Missing V3 prototype activity: ${slug}`);
    }

    return {
      activity: {
        description: activity.description,
        duration: activity.duration,
        illustration: activity.illustration,
        title: activity.title,
        workshopType: activity.workshopType
      },
      id: `activity-modal-motion-v3-${activity.slug}`,
      label: activity.title,
      modalData: getActivityDetailModalData(activity)
    };
  });
}

/**
 * Real canonical activity data for the V3 full-screen prototype routes —
 * the same source and representative slugs used by the V2 isolated shell
 * prototype, so all three V3 concepts stage against real grid content
 * instead of placeholder/dummy cards.
 */
export function getV3PrototypeCards(): V3PrototypeCard[] {
  const activities = getCanonicalActivityCards();

  return getPrototypeCards(activities);
}
