import { getV3PrototypeCards } from "@/components/prototypes/activity-modal-motion-v3/shared/prototype-cards";
import { isV3ConceptId, type V3ConceptId } from "@/components/prototypes/activity-modal-motion-v3/shared/types";

import { ActivityModalMotionV3ConsolidatedClient } from "./ActivityModalMotionV3ConsolidatedClient";

function getInitialConceptId(concept?: string): V3ConceptId | undefined {
  if (concept && isV3ConceptId(concept)) {
    return concept;
  }

  return undefined;
}

export default async function ActivityModalMotionV3ConsolidatedPage({
  searchParams
}: {
  searchParams?: Promise<{ concept?: string }>;
}) {
  const params = await searchParams;
  const cards = getV3PrototypeCards();

  return (
    <ActivityModalMotionV3ConsolidatedClient
      cards={cards}
      initialConceptId={getInitialConceptId(params?.concept)}
    />
  );
}
