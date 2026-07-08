"use client";

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
  type ActivityCardState
} from "@/components/ui/ActivityCard";
import type { ActivityCardDemoItem } from "@/lib/data/activity-card-demo-data";

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-07-08",
  owner: "Design System",
  status: "Concept 2",
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
    "Concept 2 is a clean-slate Activity Card rebuild for visual approval only. Activity Grid and Add Activity Card are intentionally not implemented in this phase.",
  summary:
    "Activity Card Concept 2 reproduces the approved 256px by 370px Figma card with a dominant illustration, two-line title, short description, and duration/workshop metadata.",
  whatItIs:
    "A single reusable ActivityCard component with Builder and Library variants.",
  whenNotToUse:
    "Do not use this concept for Activity Grid, Add Activity Card, recommendation cards, or production flows until the card visual is approved.",
  whenToUse:
    "Use this page to compare Concept 2 against the approved Figma Activity Card.",
  whereItAppears:
    "Design Portal review only.",
  whyItExists:
    "Concept 2 replaces Concept 1 instead of iterating on it, so the card can be judged from the approved measurements."
};

const showroomStates: Array<ComponentShowroomState<ActivityCardState>> = [
  {
    id: "default",
    label: "Default",
    notes: [
      ["Trigger", "Resting visual review state."],
      ["Behaviour", "Displays only illustration, title, description, and metadata."],
      ["Motion", "No motion."],
      ["Accessibility", "Illustration is decorative; text carries the content."],
      ["Tokenisation notes", "Prototype values are hardcoded from the spec."]
    ]
  },
  {
    id: "hover",
    label: "Hover",
    notes: [
      ["Trigger", "Pointer hover preview."],
      ["Behaviour", "Subtle lift only; no hidden information appears."],
      ["Motion", "Short shadow and transform transition."],
      ["Accessibility", "Hover does not communicate required information."],
      ["Tokenisation notes", "Hover elevation remains pending."]
    ]
  },
  {
    id: "dragging",
    label: "Dragging",
    notes: [
      ["Trigger", "Builder reordering preview."],
      ["Behaviour", "Builder card keeps the same dimensions with tactile transform."],
      ["Motion", "Short transform only."],
      ["Accessibility", "Future drag behaviour must support keyboard reordering."],
      ["Tokenisation notes", "Dragging treatment remains pending."]
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
    label: "Vertical gap",
    status: "hardcoded"
  },
  {
    implementationValue: "16px",
    label: "Card radius",
    status: "hardcoded"
  },
  {
    implementationValue:
      "0px 4px 8px -2px rgba(0,0,0,0.10), 0px 2px 4px -2px rgba(0,0,0,0.06)",
    label: "Card shadow",
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
    label: "Title",
    status: "hardcoded"
  },
  {
    implementationValue: "Geist 400, 10px / 16px, #1F3E29",
    label: "Description",
    status: "hardcoded"
  },
  {
    implementationValue: "Geist 300, 10px / 16px, gold gradient",
    label: "Metadata",
    status: "hardcoded"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Title, description, and metadata colours should be checked during visual approval.",
      title: "Contrast review"
    }
  ],
  focusBehaviour: [
    {
      description:
        "The card is display-only in Concept 2. Interactive wrappers are out of scope until the visual is approved.",
      title: "Display-only card"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "Builder drag behaviour is represented visually only. Keyboard reordering belongs to a later Activity Grid phase.",
      title: "Grid behaviour deferred"
    }
  ],
  reducedMotion: [
    {
      description:
        "Hover and dragging transitions use reduced-motion-safe utility classes.",
      title: "Reduced motion"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The image is decorative and the card label exposes the activity title.",
      title: "Decorative image"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Manual Figma comparison is still required before Activity Grid or Add Activity Card work begins.",
      title: "Design approval required"
    }
  ]
};

function VariantsSection({ activity }: { activity: ActivityCardDemoItem }) {
  return (
    <section id="variants" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Variants</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
        Library removes only the drag handle. No other visual differences are
        allowed.
      </p>
      <div className="mt-8 flex flex-wrap gap-[22px] rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA] p-8">
        <div>
          <p className="mb-4 text-sm font-semibold text-[color:var(--muted)]">
            Builder
          </p>
          <ActivityCard activity={activity} variant="builder" />
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold text-[color:var(--muted)]">
            Library
          </p>
          <ActivityCard activity={activity} variant="library" />
        </div>
      </div>
    </section>
  );
}

function StatePreview({
  activity,
  state
}: {
  activity: ActivityCardDemoItem;
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
  representativeCard
}: {
  representativeCard: ActivityCardDemoItem;
}) {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-card" />

        <ComponentPageShell
          description="Concept 2 clean-slate Activity Card implementation for visual approval."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <VariantsSection activity={representativeCard} />

          <ComponentStateShowroom
            autoplayEnabled={false}
            description="Only card-level visual states are shown. Activity Grid behaviour is deferred."
            renderPreview={(state) => (
              <StatePreview activity={representativeCard} state={state} />
            )}
            states={showroomStates}
          />

          <ComponentTokensSection
            description="Concept 2 uses hardcoded values from the approved Activity Card specification for visual comparison."
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
