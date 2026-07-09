"use client";

import type { ReactNode } from "react";

import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentPageShell,
  ComponentStateShowroom,
  ComponentTokensSection,
  type ComponentAccessibilityItem,
  type ComponentSectionNavItem,
  type ComponentShowroomState,
  type ComponentTokenRow
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  ActivityCard,
  type ActivityCardData,
  type ActivityCardState
} from "@/components/ui/ActivityCard";

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-07-09",
  owner: "Design System",
  status: "Exploring",
  title: "Activity Card"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "variants", label: "Variants" },
  { id: "states", label: "States" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" }
];

const overviewCopy = {
  statusNote:
    "Concept 2 replaces the rejected implementation and focuses only on the Activity Card. This showroom uses the approved visual reference content; Activity Grid, Add Activity Card, and canonical CSV integration remain paused until this card is visually approved.",
  summary:
    "Activity Card is a fixed 256px by 370px component for showing a workshop activity with one illustration-led composition.",
  whatItIs:
    "A reusable card with exactly two vertical sections: illustration and content.",
  whenNotToUse:
    "Do not use this card to expose database details, instructions, best-used-when text, inputs, outputs, chips, buttons, or recommendation controls.",
  whenToUse:
    "Use it for visual approval of the PlayBooky Activity Card before Activity Grid or Add Activity Card work begins.",
  whereItAppears:
    "Inside the Design Portal only for now. Product screens should wait until the component is approved.",
  whyItExists:
    "To keep activity presentation consistent across Library and Builder contexts without creating separate card components."
};

const showroomStates: Array<ComponentShowroomState<ActivityCardState>> = [
  {
    id: "default",
    label: "Default",
    notes: [
      ["Trigger", "Resting card."],
      ["Behaviour", "Shows the approved two-section card structure."],
      ["Motion", "No motion while resting."],
      ["Accessibility", "The illustration is decorative; text carries the content."],
      ["Tokenisation notes", "Prototype visual values are not tokenised yet."]
    ]
  },
  {
    id: "hover",
    label: "Hover",
    notes: [
      ["Trigger", "Pointer hover preview."],
      ["Behaviour", "Subtle lift only; no hidden content appears."],
      ["Motion", "Short transform and shadow transition."],
      ["Accessibility", "Hover does not change meaning."],
      ["Tokenisation notes", "Hover elevation needs a future token."]
    ]
  },
  {
    id: "dragging",
    label: "Dragging",
    notes: [
      ["Trigger", "Builder reordering preview."],
      ["Behaviour", "A tactile transform shows the card being moved."],
      ["Motion", "Transform only; no layout shift."],
      [
        "Accessibility",
        "Future product dragging must include keyboard reordering."
      ],
      ["Tokenisation notes", "Dragging treatment is prototype-only."]
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
    implementationValue: "6px",
    label: "Card padding",
    status: "hardcoded"
  },
  {
    implementationValue: "2px",
    label: "Section gap",
    status: "hardcoded"
  },
  {
    implementationValue: "16px",
    label: "Card radius",
    status: "hardcoded"
  },
  {
    implementationValue: "#FCFBFA",
    label: "Card background",
    status: "hardcoded"
  },
  {
    implementationValue: "0px 4px 8px -2px rgba(0,0,0,0.10)",
    label: "Shadow layer 1",
    status: "hardcoded"
  },
  {
    implementationValue: "0px 2px 4px -2px rgba(0,0,0,0.06)",
    label: "Shadow layer 2",
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
    implementationValue: "Newsreader 600, 22px / 24px, #324236",
    label: "Title type",
    status: "hardcoded"
  },
  {
    implementationValue: "Geist 400, 10px / 16px, #1F3E29",
    label: "Description type",
    status: "hardcoded"
  },
  {
    implementationValue: "Geist 300, 10px / 16px, gold gradient",
    label: "Metadata type",
    status: "hardcoded"
  },
  {
    implementationValue: "Approved visual reference content",
    label: "Showroom data",
    status: "pending"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Title, description, and metadata colours need formal contrast checks before approval.",
      title: "Text contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "The card is display-only in this showroom. Any future interactive wrapper must define focus styling outside the card visual.",
      title: "Interaction wrapper pending"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "Builder dragging is visual only here. Product reordering must support keyboard controls.",
      title: "Builder keyboard path"
    }
  ],
  reducedMotion: [
    {
      description:
        "Hover and dragging transitions use reduced-motion utilities.",
      title: "Motion reduction"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "Illustrations are decorative. Activity title, description, duration, and workshop type provide the content.",
      title: "Decorative illustration"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "The canonical CSV activity names do not currently match the approved illustration filenames. CSV integration should resume only after this card is visually approved.",
      title: "Canonical data alignment"
    }
  ]
};

function PortalPreviewSurface({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[470px] items-center justify-center rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA] p-8">
      {children}
    </div>
  );
}

function VariantsSection({ activity }: { activity: ActivityCardData }) {
  return (
    <section id="variants" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Variants</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
        Builder and Library use the same ActivityCard component. Builder adds
        the drag handle; Library removes only that handle.
      </p>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold text-[color:var(--muted)]">
            Builder
          </p>
          <PortalPreviewSurface>
            <ActivityCard activity={activity} variant="builder" />
          </PortalPreviewSurface>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold text-[color:var(--muted)]">
            Library
          </p>
          <PortalPreviewSurface>
            <ActivityCard activity={activity} variant="library" />
          </PortalPreviewSurface>
        </div>
      </div>
    </section>
  );
}

function StatePreview({
  activity,
  state
}: {
  activity: ActivityCardData;
  state: ActivityCardState;
}) {
  return (
    <ActivityCard
      activity={activity}
      state={state}
      variant={state === "dragging" ? "builder" : "library"}
    />
  );
}

export function ActivityCardPageClient({
  representativeActivity
}: {
  representativeActivity: ActivityCardData;
}) {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-card" />

        <ComponentPageShell
          description="A clean Concept 2 Activity Card rebuild from the approved component specification."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <VariantsSection activity={representativeActivity} />

          <ComponentStateShowroom
            autoplayEnabled={false}
            description="Only the states needed to validate the Activity Card are shown."
            renderPreview={(state) => (
              <StatePreview
                activity={representativeActivity}
                state={state}
              />
            )}
            states={showroomStates}
          />

          <ComponentTokensSection
            description="These values are hardcoded from the current Figma reference and should be tokenised only after visual approval."
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
