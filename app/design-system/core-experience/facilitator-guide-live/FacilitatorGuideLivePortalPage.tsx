"use client";

import { FacilitatorGuideLiveClient } from "@/components/product/FacilitatorGuideLiveClient";
import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import type { LibraryDataset } from "@/lib/product-system/library-read-model";

const componentMetadata = {
  category: "Core Experience -> Facilitator Guide",
  confidence: "2 Working model",
  lastUpdated: "2026-08-08",
  owner: "Product",
  status: "Prototype",
  title: "Facilitator Guide Live"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "live", label: "Live model" }
];

const overviewCopy = {
  statusNote:
    "This working model packs workshops through Active Library diagnosis rules, then maps canonical building-block steps into the Facilitator Guide UI.",
  summary:
    "Run diagnosis presets at 120 and 150 minutes to stress-test activity packing and surface canonical content gaps.",
  whatItIs:
    "A full Facilitator Guide composition fed by real library data instead of Figma fixture copy.",
  whenNotToUse:
    "Do not treat interim field mappings as final product content.",
  whenToUse:
    "Use it to review Guide layout against generated workshops and to decide which canon fields still need authoring.",
  whereItAppears:
    "Design Portal review and /facilitator-guide product preview route.",
  whyItExists:
    "To validate the Guide end-to-end before the recommendation journey hands off orderedActivities."
};

export function FacilitatorGuideLivePortalPage({
  dataset
}: {
  dataset: LibraryDataset;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/facilitator-guide-live" />

        <ComponentPageShell
          description="Working Facilitator Guide model driven by Active Library diagnosis packing and canonical step data."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <section className="scroll-mt-28 py-10" id="live">
            <div className="overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#111214] p-3">
              <div className="max-h-[85vh] overflow-auto rounded-[10px] bg-[#f7f4ef]">
                <FacilitatorGuideLiveClient dataset={dataset} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#a1a1a1]">
              Full-page route also available at{" "}
              <a className="text-[#f5f5f5] underline" href="/facilitator-guide">
                /facilitator-guide
              </a>
              .
            </p>
          </section>
        </ComponentPageShell>
      </div>
    </main>
  );
}
