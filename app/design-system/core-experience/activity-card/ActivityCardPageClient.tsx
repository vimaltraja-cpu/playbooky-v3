"use client";

import { useState } from "react";

import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentPageShell,
  ComponentStateShowroom,
  ComponentTokensSection,
  ComponentViewportShowroom,
  type ComponentAccessibilityItem,
  type ComponentSectionNavItem,
  type ComponentShowroomState,
  type ComponentTokenRow,
  type ViewportShowroomItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  ActivityCard,
  type ActivityCardState,
  type ActivityCardVariant
} from "@/components/ui/ActivityCard";
import {
  activityLibrarySource,
  createActivitySlug,
  type Activity
} from "@/lib/data/activities";

type ViewportId = "desktop" | "tablet" | "mobile";

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-07-08",
  owner: "Design System",
  status: "Exploring",
  title: "Activity Card System"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "variants", label: "Variants" },
  { id: "states", label: "States" },
  { id: "viewports", label: "Viewports" },
  { id: "motion", label: "Motion" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" }
];

const overviewCopy = {
  statusNote:
    "This is a single reusable component with contextual variants. It is not approved for product screens yet.",
  summary:
    "Activity Card System defines one reusable ActivityCard component that can adapt to Library, Builder, Recommendation, and future Live contexts while keeping the same shared card foundation.",
  whatItIs:
    "A data-backed PlayBooky component that summarizes one canonical activity and swaps only the contextual controls required by each experience.",
  whenNotToUse:
    "Do not create separate LibraryCard, BuilderActivityCard, or RecommendationCard components. Do not use it as the final product Activity Library or Workshop Builder UI yet.",
  whenToUse:
    "Use it in the Design Portal to review how one activity card foundation can support browse, build, recommendation, and future live-delivery contexts.",
  whereItAppears:
    "Inside the Design Portal only for now. Future product usage must wait until the component reaches an approved status.",
  whyItExists:
    "To prevent component drift across PlayBooky experiences and prove that real Activity Library data can power reusable UI without duplicating product knowledge in code."
};

const viewportItems: Array<ViewportShowroomItem<ViewportId>> = [
  {
    id: "desktop",
    label: "Desktop",
    notes: [
      ["Preview assumption", "Desktop review canvas"],
      ["Card width", "Max 420px"],
      ["Layout", "Image or placeholder above shared content"],
      ["Data source", activityLibrarySource]
    ]
  },
  {
    id: "tablet",
    label: "Tablet",
    notes: [
      ["Preview assumption", "Tablet-width review canvas"],
      ["Card width", "Fluid within constrained preview"],
      ["Behaviour", "Shared body and variant controls remain stacked"],
      ["Data source", activityLibrarySource]
    ]
  },
  {
    id: "mobile",
    label: "Mobile",
    notes: [
      ["Preview assumption", "Mobile-width review canvas"],
      ["Card width", "Fluid to available width"],
      ["Behaviour", "Metadata wraps before description and controls"],
      ["Data source", activityLibrarySource]
    ]
  }
];

const showroomStates: Array<ComponentShowroomState<ActivityCardState>> = [
  {
    durationMs: 1800,
    id: "default",
    label: "Default",
    notes: [
      ["Trigger", "Resting card in an activity review list."],
      [
        "Behaviour",
        "Shows canonical activity summary, metadata, and illustration fallback when the asset is missing."
      ],
      ["Motion", "No motion while resting."],
      ["Accessibility", "Card content remains readable without hover."],
      [
        "Tokenisation notes",
        "Surface, spacing, radius, and typography are prototype values."
      ]
    ]
  },
  {
    durationMs: 1800,
    id: "hover",
    label: "Hover",
    notes: [
      ["Trigger", "Pointer hover or visual preview of hover affordance."],
      [
        "Behaviour",
        "Uses a warmer border and soft elevation while keeping shared content unchanged."
      ],
      ["Motion", "Shadow and border transition over 160-240ms."],
      ["Accessibility", "Hover is not the only state cue."],
      ["Tokenisation notes", "Hover shadow needs component tokens later."]
    ]
  },
  {
    durationMs: 1800,
    id: "selected",
    label: "Selected / Added",
    notes: [
      ["Trigger", "Activity is selected or added in a contextual flow."],
      [
        "Behaviour",
        "Shows stronger brand border, elevation, and selected/addition confirmation while preserving the shared card body."
      ],
      ["Motion", "State transition remains subtle and non-blocking."],
      [
        "Accessibility",
        "Selected state must be exposed by the future interactive parent control."
      ],
      [
        "Tokenisation notes",
        "Selected border and status values are pending tokens."
      ]
    ]
  },
  {
    durationMs: 1800,
    id: "dragging",
    label: "Dragging",
    notes: [
      ["Trigger", "Activity is being repositioned in a future builder flow."],
      [
        "Behaviour",
        "Adds slight scale, rotation, opacity, and stronger elevation without changing the card body."
      ],
      ["Motion", "Transform should be short and tactile."],
      [
        "Accessibility",
        "Future drag-and-drop implementation must include keyboard alternatives."
      ],
      ["Tokenisation notes", "Dragging elevation needs motion and shadow tokens."]
    ]
  },
  {
    durationMs: 1800,
    id: "locked",
    label: "Locked / unavailable",
    notes: [
      [
        "Trigger",
        "Activity is unavailable for the selected workshop context."
      ],
      [
        "Behaviour",
        "Card remains readable but muted and includes an availability note."
      ],
      ["Motion", "No hover lift while unavailable."],
      [
        "Accessibility",
        "Unavailable state must be exposed by the future interactive parent control."
      ],
      ["Tokenisation notes", "Locked surface treatment needs final tokens."]
    ]
  }
];

