"use client";

import { useMemo, useState } from "react";

import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  FacilitatorActivityTabs,
  activitiesFromWorkshopCards,
  type FacilitatorActivityTab
} from "@/components/ui/FacilitatorActivityTabs";
import { WorkshopModeNav } from "@/components/ui/WorkshopModeNav";
import { recommendationRevealCards } from "@/components/product/RecommendationCardReveal";

const componentMetadata = {
  category: "Core Experience -> Navigation",
  confidence: "3 Implementation ready",
  lastUpdated: "2026-08-08",
  owner: "Design System",
  status: "Documented",
  title: "Facilitator Activity Tabs"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "composition", label: "Composition" }
];

const overviewCopy = {
  statusNote:
    "Basic underline tabs only. Do not add travelling-pill motion here — Workshop Mode Nav already owns that interaction language.",
  summary:
    "Facilitator Activity Tabs lists the ordered workshop activities handed off from the Active Workshop Grid and loads the selected activity in Facilitator Guide.",
  whatItIs:
    "A horizontal, scrollable secondary tab strip under Workshop Mode Nav.",
  whenNotToUse:
    "Do not use it for mode switching between Facilitator Guide, FigJam Board, and PlayBooky Live.",
  whenToUse:
    "Use it on Facilitator Guide to move between activities in the confirmed playbook order.",
  whereItAppears:
    "Directly under Workshop Mode Nav, with 24px spacing between the two.",
  whyItExists:
    "To reflect the final ordered workshop sequence after diagnosis, recommendation, and grid reordering."
};

const demoActivities: FacilitatorActivityTab[] = activitiesFromWorkshopCards(
  recommendationRevealCards.map((card) => ({
    activity: card.activity,
    id: card.id,
    label: card.activity.title
  }))
);

export default function FacilitatorActivityTabsPage() {
  const [activeActivityId, setActiveActivityId] = useState(
    demoActivities[0]?.id ?? ""
  );
  const activeLabel = useMemo(
    () =>
      demoActivities.find((activity) => activity.id === activeActivityId)
        ?.label ?? "",
    [activeActivityId]
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/facilitator-activity-tabs" />

        <ComponentPageShell
          description="Secondary activity tabs for Facilitator Guide, driven by the ordered workshop playbook."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <section className="scroll-mt-28 py-10" id="composition">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold uppercase leading-5 text-[#737373]">
                Composition
              </p>
              <h3 className="text-[22px] font-semibold leading-8 text-[#f5f5f5]">
                Under Workshop Mode Nav
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                Demo activities come from the recommendation reveal fixture, in
                order. Active activity:{" "}
                <span className="text-[#f5f5f5]">{activeLabel}</span>
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#111214] p-4">
              <div className="rounded-[10px] bg-[#fcfbf9] px-6 py-8">
                <div className="flex justify-center">
                  <WorkshopModeNav />
                </div>
                <div style={{ marginTop: 24 }}>
                  <FacilitatorActivityTabs
                    activities={demoActivities}
                    onChange={setActiveActivityId}
                    value={activeActivityId}
                  />
                </div>
              </div>
            </div>
          </section>
        </ComponentPageShell>
      </div>
    </main>
  );
}
