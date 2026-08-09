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
  FacilitatorActivitySteps,
  facilitatorActivityStepsDemo
} from "@/components/ui/FacilitatorActivitySteps";
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
  title: "Facilitator Activity Steps"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "composition", label: "Composition" }
];

const overviewCopy = {
  statusNote:
    "Step content is activity-driven. Current workshop-os step records cover name, duration, instructions, and facilitator notes — What to say / Discussion prompt / Expected outcome need dedicated fields or a mapping layer.",
  summary:
    "Facilitator Activity Steps presents the ordered facilitation steps for the selected activity inside a gradient-stroked off-white card.",
  whatItIs:
    "A stacked step list with numbered titles, duration chips, descriptions, and three insight columns separated by neutral dividers.",
  whenNotToUse:
    "Do not use this for activity switching or mode navigation.",
  whenToUse:
    "Use it on Facilitator Guide beneath the activity hero to run the selected activity step by step.",
  whereItAppears:
    "Facilitator Guide content frame, after the activity hero.",
  whyItExists:
    "To give facilitators the spoken script, prompts, and expected outcomes for each step of an activity."
};

const demoTabs = activitiesFromWorkshopCards(
  recommendationRevealCards.map((card) => ({
    activity: card.activity,
    id: card.id,
    label: card.activity.title
  }))
);

export default function FacilitatorActivityStepsPage() {
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
        <DesignPortalSidebar activeHref="/design-system/core-experience/facilitator-activity-steps" />

        <ComponentPageShell
          description="Ordered facilitation steps card for Facilitator Guide, with What to say, Discussion prompt, and Expected outcome."
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
                Activity steps card
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                Review uses the Figma example steps. Icons: message-circle,
                help-circle, target.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#111214] p-4">
              <div className="rounded-[10px] bg-[#f7f4ef] py-8">
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
                <FacilitatorActivitySteps steps={facilitatorActivityStepsDemo} />
              </div>
            </div>
          </section>
        </ComponentPageShell>
      </div>
    </main>
  );
}
