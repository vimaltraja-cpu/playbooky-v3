"use client";

import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentPageShell,
  ComponentStateShowroom,
  ComponentTokensSection,
  ComponentViewportShowroom,
  type ComponentAccessibilityItem,
  type ComponentShowroomState,
  type ComponentTokenRow,
  type ViewportShowroomItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  ActivityCard,
  type ActivityCardState
} from "@/components/ui/ActivityCard";
import {
  activityLibrarySource,
  createActivitySlug,
  type Activity
} from "@/lib/data/activities";

type ViewportId = "desktop" | "tablet" | "mobile";
type ShowroomState = ActivityCardState;

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-07-08",
  owner: "Design System",
  status: "Exploring",
  title: "Activity Card"
};

const overviewCopy = {
  statusNote:
    "This card uses real canonical activity data and prototype visual values. It is not approved for product screens yet.",
  summary:
    "Activity Card is the first reusable component for previewing one facilitation activity from the Activity Library.",
  whatItIs:
    "A data-backed card that summarizes activity purpose, stage, duration, inputs, outputs, and illustration availability.",
  whenNotToUse:
    "Do not use it as the final product Activity Library UI, filtering surface, or workshop builder card until those flows are approved.",
  whenToUse:
    "Use it inside the Design Portal to review how canonical Activity Library data may appear in a reusable component.",
  whereItAppears:
    "Inside the Design Portal only for now. The component is not wired into product workflows.",
  whyItExists:
    "To prove reusable PlayBooky components can consume canonical CSV data without inventing activity content in UI code."
};

const viewportItems: Array<ViewportShowroomItem<ViewportId>> = [
  {
    id: "desktop",
    label: "Desktop",
    notes: [
      ["Preview assumption", "Desktop review canvas"],
      ["Card width", "Max 420px"],
      ["Layout", "Image/placeholder above content"],
      ["Data source", activityLibrarySource]
    ]
  },
  {
    id: "tablet",
    label: "Tablet",
    notes: [
      ["Preview assumption", "Tablet-width review canvas"],
      ["Card width", "Fluid within constrained preview"],
      ["Behaviour", "Content remains stacked and readable"],
      ["Data source", activityLibrarySource]
    ]
  },
  {
    id: "mobile",
    label: "Mobile",
    notes: [
      ["Preview assumption", "Mobile-width review canvas"],
      ["Card width", "Fluid to available width"],
      ["Behaviour", "Metadata wraps before content"],
      ["Data source", activityLibrarySource]
    ]
  }
];

const showroomStates: Array<ComponentShowroomState<ShowroomState>> = [
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
      [
        "Accessibility",
        "Card content remains readable without relying on hover."
      ],
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
        "Uses a warmer border and soft elevation while keeping content unchanged."
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
      ["Trigger", "Activity is added to a future workshop selection."],
      [
        "Behaviour",
        "Shows a stronger brand border, elevation, and Added label."
      ],
      ["Motion", "State transition remains subtle and non-blocking."],
      [
        "Accessibility",
        "Selected state must be exposed by the future interactive parent control."
      ],
      [
        "Tokenisation notes",
        "Selected border and badge values are pending tokens."
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
        "Adds slight scale, rotation, opacity, and stronger elevation."
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
        "Activity is not available for the selected workshop context."
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
    implementationValue: "22px-28px rounded image and card surfaces",
    label: "Nested radius",
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
        "The card is currently a display component. Future interactive use must define focus treatment.",
      title: "Interaction model pending"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "Future add, select, and drag behaviours must include keyboard-accessible controls.",
      title: "Keyboard operation"
    }
  ],
  reducedMotion: [
    {
      description:
        "Prototype state changes use basic CSS transitions and must respect reduced-motion when wired into interactions.",
      title: "Motion fallback"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The illustration is decorative in this prototype; the canonical text fields provide the activity information.",
      title: "Decorative media"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Final product semantics should be reviewed when Activity Card is used in a real selection or builder flow.",
      title: "Product flow dependency"
    }
  ]
};

function SpecsSection({
  activity,
  hasIllustration
}: {
  activity: Activity;
  hasIllustration: boolean;
}) {
  const specs = [
    ["Representative activity", activity["Activity Name"]],
    ["Activity slug", createActivitySlug(activity["Activity Name"])],
    ["Canonical source", activityLibrarySource],
    ["Illustration available", hasIllustration ? "Yes" : "No"],
    ["Stage", activity["Stage"] || "Missing"],
    ["Duration", activity["Duration"] || "Missing"],
    ["Remote Friendly", activity["Remote Friendly"] || "Missing"],
    ["Layout Type", activity["Layout Type"] || "Missing"]
  ];

  return (
    <section id="specs" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Specs</h3>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white/55">
        {specs.map(([label, value]) => (
          <div
            className="grid gap-2 border-b border-[color:var(--line)] p-4 last:border-b-0 sm:grid-cols-[190px_1fr]"
            key={label}
          >
            <div className="text-sm font-semibold">{label}</div>
            <div className="font-mono text-sm text-[color:var(--muted)]">
              {value || "Missing"}
            </div>
          </div>
        ))}
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
    <div className="flex min-h-[560px] items-center justify-center overflow-visible rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA] p-5">
      <div className={`${widthClass} flex w-full justify-center`}>
        <ActivityCard
          activity={activity}
          hasIllustration={hasIllustration}
          state="default"
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
  state: ShowroomState;
}) {
  return (
    <div className="flex w-full justify-center">
      <ActivityCard
        activity={activity}
        hasIllustration={hasIllustration}
        state={state}
      />
    </div>
  );
}

export function ActivityCardPageClient({
  activity,
  hasIllustration
}: {
  activity: Activity;
  hasIllustration: boolean;
}) {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-card" />

        <ComponentPageShell
          description="A reusable activity summary card backed by canonical Activity Library CSV data. This component is for Design Portal review only."
          metadata={componentMetadata}
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
                    {createActivitySlug(activity["Activity Name"])}
                    /illustration.png
                  </code>
                  .
                </p>
              </div>
            </section>
          ) : null}

          <SpecsSection activity={activity} hasIllustration={hasIllustration} />

          <ComponentViewportShowroom
            description="The card stays as a contained summary surface across desktop, tablet, and mobile review widths."
            renderPreview={(viewport) => (
              <ViewportPreview
                activity={activity}
                hasIllustration={hasIllustration}
                viewport={viewport}
              />
            )}
            viewports={viewportItems}
          />

          <ComponentStateShowroom
            autoplayEnabled={false}
            description="A living showroom for reviewing Activity Card states before it is used in product workflows."
            renderPreview={(state) => (
              <StatePreview
                activity={activity}
                hasIllustration={hasIllustration}
                state={state}
              />
            )}
            states={showroomStates}
          />

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
