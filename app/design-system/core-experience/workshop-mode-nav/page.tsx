"use client";

import { useState } from "react";

import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  WorkshopModeNav,
  type WorkshopModeId
} from "@/components/ui/WorkshopModeNav";

const componentMetadata = {
  category: "Core Experience -> Navigation",
  confidence: "3 Locked",
  lastUpdated: "2026-08-08",
  owner: "Design System",
  status: "Locked",
  title: "Workshop Mode Nav"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "locked", label: "Labels variant" },
  { id: "icons", label: "Icons variant" }
];

const overviewCopy = {
  statusNote:
    "This is the locked production navigation. Motion explorations live separately and must not change the labels variant motion.",
  summary:
    "Workshop Mode Nav is the approved Active Elastic Pop switcher between Facilitator Guide, FigJam Board, and PlayBooky Live, with a compact icons variant for tight widths.",
  whatItIs:
    "A self-contained product component with travelling elastic surface. Labels variant reveals an icon beside the active label; icons variant shows Neutral 500 glyphs only.",
  whenNotToUse:
    "Do not use motion exploration prototypes in product surfaces. Do not invent alternate workshop mode switchers.",
  whenToUse:
    "Use it on Facilitator Guide and related Workshop Ready surfaces that switch between guide, FigJam/builder, and live modes.",
  whereItAppears:
    "Facilitator Guide and Workshop Ready experiences after the recommendation grid is confirmed. Auto variant switches to icons when ~24px side inset cannot be kept.",
  whyItExists:
    "To freeze the approved navigation motion so product work can consume one stable component across desktop and compact layouts."
};

export default function WorkshopModeNavPage() {
  const [mode, setMode] = useState<WorkshopModeId>("guide");
  const [iconsMode, setIconsMode] = useState<WorkshopModeId>("guide");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/workshop-mode-nav" />

        <ComponentPageShell
          description="Locked production Workshop Mode navigation extracted from Active Elastic Pop (RTL Icon), plus compact icons variant."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <section className="scroll-mt-28 py-10" id="locked">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold uppercase leading-5 text-[#737373]">
                Locked · Labels
              </p>
              <h3 className="text-[22px] font-semibold leading-8 text-[#f5f5f5]">
                Workshop Mode Nav
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                Import <code>WorkshopModeNav</code> from{" "}
                <code>components/ui/WorkshopModeNav.tsx</code>. Active mode:{" "}
                <span className="text-[#f5f5f5]">{mode}</span>
              </p>
            </div>

            <div className="mt-6 rounded-[10px] border border-white/[0.14] bg-[#111214] p-8">
              <div className="flex min-h-[120px] items-center justify-center rounded-[10px] bg-[#f7f4ef] px-6 py-10">
                <WorkshopModeNav
                  onChange={setMode}
                  value={mode}
                  variant="labels"
                />
              </div>
            </div>
          </section>

          <section className="scroll-mt-28 py-10" id="icons">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold uppercase leading-5 text-[#737373]">
                Locked · Icons
              </p>
              <h3 className="text-[22px] font-semibold leading-8 text-[#f5f5f5]">
                Compact icon-only variant
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                Same elastic surface. Glyphs use Neutral 500; the active item
                sits on the gold indicator with a gold glyph. Product default is{" "}
                <code>variant=&quot;auto&quot;</code>, which switches here when the
                host cannot keep 24px side inset around the labels pill. Active:{" "}
                <span className="text-[#f5f5f5]">{iconsMode}</span>
              </p>
            </div>

            <div className="mt-6 rounded-[10px] border border-white/[0.14] bg-[#111214] p-8">
              <div className="flex min-h-[120px] items-center justify-center rounded-[10px] bg-[#f7f4ef] px-6 py-10">
                <WorkshopModeNav
                  onChange={setIconsMode}
                  value={iconsMode}
                  variant="icons"
                />
              </div>
            </div>
          </section>
        </ComponentPageShell>
      </div>
    </main>
  );
}
