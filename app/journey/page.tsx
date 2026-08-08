import { Suspense } from "react";

import { ProductJourney } from "@/components/product/ProductJourney";

export default function ProductJourneyPage() {
  return (
    <Suspense fallback={null}>
      <ProductJourney />
    </Suspense>
  );
}
