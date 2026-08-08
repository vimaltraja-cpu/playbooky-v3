"use client";

import {
  ComponentAccessibilitySection,
  ComponentMatrixShowroom,
  ComponentOverviewSection,
  ComponentPageShell,
  ComponentTokensSection,
  type ComponentAccessibilityItem,
  type ComponentSectionNavItem,
  type ComponentTokenRow
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  DiagnosisCard,
  type DiagnosisCardState
} from "@/components/ui/DiagnosisCard";
import {
  diagnosisCardGeometry,
  diagnosisCardMotion,
  diagnosisCardViewportFrameWidth,
  diagnosisCardViewportLabels,
  diagnosisCardViewports,
  resolveDiagnosisCardSize,
  type DiagnosisCardSize,
  type DiagnosisCardViewport
} from "@/lib/design-system/diagnosis-card-tokens";
import { diagnosisQuestions } from "@/lib/design-system/diagnosis-options";

// Only these four states are reviewed on this page. "disabled" and "focus"
// were dropped per design feedback: disabled reads identically to
// selection-limit-reached (both are the card's "unavailable" treatment, and
// only one of them needs to be reviewable here), and focus does not need its
// own tab since it is not a distinct visual state in this review's scope.
// The underlying DiagnosisCard component still supports `state="disabled"`
// and a real :focus-visible outline for product use elsewhere (e.g. the
// Diagnosis Grid) — only this page's review matrix has been narrowed.
type ReviewState = "default" | "hover" | "selected" | "selectionLimit";

const diagnosisPreviewCanvasClassName =
  "diagnosis-card-preview-canvas text-[#171614]";

const componentMetadata = {
  category: "Core Experience",
  confidence: "3 Architecture rebuild",
  lastUpdated: "2026-07-29",
  owner: "Design System",
  status: "Exploring",
  title: "Diagnosis Card"
};

const overviewCopy = {
  statusNote:
    "The card's geometry, stroke, and responsive variants have been rebuilt onto a shared token module (lib/design-system/diagnosis-card-tokens.ts). Every viewport x state combination below is independently reviewable.",
  summary:
    "Diagnosis Card presents one diagnosis option in the future PlayBooky diagnosis experience. It is now geometry-driven and token-driven so the same component can serve mobile, tablet, and desktop without per-breakpoint forks.",
  whatItIs:
    "A selectable card with a visual icon, title, description, and state indicator.",
  whenNotToUse:
    "Do not use it for generic content cards, product navigation, settings, or the future Diagnosis Grid until that grid is separately approved.",
  whenToUse:
    "Use it when a user needs to compare and select a diagnosis direction inside the approved Core Experience flow.",
  whereItAppears:
    "Inside the Design Portal only for now. It is not approved for product screens yet.",
  whyItExists:
    "To create a calm, scannable diagnosis choice that can later scale into a guided selection experience."
};

const reviewStates: Array<{ id: ReviewState; label: string }> = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "selected", label: "Selected" },
  { id: "selectionLimit", label: "Selection limit reached" }
];

const viewportAxisItems = diagnosisCardViewports.map((viewport) => ({
  id: viewport,
  label: diagnosisCardViewportLabels[viewport]
}));

const viewportNotesById: Record<
  DiagnosisCardViewport,
  Array<[string, string]>
> = Object.fromEntries(
  diagnosisCardViewports.map((viewport) => {
    const size = resolveDiagnosisCardSize(viewport);
    return [
      viewport,
      [
        ["Card layout variant", `size="${size}"`],
        [
          "Simulated frame width",
          `${diagnosisCardViewportFrameWidth[viewport]}px`
        ],
        [
          "Review slot width",
          `Uses the original approved "${size}" reference width (${diagnosisCardGeometry[size].targetWidth}px); product grids stretch the card to the available column width.`
        ]
      ]
    ];
  })
) as Record<DiagnosisCardViewport, Array<[string, string]>>;

