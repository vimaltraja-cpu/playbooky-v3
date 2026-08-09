import { getCanonicalActivityCards } from "@/lib/data/canonical-activity-cards";
import { buildActivityLibraryModalItems } from "@/lib/design-system/activity-library-modal";
import { getLibraryDataset } from "@/lib/product-system/library-read-model";

import { ActivityLibraryModalPageClient } from "./ActivityLibraryModalPageClient";

export default async function ActivityLibraryModalPortalPage() {
  const [dataset, cards] = await Promise.all([
    getLibraryDataset(),
    Promise.resolve(getCanonicalActivityCards())
  ]);
  const activities = buildActivityLibraryModalItems(dataset.activities, cards);
  const hostCards = cards.slice(0, 6);

  return (
    <ActivityLibraryModalPageClient
      activities={activities}
      hostCards={hostCards}
    />
  );
}
