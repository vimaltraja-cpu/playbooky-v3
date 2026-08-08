import { redirect } from "next/navigation";

/**
 * Wrong surface. The signed-off Composer → Diagnosis spine is
 * `/internal/journey` (local Mac work that was never pushed to this branch).
 * Do not rebuild a substitute here.
 */
export default function ProductJourneyPage() {
  redirect("/recommendation-loading");
}
