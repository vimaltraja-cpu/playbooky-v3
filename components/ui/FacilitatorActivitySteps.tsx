"use client";

/**
 * FacilitatorActivitySteps — ordered facilitation steps for the selected activity.
 *
 * Each step shows number + title, duration, description, and three insight
 * columns: What to say, Discussion prompt, Expected outcome.
 *
 * On activity change, a short Paper/Cursor-style AI compose loader plays
 * (card shimmer + Morse bars) before the real steps blur-pop in.
 */

import {
  useEffect,
  useRef,
  useState,
  type ReactElement
} from "react";

import {
  getFacilitatorStepsIdentity,
  getFacilitatorStepsReadyDelay
} from "@/lib/facilitator-guide/steps-render-lifecycle";

const SYSTEM_ICON_PATH = "/assets/icons/system Icons";

export type FacilitatorActivityStepInsightKey =
  | "whatToSay"
  | "discussionPrompt"
  | "expectedOutcome";

export type FacilitatorActivityStep = {
  description: string;
  discussionPrompt: string | string[];
  durationLabel: string;
  expectedOutcome: string;
  id: string;
  title: string;
  whatToSay: string;
};

export type FacilitatorActivityStepsProps = {
  /** Changes when the selected activity changes — retriggers the build reveal. */
  activityKey?: string;
  className?: string;
  steps: FacilitatorActivityStep[];
};

const insightMeta: Record<
  FacilitatorActivityStepInsightKey,
  { icon: string; label: string }
> = {
  discussionPrompt: {
    icon: "flag",
    label: "Discussion prompt"
  },
  expectedOutcome: {
    icon: "target",
    label: "Expected outcome"
  },
  whatToSay: {
    icon: "message-circle",
    label: "What to say"
  }
};

function SystemIcon({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="fg-activity-steps__insight-icon"
      style={{
        WebkitMaskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`,
        maskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`
      }}
    />
  );
}

function formatStepNumber(index: number) {
  return `#${index + 1}`;
}