const variantItems: Array<{
  id: ActivityCardVariant;
  label: string;
  notes: Array<[string, string]>;
}> = [
  {
    id: "library",
    label: "Library",
    notes: [
      ["Purpose", "Browse activities in the Activity Library."],
      ["Controls", "Preview and Add Activity."],
      ["Constraint", "No drag handle in the Library variant."]
    ]
  },
  {
    id: "builder",
    label: "Builder",
    notes: [
      ["Purpose", "Build and reorder a workshop."],
      ["Controls", "Drag handle, reordering controls, and selection."],
      [
        "Constraint",
        "Builder CSS is intentionally placeholder until provided."
      ]
    ]
  },
  {
    id: "recommendation",
    label: "Recommendation",
    notes: [
      ["Purpose", "Review AI-recommended activities."],
      [
        "Controls",
        "Placeholder confidence, Why this activity?, Accept, and Replace."
      ],
      ["Constraint", "No recommendation logic is invented in this page."]
    ]
  },
  {
    id: "live",
    label: "Live",
    notes: [
      ["Purpose", "Future workshop delivery context."],
      ["Controls", "Placeholder areas for timer, progress, and instructions."],
      ["Constraint", "No live implementation yet."]
    ]
  }
];

const tokenRows: ComponentTokenRow[] = [
  {
    implementationValue: "max-width: 420px",
    label: "Card width",
    status: "hardcoded"
  },
  {
    implementationValue: "28px",
    label: "Card radius",
    status: "hardcoded"
  },
  {
    implementationValue: "#FCFBF9 / #F4EFE6",
    label: "Surface colours",
    status: "hardcoded"
  },
  {
    implementationValue: "#7D5330 / #D8C08A",
    label: "Brand state colours",
    status: "hardcoded"
  },
  {
    implementationValue: "160-300ms cubic-bezier(0.2,0,0,1)",
    label: "Card and control motion",
    status: "hardcoded"
  },
  {
    implementationValue: activityLibrarySource,
    label: "Canonical data source",
    status: "approved"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Text colours need formal contrast checks once final card tokens are approved.",
      title: "Text contrast"
    },
    {
      description:
        "Missing illustration warning uses visible text and does not depend on colour alone.",
      title: "Asset warning"
    }
  ],
  focusBehaviour: [
    {
      description:
        "The card is currently a display component. Future interactive use must define focus treatment for the whole card and contextual controls.",
      title: "Interaction model pending"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "Future add, select, reorder, and replace behaviours must include keyboard-accessible controls.",
      title: "Keyboard operation"
    }
  ],
  reducedMotion: [
    {
      description:
        "Variant and state transitions use subtle CSS transitions and must respect reduced-motion when wired into product interactions.",
      title: "Motion fallback"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The illustration is decorative in this prototype; canonical text fields provide the activity information.",
      title: "Decorative media"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Final semantics should be reviewed once Activity Card is used in a real selection, recommendation, or builder flow.",
      title: "Product flow dependency"
    }
  ]
};

