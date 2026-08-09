import { FacilitatorGuideBody } from "@/components/product/FacilitatorGuideBody";
import { getLibraryDataset } from "@/lib/product-system/library-read-model";

export default async function FacilitatorGuideLivePage() {
  const dataset = await getLibraryDataset();

  return <FacilitatorGuideBody dataset={dataset} />;
}