const stateNotesById: Record<ReviewState, Array<[string, string]>> = {
  default: [
    ["Trigger", "Resting state before pointer or keyboard interaction."],
    [
      "Behaviour",
      "Translucent warm surface, neutral border, no state icon."
    ]
  ],
  hover: [
    ["Trigger", "Pointer hover, or a controlled preview of the hover affordance."],
    [
      "Behaviour",
      "Surface becomes opaque, shadow appears, gold border, empty gold ring in the top right."
    ]
  ],
  selected: [
    ["Trigger", "User selects the diagnosis option."],
    [
      "Behaviour",
      "Hover surface/border/ring persist while the geometry-derived stroke traces the card's real border and the radio dot enters."
    ]
  ],
  selectionLimit: [
    ["Trigger", "The user already selected the maximum number of options allowed."],
    [
      "Behaviour",
      "Neutral gray border (not gold), muted content opacity, no lift, not-allowed cursor. Exposed via aria-disabled."
    ]
  ]
};

function DiagnosisCardMatrixPreview({
  reducedMotion,
  state,
  viewport
}: {
  reducedMotion: boolean;
  state: ReviewState;
  viewport: DiagnosisCardViewport;
}) {
  const option = diagnosisQuestions[0].options[0];
  const size = resolveDiagnosisCardSize(viewport);
  const geometry = diagnosisCardGeometry[size];
  const frameWidth = diagnosisCardViewportFrameWidth[viewport];

  const cardVisualState: DiagnosisCardState =
    state === "hover" ? "hover" : "default";

  return (
    <div
      className="mx-auto flex items-center justify-center rounded-[10px] border border-dashed border-white/10 p-6"
      style={{ maxWidth: "100%", width: frameWidth }}
    >
      <div style={{ maxWidth: "100%", width: geometry.targetWidth }}>
        <DiagnosisCard
          option={option}
          reducedMotion={reducedMotion}
          selected={state === "selected"}
          selectionLimitReached={state === "selectionLimit"}
          size={size}
          state={cardVisualState}
        />
      </div>
    </div>
  );
}

function buildGeometryTokenRows(): ComponentTokenRow[] {
  const sizes: DiagnosisCardSize[] = ["mobile", "tablet", "desktop"];

  return sizes.flatMap((size) => {
    const geometry = diagnosisCardGeometry[size];

    return [
      {
        implementationValue: `${geometry.radius}px`,
        label: `${size} — border radius (shared by border and stroke)`,
        status: "hardcoded"
      },
      {
        implementationValue: `${geometry.strokeWidth}px`,
        label: `${size} — border / stroke width`,
        status: "hardcoded"
      },
      {
        implementationValue: `${geometry.paddingBlock}px ${geometry.paddingInlineEnd}px ${geometry.paddingBlock}px ${geometry.paddingInlineStart}px`,
        label: `${size} — padding`,
        status: "hardcoded"
      },
      {
        implementationValue: `${geometry.targetWidth}px`,
        label: `${size} — reference review width`,
        status: "hardcoded"
      },
      {
        implementationValue:
          geometry.height === "auto"
            ? `auto, min-height ${geometry.minHeight}px`
            : `${geometry.height}px (fixed)`,
        label: `${size} — height`,
        status: "hardcoded"
      }
    ] satisfies ComponentTokenRow[];
  });
}

const tokenRows: ComponentTokenRow[] = [
  ...buildGeometryTokenRows(),
  {
    futureToken: "diagnosis-card/gradient/selected",
    implementationValue: "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)",
    label: "Selected stroke + radio gradient",
    status: "hardcoded"
  },
  {
    implementationValue: `${diagnosisCardMotion.strokeDrawMs}ms draw / ${diagnosisCardMotion.circleEnterMs}ms radio entrance`,
    label: "Selected animation timing",
    status: "hardcoded"
  },
  {
    implementationValue: "assets/icons/align-a-team.svg",
    label: "Diagnosis icon asset",
    status: "approved"
  }
];

