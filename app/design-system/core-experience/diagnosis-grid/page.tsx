"use client";

import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentPageShell,
  ComponentTokensSection,
  type ComponentAccessibilityItem,
  type ComponentTokenRow
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { ScaledDesktopMockup } from "@/components/portal/ScaledDesktopMockup";
import { DiagnosisCard } from "@/components/ui/DiagnosisCard";
import { diagnosisGridPreviewOptions } from "@/lib/design-system/diagnosis-options";

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-07-08",
  owner: "Design System",
  status: "Exploring",
  title: "Diagnosis Grid"
};

const overviewCopy = {
  statusNote:
    "This page documents the desktop diagnosis grid preview only. It is not a final diagnosis screen and is not approved for product use.",
  summary:
    "Diagnosis Grid demonstrates the intended desktop layout for six diagnosis option cards.",
  whatItIs:
    "A scaled 1440 by 900 desktop viewport containing real diagnosis cards.",
  whenNotToUse:
    "Do not use this page to approve content, typography, icons, selection visuals, or a final diagnosis screen.",
  whenToUse:
    "Use it to review the desktop card grid, outer edges, spacing, and visual density.",
  whereItAppears: "Inside the Design Portal documentation framework only.",
  whyItExists:
    "To make the grid behaviour reviewable inside the standard component documentation page without inventing final UI design."
};

const specs = [
  ["Purpose", "Responsive diagnosis card grid behaviour"],
  ["Content", "Six real diagnosis option cards"],
  ["Desktop frame", "1440px x 900px"],
  ["Desktop grid", "3 columns x 2 rows"],
  ["Desktop gap", "20px"],
  ["Desktop side inset", "32px"],
  ["Overflow", "Complete viewport visible, no cropped edges"],
  ["Scaling", "Viewport scales down proportionally inside the page width"]
];

const tokenRows: ComponentTokenRow[] = [
  {
    implementationValue: "1440px x 900px",
    label: "Desktop reference frame",
    status: "todo"
  },
  {
    implementationValue: "3 x 2 / 20px gap",
    label: "Desktop grid",
    status: "todo"
  },
  {
    implementationValue: "32px",
    label: "Desktop side inset",
    status: "todo"
  },
  {
    implementationValue: "Scaled preview shell",
    label: "Documentation viewport scaling",
    status: "todo"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Cards use the same prototype text and selected-state colour treatment documented in Diagnosis Card.",
      title: "Card contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "The viewport preview reuses Diagnosis Card visuals. Final product focus behaviour still belongs to the production diagnosis flow.",
      title: "Preview focus"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "Only the viewport controls are keyboard reachable in this prototype.",
      title: "Viewport controls"
    }
  ],
  reducedMotion: [
    {
      description:
        "The mockup uses static proportional scaling and does not require layout animation.",
      title: "Static preview"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The preview is labelled as a layout prototype. Card content is present so reviewers can inspect real labels and descriptions.",
      title: "Preview labelling"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Final production interactions remain out of scope for this design-system grid page.",
      title: "Production behaviour"
    }
  ]
};

function DiagnosisGridDesktopMockup() {
  return (
    <ScaledDesktopMockup aria-label="Diagnosis grid in a 1440 by 900 desktop mockup">
      <div className="flex h-full w-full flex-col bg-[#F7F2EA] px-8 py-10">
        <header className="flex items-start justify-between gap-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7D5330]">
              Diagnosis
            </p>
            <h4 className="mt-4 max-w-3xl text-[44px] font-semibold leading-[1.08] tracking-normal text-[#171614]">
              What are you trying to achieve?
            </h4>
            <p className="mt-4 max-w-2xl text-[18px] leading-8 text-[#5B554E]">
              Six diagnosis options arranged in the intended desktop grid.
            </p>
          </div>
          <div className="rounded-full border border-[#E8DFD3] bg-[#FCFBF9]/80 px-5 py-3 text-sm font-semibold text-[#7D5330]">
            Desktop reference
          </div>
        </header>

        <div className="mt-12 grid grid-cols-3 gap-5">
          {diagnosisGridPreviewOptions.map((card, index) => (
            <DiagnosisCard
              description={card.description}
              iconKey={card.iconKey}
              key={card.id}
              label={card.label}
              state={index === 0 ? "selected" : "default"}
            />
          ))}
        </div>
      </div>
    </ScaledDesktopMockup>
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

function ViewportsSection() {
  return (
    <section id="viewports" className="scroll-mt-40 py-10">
      <div>
        <h3 className="text-2xl font-semibold">Desktop Viewport</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
          The full 1440 by 900 desktop frame is scaled to fit the documentation
          page while preserving the grid edges.
        </p>
      </div>

      <div className="mt-6">
        <div id="diagnosis-grid-viewport-panel" role="tabpanel">
          <DiagnosisGridDesktopMockup />
        </div>
        <div className="mt-5 rounded-[24px] border border-[color:var(--line)] bg-white/55 p-5">
          <h4 className="text-sm font-semibold">Desktop measurement notes</h4>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Frame", "1440px x 900px"],
              ["Grid", "3 columns x 2 rows"],
              ["Gap", "20px"],
              ["Card size", "445.33px x 252px"]
            ].map(([term, description]) => (
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
        </div>
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
          Diagnosis Grid documents responsive layout using real Diagnosis Card
          content and selected styling. Production selection behaviour,
          persistence, validation, and recommendation logic remain out of scope.
        </p>
      </div>
    </section>
  );
}

export default function DiagnosisGridPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/diagnosis-grid" />

        <ComponentPageShell
          description="A responsive grid behaviour reference for six diagnosis option surfaces. The Design Portal shell remains unchanged; the prototype lives inside Viewports."
          metadata={componentMetadata}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <SpecsSection />

          <ViewportsSection />

          <StatesSection />

          <ComponentTokensSection
            description="These values document prototype grid behaviour only. They should become approved layout tokens before product implementation."
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
