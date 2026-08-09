import { getCanonicalActivityCards } from "@/lib/data/canonical-activity-cards";
import { buildActivityLibraryModalItems } from "@/lib/design-system/activity-library-modal";
import { getLibraryDataset } from "@/lib/product-system/library-read-model";

import { ActivityLibraryPacksPlayground } from "./ActivityLibraryPacksPlayground";

export default async function ActivityLibraryPacksPlaygroundPage() {
  const [dataset, cards] = await Promise.all([
    getLibraryDataset(),
    Promise.resolve(getCanonicalActivityCards())
  ]);
  const activities = buildActivityLibraryModalItems(dataset.activities, cards);
  const hostCards = cards.slice(0, 6);
  const suggestedIds = hostCards.map((card) => `activity-${card.slug}`);

  return (
    <ActivityLibraryPacksPlayground
      activities={activities}
      hostCards={hostCards}
      suggestedIds={suggestedIds}
    />
  );
}
