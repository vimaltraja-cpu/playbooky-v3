import { FacilitatorGuideLivePortalPage } from "./FacilitatorGuideLivePortalPage";
import { getLibraryDataset } from "@/lib/product-system/library-read-model";

export default async function FacilitatorGuideLiveDesignSystemPage() {
  const dataset = await getLibraryDataset();
  return <FacilitatorGuideLivePortalPage dataset={dataset} />;
}
