"use client";

import { useMemo, useState } from "react";

import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { recommendationRevealCards } from "@/components/product/RecommendationCardReveal";
import {
  FacilitatorActivityHero,
  activityHeroFromWorkshopActivity
} from "@/components/ui/FacilitatorActivityHero";
import {
  FacilitatorActivityTabs,
  activitiesFromWorkshopCards
} from "@/components/ui/FacilitatorActivityTabs";
import { WorkshopModeNav } from "@/components/ui/WorkshopModeNav";

const componentMetadata = {
  category: "Core Experience -> Facilitator Guide",
  confidence: "3 Implementation ready",
  lastUpdated: "2026-08-08",
  owner: "Design System",
  status: "Documented",
  title: "Facilitator Activity Hero"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "composition", label: "Composition" }
];

const overviewCopy = {
  statusNote:
    "Type, title, description, and illustration are all driven by the selected activity record.",
  summary:
    "Facilitator Activity Hero introduces the currently selected workshop activity beneath the activity tabs.",
  whatItIs:
    "A two-column title block: activity type, name, and description on the left; activity illustration on the right.",
  whenNotToUse:
    "Do not use this for Workshop Mode switching or for listing all activities.",
  whenToUse:
    "Use it on Facilitator Guide once an activity tab is selected.",
  whereItAppears:
    "Inside the Facilitator Guide content frame with 50px horizontal and 12px vertical padding.",
  whyItExists:
    "To present the selected activity's identity and illustration before deeper facilitation content."
};

const demoTabs = activitiesFromWorkshopCards(
  recommendationRevealCards.map((card) => ({
    activity: card.activity,
    id: card.id,
    label: card.activity.title
  }))
);

export default function FacilitatorActivityHeroPage() {
  const [activeActivityId, setActiveActivityId] = useState(
    demoTabs[0]?.id ?? ""
  );

  const activeCard = useMemo(
    () =>
      recommendationRevealCards.find((card) => card.id === activeActivityId) ??
      recommendationRevealCards[0],
    [activeActivityId]
  );

  const heroActivity = useMemo(
    () => activityHeroFromWorkshopActivity(activeCard.activity),
    [activeCard]
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/facilitator-activity-hero" />

        <ComponentPageShell
          description="Activity title block for Facilitator Guide: type, name, description, and illustration from activity data."
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
                Selected activity hero
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                Switching tabs updates type, title, description, and image from
                the activity record.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#111214] p-4">
              <div className="rounded-[10px] bg-[#fcfbf9] py-8">
                <div className="flex justify-center px-6">
                  <WorkshopModeNav />
                </div>
                <div className="px-6" style={{ marginTop: 24 }}>
                  <FacilitatorActivityTabs
                    activities={demoTabs}
                    onChange={setActiveActivityId}
                    value={activeActivityId}
                  />
                </div>
                <FacilitatorActivityHero activity={heroActivity} />
              </div>
            </div>
          </section>
        </ComponentPageShell>
      </div>
    </main>
  );
}