function InfoRows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="mt-5 space-y-4">
      {rows.map(([term, description]) => (
        <div key={term}>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
            {term}
          </dt>
          <dd className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
            {description}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function VariantsSection({
  activity,
  hasIllustration
}: {
  activity: Activity;
  hasIllustration: boolean;
}) {
  const [activeVariant, setActiveVariant] =
    useState<ActivityCardVariant>("library");
  const activeItem =
    variantItems.find((variant) => variant.id === activeVariant) ??
    variantItems[0];

  return (
    <section id="variants" className="scroll-mt-40 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-semibold">Variants</h3>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            Variants keep the same card foundation and swap only the controls
            that belong to the current PlayBooky context.
          </p>
        </div>
        <div
          aria-label="Activity Card variants"
          className="flex w-fit max-w-full rounded-full border border-[color:var(--line)] bg-white/65 p-1"
          role="tablist"
        >
          {variantItems.map((variant) => (
            <button
              aria-controls={`variant-panel-${variant.id}`}
              aria-selected={activeVariant === variant.id}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                activeVariant === variant.id
                  ? "bg-[#7D5330] !text-[#FCFBF9] shadow-[0_10px_24px_rgba(125,83,48,0.18)]"
                  : "!text-[#171614] hover:bg-[#EFE3D2]/60"
              ].join(" ")}
              id={`variant-tab-${variant.id}`}
              key={variant.id}
              onClick={() => setActiveVariant(variant.id)}
              role="tab"
              type="button"
            >
              {variant.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 min-[1500px]:grid-cols-[minmax(820px,1fr)_320px]">
        <div
          aria-labelledby={`variant-tab-${activeItem.id}`}
          className="flex min-h-[590px] min-w-0 items-center justify-center rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA] p-6"
          id={`variant-panel-${activeItem.id}`}
          key={activeItem.id}
          role="tabpanel"
        >
          <div className="max-w-full overflow-x-auto py-8">
            <ActivityCard
              activity={activity}
              hasIllustration={hasIllustration}
              state="default"
              variant={activeItem.id}
            />
          </div>
        </div>
        <div className="rounded-[24px] border border-[color:var(--line)] bg-white/55 p-5">
          <h4 className="text-sm font-semibold">{activeItem.label} notes</h4>
          <InfoRows rows={activeItem.notes} />
        </div>
      </div>
    </section>
  );
}

function ViewportPreview({
  activity,
  hasIllustration,
  viewport
}: {
  activity: Activity;
  hasIllustration: boolean;
  viewport: ViewportId;
}) {
  const widthClass =
    viewport === "desktop"
      ? "max-w-[980px]"
      : viewport === "tablet"
        ? "max-w-[680px]"
        : "max-w-[390px]";

  return (
    <div className="flex min-h-[590px] items-center justify-center overflow-visible rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA] p-5">
      <div className={`${widthClass} flex w-full justify-center`}>
        <ActivityCard
          activity={activity}
          hasIllustration={hasIllustration}
          state="default"
          variant="library"
        />
      </div>
    </div>
  );
}

function StatePreview({
  activity,
  hasIllustration,
  state
}: {
  activity: Activity;
  hasIllustration: boolean;
  state: ActivityCardState;
}) {
  return (
    <div className="flex w-full justify-center">
      <ActivityCard
        activity={activity}
        hasIllustration={hasIllustration}
        state={state}
        variant={state === "dragging" ? "builder" : "library"}
      />
    </div>
  );
}

function MotionSection() {
  return (
    <section id="motion" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Motion</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
        Motion keeps the Activity Card stable. The shared foundation does not
        resize when variants change; only contextual controls transition in and
        out.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          [
            "Hover",
            "Border and elevation transition over 160-240ms with cubic-bezier(0.2,0,0,1)."
          ],
          [
            "Variant controls",
            "Controls appear in the same reserved footer area to avoid layout jumps."
          ],
          [
            "Reduced motion",
            "State and variant changes must remain readable without animation."
          ]
        ].map(([title, description]) => (
          <div
            className="rounded-[24px] border border-[color:var(--line)] bg-white/55 p-5"
            key={title}
          >
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ActivityCardPageClient({
  activity,
  hasIllustration
}: {
  activity: Activity;
  hasIllustration: boolean;
}) {
  const activityName = activity["Activity Name"] || "Untitled activity";

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-card" />

        <ComponentPageShell
          description="A reusable activity summary card backed by canonical Activity Library CSV data. The card supports contextual variants without creating separate component types."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          {!hasIllustration ? (
            <section className="scroll-mt-40 py-4">
              <div className="rounded-[24px] border border-[#E5D2B6] bg-[#FFF8EB] p-5">
                <p className="text-sm font-semibold text-[#7D5330]">
                  Activity illustration missing
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6E6253]">
                  The card is intentionally showing the designed placeholder.
                  Add the approved illustration later at{" "}
                  <code className="rounded-lg bg-white/70 px-1.5 py-1 text-[#2C2924]">
                    public/assets/activities/
                    {createActivitySlug(activityName)}
                    /illustration.png
                  </code>
                  .
                </p>
              </div>
            </section>
          ) : null}

          <VariantsSection
            activity={activity}
            hasIllustration={hasIllustration}
          />

          <ComponentStateShowroom
            autoplayEnabled={false}
            description="A manual showroom for reviewing Activity Card states before the component is approved for product workflows."
            renderPreview={(state) => (
              <StatePreview
                activity={activity}
                hasIllustration={hasIllustration}
                state={state}
              />
            )}
            states={showroomStates}
          />

          <ComponentViewportShowroom
            description="The same ActivityCard foundation stays readable across desktop, tablet, and mobile review widths."
            renderPreview={(viewport) => (
              <ViewportPreview
                activity={activity}
                hasIllustration={hasIllustration}
                viewport={viewport}
              />
            )}
            viewports={viewportItems}
          />

          <MotionSection />

          <ComponentTokensSection
            description="Prototype values remain hardcoded for review. These must become approved tokens before product use."
            tokens={tokenRows}
          />

          <ComponentAccessibilitySection
            contrastNotes={accessibilityNotes.contrastNotes}
            focusBehaviour={accessibilityNotes.focusBehaviour}
            keyboardBehaviour={accessibilityNotes.keyboardBehaviour}
            reducedMotion={accessibilityNotes.reducedMotion}
            screenReaderNotes={accessibilityNotes.screenReaderNotes}
            unresolvedIssues={accessibilityNotes.unresolvedIssues}
          />
        </ComponentPageShell>
      </div>
    </main>
  );
}
