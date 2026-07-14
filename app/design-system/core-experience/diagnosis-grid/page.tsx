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
import { ViewportReviewLayout } from "@/components/portal/ViewportReviewLayout";
import { DiagnosisCard } from "@/components/ui/DiagnosisCard";
import { diagnosisGridPreviewOptions } from "@/lib/design-system/diagnosis-options";

type ViewportId = "desktop" | "tablet" | "mobile";

type PrototypeFrame = {
  cardHeight: number;
  columns: number;
  frameHeight: number;
  frameWidth: number;
  gap: number;
  gridHeight?: number;
  gridInsetX: number;
  gridTop: number;
  label: string;
  rows: number;
};

const frames: Record<ViewportId, PrototypeFrame> = {
  desktop: {
    cardHeight: 252,
    columns: 3,
    frameHeight: 900,
    frameWidth: 1400,
    gap: 20,
    gridInsetX: 12,
    gridTop: 188,
    label: "Desktop",
    rows: 2
  },
  tablet: {
    cardHeight: 188,
    columns: 2,
    frameHeight: 900,
    frameWidth: 900,
    gap: 16,
    gridInsetX: 48,
    gridTop: 132,
    label: "Tablet",
    rows: 3
  },
  mobile: {
    cardHeight: 78,
    columns: 1,
    frameHeight: 852,
    frameWidth: 393,
    gap: 12,
    gridHeight: 567,
    gridInsetX: 12,
    gridTop: 142,
    label: "Mobile",
    rows: 6
  }
};

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
    "This page documents responsive grid behaviour only. It is not a final diagnosis screen and is not approved for product use.",
  summary:
    "Diagnosis Grid demonstrates how six diagnosis option surfaces respond between desktop, tablet, and mobile layouts.",
  whatItIs:
    "A responsive layout behaviour prototype for six equal diagnosis option surfaces.",
  whenNotToUse:
    "Do not use this page to approve content, typography, icons, selection visuals, or a final diagnosis screen.",
  whenToUse:
    "Use it to review the reference layout morph from 3 columns by 2 rows, to 2 columns by 3 rows, to 1 column by 6 rows.",
  whereItAppears: "Inside the Design Portal documentation framework only.",
  whyItExists:
    "To make the grid behaviour reviewable inside the standard component documentation page without inventing final UI design."
};

const specs = [
  ["Purpose", "Responsive diagnosis card grid behaviour"],
  ["Content", "Six real diagnosis option cards"],
  ["Desktop frame", "1400px x 900px"],
  ["Desktop grid", "3 columns x 2 rows"],
  ["Desktop gap", "20px"],
  ["Tablet grid", "2 columns x 3 rows"],
  ["Tablet gap", "16px"],
  ["Mobile frame", "393px x 852px"],
  ["Mobile grid zone", "567px height"],
  ["Mobile grid", "1 column x 6 rows"],
  ["Mobile row height", "78px"],
  ["Mobile gap", "12px"],
  ["Mobile side inset", "12px"],
  [
    "Mobile alignment",
    "Six rows vertically centred inside the 567px grid zone"
  ],
  ["Overflow", "No internal scroll, no horizontal overflow, no clipping"],
  ["Motion", "Smooth card position and size transition between viewports"]
];

