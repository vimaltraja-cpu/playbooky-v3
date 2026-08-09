import { getCanonicalActivityCards } from "@/lib/data/canonical-activity-cards";
import { buildActivityLibraryModalItems } from "@/lib/design-system/activity-library-modal";
import { getLibraryDataset } from "@/lib/product-system/library-read-model";

import { ActivityLibraryGridPlayground } from "./ActivityLibraryGridPlayground";

const STARTER_SLUGS = [
  "problem-statement",
  "five-whys",
  "journey-map",
  "stakeholder-map",
  "how-might-we",
  "okrs"
] as const;

export default async function ActivityLibraryGridPlaygroundPage() {
  const [dataset, cards] = await Promise.all([
    getLibraryDataset(),
    Promise.resolve(getCanonicalActivityCards())
  ]);
  const libraryActivities = buildActivityLibraryModalItems(
    dataset.activities,
    cards
  );
  const bySlug = new Map(cards.map((card) => [card.slug, card]));
  const starterCards = STARTER_SLUGS.map((slug) => {
    const card = bySlug.get(slug);
    if (!card) {
      throw new Error(`Missing starter workshop activity: ${slug}`);
    }
    return card;
  });

  return (
    <ActivityLibraryGridPlayground
      canonicalCards={cards}
      libraryActivities={libraryActivities}
      starterCards={starterCards}
    />
  );
}
