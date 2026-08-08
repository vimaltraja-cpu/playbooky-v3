"use client";

import { useCallback, useState } from "react";

import {
  AnimatedViewportReview,
  type AnimatedViewportConfig,
  type AnimatedViewportId
} from "@/components/portal/AnimatedViewportReview";
import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentPageShell,
  ComponentTokensSection,
  type ComponentAccessibilityItem,
  type ComponentTokenRow
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  DiagnosisQuestionScreen,
  type DiagnosisScreenViewport
} from "@/components/product/DiagnosisQuestionScreen";
import { diagnosisQuestions } from "@/lib/design-system/diagnosis-options";

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

const componentMetadata = {
  category: "Core Experience",
  confidence: "3 Implementation ready",
  lastUpdated: "2026-07-29",
  owner: "Design System",
  status: "Documented",
  title: "Diagnosis Grid"
};

const overviewCopy = {
  statusNote:
    "The preview renders the complete responsive diagnosis question screen using the signed-off Diagnosis Card component.",
  summary:
    "Diagnosis Grid documents the full-screen diagnosis question composition across the six approved viewport sizes.",
  whatItIs:
    "A full diagnosis surface with a dynamic question, supporting instruction, desktop privacy notice, six selectable cards, and reserved bottom navigation space.",
  whenNotToUse:
    "Do not use this page as approval for final progress controls or CTA controls.",
  whenToUse:
    "Use it when reviewing the complete diagnosis question screen across mobile, tablet, and desktop-family viewports.",
  whereItAppears:
    "Documentation lives at /design-system/core-experience/diagnosis-grid. Full-screen review lives at /preview/diagnosis-grid.",
  whyItExists:
    "To make the real diagnosis screen reviewable without product header chrome and without duplicating the card implementation."
};

const specs = [
  ["Review pattern", "AnimatedViewportReview tabbed viewport preview"],
  ["Screen background", "#FCFBF9"],
  ["Product header", "None"],
  ["Preview question", "What are you trying to achieve?"],
  ["Instruction", "Choose up to two goals for the workshop."],
  ["Mobile grid", "1 column x 6 rows, 12px gap"],
  ["Tablet portrait grid", "2 columns x 3 rows, 12px gap"],
  ["Tablet landscape grid", "3 columns x 2 rows, 12px gap"],
  ["Desktop-family grid", "3 columns x 2 rows, 20px gap"],
  ["Selection limit", "Maximum two selected cards"],
  ["Desktop privacy", "Desktop, Large Desktop, and XL Desktop only"],
  ["Bottom region", "Reserved space only; no production controls"],
  ["Preview surface", "#FCFBF9 product background"]
];

const tokenRows: ComponentTokenRow[] = [
  {
    implementationValue:
      "394 x 852 / 768 x 1024 / 1024 x 768 / 1440 x 900 / 1728 x 1117 / 1920 x 1080",
    label: "Reference frames",
    status: "hardcoded"
  },
  {
    implementationValue: "1 column / 2 columns / 3 columns",
    label: "Grid columns",
    status: "hardcoded"
  },
  {
    implementationValue: "12px tablet/mobile, 20px desktop family",
    label: "Grid gaps",
    status: "hardcoded"
  },
  {
    implementationValue: "DiagnosisCard viewport prop",
    label: "Card variants",
    status: "hardcoded"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "The screen uses the approved product background and the signed-off Diagnosis Card colours without preview dimming.",
      title: "Screen contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "Each card remains a single keyboard-focusable button and keeps the corrected card focus treatment.",
      title: "Card focus"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "Viewport tabs and the full-screen preview link follow the same documentation controls used elsewhere in the portal.",
      title: "Review controls"
    }
  ],
  reducedMotion: [
    {
      description:
        "Selected stroke animation keeps the existing reduced-motion fallback rules.",
      title: "Stroke motion"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The card exposes aria-pressed for selected state and aria-disabled for selection-limit state.",
      title: "State semantics"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "The real progress bar and CTA controls are still pending; this page reserves space only.",
      title: "Bottom controls"
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

function InfoPanel({ children, title }: { children: string; title: string }) {
  return (
    <div className="rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-4">
      <h4 className="text-[13px] font-medium leading-5 text-[#ededed]">
        {title}
      </h4>
      <p className="mt-3 text-sm leading-6 text-[#a1a1a1]">{children}</p>
    </div>
  );
}

function ViewportsSection() {
  const [activeViewportId, setActiveViewportId] =
    useState<AnimatedViewportId>("mobile");
  const activeViewport =
    viewports.find((viewport) => viewport.id === activeViewportId) ??
    viewports[0];
  const renderPreview = useCallback(
    () => (
      <DiagnosisQuestionScreen
        framed
        question={diagnosisQuestions[0]}
        questions={diagnosisQuestions}
        showBottomPlaceholder
        viewport={activeViewportId as DiagnosisScreenViewport}
      />
    ),
    [activeViewportId]
  );

  return (
    <section className="scroll-mt-28 py-8" id="viewports">
      <SectionHeading
        description="Select one reference size at a time. The frame uses the existing portal viewport tabs and scales the native diagnosis question screen proportionally."
        title="Viewports"
      />

      <AnimatedViewportReview
        activeViewport={activeViewport}
        activeViewportId={activeViewportId}
        ariaLabel="Diagnosis question screen viewport"
        canvasClassName="diagnosis-card-preview-canvas"
        onSelectViewport={setActiveViewportId}
        previewHref="/preview/diagnosis-grid"
        renderPreview={renderPreview}
        tabIdPrefix="diagnosis-grid"
        viewports={viewports}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Full-size preview">
          Opens /preview/diagnosis-grid as the real responsive experience with
          no portal shell.
        </InfoPanel>
        <InfoPanel title="Screen content">
          The preview includes the question heading, instruction, privacy notice
          where applicable, six cards, and bottom reserved region.
        </InfoPanel>
        <InfoPanel title="Card source">
          The grid passes viewport, option, selected, and selection-limit state
          into the corrected Diagnosis Card.
        </InfoPanel>
      </div>
    </section>
  );
}

function SpecsSection() {
  return (
    <section id="specs" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Specs</h3>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white/55">
        {specs.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-2 border-b border-[color:var(--line)] p-4 last:border-b-0 sm:grid-cols-[220px_1fr]"
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

function StatesSection() {
  return (
    <section id="states" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">States</h3>
      <div className="mt-6 rounded-[24px] border border-[color:var(--line)] bg-white/55 p-5">
        <p className="text-sm leading-7 text-[color:var(--muted)]">
          The complete preview supports selecting up to two cards. Additional
          unselected cards receive the shared card selection-limit state.
        </p>
      </div>
    </section>
  );
}

export default function DiagnosisGridPage() {
  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/diagnosis-grid" />

        <ComponentPageShell
          description="A responsive full-screen diagnosis question surface using the corrected Diagnosis Card as the card source of truth."
          metadata={componentMetadata}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <ViewportsSection />

          <StatesSection />

          <SpecsSection />

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
