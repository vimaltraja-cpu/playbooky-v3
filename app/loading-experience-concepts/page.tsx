import { isLoadingConceptId, type LoadingConceptId } from "@/components/prototypes/loading-experience-concepts/shared/types";

import { LoadingExperienceConceptsClient } from "./LoadingExperienceConceptsClient";

function getInitialConceptId(concept?: string): LoadingConceptId | undefined {
  if (concept && isLoadingConceptId(concept)) {
    return concept;
  }

  return undefined;
}

export default async function LoadingExperienceConceptsPage({
  searchParams
}: {
  searchParams?: Promise<{ concept?: string }>;
}) {
  const params = await searchParams;

  return (
    <LoadingExperienceConceptsClient
      initialConceptId={getInitialConceptId(params?.concept)}
    />
  );
}
