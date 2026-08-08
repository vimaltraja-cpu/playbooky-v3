"use client";

import { useCallback, useState, type ReactNode } from "react";

import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentPageShell,
  ComponentStateShowroom,
  ComponentTokensSection,
  type ComponentAccessibilityItem,
  type ComponentPageMetadata,
  type ComponentSectionNavItem,
  type ComponentShowroomState,
  type ComponentTokenRow
} from "@/components/portal/ComponentPage";
import {
  AnimatedViewportReview,
  type AnimatedViewportConfig,
  type AnimatedViewportId
} from "@/components/portal/AnimatedViewportReview";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { RecommendationCardRevealExperience } from "@/components/product/RecommendationCardRevealExperience";
import {
  recommendationRevealComposition,
  type RecommendationCardRevealPlayback,
  type RecommendationCardRevealPhase,
  type RecommendationCardRevealViewport
} from "@/components/product/RecommendationCardReveal";

type ShowroomState = "normal" | "slow" | "reduced" | "final";

const routeHref = "/design-system/core-experience/recommendation-card-reveal";

const sections: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "motion", label: "Motion Behaviour" },
  { id: "viewports", label: "Viewports" },
  { id: "states", label: "States" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" }
];

const componentMetadata: ComponentPageMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-08-04",
  owner: "Design System",
  status: "Exploring",
  title: "Recommendation Card Reveal"
};

const overviewCopy = {
  statusNote:
    "This page documents the post-loading reveal stage in the same Recommendation Experience shell as the loading page. The cards are not resized to match the loader illustration.",
  summary:
    "Recommendation Card Reveal is the second stage of the recommendation journey: the approved activity-card fan appears beneath the recommendation text after analysis finishes.",
  whatItIs:
    "A full-page recommendation state using the same background, typography, responsive layout, viewport centring, and vertical composition as Recommendation Loading.",
  whenNotToUse:
    "Do not use it as the analysing/loading state or as a separate visual language from the loading page.",
  whenToUse:
    "Use it immediately after Recommendation Loading when PlayBooky has selected the recommended workshop activities.",
  whereItAppears:
    "In the responsive route at /recommendation-card-reveal and in this Design Portal review page.",
  whyItExists:
    "To make the transition from analysis to recommendation feel like one continuous journey while preserving the approved full-size card fan."
};

const viewports: AnimatedViewportConfig[] = [
  {
    height: 852,
    id: "mobile",
    label: "Mobile",
    layoutViewport: "mobile",
    width: 394
  },
  {
    height: 1024,
    id: "tablet-portrait",
    label: "Tablet portrait",
    layoutViewport: "tablet-portrait",
    width: 768
  },
  {
    height: 768,
    id: "tablet-landscape",
    label: "Tablet landscape",
    layoutViewport: "tablet-landscape",
    width: 1024
  },
  {
    height: 900,
    id: "desktop",
    label: "Desktop",
    layoutViewport: "desktop",
    width: 1440
  },
  {
    height: 1117,
    id: "large-desktop",
    label: "Large desktop",
    layoutViewport: "desktop",
    width: 1728
  },
  {
    height: 1080,
    id: "xl-desktop",
    label: "XL desktop",
    layoutViewport: "desktop",
    width: 1920
  }
];

const showroomStates: Array<ComponentShowroomState<ShowroomState>> = [
  {
    durationMs: 2300,
    id: "normal",
    label: "Normal",
    notes: [
      ["Playback", "Production speed"],
      ["Desktop/tablet", "Full-size paired fan, centre-cropped when needed"],
      ["Mobile", "Centred rotational stack"]
    ],
    reducedMotionDurationMs: 220
  },
  {
    durationMs: 4600,
    id: "slow",
    label: "Slow",
    notes: [
      ["Playback", "Slow inspection speed"],
      ["Purpose", "Review pair timing without changing final geometry"]
    ],
    reducedMotionDurationMs: 220
  },
  {
    durationMs: 220,
    id: "reduced",
    label: "Reduced",
    notes: [
      ["Motion", "Short fade into the final arrangement"],
      ["Purpose", "Manual reduced-motion preview"]
    ],
    reducedMotionDurationMs: 220
  },
  {
    durationMs: 0,
    id: "final",
    label: "Final",
    notes: [
      ["Phase", "Resting state"],
      ["Interaction", "Cards are available once the reveal is complete"]
    ],
    reducedMotionDurationMs: 0
  }
];

const tokenRows: ComponentTokenRow[] = [
  {
    implementationValue: "#F6F1E8",
    label: "Page background",
    status: "hardcoded"
  },
  {
    implementationValue: "Shared with Recommendation Loading",
    label: "Experience shell",
    status: "hardcoded"
  },
  {
    implementationValue: "256px x 370px",
    label: "Activity card size",
    status: "hardcoded"
  },
  {
    implementationValue: `${recommendationRevealComposition.sourceWidth}px x ${recommendationRevealComposition.sourceHeight}px`,
    label: "Desktop/tablet fan composition",
    status: "hardcoded"
  },
  {
    implementationValue:
      "Fixed x/y coordinates from approved Screen Paired Fan implementation",
    label: "Desktop/tablet geometry",
    status: "hardcoded"
  },
  {
    implementationValue: "-24deg, -16deg, -8deg, 0deg, 8deg, 16deg, 24deg",
    label: "Mobile stacked rotation",
    status: "hardcoded"
  },
  {
    implementationValue: "overflow visible in result; viewport mask only in review",
    label: "Reveal bounds",
    status: "hardcoded"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "The reveal reuses the loading page text styles and the approved Activity Card contrast.",
      title: "Shared contrast model"
    }
  ],
  focusBehaviour: [
    {
      description:
        "The card deck has pointer events disabled until the reveal completes.",
      title: "Delayed interaction"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "The standalone reveal screen has no extra controls beyond the activity cards themselves.",
      title: "Passive reveal"
    }
  ],
  reducedMotion: [
    {
      description:
        "Reduced motion replaces the card dealing movement with a short fade to the final fan or mobile stack.",
      title: "Short fade"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The animated deck is labelled as the recommended activity deck; each real card keeps its Activity Card accessible label.",
      title: "Deck labelling"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Final production wiring to the recommendation engine should pass generated title, description, and activity cards into this component.",
      title: "Engine data"
    }
  ]
};

