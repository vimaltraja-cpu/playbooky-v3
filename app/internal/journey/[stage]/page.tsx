import { notFound } from "next/navigation";

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

  return <JourneyFullPage stage={stage} />;
}
