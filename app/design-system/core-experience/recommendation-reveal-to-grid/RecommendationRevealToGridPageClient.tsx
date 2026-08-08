"use client";

import { useState } from "react";

import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentPageMetadata,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  activityGridRoute,
  recommendationRevealRoute,
  RecommendationRevealToGridPreview,
  revealToGridRoute
} from "@/components/product/recommendation-reveal-to-grid/RecommendationRevealToGridTransition";

const sections: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "preview", label: "Preview" },
  { id: "implementation", label: "Implementation" }
];

const metadata: ComponentPageMetadata = {
  category: "Core Experience",
  confidence: "1 Desktop transition review",
  lastUpdated: "2026-08-04",
  owner: "Design System",
  status: "Exploring",
  title: "Recommendation Reveal -> Activity Grid Transition"
};

const overviewCopy = {
  statusNote:
    "Desktop-first reset. This page now focuses on one 1440 x 900 measured transition before responsive variants or choreography concepts are added.",
  summary:
    "A single user-triggered motion study that moves the approved recommendation activity cards into the approved desktop activity grid.",
  whatItIs:
    "A scale-to-fit desktop review canvas for validating card identity, measured geometry and final handoff.",
  whenNotToUse:
    "Do not use this page as a product route integration or responsive approval surface yet.",
  whenToUse:
    "Use after the recommendation result is complete and the user presses Continue to begin arranging the recommended activities.",
  whereItAppears:
    `This route is ${revealToGridRoute}. Source states are ${recommendationRevealRoute} and ${activityGridRoute}.`,
  whyItExists:
    "The recommendation should feel like it becomes the editable activity grid instead of disappearing into a new screen."
};

function PreviewControls({
  onReset,
  onReducedMotionChange,
  onSlowChange,
  reducedMotion,
  slow
}: {
  onReset: () => void;
  onReducedMotionChange: (value: boolean) => void;
  onSlowChange: (value: boolean) => void;
  reducedMotion: boolean;
  slow: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className="rounded-md border border-white/[0.14] px-3 py-1.5 text-[13px] font-medium text-[#ededed] hover:bg-white/[0.08]"
        onClick={onReset}
        type="button"
      >
        Reset
      </button>
      <label className="flex h-8 items-center gap-2 rounded-md border border-white/[0.14] px-3 text-[13px] font-medium text-[#ededed]">
        <input
          checked={slow}
          className="accent-[#B77B32]"
          onChange={(event) => onSlowChange(event.target.checked)}
          type="checkbox"
        />
        Slow inspection
      </label>
      <label className="flex h-8 items-center gap-2 rounded-md border border-white/[0.14] px-3 text-[13px] font-medium text-[#ededed]">
        <input
          checked={reducedMotion}
          className="accent-[#B77B32]"
          onChange={(event) => onReducedMotionChange(event.target.checked)}
          type="checkbox"
        />
        Reduced motion
      </label>
    </div>
  );
}

function PreviewSection() {
  const [resetKey, setResetKey] = useState(0);
  const [slow, setSlow] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <section className="scroll-mt-28 py-8" id="preview">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
            Desktop Transition Preview
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
            The simulated product viewport is 1440 x 900 and scales down as one
            complete canvas. Press Continue inside the preview to start.
          </p>
        </div>
        <PreviewControls
          onReducedMotionChange={setReducedMotion}
          onReset={() => setResetKey((key) => key + 1)}
          onSlowChange={setSlow}
          reducedMotion={reducedMotion}
          slow={slow}
        />
      </div>

      <div className="mt-5 rounded-[10px] border border-white/[0.14] bg-[#111214] p-4">
        <RecommendationRevealToGridPreview
          reducedMotion={reducedMotion}
          resetKey={resetKey}
          slow={slow}
        />
      </div>
    </section>
  );
}

function ImplementationSection() {
  const notes = [
    [
      "Start state",
      "Renders RecommendationResultExperience with the signed-off RecommendationCardReveal forced to its completed fan state."
    ],
    [
      "Destination state",
      "Renders the extracted desktop Activity Grid visual layer with matching stable card IDs."
    ],
    [
      "Measurement",
      "Source and destination card rectangles are read from the actual rendered DOM immediately when Continue is pressed."
    ],
    [
      "Shared layer",
      "The transition layer uses the same ActivityCard surface and hides duplicate source/destination cards while moving."
    ],
    [
      "Scope",
      "Desktop only: no mobile, tablet, large desktop, XL desktop or alternate choreography concepts in this pass."
    ]
  ];

  return (
    <section className="scroll-mt-28 py-8" id="implementation">
      <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
        Implementation Notes
      </h3>
      <div className="mt-5 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#0a0a0a]">
        {notes.map(([label, value]) => (
          <div
            className="grid gap-3 border-b border-white/[0.1] p-4 last:border-b-0 md:grid-cols-[180px_minmax(0,1fr)]"
            key={label}
          >
            <dt className="text-xs font-semibold uppercase text-[#B77B32]">
              {label}
            </dt>
            <dd className="text-sm leading-6 text-[#a1a1a1]">{value}</dd>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecommendationRevealToGridPageClient() {
  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref={revealToGridRoute} />
        <ComponentPageShell
          description="A desktop-first measured transition from the approved Recommendation Result into the approved Activity Grid."
          metadata={metadata}
          sections={sections}
        >
          <ComponentOverviewSection {...overviewCopy} />
          <PreviewSection />
          <ImplementationSection />
        </ComponentPageShell>
      </div>
    </main>
  );
}