function SectionHeading({
  description,
  title
}: {
  description?: string;
  title: string;
}) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function InfoPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-4">
      <h4 className="text-[13px] font-medium leading-5 text-[#ededed]">
        {title}
      </h4>
      <div className="mt-3 text-sm leading-6 text-[#a1a1a1]">{children}</div>
    </div>
  );
}

function MotionBehaviourSection() {
  return (
    <section className="scroll-mt-28 py-8" id="motion">
      <SectionHeading
        description="The reveal is the second stage of the recommendation journey and uses the same page composition as loading."
        title="Motion Behaviour"
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Desktop and tablet">
          The full 1122.4px by 511.53px fan is centred beneath the text. Tablet
          frames crop the outer cards from the centre mask instead of shrinking
          the fan.
        </InfoPanel>
        <InfoPanel title="Mobile">
          All cards share the same centre point and fan through rotation from
          -24deg to +24deg, with Commitment Check on top.
        </InfoPanel>
        <InfoPanel title="Interaction">
          Cards are non-interactive during the reveal. Reduced motion fades the
          final arrangement into place without dealing movement.
        </InfoPanel>
      </div>
    </section>
  );
}

function ViewportsSection() {
  const [activeViewportId, setActiveViewportId] =
    useState<AnimatedViewportId>("mobile");
  const [replayKey, setReplayKey] = useState(0);
  const activeViewport =
    viewports.find((viewport) => viewport.id === activeViewportId) ??
    viewports[0];
  const renderPreview = useCallback(
    (viewport: RecommendationCardRevealViewport) => (
      <RecommendationCardRevealExperience
        key={`${viewport}-${replayKey}`}
        viewport={viewport}
      />
    ),
    [replayKey]
  );

  return (
    <section className="scroll-mt-28 py-8" id="viewports">
      <SectionHeading
        description="Select one reference size at a time. The frame scales the real target viewport for review without changing the component's internal responsive behaviour."
        title="Viewports"
      />

      <button
        className="mt-5 inline-flex h-8 items-center rounded-md border border-white/[0.14] px-3 text-[12px] font-medium leading-5 text-[#ededed] transition-colors duration-200 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/70 motion-reduce:transition-none"
        onClick={() => setReplayKey((currentKey) => currentKey + 1)}
        type="button"
      >
        Replay reveal
      </button>

      <AnimatedViewportReview
        activeViewport={activeViewport}
        activeViewportId={activeViewportId}
        ariaLabel="Recommendation card reveal viewport"
        canvasClassName="recommendation-card-reveal-review-canvas"
        onSelectViewport={setActiveViewportId}
        previewHref="/recommendation-card-reveal"
        renderPreview={renderPreview}
        tabIdPrefix="recommendation-card-reveal"
        viewports={viewports}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Full preview">
          The open action goes to /recommendation-card-reveal and fills the
          browser without portal chrome.
        </InfoPanel>
        <InfoPanel title="Desktop/tablet mask">
          The full-size fan is centred in the visual slot. Narrower tablet
          frames clip both sides evenly and never create horizontal scrolling.
        </InfoPanel>
        <InfoPanel title="Mobile frame">
          The 394 x 852 preview uses the mobile rotational stack, not the
          desktop fan.
        </InfoPanel>
      </div>
    </section>
  );
}

function getStatePreviewProps(state: ShowroomState): {
  motion?: "paired" | "reduced";
  phase?: RecommendationCardRevealPhase;
  playback?: RecommendationCardRevealPlayback;
} {
  if (state === "slow") {
    return { playback: "slow" };
  }

  if (state === "reduced") {
    return { motion: "reduced" };
  }

  if (state === "final") {
    return { phase: "complete" };
  }

  return {};
}

function StatePreview({ state }: { state: ShowroomState }) {
  return (
    <div className="w-[min(760px,78vw)] overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA]">
      <RecommendationCardRevealExperience
        className="!min-h-[480px] rounded-[28px]"
        viewport="desktop"
        {...getStatePreviewProps(state)}
      />
    </div>
  );
}

export function RecommendationCardRevealPageClient() {
  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref={routeHref} />

        <ComponentPageShell
          description="The recommendation reveal stage that follows loading and uses the same full-page experience shell."
          metadata={componentMetadata}
          sections={sections}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <MotionBehaviourSection />

          <ViewportsSection />

          <ComponentStateShowroom
            autoplayEnabled={false}
            description="Playback variants keep the same card component and final geometry; only timing or motion preference changes."
            renderPreview={(state) => <StatePreview state={state} />}
            states={showroomStates}
          />

          <ComponentTokensSection
            description="Prototype visual values remain hardcoded for review. The fan geometry is fixed to the approved Screen Paired Fan implementation."
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
