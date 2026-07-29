"use client";

import { useMemo } from "react";

import {
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { apertureRevealMeta } from "@/components/prototypes/activity-modal-motion-v3/concept-3-aperture-reveal/ApertureRevealConcept";
import { ApertureRevealConcept } from "@/components/prototypes/activity-modal-motion-v3/concept-3-aperture-reveal/ApertureRevealConcept";
import { cohesiveSurfaceMeta } from "@/components/prototypes/activity-modal-motion-v3/concept-1-cohesive-surface/CohesiveSurfaceConcept";
import { CohesiveSurfaceConcept } from "@/components/prototypes/activity-modal-motion-v3/concept-1-cohesive-surface/CohesiveSurfaceConcept";
import { focusFieldMeta } from "@/components/prototypes/activity-modal-motion-v3/concept-2-focus-field/FocusFieldConcept";
import { FocusFieldConcept } from "@/components/prototypes/activity-modal-motion-v3/concept-2-focus-field/FocusFieldConcept";
import { ConceptFrame } from "@/components/prototypes/activity-modal-motion-v3/shared/ConceptFrame";
import type { V3PrototypeCard } from "@/components/prototypes/activity-modal-motion-v3/shared/types";
import { getActivityDetailModalData } from "@/lib/design-system/activity-detail-modal-demo";
import type { CanonicalActivityCardRecord } from "@/lib/data/canonical-activity-cards";

const REPRESENTATIVE_ACTIVITY_SLUGS = [
  "problem-statement",
  "five-whys",
  "journey-map",
  "stakeholder-map",
  "how-might-we",
  "okrs"
] as const;

const componentMetadata = {
  category: "Core Experience",
  confidence: "3 Exploration — not yet a review candidate",
  lastUpdated: "2026-07-28",
  owner: "Design System",
  status: "In exploration",
  title: "Active Modal Motion V3 — Explorations"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "problem", label: "Problem" },
  { id: "cohesive-surface", label: "1. Cohesive Surface" },
  { id: "focus-field", label: "2. Focus Field" },
  { id: "aperture-reveal", label: "3. Aperture Reveal" },
  { id: "recommendation", label: "Recommendation" }
];

function getPrototypeCards(
  activities: CanonicalActivityCardRecord[]
): V3PrototypeCard[] {
  const activitiesBySlug = new Map(
    activities.map((activity) => [activity.slug, activity])
  );

  return REPRESENTATIVE_ACTIVITY_SLUGS.map((slug) => {
    const activity = activitiesBySlug.get(slug);

    if (!activity) {
      throw new Error(`Missing V3 exploration activity: ${slug}`);
    }

    return {
      activity: {
        description: activity.description,
        duration: activity.duration,
        illustration: activity.illustration,
        title: activity.title,
        workshopType: activity.workshopType
      },
      id: `activity-modal-motion-v3-${activity.slug}`,
      label: activity.title,
      modalData: getActivityDetailModalData(activity)
    };
  });
}

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
        experience. These three explorations each solve that rigidity with a
        different motion principle, while reusing the same activity card and
        activity detail modal content/visual language as V2 — this is a
        motion-only comparison, not a redesign.
      </p>

      <h4 className="mt-6 text-[13px] font-semibold leading-5 text-[#ededed]">
        Reference motion principles applied across all three
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
          Closing is a deliberately composed sequence — secondary content
          exits before the surface compresses — never a mechanical reverse,
          and focus always returns to the originating card.
        </li>
        <li>
          <code>prefers-reduced-motion</code> gets a genuinely different
          behaviour (cross-fade, no geometry animation), not just a shorter
          duration. Use each concept&apos;s &quot;Preview reduced motion&quot;
          toggle below to see it without changing your OS setting.
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

function RecommendationSection() {
  return (
    <section className="scroll-mt-28 py-8" id="recommendation">
      <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
        Recommendation
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
        All three concepts satisfy the motion brief and remain live for
        comparison — this page intentionally does not remove or de-emphasize
        any of them. As a closing opinion rather than a decision: Concept 1
        (Cohesive Surface Morph) is the strongest default for the activity
        grid because it most directly answers &quot;this card became the
        focused experience&quot; while staying visually restrained and cheap
        to run (transform + opacity only). Concept 2 (Focus Field) is the
        better fit if the destination content&apos;s shape stops matching the
        card&apos;s aspect ratio, or if grid position becomes unstable (e.g.
        after filtering). Concept 3 (Aperture Reveal) is worth prototyping
        further as a dedicated &quot;focus mode&quot; entry point — e.g. from
        the workshop builder when someone commits to working an activity
        end-to-end — where a fuller canvas takeover and a persistent context
        rail earn their extra visual weight. None of this forecloses further
        exploration; it is a starting recommendation for the next review, not
        an implementation decision.
      </p>
    </section>
  );
}

export function ActivityModalMotionV3PageClient({
  activities
}: {
  activities: CanonicalActivityCardRecord[];
}) {
  const cards = useMemo(() => getPrototypeCards(activities), [activities]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-modal-motion-v3" />

        <ComponentPageShell
          description="Three structurally different motion explorations for the activity card → activity detail modal transition, built to solve the mechanical/rigid feel of the V2 isolated shell prototype. All three stay live for comparison; none is presented as a final decision."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ProblemSection />

          <section className="scroll-mt-28 py-8" id="cohesive-surface">
            <ConceptFrame
              controls={null}
              meta={cohesiveSurfaceMeta}
            >
              <CohesiveSurfaceConcept cards={cards} />
            </ConceptFrame>
          </section>

          <section className="scroll-mt-28 py-8" id="focus-field">
            <ConceptFrame controls={null} meta={focusFieldMeta}>
              <FocusFieldConcept cards={cards} />
            </ConceptFrame>
          </section>

          <section className="scroll-mt-28 py-8" id="aperture-reveal">
            <ConceptFrame controls={null} meta={apertureRevealMeta}>
              <ApertureRevealConcept cards={cards} />
            </ConceptFrame>
          </section>

          <RecommendationSection />
        </ComponentPageShell>
      </div>
    </main>
  );
}
