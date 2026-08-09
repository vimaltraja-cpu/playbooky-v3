"use client";

import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { FacilitatorGuideHeader } from "@/components/ui/FacilitatorGuideHeader";

const componentMetadata = {
  category: "Core Experience -> Navigation",
  confidence: "3 Locked",
  lastUpdated: "2026-08-08",
  owner: "Design System",
  status: "Locked",
  title: "Facilitator Guide Header"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "locked", label: "Locked component" }
];

const overviewCopy = {
  statusNote:
    "This is the locked Facilitator Guide header. It is a replica of the SiteHeader shell with no primary nav text.",
  summary:
    "Facilitator Guide Header keeps the PlayBooky logo on the left and Share / Download PDF actions on the right.",
  whatItIs:
    "A product header variant for Facilitator Guide surfaces after the workshop grid is confirmed.",
  whenNotToUse:
    "Do not use SiteHeader landing or inner variants for Facilitator Guide. Do not add primary marketing nav into this component.",
  whenToUse:
    "Use it on Facilitator Guide pages that need share and PDF export actions.",
  whereItAppears:
    "Facilitator Guide experience chrome, above workshop mode navigation and guide content.",
  whyItExists:
    "To freeze the Facilitator Guide header layout separately from marketing and other product headers."
};

export default function FacilitatorGuideHeaderPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/facilitator-guide-header" />

        <ComponentPageShell
          description="Locked Facilitator Guide header: logo left, Share and Download PDF actions right."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <section className="scroll-mt-28 py-10" id="locked">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold uppercase leading-5 text-[#737373]">
                Locked
              </p>
              <h3 className="text-[22px] font-semibold leading-8 text-[#f5f5f5]">
                Facilitator Guide Header
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                Import <code>FacilitatorGuideHeader</code> from{" "}
                <code>components/ui/FacilitatorGuideHeader.tsx</code>. Icons use{" "}
                <code>share-2</code> and <code>download</code> from system Icons.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#111214] p-4">
              <div className="overflow-hidden rounded-[10px] bg-[#fcfbf9]">
                <FacilitatorGuideHeader />
              </div>
            </div>
          </section>
        </ComponentPageShell>
      </div>
    </main>
  );
}
