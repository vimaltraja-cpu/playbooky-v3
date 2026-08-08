import { redirect } from "next/navigation";

/** Legacy path — green-lit recommendation segment lives at /recommendation-loading. */
export default function ProductJourneyPage() {
  redirect("/recommendation-loading");
}
