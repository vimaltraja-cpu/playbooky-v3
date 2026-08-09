import { notFound } from "next/navigation";

import { getCanonicalActivityCards } from "@/lib/data/canonical-activity-cards";
import { buildActivityLibraryModalItems } from "@/lib/design-system/activity-library-modal";
import { getLibraryDataset } from "@/lib/product-system/library-read-model";
import { JourneyFullPage } from "@/src/features/recommendation-journey/JourneyFullPage";
import {
  getJourneyStage,
  journeyStageIds
} from "@/src/features/recommendation-journey/journeyManifest";

export function generateStaticParams() {
  return journeyStageIds.map((stage) => ({ stage }));
}

export default async function InternalJourneyStagePage({
  params
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage: stageId } = await params;
  const stage = getJourneyStage(stageId);

  if (!stage) {
    notFound();
  }

  const [dataset, cards] = await Promise.all([
    getLibraryDataset(),
    Promise.resolve(getCanonicalActivityCards())
  ]);
  const libraryActivities = buildActivityLibraryModalItems(
    dataset.activities,
    cards
  );

  return (
    <JourneyFullPage libraryActivities={libraryActivities} stage={stage} />
  );
}
