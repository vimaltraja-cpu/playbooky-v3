import { getCanonicalActivityCards } from "@/lib/data/canonical-activity-cards";
import { buildActivityLibraryModalItems } from "@/lib/design-system/activity-library-modal";
import { getLibraryDataset } from "@/lib/product-system/library-read-model";

import { ActivityGridPageClient } from "./ActivityGridPageClient";

export default async function ActivityGridMotionPortalPage() {
  const [dataset, cards] = await Promise.all([
    getLibraryDataset(),
    Promise.resolve(getCanonicalActivityCards())
  ]);
  const libraryActivities = buildActivityLibraryModalItems(
    dataset.activities,
    cards
  );

  return (
    <ActivityGridPageClient
      activities={cards}
      libraryActivities={libraryActivities}
    />
  );
}
