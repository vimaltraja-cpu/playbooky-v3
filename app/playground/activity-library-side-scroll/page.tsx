import { getCanonicalActivityCards } from "@/lib/data/canonical-activity-cards";
import { buildActivityLibraryModalItems } from "@/lib/design-system/activity-library-modal";
import { getLibraryDataset } from "@/lib/product-system/library-read-model";

import { ActivityLibrarySideScrollPlayground } from "./ActivityLibrarySideScrollPlayground";

export default async function ActivityLibrarySideScrollPlaygroundPage() {
  const [dataset, cards] = await Promise.all([
    getLibraryDataset(),
    Promise.resolve(getCanonicalActivityCards())
  ]);

  return (
    <ActivityLibrarySideScrollPlayground
      activities={buildActivityLibraryModalItems(dataset.activities, cards)}
      hostCards={cards.slice(0, 6)}
    />
  );
}
