"use client";

import { useState, type ReactNode } from "react";

import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  WorkshopReadyWaitlist,
  type WorkshopReadyWaitlistMode,
  type WorkshopReadyWaitlistVariant
} from "@/components/ui/WorkshopReadyWaitlist";

const componentMetadata = {
  category: "Core Experience -> Workshop Ready",
  confidence: "2 Working model",
  lastUpdated: "2026-08-08",
  owner: "Product",
  status: "Prototype",
  title: "Workshop Ready Waitlist"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "join", label: "Join variant" },
  { id: "submitted", label: "Submitted variant" },
  { id: "overview", label: "Overview" }
];

const overviewCopy = {
  statusNote:
    "Standalone panel for FigJam Board and PlayBooky Live. Not wired into the live Facilitator Guide route yet.",
  summary:
    "Early-access waitlist panel with email capture and a continue-to-guide escape hatch. Same surface for both upcoming workshop modes.",
  whatItIs:
    "An in-page panel (not a modal) that will sit under Workshop Mode Nav when FigJam or Live is selected.",
  whenNotToUse:
    "Do not use this for Facilitator Guide content. Do not treat the submitted state as final product copy until Figma is locked.",
  whenToUse:
    "Use it when reviewing waitlist UX for FigJam Board and PlayBooky Live before those modes are product-ready.",
  whereItAppears:
    "Design Portal for component variants. Full-page: /figjam-board and /playbooky-live under Workshop Mode Nav.",
  whyItExists:
    "To freeze the waitlist layout and the post-submit confirmation pattern before wiring into workshop navigation."
};

function PreviewFrame({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="mt-6 rounded-[10px] border border-white/[0.14] bg-[#111214] p-4">
      <p className="mb-3 text-[12px] font-semibold uppercase leading-5 text-[#737373]">
        {label}
      </p>
      <div className="overflow-x-auto rounded-[10px] bg-[#f7f4ef] p-6">
        {children}
      </div>
    </div>
  );
}

export default function WorkshopReadyWaitlistPage() {
  const [mode, setMode] = useState<WorkshopReadyWaitlistMode>("figjam");
  const [joinVariant, setJoinVariant] =
    useState<WorkshopReadyWaitlistVariant>("join");
  const [message, setMessage] = useState("Idle");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/workshop-ready-waitlist" />

        <ComponentPageShell
          description="Waitlist panel for FigJam Board and PlayBooky Live — join and submitted variants."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <section className="scroll-mt-28 py-10" id="join">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold uppercase leading-5 text-[#737373]">
                Working model · Join
              </p>
              <h3 className="text-[22px] font-semibold leading-8 text-[#f5f5f5]">
                Workshop Ready Waitlist
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                Import <code>WorkshopReadyWaitlist</code> from{" "}
                <code>components/ui/WorkshopReadyWaitlist.tsx</code>. Mode:{" "}
                <span className="text-[#f5f5f5]">{mode}</span>. Last action:{" "}
                <span className="text-[#f5f5f5]">{message}</span>
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                Full-page FigJam composition (header + mode nav + this panel):{" "}
                <a className="text-[#f5f5f5] underline" href="/figjam-board">
                  /figjam-board
                </a>
                {" · "}
                PlayBooky Live:{" "}
                <a className="text-[#f5f5f5] underline" href="/playbooky-live">
                  /playbooky-live
                </a>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-[#f5f5f5]"
                  onClick={() => setMode("figjam")}
                  type="button"
                >
                  FigJam mode
                </button>
                <button
                  className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-[#f5f5f5]"
                  onClick={() => setMode("live")}
                  type="button"
                >
                  Live mode
                </button>
                <button
                  className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-[#f5f5f5]"
                  onClick={() => setJoinVariant("join")}
                  type="button"
                >
                  Reset to join
                </button>
              </div>
            </div>

            <PreviewFrame label="Interactive join → submitted">
              <WorkshopReadyWaitlist
                mode={mode}
                onContinueToGuide={() =>
                  setMessage("Continue to facilitator guide")
                }
                onSubmitEmail={(email) => setMessage(`Submitted ${email}`)}
                onVariantChange={setJoinVariant}
                variant={joinVariant}
              />
            </PreviewFrame>
          </section>

          <section className="scroll-mt-28 py-10" id="submitted">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-semibold uppercase leading-5 text-[#737373]">
                Working model · Submitted
              </p>
              <h3 className="text-[22px] font-semibold leading-8 text-[#f5f5f5]">
                Confirmation variation
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                Interim confirmation state until Figma lands the final post-submit
                frame. Keeps the continue-to-guide card and allows returning to
                join with a different email.
              </p>
            </div>

            <PreviewFrame label="Submitted (controlled)">
              <WorkshopReadyWaitlist
                defaultEmail="vimal@playbooky.com"
                mode={mode}
                onContinueToGuide={() =>
                  setMessage("Continue to facilitator guide (submitted view)")
                }
                variant="submitted"
              />
            </PreviewFrame>
          </section>

          <ComponentOverviewSection {...overviewCopy} />
        </ComponentPageShell>
      </div>
    </main>
  );
}
