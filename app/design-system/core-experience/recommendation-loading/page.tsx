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
  RecommendationLoadingExperience,
  type RecommendationLoadingStageId,
  type RecommendationLoadingViewport,
  recommendationLoadingStages
} from "@/components/product/RecommendationLoadingExperience";

type ViewportId = RecommendationLoadingViewport;
type ShowroomState = RecommendationLoadingStageId;

const componentMetadata = {
  category: "Core Experience",
  confidence: "4 Product-ready",
  lastUpdated: "2026-08-08",
  owner: "Design System",
  status: "Approved",
  title: "Recommendation Loading"
};

const overviewCopy = {
  statusNote:
    "Green-lit. Product loading consumes the shared watercolor motion contract and continues into Recommendation Reveal. Tuners stay in playground for refinement only.",
  summary:
    "Recommendation Loading is the calm analysing experience that appears after Diagnosis while PlayBooky turns answers into a recommended workshop structure, then hands off into reveal.",
  whatItIs:
    "A full-page loading state with a central illustration, shimmering analysis label, supporting copy, and Layer 1/2 watercolor stage transitions.",
  whenNotToUse:
    "Do not use it as a generic loading screen, spinner replacement, or a forked motion experiment outside the shared green-lit config.",
  whenToUse:
    "Use it after Diagnosis completion while PlayBooky is preparing the recommendation, including the linked reveal journey.",
  whereItAppears:
    "Product route /recommendation-loading (loading → reveal). Intended stitch target after Diagnosis in /internal/journey once that local spine is pushed.",
  whyItExists:
    "To make analysis feel intentional, calm, and premium before the recommended workshop appears."
};

const specs = [
  ["Status", "Green-lit / Approved"],
  ["Product route", "/recommendation-loading"],
  ["Intended upstream", "/internal/journey (Composer → Diagnosis — Mac local, not yet on GitHub)"],
  ["Portal route", "/design-system/core-experience/recommendation-loading"],
  ["Motion source", "lib/design-system/recommendation-watercolor-motion.ts"],
  ["Sequence", "Goals -> Challenges -> Context -> Participants -> Outcome"],
  ["Stage cycle", "6750ms (computed from Layer 2 timeline + stick)"],
  ["First-stage hold", "1600ms before first bleed"],
  ["Label handoff", "Leads with illustration; label updates at Layer 1 fade start"],
  ["Reveal handoff", "Blur exit into Recommendation Reveal"],
  [
    "Primary visual",
    "Transparent PNG illustration with watercolour droplet mask bleed"
  ],
  ["Primary visual rule", "No generic spinner as the primary visual"],
  [
    "Reduced motion",
    "Animation durations collapse; no bloom expansion or breathing motion"
  ]
];

const viewportItems: Array<ViewportShowroomItem<ViewportId>> = [
  {
    id: "desktop",
    label: "Desktop",
    notes: [
      ["Preview assumption", "Full-page warm neutral loading experience"],
      ["Illustration", "Centred hero, max 420px"],
      [
        "Chrome",
        "Minimal; illustration, label, supporting line, stage indicator"
      ],
      ["Motion", "Bloom/cross-dissolve loop for visual approval"]
    ]
  },
  {
    id: "mobile",
    label: "Mobile",
    notes: [
      ["Preview assumption", "Proposed mobile treatment"],
      ["Illustration", "Centred hero, max 270px"],
      ["Layout", "Single column with the same stage sequence"],
      ["Motion", "Same concept with reduced visual scale"]
    ]
  }
];

const showroomStates: Array<ComponentShowroomState<ShowroomState>> =
  recommendationLoadingStages.map((stage) => ({
    durationMs: 1600,
    id: stage.id,
    label: stage.shortLabel,
    notes: [
      ["Label", stage.label],
      ["Asset", stage.imageSrc],
      ["Behaviour", "Stage appears as part of the continuous analysing loop."],
      [
        "Transition",
        "Previous illustration dissolves into paper while the next image appears through a soft bloom."
      ]
    ],
    reducedMotionDurationMs: 1400
  }));

const tokenRows: ComponentTokenRow[] = [
  {
    implementationValue: "#F6F1E8",
    label: "Page background",
    status: "hardcoded"
  },
  {
    implementationValue: "#7D5330",
    label: "Active label and progress",
    status: "hardcoded"
  },
  {
    implementationValue: "#5E5A53",
    label: "Supporting text",
    status: "hardcoded"
  },
  {
    implementationValue: "radial-gradient bloom overlays",
    label: "Watercolour bloom",
    status: "todo"
  },
  {
    implementationValue: "1100ms / cubic-bezier(0.2,0,0,1)",
    label: "Bloom transition",
    status: "todo"
  },
  {
    implementationValue: "/assets/recommendation-loading/*.png",
    label: "Stage illustrations",
    status: "pending"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Current label and supporting line use dark warm text on a warm neutral background and need final token contrast validation.",
      title: "Text contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "The loading experience has no interactive controls in this first version.",
      title: "No focus targets"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "No keyboard interaction is required while PlayBooky is analysing.",
      title: "Passive state"
    }
  ],
  reducedMotion: [
    {
      description:
        "Reduced motion removes bloom expansion and breathing motion, leaving a simple opacity crossfade.",
      title: "Motion fallback"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The current analysis label is announced politely as the stage changes.",
      title: "Polite status"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Motion values are green-lit via the shared watercolor contract. Token promotion from hardcoded values remains open.",
      title: "Token promotion"
    }
  ]
};

function SpecsSection() {
  return (
    <section id="specs" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Specs</h3>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white/55">
        {specs.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-2 border-b border-[color:var(--line)] p-4 last:border-b-0 sm:grid-cols-[190px_1fr]"
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

function ViewportPreview({ viewport }: { viewport: ViewportId }) {
  return (
    <div className="overflow-hidden rounded-[20px]">
      <RecommendationLoadingExperience
        className={
          viewport === "mobile"
            ? "!min-h-[620px] rounded-[28px]"
            : "!min-h-[560px] rounded-[28px]"
        }
        viewport={viewport}
      />
    </div>
  );
}

function StatePreview({ state }: { state: ShowroomState }) {
  return (
    <div className="w-[min(760px,78vw)] overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA]">
      <RecommendationLoadingExperience
        className="!min-h-[480px] rounded-[28px]"
        lockedStage={state}
      />
    </div>
  );
}

export default function RecommendationLoadingPortalPage() {
  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/recommendation-loading" />

        <ComponentPageShell
          description="The analysing/loading state that appears after Diagnosis and before a recommended workshop is shown."
          metadata={componentMetadata}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <ComponentViewportShowroom
            description="Review the full-page experience at desktop and a proposed mobile treatment."
            renderPreview={(viewport) => (
              <ViewportPreview viewport={viewport} />
            )}
            viewports={viewportItems}
          />

          <ComponentStateShowroom
            description="Each stage in the analysing loop has its own label, artwork path, and transition moment."
            renderPreview={(state) => <StatePreview state={state} />}
            states={showroomStates}
          />

          <SpecsSection />

          <ComponentTokensSection
            description="Prototype visual values remain hardcoded for review. Motion, colour, and illustration roles need token approval before product use."
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
