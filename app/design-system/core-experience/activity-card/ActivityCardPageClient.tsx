"use client";

import type { ReactNode } from "react";

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
  type ActivityCardData,
  type ActivityCardState,
  type ActivityCardVariant
} from "@/components/ui/ActivityCard";

import type { CanonicalActivityRecord } from "./page";

type ViewportId = "desktop" | "tablet" | "mobile";

const componentMetadata = {
  category: "Core Experience",
  confidence: "4 Usability ready",
  lastUpdated: "2026-07-09",
  owner: "Design System",
  status: "Approved",
  title: "Activity Card"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "viewports", label: "Viewport" },
  { id: "states", label: "States" },
  { id: "specs", label: "Specs" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" },
  { id: "library", label: "Library" }
];

const overviewCopy = {
  statusNote:
    "Activity Card is visually approved. This page now uses canonical activity data and processed canonical illustrations rather than temporary demo data.",
  summary:
    "Activity Card is the fixed visual unit for presenting a PlayBooky workshop activity in the library and builder experience.",
  whatItIs:
    "A 256px by 370px card with an illustration area, content area, metadata row, and an optional builder drag handle.",
  whenNotToUse:
    "Do not use it as a container for controls, forms, instructions, outputs, or recommendation logic.",
  whenToUse:
    "Use it when an activity needs to be represented as a selectable or reorderable workshop card.",
  whereItAppears:
    "Activity Library and future Builder flows, using the same approved shared ActivityCard component.",
  whyItExists:
    "To keep workshop activity presentation consistent across library browsing and builder composition without creating separate card components."
};

const specs = [
  ["Card", "256px x 370px"],
  ["Illustration area", "244px x 230px"],
  ["Content area", "244px x 125px"],
  ["Visible stroke", "2px"],
  ["Outer radius", "16px"],
  ["Inner illustration radius", "10px"],
  ["Card padding", "6px"],
  ["Section gap", "2px"],
  ["Variants", "builder and library"],
  ["Builder-only element", "Drag handle"],
  ["Library variant", "No drag handle"]
];

const viewportItems: Array<ViewportShowroomItem<ViewportId>> = [
  {
    id: "desktop",
    label: "Desktop",
    notes: [
      ["Preview assumption", "Desktop portal canvas"],
      ["Card behaviour", "Approved 256px x 370px card shown at actual size"],
      ["Responsive rule", "No desktop-specific redesign documented yet"]
    ]
  },
  {
    id: "tablet",
    label: "Tablet",
    notes: [
      ["Preview assumption", "Tablet preview container"],
      ["Card behaviour", "Same approved card scaled only for demonstration"],
      ["Responsive rule", "Tablet-specific grid behaviour remains future work"]
    ]
  },
  {
    id: "mobile",
    label: "Mobile",
    notes: [
      ["Preview assumption", "Mobile preview container"],
      ["Card behaviour", "Same approved card scaled only for demonstration"],
      ["Responsive rule", "Mobile-specific card redesign is not introduced here"]
    ]
  }
];

const showroomStates: Array<ComponentShowroomState<ActivityCardState>> = [
  {
    id: "default",
    label: "Default",
    notes: [
      ["Trigger", "Resting card."],
      ["Behaviour", "Shows the approved card with canonical content."],
      ["Motion", "No motion while resting."],
      ["Accessibility", "Text carries the card content; illustration is decorative."],
      ["Tokenisation notes", "Approved visual values remain pending tokenisation."]
    ]
  },
  {
    id: "hover",
    label: "Hover",
    notes: [
      ["Trigger", "Pointer hover preview."],
      ["Behaviour", "Uses the approved ActivityCard hover state."],
      ["Motion", "Subtle lift from the shared component."],
      ["Accessibility", "Hover does not expose hidden content or change meaning."],
      ["Tokenisation notes", "Hover elevation still needs semantic tokens."]
    ]
  },
  {
    id: "dragging",
    label: "Dragging",
    notes: [
      ["Trigger", "Builder reordering preview."],
      ["Behaviour", "Uses the approved ActivityCard dragging state."],
      ["Motion", "Shared component transform and elevation only."],
      ["Accessibility", "Future product drag behaviour needs a keyboard equivalent."],
      ["Tokenisation notes", "Dragging treatment remains pending tokenisation."]
    ]
  }
];

