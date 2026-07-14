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
import { AIComposer } from "@/components/ui/AIComposer";

type ViewportId = "desktop" | "tablet" | "mobile";
type ShowroomState = "empty" | "focus" | "typing" | "generating";
type GeneratingPhase = "ready" | "pressed" | "designing";

const componentMetadata = {
  category: "Components / Inputs",
  confidence: "3 Visually directional",
  lastUpdated: "2026-07-07",
  owner: "Design System",
  status: "Exploring",
  title: "AI Composer"
};

const overviewCopy = {
  statusNote:
    "Prototype values are intentionally hardcoded for visual approval. They must become tokens before product use.",
  summary:
    "AI Composer is the calm prompt surface used when a user needs to ask PlayBooky for help shaping, improving, or continuing a playbook experience.",
  whatItIs:
    "A compact composer with prompt text, microphone affordance, and send action.",
  whenNotToUse:
    "Do not use for ordinary forms, filters, notes, comments, or product navigation.",
  whenToUse:
    "Use when the user is composing a prompt, request, or instruction for PlayBooky.",
  whereItAppears:
    "Inside future AI-assisted PlayBooky flows after portal approval.",
  whyItExists:
    "To make AI help feel focused and supportive without turning the product into a chat interface."
};

const specs = [
  ["Desktop width", "736px"],
  ["Desktop height", "141px"],
  ["Mobile width", "370px"],
  ["Mobile height", "141px"],
  ["Background", "#FCFBF9"],
  ["Stroke", "2px linear-gradient(45deg, #7D5330 0%, #D99C56 100%)"],
  ["Radius", "32px"],
  ["Padding", "20px 16px 16px 32px"],
  ["Send gradient", "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)"]
];

const viewportItems: Array<ViewportShowroomItem<ViewportId>> = [
  {
    id: "desktop",
    label: "Desktop",
    notes: [
      ["Preview assumption", "1440x900 canvas"],
      ["Composer width", "736px fixed"],
      ["Composer position", "Centered horizontally"],
      ["Height", "141px"],
      ["Padding", "20px 16px 16px 32px"]
    ]
  },
  {
    id: "tablet",
    label: "Tablet",
    notes: [
      ["Preview assumption", "Tablet target"],
      ["Behaviour", "Tablet behaviour pending final component review"]
    ]
  },
  {
    id: "mobile",
    label: "Mobile",
    notes: [
      ["Preview assumption", "394x852 target represented in compact preview"],
      ["Composer width", "370px"],
      [
        "Composer position",
        "Fixed-bottom behaviour, centered with 32px bottom offset"
      ],
      ["Height", "141px"],
      ["Padding", "20px 16px 16px 32px"],
      ["Placeholder type", "14px / 20px"]
    ]
  }
];

const typingSentence =
  "Create a 45-minute workshop for our product strategy session";

const showroomStates: Array<ComponentShowroomState<ShowroomState>> = [
  {
    durationMs: 1800,
    id: "empty",
    label: "Empty",
    notes: [
      ["Trigger", "Resting state before input."],
      [
        "Behaviour",
        "Shows approved placeholder copy with mic and send actions ready."
      ],
      ["Motion", "No motion; the composer is waiting for user intent."],
      [
        "Accessibility",
        "Controls must expose clear labels before product use."
      ],
      [
        "Tokenisation notes",
        "Placeholder, surface, stroke and action values remain pending tokens."
      ]
    ]
  },
  {
    durationMs: 1800,
    id: "focus",
    label: "Focus",
    notes: [
      ["Trigger", "Keyboard or pointer focus."],
      [
        "Behaviour",
        "Shows a visible caret, softer placeholder and subtle focus treatment."
      ],
      ["Motion", "Uses a calm surface/elevation transition."],
      [
        "Accessibility",
        "Focus treatment must not rely on colour alone once tokenised."
      ],
      [
        "Tokenisation notes",
        "Focus ring, glow and surface lift need semantic tokens."
      ]
    ]
  },
  {
    durationMs: typingSentence.length * 60 + 1900,
    id: "typing",
    label: "Typing",
    notes: [
      ["Trigger", "Active user composition."],
      ["Behaviour", "Types the workshop request automatically for review."],
      ["Motion", "Loops natural character entry with a blinking caret."],
      [
        "Accessibility",
        "Reduced motion shows the full sentence statically with a caret."
      ],
      [
        "Tokenisation notes",
        "Caret colour and typed text treatment need component tokens."
      ]
    ],
    reducedMotionDurationMs: 2200
  },
  {
    durationMs: 4300,
    id: "generating",
    label: "Generating",
    notes: [
      ["Trigger", "Send action is activated."],
      [
        "Behaviour",
        "Composer locks, mic quiets, send action turns into a calm indicator."
      ],
      [
        "Motion",
        "Shows press, thinking and reset sequence without layout shift."
      ],
      [
        "Accessibility",
        "Status is communicated through text, not motion alone."
      ],
      [
        "Tokenisation notes",
        "Locked surface, inactive icon and spinner treatments need tokens."
      ]
    ],
    reducedMotionDurationMs: 2600
  }
];

