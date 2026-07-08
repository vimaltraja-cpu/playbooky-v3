"use client";

import { useEffect, useRef, useState } from "react";

import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentPageShell,
  ComponentTokensSection,
  type ComponentAccessibilityItem,
  type ComponentTokenRow
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";

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

const cards = [1, 2, 3, 4, 5, 6];

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
  whereItAppears:
    "Inside the Design Portal documentation framework only.",
  whyItExists:
    "To make the grid behaviour reviewable inside the standard component documentation page without inventing final UI design."
};

const specs = [
  ["Purpose", "Responsive grid behaviour prototype only"],
  ["Content", "Six blank diagnosis option surfaces"],
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
  ["Mobile alignment", "Six rows vertically centred inside the 567px grid zone"],
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
        "The surfaces are structural placeholders only and do not communicate meaning through colour.",
      title: "Structural placeholder"
    }
  ],
  focusBehaviour: [
    {
      description:
        "The prototype surfaces are non-interactive. Future interactive cards must define focus behaviour in Diagnosis Card.",
      title: "No interactive cards"
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
        "The preview is labelled as a layout prototype. Individual blank surfaces are hidden from assistive technology.",
      title: "Preview labelling"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Final Diagnosis Card content, selection states, icons, typography, and production interactions are intentionally out of scope.",
      title: "Out of scope"
    }
  ]
};

function getScale(frame: PrototypeFrame) {
  if (frame.frameWidth === 1400) {
    return 0.7;
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
      {cards.map((card, index) => (
        <div
          aria-hidden="true"
          className="absolute rounded-lg border border-[#E8DFD3] bg-[#FCFBF9]/72 shadow-[0_10px_26px_rgba(36,31,24,0.055)] transition-[left,top,width,height] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          key={card}
          style={getCardPosition(index, frame)}
        />
      ))}
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
  const [viewport, setViewport] = useState<ViewportId>("desktop");
  const [indicator, setIndicator] = useState({ left: 4, width: 0 });
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const frame = frames[viewport];
  const scale = getScale(frame);

  useEffect(() => {
    const activeElement = triggerRefs.current[viewport];

    if (!activeElement) {
      return;
    }

    setIndicator({
      left: activeElement.offsetLeft,
      width: activeElement.offsetWidth
    });
  }, [viewport]);

  return (
    <section id="viewports" className="scroll-mt-40 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Viewports</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            Switch viewports to review the reference grid morph inside the
            standard Design Portal page.
          </p>
        </div>
        <div
          aria-label="Viewport preview"
          className="relative flex w-fit rounded-full border border-[color:var(--line)] bg-white/65 p-1"
          role="tablist"
        >
          <span
            aria-hidden="true"
            className="absolute bottom-1 top-1 rounded-full bg-[#7D5330] shadow-[0_10px_24px_rgba(125,83,48,0.18)] transition-[transform,width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
            style={{
              transform: `translateX(${indicator.left - 4}px)`,
              width: indicator.width
            }}
          />
          {(Object.keys(frames) as ViewportId[]).map((id) => (
            <button
              aria-controls="diagnosis-grid-viewport-panel"
              aria-selected={viewport === id}
              className={[
                "relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                viewport === id
                  ? "!text-[#FCFBF9]"
                  : "!text-[#171614] hover:bg-[#EFE3D2]/60"
              ].join(" ")}
              id={`diagnosis-grid-viewport-${id}`}
              key={id}
              onClick={() => setViewport(id)}
              ref={(element) => {
                triggerRefs.current[id] = element;
              }}
              role="tab"
              type="button"
            >
              {frames[id].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 min-[1500px]:grid-cols-[minmax(820px,1fr)_320px]">
        <div
          aria-labelledby={`diagnosis-grid-viewport-${viewport}`}
          className="flex min-h-[700px] min-w-0 items-center justify-center overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA] p-5"
          id="diagnosis-grid-viewport-panel"
          role="tabpanel"
        >
          <div
            className="flex items-center justify-center transition-[width,height] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              height: frame.frameHeight * scale,
              width: frame.frameWidth * scale
            }}
          >
            <DiagnosisGridPrototype viewport={viewport} />
          </div>
        </div>
        <div className="rounded-[24px] border border-[color:var(--line)] bg-white/55 p-5">
          <h4 className="text-sm font-semibold">
            {frame.label} measurement notes
          </h4>
          <dl className="mt-5 space-y-4">
            {[
              ["Frame", `${frame.frameWidth}px x ${frame.frameHeight}px`],
              ["Grid", `${frame.columns} columns x ${frame.rows} rows`],
              ["Gap", `${frame.gap}px`],
              ["Card height", `${frame.cardHeight}px`],
              [
                "Mobile rule",
                viewport === "mobile"
                  ? "Rows are vertically centred inside the 567px grid zone."
                  : "Not applicable."
              ]
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
          Diagnosis Grid currently documents responsive layout behaviour only.
          Selection, hover, reorder, radio, and card content states belong to
          Diagnosis Card or future product-flow documentation.
        </p>
      </div>
    </section>
  );
}

export default function DiagnosisGridPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
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
