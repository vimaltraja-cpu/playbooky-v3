"use client";

import Link from "next/link";

import {
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  cohesiveSurfaceFramedMeta,
  cohesiveSurfaceFramelessMeta
} from "@/components/prototypes/activity-modal-motion-v3/concept-1-cohesive-surface/CohesiveSurfaceConcept";
import { focusFieldMeta } from "@/components/prototypes/activity-modal-motion-v3/concept-2-focus-field/FocusFieldConcept";
import { thresholdUnfoldMeta } from "@/components/prototypes/activity-modal-motion-v3/concept-3-threshold-unfold/ThresholdUnfoldConcept";
import type { ConceptMeta } from "@/components/prototypes/activity-modal-motion-v3/shared/types";

const componentMetadata = {
  category: "Core Experience",
  confidence: "4 Explorations — not yet a review candidate",
  lastUpdated: "2026-07-29",
  owner: "Design System",
  status: "In exploration",
  title: "Active Modal Motion V3 — Explorations"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "problem", label: "Problem" },
  { id: "cohesive-surface-framed", label: "1a. Cohesive Surface — Framed" },
  { id: "cohesive-surface-frameless", label: "1b. Cohesive Surface — Frameless" },
  { id: "focus-field", label: "2. Focus Field" },
  { id: "threshold-unfold", label: "3. Threshold Unfold" },
  { id: "recommendation", label: "Recommendation" }
];

// All four explorations now live on one consolidated, tabbed prototype
// route — each "Try the full-screen prototype" link preselects that
// concept/variant's tab via the `concept` query param rather than pointing
// at its own route. Concept 1 (Cohesive Surface) ships as two variants —
// Framed and Frameless — that share one motion engine and differ only in
// whether the card's border/stroke stays visible on the fully open modal.
const conceptRoutes: Record<string, string> = {
  "cohesive-surface-framed": "/activity-modal-motion-v3?concept=cohesive-surface-framed",
  "cohesive-surface-frameless": "/activity-modal-motion-v3?concept=cohesive-surface-frameless",
  "focus-field": "/activity-modal-motion-v3?concept=focus-field",
  "threshold-unfold": "/activity-modal-motion-v3?concept=threshold-unfold"
};

function ProblemSection() {
  return (
    <section className="scroll-mt-28 py-8" id="problem">
      <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
        Problem statement
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
        V2&apos;s isolated shell prototype is functionally correct but reads as
        mechanical: a rectangular container resizes, repositions, and swaps
        content in three visibly separate steps. It feels like a box being
        resized, not like the card the person tapped becoming their focused
        experience. These four explorations — three structurally different
        motion principles, with Concept 1 further split into two stroke
        variants — each solve that rigidity, while reusing the same activity
        card and activity detail modal content/visual language as V2 — this
        is a motion-only comparison, not a redesign.
      </p>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
        All four explorations are staged on one consolidated full-screen
        prototype route with a tab switcher — a real grid of real activity
        cards at real size, opening into a real modal that always fills the
        exact bounds of that same grid — the same way V2 is staged, rather
        than as a shrunk-down demo embedded in this write-up. Use the links
        below to try each one; each preselects its tab.
      </p>

      <h4 className="mt-6 text-[13px] font-semibold leading-5 text-[#ededed]">
        Reference motion principles applied across all four
      </h4>
      <ul className="mt-3 grid max-w-3xl list-disc gap-2 pl-4 text-sm leading-6 text-[#a1a1a1]">
        <li>
          One dominant motion per phase — no visible width-then-height
          stepping, no abrupt radius jumps, no exposed layout reflow, no
          elastic/rubbery bounce.
        </li>
        <li>
          Purposeful, distinct easing per phase (departure, geometric
          transform, content fade, landing, close) rather than one generic
          ease everywhere.
        </li>
        <li>
          Content sequencing: selection ack → environmental soften → surface
          transform → heading/orientation → supporting info → actions → final
          state. Content never animates simultaneously with geometry.
        </li>
        <li>
          Prefer transform/opacity/clip-path over animating width, height,
          top, or left directly; portal + rect measurement (FLIP-style) where
          geometry is needed, following the same technique as V2.
        </li>
        <li>
          One shared &quot;stage&quot; rule: every concept&apos;s open-state
          width/height/position is measured from the same real grid element
          — never viewport units, never a fixed/centered box — so the modal
          can never render larger than or outside the card grid&apos;s own
          bounds.
        </li>
        <li>
          Closing is a deliberately composed sequence — secondary content
          exits before the surface compresses — never a mechanical reverse,
          and focus always returns to the originating card.
        </li>
        <li>
          <code>prefers-reduced-motion</code> gets a genuinely different
          behaviour (cross-fade, no geometry animation), not just a shorter
          duration. Each full-screen prototype also has a &quot;Preview
          reduced motion&quot; toggle to see it without changing your OS
          setting.
        </li>
        <li>
          Interruption policy (consistent across all three): while a
          transition is in flight (any phase other than idle), all triggers
          are locked. A same-card click during the transition is a no-op; a
          different-card click is blocked rather than redirected, so an
          in-flight transition never has to re-target mid-flight.
        </li>
      </ul>
    </section>
  );
}