const tokenRows: ComponentTokenRow[] = [
  {
    implementationValue: "#FCFBF9",
    label: "Composer surface",
    status: "hardcoded"
  },
  {
    implementationValue: "#5E5A53 / #45413C",
    label: "Placeholder text",
    status: "hardcoded"
  },
  {
    implementationValue: "#171614",
    label: "Icon colour",
    status: "hardcoded"
  },
  {
    implementationValue: "#E2E8F0",
    label: "Send arrow",
    status: "hardcoded"
  },
  {
    implementationValue: "32px radius / 40px action",
    label: "Shape and action size",
    status: "todo"
  },
  {
    implementationValue: "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)",
    label: "Send button gradient",
    status: "pending"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Placeholder, icon, surface, and action colours require formal contrast checks during tokenisation.",
      title: "Token contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "Focus treatment must be visible and must not rely on colour alone once tokenised.",
      title: "Visible focus"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "The send action must remain reachable and clearly focusable before product use.",
      title: "Send action"
    }
  ],
  reducedMotion: [
    {
      description:
        "Typing and generating previews render static or simplified states when reduced motion is requested.",
      title: "Showroom fallback"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The composer exposes a group label and the send button has an action label.",
      title: "Labels"
    },
    {
      description:
        "Generating status is communicated through text, not motion alone.",
      title: "Status"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Disabled, error, and loading states must communicate status without relying on colour alone.",
      title: "State communication"
    }
  ]
};

