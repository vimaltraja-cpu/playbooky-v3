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
import {
  activityLibrarySource,
  type Activity
} from "@/lib/data/activities";

type ActivityCardData = {
  activity: Activity;
  illustrationSrc: string;
};

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-07-08",
  owner: "Design System",
  status: "Exploring",
  title: "Activity Card"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "variants", label: "Variants" },
  { id: "states", label: "States" },
  { id: "library", label: "Library" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" }
];

const overviewCopy = {
  statusNote:
    "Figma CSS is the source of truth for this prototype. The card intentionally hides extra database fields.",
  summary:
    "Activity Card is a fixed-size visual component for representing one workshop activity with illustration, title, description, duration, and workshop context.",
  whatItIs:
    "A 256px by 370px card with one shared foundation and two current variants: Builder and Library.",
  whenNotToUse:
    "Do not use this card to inspect database fields, show activity chips, expose inputs or outputs, or add recommendation/live controls.",
  whenToUse:
    "Use it to review the Figma-faithful card component before it is approved for the Activity Library or Workshop Builder.",
  whereItAppears:
    "Inside the Design Portal only for now. Product screens should wait until this component is approved.",
  whyItExists:
    "To keep PlayBooky activity presentation consistent across contexts without creating separate card components."
};

const showroomStates: Array<ComponentShowroomState<ActivityCardState>> = [
  {
    id: "default",
    label: "Default",
    notes: [
      ["Trigger", "Resting card."],
      ["Behaviour", "Shows the fixed Figma structure without extra controls."],
      ["Motion", "No motion while resting."],
      ["Accessibility", "Text content remains visible without hover."],
      ["Tokenisation notes", "Prototype visual values are not tokenised yet."]
    ]
  },
  {
    id: "hover",
    label: "Hover",
    notes: [
      ["Trigger", "Pointer hover preview."],
      ["Behaviour", "Subtle lift and slightly stronger shadow."],
      ["Motion", "Short transform and shadow transition."],
      ["Accessibility", "Hover is decorative and does not expose hidden content."],
      ["Tokenisation notes", "Hover elevation needs a future token."]
    ]
  },
  {
    id: "dragging",
    label: "Dragging",
    notes: [
      ["Trigger", "Builder reordering preview."],
      ["Behaviour", "Slight rotation and scale while keeping card dimensions."],
      ["Motion", "Tactile transform only."],
      [
        "Accessibility",
        "Future drag implementation must include keyboard reordering."
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
    implementationValue: activityLibrarySource,
    label: "Canonical data source",
    status: "approved"
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
        "The card is display-only in the portal. Any future interactive wrapper must define focus styling.",
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
        "Hover and dragging transitions are subtle and disabled by the reduced-motion utility.",
      title: "Motion reduction"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "Illustrations are decorative; the activity name and description carry the content.",
      title: "Decorative illustration"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Temporary activity-to-illustration mapping is in use until the final activity library and artwork are aligned.",
      title: "Temporary artwork mapping"
    }
  ]
};

function VariantsSection({
  representativeCard
}: {
  representativeCard: ActivityCardData;
}) {
  return (
    <section id="variants" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Variants</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
        Builder and Library share the exact same component foundation. Builder
        adds the drag handle; Library removes it.
      </p>
      <div className="mt-8 flex flex-wrap gap-[22px] rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA] p-8">
        <div>
          <p className="mb-4 text-sm font-semibold text-[color:var(--muted)]">
            Builder
          </p>
          <ActivityCard
            activity={representativeCard.activity}
            illustrationSrc={representativeCard.illustrationSrc}
            variant="builder"
          />
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold text-[color:var(--muted)]">
            Library
          </p>
          <ActivityCard
            activity={representativeCard.activity}
            illustrationSrc={representativeCard.illustrationSrc}
            variant="library"
          />
        </div>
      </div>
    </section>
  );
}

function StatePreview({
  representativeCard,
  state
}: {
  representativeCard: ActivityCardData;
  state: ActivityCardState;
}) {
  return (
    <ActivityCard
      activity={representativeCard.activity}
      illustrationSrc={representativeCard.illustrationSrc}
      state={state}
      variant={state === "dragging" ? "builder" : "library"}
    />
  );
}

function LibrarySection({
  activityCards
}: {
  activityCards: ActivityCardData[];
}) {
  return (
    <section id="library" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Library</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
        This grid uses canonical Activity Library rows and temporary mapped
        illustrations while the final artwork relationship is being aligned.
      </p>
      <p className="mt-3 text-sm font-medium text-[color:var(--muted)]">
        {activityCards.length} activities with valid CSV data and mapped artwork
      </p>
      <div className="mt-8 flex flex-wrap gap-[22px]">
        {activityCards.map(({ activity, illustrationSrc }) => (
          <ActivityCard
            activity={activity}
            illustrationSrc={illustrationSrc}
            key={activity["Activity Name"]}
            variant="library"
          />
        ))}
      </div>
    </section>
  );
}

export function ActivityCardPageClient({
  activityCards,
  representativeCard
}: {
  activityCards: ActivityCardData[];
  representativeCard: ActivityCardData;
}) {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-card" />

        <ComponentPageShell
          description="A Figma-faithful Activity Card component backed by canonical Activity Library data."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <VariantsSection representativeCard={representativeCard} />

          <ComponentStateShowroom
            autoplayEnabled={false}
            description="Only the currently defined visual states are shown."
            renderPreview={(state) => (
              <StatePreview
                representativeCard={representativeCard}
                state={state}
              />
            )}
            states={showroomStates}
          />

          <LibrarySection activityCards={activityCards} />

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
