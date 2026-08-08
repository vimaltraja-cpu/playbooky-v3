import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { LibrariesWorkspace } from "@/components/libraries/LibrariesWorkspace";
import { getLibraryDataset } from "@/lib/product-system/library-read-model";

const activeHref = "/design-system/product-system/libraries/building-block-steps";

export default async function BuildingBlockStepsPage() {
  const dataset = await getLibraryDataset();

  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref={activeHref} />
        <LibrariesWorkspace activeHref={activeHref} dataset={dataset} mode="steps" />
      </div>
    </main>
  );
}