const tokenRows: ComponentTokenRow[] = [
  {
    implementationValue: "1400px x 900px",
    label: "Desktop reference frame",
    status: "todo"
  },
  {
    implementationValue: "3 x 2 / 20px gap",
    label: "Desktop grid",
    status: "todo"
  },
  {
    implementationValue: "2 x 3 / 16px gap",
    label: "Tablet grid",
    status: "todo"
  },
  {
    implementationValue: "393px x 852px",
    label: "Mobile reference frame",
    status: "todo"
  },
  {
    implementationValue: "567px",
    label: "Mobile grid zone",
    status: "todo"
  },
  {
    implementationValue: "78px rows / 12px gap / 12px inset",
    label: "Mobile rows",
    status: "todo"
  },
  {
    implementationValue: "360ms / cubic-bezier(0.22, 1, 0.36, 1)",
    label: "Layout transition",
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
        "Grid position and size transitions are disabled when reduced motion is requested.",
      title: "Motion fallback"
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

function getScale(frame: PrototypeFrame) {
  if (frame.frameWidth === 1400) {
    return 0.82;
  }

  if (frame.frameWidth === 900) {
    return 0.78;
  }

  return 0.82;
}

function getGridMetrics(frame: PrototypeFrame) {
  const availableWidth = frame.frameWidth - frame.gridInsetX * 2;
  const cardWidth =
    (availableWidth - frame.gap * (frame.columns - 1)) / frame.columns;
  const cardStackHeight =
    frame.cardHeight * frame.rows + frame.gap * (frame.rows - 1);
  const gridHeight = frame.gridHeight ?? cardStackHeight;
  const verticalOffset = Math.max(0, (gridHeight - cardStackHeight) / 2);

  return {
    cardWidth,
    verticalOffset
  };
}

function getCardPosition(index: number, frame: PrototypeFrame) {
  const metrics = getGridMetrics(frame);
  const column = index % frame.columns;
  const row = Math.floor(index / frame.columns);

  return {
    height: frame.cardHeight,
    left: frame.gridInsetX + column * (metrics.cardWidth + frame.gap),
    top:
      frame.gridTop +
      metrics.verticalOffset +
      row * (frame.cardHeight + frame.gap),
    width: metrics.cardWidth
  };
}

function DiagnosisGridPrototype({ viewport }: { viewport: ViewportId }) {
  const frame = frames[viewport];
  const scale = getScale(frame);

  return (
    <div
      aria-label={`${frame.label} responsive diagnosis grid prototype`}
      className="relative shrink-0 overflow-hidden rounded-[28px] border border-[#E8DFD3] bg-[#F7F2EA] shadow-[0_24px_70px_rgba(36,31,24,0.12)] transition-[width,height,transform] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      style={{
        height: frame.frameHeight,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        width: frame.frameWidth
      }}
    >
      {diagnosisGridPreviewOptions.map((card, index) => {
        const position = getCardPosition(index, frame);
        const cardScale = Math.min(
          position.width / 445.33,
          position.height / 252
        );

        return (
          <div
            className="absolute overflow-hidden rounded-lg transition-[left,top,width,height] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            key={card.id}
            style={position}
          >
            <div
              style={{
                transform: `scale(${cardScale})`,
                transformOrigin: "top left"
              }}
            >
              <DiagnosisCard
                description={card.description}
                iconKey={card.iconKey}
                label={card.label}
                state={index === 0 ? "selected" : "default"}
              />
            </div>
          </div>
        );
      })}
    </div>
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
  const viewportItems = (Object.keys(frames) as ViewportId[]).map((id) => {
    const frame = frames[id];

    return {
      id,
      label: frame.label,
      notes: [
        ["Frame", `${frame.frameWidth}px x ${frame.frameHeight}px`],
        ["Grid", `${frame.columns} columns x ${frame.rows} rows`],
        ["Gap", `${frame.gap}px`],
        [
          "Card height",
          `${frame.cardHeight}px${id === "mobile" ? " rows" : ""}`
        ],
        [
          "Mobile rule",
          id === "mobile"
            ? "Rows are vertically centred inside the 567px grid zone."
            : "Not applicable."
        ]
      ] satisfies Array<[string, string]>
    };
  });

  return (
    <ViewportReviewLayout
      canvasClassName="flex min-h-[760px] items-center justify-start overflow-x-auto overflow-y-hidden p-3 sm:justify-center sm:p-3"
      description="Switch viewports to review the restored responsive grid morph inside the standard Design Portal presentation canvas."
      renderPreview={(viewport) => {
        const frame = frames[viewport];
        const scale = getScale(frame);

        return (
          <div
            className="flex items-center justify-center transition-[width,height] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              height: frame.frameHeight * scale,
              width: frame.frameWidth * scale
            }}
          >
            <DiagnosisGridPrototype viewport={viewport} />
          </div>
        );
      }}
      viewports={viewportItems}
    />
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

          <ViewportsSection />

          <StatesSection />

          <SpecsSection />

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
