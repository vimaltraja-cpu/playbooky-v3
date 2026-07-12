"use client";

import Link from "next/link";
import { useMemo } from "react";

import {
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { ActivityCard, type ActivityCardData } from "@/components/ui/ActivityCard";
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
  confidence: "2 Prototype review",
  lastUpdated: "2026-07-12",
  owner: "Design System",
  status: "Current review candidate",
  title: "Activity Modal Motion"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "prototype", label: "Prototype" },
  { id: "motion-notes", label: "Motion Notes" }
];

const overviewCopy = {
  statusNote:
    "V2 is the current review candidate. Open the full-screen prototype from the preview below to review the accepted isolated shell motion.",
  summary:
    "Activity Modal Motion isolates the opening and closing transition from a selected Activity Card into the approved Activity Detail Modal shell.",
  whatItIs:
    "A shell-only motion prototype for reviewing how an Activity Card opens into a fixed modal-content surface.",
  whenNotToUse:
    "Do not use this page to approve Activity Card, Activity Grid, or final Activity Modal interface decisions.",
  whenToUse:
    "Use it to launch the full-screen V2 prototype, click different cards, and review the approved shell movement, frost layer, and modal reveal.",
  whereItAppears:
    "Inside the Design System under Core Experience, with the interactive V2 prototype hosted on an isolated full-screen route.",
  whyItExists:
    "To keep transition behaviour reviewable without embedding the full motion engine inside the documentation surface."
};

function toActivityCardData(activity: CanonicalActivityCardRecord) {
  return {
    description: activity.description,
    duration: activity.duration,
    illustration: activity.illustration,
    title: activity.title,
    workshopType: activity.workshopType
  } satisfies ActivityCardData;
}

type ActivityModalMotionPreviewCard = {
  activity: ActivityCardData;
  id: string;
  label: string;
};

function getInitialCards(activities: CanonicalActivityCardRecord[]) {
  const activitiesBySlug = new Map(
    activities.map((activity) => [activity.slug, activity])
  );

  return REPRESENTATIVE_ACTIVITY_SLUGS.map((slug) => {
    const activity = activitiesBySlug.get(slug);

    if (!activity) {
      throw new Error(`Missing representative workshop activity: ${slug}`);
    }

    const cardData = toActivityCardData(activity);

    return {
      activity: cardData,
      id: `activity-modal-motion-${activity.slug}`,
      label: cardData.title
    } satisfies ActivityModalMotionPreviewCard;
  });
}

function FullScreenPrototypePreviewLink({
  actionLabel,
  cards,
  eyebrow,
  href,
  title
}: {
  actionLabel: string;
  cards: ActivityModalMotionPreviewCard[];
  eyebrow: string;
  href: string;
  title: string;
}) {
  return (
    <Link
      aria-label={`${actionLabel}: ${title}`}
      className="group block rounded-[16px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d3a]/50"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="overflow-hidden rounded-[16px] border border-[#dfd4c5] bg-[#F3EEE7] shadow-[0_18px_48px_rgba(36,31,24,0.10)] transition group-hover:-translate-y-0.5 group-hover:shadow-[0_22px_60px_rgba(36,31,24,0.14)]">
        <div className="flex min-h-11 items-center justify-between border-b border-[#dfd4c5] bg-[#FCFBFA]/82 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7D5330]">
              {eyebrow}
            </p>
            <h4 className="mt-1 text-base font-semibold text-[#324236]">
              {title}
            </h4>
          </div>
          <span className="rounded-[12px] bg-[#324236] px-4 py-2 text-sm font-semibold text-[#FCFBFA]">
            {actionLabel}
          </span>
        </div>

        <div className="relative h-[248px] overflow-hidden px-5 py-5">
          <div
            aria-hidden="true"
            className="pointer-events-none origin-top-left"
            style={{
              transform: "scale(0.62)",
              width: 1376
            }}
          >
            <div className="grid grid-cols-[repeat(5,256px)] gap-6">
              {cards.map((card) => (
                <ActivityCard
                  activity={card.activity}
                  key={card.id}
                  variant="builder"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MotionPrototypeSection({
  cards
}: {
  cards: ActivityModalMotionPreviewCard[];
}) {
  return (
    <section className="scroll-mt-40 py-10" id="prototype">
      <h3 className="text-2xl font-semibold">Prototype</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
        V2 is hosted as a full-screen review route so the shell motion can be
        tested without portal chrome or competing preview containers.
      </p>
      <div className="mt-7 max-w-[980px]">
        <FullScreenPrototypePreviewLink
          actionLabel="Open full-screen motion prototype"
          cards={cards}
          eyebrow="Current review candidate"
          href="/activity-modal-motion-v2"
          title="Activity Modal Motion V2"
        />
      </div>
    </section>
  );
}

function MotionNotesSection() {
  const notes = [
    [
      "Geometry",
      "The selected card and complete Activity Grid bounds are measured with getBoundingClientRect, then one fixed shell animates between those rectangles."
    ],
    [
      "Focus",
      "The shell clips fixed modal content while the frost layer peaks midway through the transition and clears before the modal settles."
    ],
    [
      "Content",
      "The modal content is laid out at its final internal size. It does not translate, scale, or chase the shell."
    ],
    [
      "Closing",
      "The origin card is remeasured before contraction, allowing the return motion to track layout changes instead of shrinking toward the centre."
    ]
  ];

  return (
    <section className="scroll-mt-40 py-10" id="motion-notes">
      <h3 className="text-2xl font-semibold">Motion Notes</h3>
      <dl className="mt-7 grid gap-5 md:grid-cols-2">
        {notes.map(([label, description]) => (
          <div
            className="border-l-4 border-[#D99C56] bg-white/35 py-2 pl-5"
            key={label}
          >
            <dt className="text-sm font-semibold text-[color:var(--foreground)]">
              {label}
            </dt>
            <dd className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              {description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ActivityModalMotionPageClient({
  activities
}: {
  activities: CanonicalActivityCardRecord[];
}) {
  const cards = useMemo(() => getInitialCards(activities), [activities]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-modal-motion" />

        <ComponentPageShell
          description="A separate motion-only prototype for reviewing how an Activity Card expands into an Activity Grid-sized Activity Modal surface."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />
          <MotionPrototypeSection cards={cards} />
          <MotionNotesSection />
        </ComponentPageShell>
      </div>
    </main>
  );
}