function ViewportPreview({ viewport }: { viewport: ViewportId }) {
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  return (
    <div className="composer-responsive-preview flex justify-center overflow-visible transition-[min-height,padding] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none">
      <div
        className={[
          "relative flex border border-[color:var(--line)] bg-[color:var(--panel)] transition-[width,height,border-radius,padding] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
          isMobile
            ? "h-[420px] w-[394px] max-w-full items-end justify-center overflow-visible rounded-[30px] px-3 pb-8"
            : isTablet
              ? "h-[390px] w-full max-w-[820px] items-center justify-center overflow-visible rounded-[30px] px-8"
              : "h-[430px] w-full min-w-0 items-center justify-center overflow-visible rounded-[28px] px-8 min-[1180px]:min-w-[820px]"
        ].join(" ")}
      >
        <div className="max-w-full transition-[transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none">
          <AIComposer
            state="empty"
            viewport={isMobile ? "mobile" : "desktop"}
          />
        </div>
        {isTablet ? (
          <p className="absolute bottom-5 left-6 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
            Tablet behaviour pending final component review
          </p>
        ) : null}
      </div>
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

function ShowroomMicIcon({ inactive }: { inactive?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={[
        "transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
        inactive ? "opacity-35" : "opacity-100"
      ].join(" ")}
      height="16"
      viewBox="0 0 24 24"
      width="16"
      fill="none"
      stroke="#171614"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
    </svg>
  );
}

function ShowroomArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      fill="none"
      stroke="#E2E8F0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.25"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function ShowroomSpinner() {
  return (
    <span
      aria-hidden="true"
      className="ai-composer-showroom-spinner h-5 w-5 rounded-full border-2 border-[#E2E8F0]/35 border-t-[#E2E8F0]"
    />
  );
}

function AIComposerStatePreview({
  isReducedMotion,
  state
}: {
  isReducedMotion: boolean;
  state: ShowroomState;
}) {
  const [typedText, setTypedText] = useState("");
  const [generatingPhase, setGeneratingPhase] =
    useState<GeneratingPhase>("ready");

  useEffect(() => {
    if (isReducedMotion || state !== "typing") {
      setTypedText(state === "typing" ? typingSentence : "");
      return;
    }

    setTypedText("");

    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setTypedText(typingSentence.slice(0, index));

      if (index >= typingSentence.length) {
        window.clearInterval(intervalId);
      }
    }, 60);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isReducedMotion, state]);

  useEffect(() => {
    if (state !== "generating") {
      setGeneratingPhase("ready");
      return;
    }

    if (isReducedMotion) {
      setGeneratingPhase("designing");
      return;
    }

    setGeneratingPhase("ready");
    const pressTimeout = window.setTimeout(() => {
      setGeneratingPhase("pressed");
    }, 550);
    const designingTimeout = window.setTimeout(() => {
      setGeneratingPhase("designing");
    }, 1150);

    return () => {
      window.clearTimeout(pressTimeout);
      window.clearTimeout(designingTimeout);
    };
  }, [isReducedMotion, state]);

  const isFocus = state === "focus";
  const isTyping = state === "typing";
  const isGenerating = state === "generating";
  const showDesigning =
    isGenerating && (isReducedMotion || generatingPhase === "designing");
  const displayText = showDesigning
    ? "Designing your workshop..."
    : isGenerating
      ? typingSentence
      : isTyping
        ? isReducedMotion
          ? typingSentence
          : typedText
        : "Tell PlayBooky about your challenge...";
  const showCaret = isFocus || isTyping;
  const placeholderLike = state === "empty" || state === "focus";

  return (
    <div
      aria-label="AI Composer state preview"
      aria-live={isGenerating ? "polite" : "off"}
      className={[
        "h-[141px] w-[736px] rounded-[32px] bg-[linear-gradient(45deg,#7D5330_0%,#D99C56_100%)] p-0.5 transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
        isFocus
          ? "shadow-[0_0_0_4px_rgba(217,156,86,0.16),0_18px_48px_rgba(125,83,48,0.14)]"
          : "shadow-none",
        isGenerating ? "select-none" : ""
      ].join(" ")}
      role="group"
    >
      <div
        className={[
          "flex h-full w-full flex-col items-start justify-between rounded-[30px] px-4 pb-4 pl-8 pt-5 transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
          isFocus
            ? "bg-[#FFFDF9]"
            : isGenerating
              ? "bg-[#F7F2EA]"
              : "bg-[#FCFBF9]"
        ].join(" ")}
      >
        <p
          className={[
            "m-0 flex max-w-[620px] items-center font-normal transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            placeholderLike ? "text-[#6F6A62]" : "text-[#45413C]",
            isFocus ? "opacity-75" : "opacity-100"
          ].join(" ")}
          style={{
            fontFamily:
              "Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: "16px",
            lineHeight: "24px"
          }}
        >
          <span>{displayText}</span>
          {showCaret || showDesigning ? (
            <span
              aria-hidden="true"
              className={[
                "ml-1 inline-block h-5 w-px bg-[#7D5330]",
                showDesigning ? "opacity-50" : "ai-composer-showroom-caret"
              ].join(" ")}
            />
          ) : null}
        </p>

        <div className="flex h-10 w-full flex-row items-center justify-end gap-4">
          <ShowroomMicIcon inactive={isGenerating} />
          <button
            aria-label={isGenerating ? "Generating" : "Send prompt"}
            className={[
              "inline-flex h-10 w-10 items-center justify-center rounded-[20px] bg-[linear-gradient(45deg,#7D5330_0%,#D99C56_100%)] p-0 transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
              isGenerating && generatingPhase === "pressed"
                ? "scale-[0.94]"
                : "scale-100"
            ].join(" ")}
            disabled={isGenerating}
            type="button"
          >
            {isGenerating && generatingPhase !== "ready" ? (
              <ShowroomSpinner />
            ) : (
              <ShowroomArrowIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AIComposerPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/components/ai-composer" />

        <ComponentPageShell
          description="A focused prompt composer for future PlayBooky AI moments. This page is for visual approval only and is not used in product pages."
          metadata={componentMetadata}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <ComponentViewportShowroom
            description="Use the viewport control to review how the same component is positioned inside desktop, tablet, and mobile preview frames."
            renderPreview={(viewport) => (
              <ViewportPreview viewport={viewport} />
            )}
            viewports={viewportItems}
          />

          <ComponentStateShowroom
            description="A living showroom for watching the AI Composer move through its core interaction states before product use."
            renderPreview={(state, isReducedMotion) => (
              <AIComposerStatePreview
                isReducedMotion={isReducedMotion}
                state={state}
              />
            )}
            states={showroomStates}
          />

          <SpecsSection />

          <ComponentTokensSection
            description="Token TODOs remain in place until the component is visually approved. No final token names are being invented yet."
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