// This page reviews viewport and state together as one combined matrix
// (see ComponentMatrixShowroom), so the standard nav's separate "Viewports"
// tab has no matching section here — it is replaced by a single "Viewport &
// state" entry pointing at the same #states anchor the matrix renders.
const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Specs" },
  { id: "states", label: "Viewport & state" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" }
];

const specs = [
  [
    "Shared API",
    '<DiagnosisCard viewport="mobile | tablet-portrait | tablet-landscape | desktop | large-desktop | xl-desktop" option={option} selected disabled selectionLimitReached reducedMotion />'
  ],
  [
    "Size resolution",
    "resolveDiagnosisCardSize() maps the six review viewports to three real layouts: mobile, tablet, desktop. Tablet Portrait/Landscape share the tablet layout; Desktop/Large/XL share the desktop layout."
  ],
  [
    "Stroke architecture",
    "Single SVG, geometry derived from the card's measured pixel bounds (ResizeObserver) plus the shared radius/stroke-width tokens. No per-breakpoint stroke implementation."
  ],
  [
    "Geometry source of truth",
    "lib/design-system/diagnosis-card-tokens.ts — consumed by the component's CSS custom properties and by this page's tokens table."
  ]
] satisfies Array<[string, string]>;

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Title and description colours need formal contrast checks during tokenisation.",
      title: "Text contrast"
    },
    {
      description:
        "Disabled and selection-limit states must remain readable even with reduced opacity.",
      title: "Muted states"
    }
  ],
  focusBehaviour: [
    {
      description:
        "The card uses a visible :focus-visible outline and must not rely on hover-only feedback. Not exposed as its own tab in this page's state matrix; verify by tabbing to the card directly.",
      title: "Keyboard focus"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "The whole card is the touch and keyboard target, exposed as a button.",
      title: "Whole-card target"
    }
  ],
  reducedMotion: [
    {
      description:
        "The Motion control on this page forces the reduced-motion presentation independently of the reviewer's OS setting, in addition to the real prefers-reduced-motion media query.",
      title: "Motion fallback"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "Selected state is exposed through aria-pressed. Selection limit reached (and the disabled prop, when a consumer uses it) is exposed through aria-disabled.",
      title: "State semantics"
    },
    {
      description:
        "The right state icon is decorative because the interactive state is exposed on the card itself.",
      title: "State icon"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "This page reviews Default, Hover, Selected, and Selection limit reached. The component still supports a separate `state=\"disabled\"` and a Focus state (real :focus-visible) for product use, but neither is reviewed as its own tab here per design feedback.",
      title: "Reviewed state set"
    },
    {
      description:
        "Final selected, hover, and selection-limit semantics should be reviewed once the Diagnosis Grid exists.",
      title: "Grid dependency"
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

export default function DiagnosisCardPage() {
  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/diagnosis-card" />

        <ComponentPageShell
          description="A responsive diagnosis selection card for visual approval inside the Design Portal. This component is not used in product screens yet."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <ComponentMatrixShowroom
            canvasClassName={diagnosisPreviewCanvasClassName}
            description="Every viewport can be inspected in every state. Viewport, state, and motion are independent controls over the same preview, so combinations like Tablet Portrait + Hover or Mobile + Selected are directly reviewable rather than assumed."
            renderPreview={(viewport, state, reducedMotion) => (
              <DiagnosisCardMatrixPreview
                reducedMotion={reducedMotion}
                state={state}
                viewport={viewport}
              />
            )}
            stateAxis={{ items: reviewStates, title: "State" }}
            stateNotes={(state) => stateNotesById[state]}
            title="Viewport & state review"
            viewportAxis={{ items: viewportAxisItems, title: "Viewport" }}
            viewportNotes={(viewport) => viewportNotesById[viewport]}
          />

          <SpecsSection />

          <ComponentTokensSection
            description="Every value below is read directly from lib/design-system/diagnosis-card-tokens.ts, the same module the component itself consumes. There is no second copy of these numbers left to drift."
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
