"use client";

import { useEffect, useState } from "react";

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
import { ScaledDesktopMockup } from "@/components/portal/ScaledDesktopMockup";
import {
  DiagnosisCard,
  type DiagnosisCardState
} from "@/components/ui/DiagnosisCard";
import {
  diagnosisQuestions,
  diagnosisQuestionTabs,
  type DiagnosisQuestionId
} from "@/lib/design-system/diagnosis-options";

type ViewportId = "desktop";
type ShowroomState = DiagnosisCardState;

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-07-08",
  owner: "Design System",
  status: "Exploring",
  title: "Diagnosis Card"
};

const overviewCopy = {
  statusNote:
    "Prototype values are intentionally hardcoded for visual approval. They must become tokens before product use.",
  summary:
    "Diagnosis Card is the desktop review card for presenting one diagnosis option in the future PlayBooky diagnosis experience.",
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

const specs = [
  ["Card width", "445.33px"],
  ["Card height", "252px"],
  ["Padding", "16px 32px"],
  ["Radius", "8px"],
  ["Layout", "Flex column, center, flex-start, 10px gap"],
  ["Inner width", "381.33px"],
  ["Top/text gap", "32px"],
  ["Diagnosis icon asset", "assets/icons/align-a-team.svg"],
  ["Diagnosis icon default size", "72px x 70px"],
  ["Diagnosis icon compressed size", "60.17px x 58.5px"],
  ["Default background", "rgba(252, 251, 249, 0.5)"],
  ["Default border", "1px solid #E6E2DC"],
  ["Selected animation", "Two-path selected stroke"],
  ["Selected circle animation", "Starts at 88-92% border progress"],
  [
    "Hover shadow",
    "0px 4px 8px -2px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.06)"
  ],
  ["Title", "Newsreader 600, 24px / 140%, -0.01em, #062E27"],
  ["Description", "Geist 400, 17px / 160%, #45413C"]
];

const viewportItems: Array<ViewportShowroomItem<ViewportId>> = [
  {
    id: "desktop",
    label: "Desktop",
    notes: [
      ["Preview assumption", "Desktop component review canvas"],
      ["Card width", "445.33px fixed"],
      ["Card height", "252px fixed"],
      ["Padding", "16px 32px"],
      ["Product usage", "Not approved for product screens yet"]
    ]
  }
];

const showroomStates: Array<ComponentShowroomState<ShowroomState>> = [
  {
    durationMs: 1800,
    id: "default",
    label: "Default",
    notes: [
      ["Trigger", "Resting state before pointer or keyboard interaction."],
      [
        "Behaviour",
        "Shows the translucent warm surface, neutral border, and no right state icon."
      ],
      [
        "Motion",
        "No motion while resting. Background and shadow animate when moving to hover."
      ],
      [
        "Accessibility",
        "The full card remains keyboard focusable and exposes its pressed state."
      ],
      [
        "Tokenisation notes",
        "Default background, border, dimensions, and typography remain prototype values."
      ]
    ]
  },
  {
    durationMs: 2000,
    id: "hover",
    label: "Hover",
    notes: [
      ["Trigger", "Pointer hover or a visual preview of hover affordance."],
      [
        "Behaviour",
        "Surface becomes opaque, shadow appears, a 1px soft gold stroke remains visible, and an empty gold ring appears."
      ],
      [
        "Motion",
        "Background, shadow, and right icon transition over 160-240ms."
      ],
      [
        "Accessibility",
        "Hover must never be the only way to understand the selectable affordance."
      ],
      [
        "Tokenisation notes",
        "Hover shadow and subtle icon gradient need component tokens after approval."
      ]
    ]
  },
  {
    durationMs: 2000,
    id: "selected",
    label: "Selected",
    notes: [
      ["Trigger", "User selects the diagnosis option."],
      [
        "Behaviour",
        "Card keeps the hover surface, hover stroke, and hover ring stable while a selected layer confirms the choice."
      ],
      [
        "Motion",
        "Two border paths keep the chosen Version 3 motion path and use the accepted speed profile into the top-right radio."
      ],
      [
        "Accessibility",
        "Selected state is exposed with aria-pressed and cannot rely on colour alone."
      ],
      [
        "Tokenisation notes",
        "Selected icon gradient remains a prototype value until brand tokens are approved."
      ]
    ]
  },
  {
    durationMs: 2200,
    id: "maxSelected",
    label: "Max selected",
    notes: [
      ["Trigger", "The user has already selected the maximum number allowed."],
      [
        "Behaviour",
        "Card remains readable but uses muted opacity, no lift, and a not-allowed cursor."
      ],
      [
        "Motion",
        "No hover lift or activity motion while unavailable for selection."
      ],
      [
        "Accessibility",
        "Unavailable state is exposed with aria-disabled and must remain understandable without opacity alone."
      ],
      [
        "Tokenisation notes",
        "This is a suggested review state and needs final availability tokens later."
      ]
    ]
  }
];

const tokenRows: ComponentTokenRow[] = [
  {
    implementationValue: "445.33px / 252px",
    label: "Card dimensions",
    status: "hardcoded"
  },
  {
    implementationValue: "8px",
    label: "Card radius",
    status: "hardcoded"
  },
  {
    implementationValue: "16px 32px",
    label: "Padding",
    status: "hardcoded"
  },
  {
    implementationValue: "Newsreader 600, 24px / 140%",
    label: "Title typography",
    status: "hardcoded"
  },
  {
    implementationValue: "Geist 400, 17px / 160%",
    label: "Description typography",
    status: "hardcoded"
  },
  {
    implementationValue: "rgba(252, 251, 249, 0.5)",
    label: "Default background",
    status: "hardcoded"
  },
  {
    implementationValue: "1px solid #E6E2DC",
    label: "Default border",
    status: "hardcoded"
  },
  {
    implementationValue:
      "0px 4px 8px -2px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.06)",
    label: "Hover shadow",
    status: "hardcoded"
  },
  {
    implementationValue: "assets/icons/align-a-team.svg",
    label: "Diagnosis icon asset",
    status: "approved"
  },
  {
    implementationValue: "72px x 70px / 60.17px x 58.5px",
    label: "Diagnosis icon size",
    status: "hardcoded"
  },
  {
    implementationValue: "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)",
    label: "Selected ring and dot gradient",
    status: "hardcoded"
  },
  {
    implementationValue:
      "820ms accelerating border draw / 260ms radio entrance",
    label: "Selected animation timing",
    status: "hardcoded"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Title and description colours need formal contrast checks during tokenisation.",
      title: "Text contrast"
    },
    {
      description:
        "The max selected state must remain readable even with reduced opacity.",
      title: "Muted state"
    }
  ],
  focusBehaviour: [
    {
      description:
        "The card uses a visible focus outline and must not rely on hover-only feedback.",
      title: "Keyboard focus"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "The whole card is the touch and keyboard target, exposed as a button for this prototype.",
      title: "Whole-card target"
    }
  ],
  reducedMotion: [
    {
      description:
        "State transitions use short opacity, background, shadow, perimeter draw, and circle pop changes, with animations disabled for reduced motion.",
      title: "Motion fallback"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "Selected state is exposed through aria-pressed. Max selected is exposed through aria-disabled.",
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
        "Final selected, hover, and max selected semantics should be reviewed once the Diagnosis Grid exists.",
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

function ViewportPreview() {
  return (
    <div className="flex min-h-[360px] items-center justify-center overflow-visible">
      <div className="max-w-full overflow-x-auto py-8">
        <DiagnosisCard state="default" />
      </div>
    </div>
  );
}

function DiagnosisCardStatePreview({ state }: { state: ShowroomState }) {
  const [replayCount, setReplayCount] = useState(0);
  const [selectedPreviewState, setSelectedPreviewState] =
    useState<DiagnosisCardState>("hover");

  useEffect(() => {
    if (state !== "selected") {
      return;
    }

    setSelectedPreviewState("hover");

    const timeoutId = window.setTimeout(() => {
      setSelectedPreviewState("selected");
    }, 120);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [replayCount, state]);

  if (state !== "selected") {
    return <DiagnosisCard state={state} />;
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <p className="rounded-full border border-[#D8C08A] bg-[#FCFBF9]/80 px-4 py-2 text-sm font-semibold text-[#7D5330]">
        Selected animation
      </p>
      <DiagnosisCard
        key={`${replayCount}-${selectedPreviewState}`}
        state={selectedPreviewState}
      />
      <p className="max-w-xl text-center text-sm leading-6 text-[color:var(--muted)]">
        Selected animation uses the accepted Version 3 two-path motion. The path
        remains unchanged, while timing accelerates into the top-right corner
        and triggers the radio entrance as the stroke arrives.
      </p>
      <button
        className="rounded-full border border-[#D8C08A] bg-[#FCFBF9]/80 px-4 py-2 text-sm font-semibold text-[#7D5330] shadow-[0_10px_24px_rgba(125,83,48,0.08)] transition hover:bg-[#FCFBF9]"
        onClick={() => setReplayCount((current) => current + 1)}
        type="button"
      >
        Replay animation
      </button>
    </div>
  );
}

const diagnosisQuestionPrompts: Record<DiagnosisQuestionId, string> = {
  challenges: "What is getting in the way?",
  context: "What context should shape the workshop?",
  goals: "What are you trying to achieve?",
  outcome: "What should be different by the end?",
  participants: "Who needs to be involved?"
};

function DiagnosisAnswerDesktopMockup({
  activeQuestion,
  selectedOptionId,
  onSelect
}: {
  activeQuestion: (typeof diagnosisQuestions)[number];
  onSelect: (optionId: string) => void;
  selectedOptionId: string;
}) {
  return (
    <ScaledDesktopMockup
      aria-label={`${activeQuestion.label} diagnosis answer options in a 1440 by 900 desktop mockup`}
    >
      <div className="flex h-full w-full flex-col bg-[#F7F2EA] px-8 py-10">
        <header className="flex items-start justify-between gap-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7D5330]">
              Diagnosis
            </p>
            <h4 className="mt-4 max-w-3xl text-[44px] font-semibold leading-[1.08] tracking-normal text-[#171614]">
              {diagnosisQuestionPrompts[activeQuestion.id]}
            </h4>
            <p className="mt-4 max-w-2xl text-[18px] leading-8 text-[#5B554E]">
              Choose the answer that best reflects the current workshop need.
            </p>
          </div>
          <div className="rounded-full border border-[#E8DFD3] bg-[#FCFBF9]/80 px-5 py-3 text-sm font-semibold text-[#7D5330]">
            {activeQuestion.label}
          </div>
        </header>

        <div className="mt-12 grid grid-cols-3 gap-5">
          {activeQuestion.options.map((option) => (
            <DiagnosisCard
              description={option.description}
              iconKey={option.iconKey}
              key={option.id}
              label={option.label}
              onClick={() => onSelect(option.id)}
              state={selectedOptionId === option.id ? "selected" : "default"}
            />
          ))}
        </div>
      </div>
    </ScaledDesktopMockup>
  );
}

function DiagnosisAnswerOptionsSection() {
  const [activeQuestionId, setActiveQuestionId] =
    useState<DiagnosisQuestionId>("goals");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<DiagnosisQuestionId, string>
  >({
    challenges: diagnosisQuestions[1].options[0].id,
    context: diagnosisQuestions[2].options[0].id,
    goals: diagnosisQuestions[0].options[0].id,
    outcome: diagnosisQuestions[4].options[0].id,
    participants: diagnosisQuestions[3].options[0].id
  });
  const activeQuestion =
    diagnosisQuestions.find((question) => question.id === activeQuestionId) ??
    diagnosisQuestions[0];

  return (
    <section id="answer-options" className="scroll-mt-40 py-10">
      <div>
        <h3 className="text-2xl font-semibold">Answer Options</h3>
        <div
          aria-label="Diagnosis question tabs"
          className="mt-5 grid grid-cols-5 gap-2 rounded-full border border-[color:var(--line)] bg-white/65 p-1"
          role="tablist"
        >
          {diagnosisQuestionTabs.map((tab) => (
            <button
              aria-controls="diagnosis-answer-options-panel"
              aria-selected={activeQuestionId === tab.id}
              className={[
                "min-w-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 sm:px-4",
                activeQuestionId === tab.id
                  ? "bg-[#7D5330] !text-[#FCFBF9] shadow-[0_10px_24px_rgba(125,83,48,0.18)]"
                  : "!text-[#171614] hover:bg-[#EFE3D2]/60"
              ].join(" ")}
              id={`diagnosis-answer-options-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveQuestionId(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
          Each category is shown as a complete 1440 by 900 desktop diagnosis
          screen, scaled to fit the documentation page.
        </p>
      </div>

      <div
        aria-labelledby={`diagnosis-answer-options-${activeQuestion.id}`}
        className="mt-6"
        id="diagnosis-answer-options-panel"
        role="tabpanel"
      >
        <DiagnosisAnswerDesktopMockup
          activeQuestion={activeQuestion}
          onSelect={(optionId) =>
            setSelectedOptions((current) => ({
              ...current,
              [activeQuestion.id]: optionId
            }))
          }
          selectedOptionId={selectedOptions[activeQuestion.id]}
        />

        <div className="mt-5 rounded-[24px] border border-[color:var(--line)] bg-white/55 p-5">
          <h4 className="text-sm font-semibold">Desktop measurement notes</h4>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Frame", "1440px x 900px"],
              ["Layout", "3 columns x 2 rows"],
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

export default function DiagnosisCardPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/diagnosis-card" />

        <ComponentPageShell
          description="A desktop diagnosis selection card for visual approval inside the Design Portal. This component is not used in product screens yet."
          metadata={componentMetadata}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <ComponentViewportShowroom
            description="The first review target is the desktop card. Tablet and mobile behaviour will be documented after the desktop card is approved."
            renderPreview={() => <ViewportPreview />}
            viewports={viewportItems}
          />

          <DiagnosisAnswerOptionsSection />

          <ComponentStateShowroom
            autoplayEnabled={false}
            description="A living showroom for reviewing the Diagnosis Card as it moves from resting to hover, selected, and max-selected states."
            renderPreview={(state) => (
              <DiagnosisCardStatePreview state={state} />
            )}
            states={showroomStates}
          />

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