function ConceptCard({ meta }: { meta: ConceptMeta }) {
  return (
    <section
      aria-labelledby={`${meta.id}-heading`}
      className="scroll-mt-28 rounded-[20px] border border-[#2a2a2a] bg-[#161616] p-5"
      id={meta.id}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a1a1a1]">
        {meta.tagline}
      </p>
      <h3
        className="mt-2 text-xl font-semibold text-[#ededed]"
        id={`${meta.id}-heading`}
      >
        {meta.name}
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
        {meta.principle}
      </p>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-[#3fb27f]">
            Strengths
          </h4>
          <ul className="list-disc space-y-1 pl-4 text-xs leading-5 text-[#a1a1a1]">
            {meta.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-[#e07a5f]">Risks</h4>
          <ul className="list-disc space-y-1 pl-4 text-xs leading-5 text-[#a1a1a1]">
            {meta.risks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="mb-2 text-sm font-semibold text-[#ededed]">
          Recommended use
        </h4>
        <p className="text-xs leading-5 text-[#a1a1a1]">{meta.recommendedUse}</p>
      </div>

      <Link
        className="mt-6 inline-flex min-h-11 items-center rounded-[12px] bg-[#ededed] px-4 text-sm font-semibold text-[#161616] transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#aa7d3a]/50"
        href={conceptRoutes[meta.id]}
      >
        Try the full-screen prototype →
      </Link>
    </section>
  );
}

function RecommendationSection() {
  return (
    <section className="scroll-mt-28 py-8" id="recommendation">
      <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
        Recommendation
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
        All four explorations satisfy the motion brief and remain live for
        comparison — this page intentionally does not remove or de-emphasize
        any of them. As a closing opinion rather than a decision: Concept 1
        (Cohesive Surface Morph) is the strongest default for the activity
        grid because it most directly answers &quot;this card became the
        focused experience,&quot; via a real blurred-content crossfade rather
        than a flat panel swap, while staying cheap to run (transform +
        opacity + filter only) — the Frameless variant is the better fit if
        the fully open modal should match the rest of the product&apos;s
        borderless modal language, while Framed keeps the border visible
        throughout for a stronger persistent &quot;this card, now open&quot;
        read. Concept 2 (Focus Field) is the
        better fit if the destination content&apos;s shape stops matching the
        card&apos;s aspect ratio, or if grid position becomes unstable (e.g.
        after filtering). Concept 3 (Threshold Unfold) is worth prototyping
        further when the goal is for the transition to read as &quot;the
        grid&apos;s own space opening up&quot; rather than &quot;the card
        became the modal&quot; — a genuinely different spatial idea from the
        other two, while staying just as strictly bounded to the grid&apos;s
        own rect. None of this forecloses further exploration; it is a
        starting recommendation for the next review, not an implementation
        decision.
      </p>
    </section>
  );
}

export function ActivityModalMotionV3PageClient() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-modal-motion-v3" />

        <ComponentPageShell
          description="Three structurally different motion explorations for the activity card → activity detail modal transition, built to solve the mechanical/rigid feel of the V2 isolated shell prototype. All three now live on one consolidated, tab-switched full-screen prototype route, staged against the same real grid of real activity cards — exactly like V2 — rather than as an embedded demo on this page or three separate routes. All three stay live for comparison; none is presented as a final decision."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ProblemSection />

          <div className="flex flex-col gap-6 py-4">
            <ConceptCard meta={cohesiveSurfaceFramedMeta} />
            <ConceptCard meta={cohesiveSurfaceFramelessMeta} />
            <ConceptCard meta={focusFieldMeta} />
            <ConceptCard meta={thresholdUnfoldMeta} />
          </div>

          <RecommendationSection />
        </ComponentPageShell>
      </div>
    </main>
  );
}