function InsightBody({ value }: { value: string | string[] }) {
  if (Array.isArray(value)) {
    return (
      <p className="fg-activity-steps__insight-body">
        {value.map((line, index) => (
          <span key={`${line}-${index}`}>
            {line}
            {index < value.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    );
  }

  return <p className="fg-activity-steps__insight-body">{value}</p>;
}

function InsightColumn({
  body,
  icon,
  label,
  showDividerBefore = false
}: {
  body: string | string[];
  icon: string;
  label: string;
  showDividerBefore?: boolean;
}) {
  return (
    <>
      {showDividerBefore ? (
        <div
          aria-hidden="true"
          className="fg-activity-steps__column-divider"
        />
      ) : null}
      <div className="fg-activity-steps__insight">
        <div className="fg-activity-steps__insight-heading">
          <SystemIcon name={icon} />
          <span className="fg-activity-steps__insight-label">{label}</span>
        </div>
        <InsightBody value={body} />
      </div>
    </>
  );
}

function StepDivider() {
  return (
    <div aria-hidden="true" className="fg-activity-steps__divider-wrap">
      <div className="fg-activity-steps__divider" />
    </div>
  );
}

function BuildingSkeleton() {
  // Irregular dash lengths — Morse-code / Cursor-style AI compose feel.
  const rows: number[][] = [
    [72, 28, 48, 18],
    [36, 64, 22, 52, 26],
    [88, 20, 40],
    [24, 32, 60, 16, 44],
    [68, 22, 46, 30],
    [34, 80, 18, 50]
  ];

  return (
    <div
      aria-busy="true"
      aria-label="Building facilitation steps"
      aria-live="polite"
      className="fg-activity-steps__build"
    >
      <div aria-hidden="true" className="fg-activity-steps__build-wash" />

      <div className="fg-activity-steps__build-morse">
        {rows.map((bars, rowIndex) => (
          <div className="fg-activity-steps__build-morse-row" key={rowIndex}>
            {bars.map((width, barIndex) => (
              <span
                className="fg-activity-steps__build-morse-bar"
                key={`${rowIndex}-${barIndex}`}
                style={{
                  animationDelay: `${(rowIndex * 90 + barIndex * 55) % 700}ms`,
                  width: `${width}px`
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FacilitatorActivitySteps({
  activityKey,
  className,
  steps
}: FacilitatorActivityStepsProps): ReactElement | null {
  const stepsSignature = getFacilitatorStepsIdentity(
    activityKey,
    steps.map((step) => step.id)
  );
  const [phase, setPhase] = useState<"building" | "ready">("building");
  const hasPlayedEntranceBuild = useRef(false);

  useEffect(() => {
    setPhase("building");

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const readyDelay = getFacilitatorStepsReadyDelay(
      hasPlayedEntranceBuild.current,
      prefersReducedMotion
    );

    if (readyDelay === 0) {
      hasPlayedEntranceBuild.current = true;
      setPhase("ready");
      return;
    }

    const timeout = window.setTimeout(() => {
      hasPlayedEntranceBuild.current = true;
      setPhase("ready");
    }, readyDelay);

    return () => window.clearTimeout(timeout);
  }, [stepsSignature]);

  if (steps.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Activity steps"
      className={[
        "fg-activity-steps-section",
        "fg-live__enter",
        "fg-live__enter--steps",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      data-phase={phase}
    >
      <div
        className={[
          "fg-activity-steps",
          phase === "building" ? "fg-activity-steps--building" : null
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {phase === "building" ? (
          <BuildingSkeleton />
        ) : (
          <div className="fg-activity-steps__ready">
            {steps.map((step, index) => {
              const insights: Array<{
                body: string | string[];
                key: FacilitatorActivityStepInsightKey;
              }> = [
                { body: step.whatToSay, key: "whatToSay" },
                { body: step.discussionPrompt, key: "discussionPrompt" },
                { body: step.expectedOutcome, key: "expectedOutcome" }
              ];

              return (
                <div key={step.id}>
                  <article className="fg-activity-steps__step">
                    <div className="fg-activity-steps__step-inner">
                      <div className="fg-activity-steps__header">
                        <div className="fg-activity-steps__title-group">
                          <span className="fg-activity-steps__number">
                            {formatStepNumber(index)}
                          </span>
                          <h2 className="fg-activity-steps__title">
                            {step.title}
                          </h2>
                        </div>

                        <div className="fg-activity-steps__duration">
                          <span className="fg-activity-steps__duration-label">
                            {step.durationLabel}
                          </span>
                        </div>
                      </div>

                      <p className="fg-activity-steps__description">
                        {step.description}
                      </p>

                      <div className="fg-activity-steps__insights">
                        {insights.map((insight, insightIndex) => {
                          const meta = insightMeta[insight.key];

                          return (
                            <InsightColumn
                              body={insight.body}
                              icon={meta.icon}
                              key={insight.key}
                              label={meta.label}
                              showDividerBefore={insightIndex > 0}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </article>

                  {index < steps.length - 1 ? <StepDivider /> : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/** Demo / review fixture matching the Figma Facilitator Guide step examples. */
export const facilitatorActivityStepsDemo: FacilitatorActivityStep[] = [
  {
    description:
      "Present the key research findings and establish a shared understanding.",
    discussionPrompt: [
      "What stands out to you?",
      "What surprised you?",
      "What patterns do you notice?"
    ],
    durationLabel: "5 MINUTES",
    expectedOutcome:
      "Participants understand the key findings and current landscape.",
    id: "review-findings",
    title: "Review findings",
    whatToSay:
      "“Let’s spend a few minutes reviewing the key findings from our research.”"
  },
  {
    description:
      "Invite individual reactions and observations to surface early patterns.",
    discussionPrompt: [
      "What surprised you?",
      "What opportunities do you see?",
      "What questions do you have?"
    ],
    durationLabel: "5 MINUTES",
    expectedOutcome:
      "Key observations, patterns and opportunities are captured by the team.",
    id: "capture-observations",
    title: "Capture observations",
    whatToSay:
      "“Take a few minutes to capture your initial reactions and observation.”"
  },
  {
    description:
      "Discuss and agree on the 2-3 key themes that matter most right now.",
    discussionPrompt:
      "What are the most important themes we should focus on? Why do these themes matter?",
    durationLabel: "5 MINUTES",
    expectedOutcome:
      "Shared agreement on the key themes that will guide decisions and priorities.",
    id: "align-key-themes",
    title: "Align key themes",
    whatToSay:
      "“Let’s identify the 2-3 themes that are most important for us to focus on.”"
  }
];