const tokenRows: ComponentTokenRow[] = [
  {
    implementationValue: "256px x 370px",
    label: "Card dimensions",
    status: "hardcoded"
  },
  {
    implementationValue: "244px x 230px",
    label: "Illustration area",
    status: "hardcoded"
  },
  {
    implementationValue: "244px x 125px",
    label: "Content area",
    status: "hardcoded"
  },
  {
    implementationValue: "2px #B77B32",
    label: "Visible stroke",
    status: "hardcoded"
  },
  {
    implementationValue: "16px / 10px",
    label: "Card and image radius",
    status: "hardcoded"
  },
  {
    implementationValue: "#FCFBFA",
    label: "Card surface",
    status: "hardcoded"
  },
  {
    implementationValue: "#324236 / #1F3E29",
    label: "Content text colours",
    status: "hardcoded"
  },
  {
    implementationValue: "Newsreader 600, 22px / 24px",
    label: "Title type",
    status: "hardcoded"
  },
  {
    implementationValue: "Geist 400, 10px / 16px",
    label: "Description type",
    status: "hardcoded"
  },
  {
    implementationValue: "0 4px 8px -2px / 0 2px 4px -2px",
    label: "Default shadow",
    status: "hardcoded"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Title, description, metadata, border, and gradient text values need formal token contrast checks before wider product rollout.",
      title: "Token contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "The card itself is display-only. Any future interactive wrapper needs its own visible focus treatment outside the approved card visual.",
      title: "Interactive wrapper"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "Future drag and reorder behaviour must provide a keyboard equivalent before product use.",
      title: "Drag equivalent"
    }
  ],
  reducedMotion: [
    {
      description:
        "Shared component transitions use motion-reduce support. Product drag interactions need their own reduced-motion path.",
      title: "Reduced motion"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "Activity illustrations are decorative. The card title, description, duration, and workshop type provide the content.",
      title: "Decorative illustration"
    },
    {
      description:
        "The card exposes an activity label based on the activity title.",
      title: "Card label"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Product-level selection, focus, and reorder semantics are owned by the future interactive wrapper, not the visual ActivityCard.",
      title: "Wrapper semantics"
    }
  ]
};

function toActivityCardData(
  activity: CanonicalActivityRecord
): ActivityCardData {
  return {
    description: activity.description,
    duration: activity.duration,
    illustration: activity.illustration,
    title: activity.title,
    workshopType: activity.workshopType
  };
}

function SpecsSection() {
  return (
    <section id="specs" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Specs</h3>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white/55">
        {specs.map(([label, value]) => (
          <div
            className="grid gap-2 border-b border-[color:var(--line)] p-4 last:border-b-0 sm:grid-cols-[220px_1fr]"
            key={label}
          >
            <div className="text-sm font-semibold">{label}</div>
            <div className="font-mono text-sm text-[color:var(--muted)]">
              {value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CardPreviewSurface({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[470px] items-center justify-center rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA] p-8">
      {children}
    </div>
  );
}

function ViewportPreview({
  activity,
  viewport
}: {
  activity: CanonicalActivityRecord;
  viewport: ViewportId;
}) {
  const scale = viewport === "tablet" ? 0.86 : 1;

  return (
    <div className="flex justify-center">
      <div
        className={[
          "flex items-center justify-center rounded-[24px] border border-[color:var(--line)] bg-white/50",
          viewport === "mobile"
            ? "h-[390px] w-[320px]"
            : viewport === "tablet"
              ? "h-[410px] w-[640px]"
              : "h-[430px] w-full min-w-[820px]"
        ].join(" ")}
      >
        <div
          style={{
            transform: `scale(${scale})`
          }}
        >
          <ActivityCard
            activity={toActivityCardData(activity)}
            size={viewport === "mobile" ? "mobile" : "desktop"}
          />
        </div>
      </div>
    </div>
  );
}

function StatePreview({
  activity,
  state
}: {
  activity: CanonicalActivityRecord;
  state: ActivityCardState;
}) {
  const variant: ActivityCardVariant =
    state === "dragging" ? "builder" : "library";

  return (
    <ActivityCard
      activity={toActivityCardData(activity)}
      state={state}
      variant={variant}
    />
  );
}

function LibrarySection({
  activities
}: {
  activities: CanonicalActivityRecord[];
}) {
  return (
    <section id="library" className="scroll-mt-40 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Library</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
            {activities.length} canonical activities rendered with the approved
            shared ActivityCard component.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-[repeat(auto-fill,256px)] gap-[22px]">
        {activities.map((activity) => (
          <ActivityCard
            activity={toActivityCardData(activity)}
            key={activity.title}
            variant="library"
          />
        ))}
      </div>
    </section>
  );
}

export function ActivityCardPageClient({
  activities
}: {
  activities: CanonicalActivityRecord[];
}) {
  const representativeActivity =
    activities.find((activity) => !activity.isMissingIllustration) ??
    activities[0];

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-card" />

        <ComponentPageShell
          description="The visually approved Activity Card for canonical PlayBooky workshop activities."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <ComponentViewportShowroom
            description="The approved card does not change by viewport yet. These frames show the same card inside desktop, tablet, and mobile preview containers."
            renderPreview={(viewport) => (
              <ViewportPreview
                activity={representativeActivity}
                viewport={viewport}
              />
            )}
            viewports={viewportItems}
          />

          <ComponentStateShowroom
            autoplayEnabled={false}
            description="Approved visual states from the shared ActivityCard component."
            renderPreview={(state) => (
              <CardPreviewSurface>
                <StatePreview
                  activity={representativeActivity}
                  state={state}
                />
              </CardPreviewSurface>
            )}
            states={showroomStates}
          />

          <SpecsSection />

          <ComponentTokensSection
            description="These values are present in the approved visual component and remain pending tokenisation."
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

          <LibrarySection
            activities={activities}
          />
        </ComponentPageShell>
      </div>
    </main>
  );
}
