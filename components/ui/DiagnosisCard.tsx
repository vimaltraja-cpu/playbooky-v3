"use client";

import {
  diagnosisIcons,
  type DiagnosisIconKey
} from "@/lib/design-system/diagnosis-icons";

export type DiagnosisCardState =
  "default" | "hover" | "selected" | "maxSelected";

type DiagnosisCardProps = {
  iconKey?: DiagnosisIconKey;
  state?: DiagnosisCardState;
};

const diagnosisIconAspectRatio = 72 / 70;
const diagnosisIconDefaultHeight = 70;
const diagnosisIconCompressedHeight = 58.5;

function DiagnosisLeftIcon({
  iconKey,
  state
}: {
  iconKey: DiagnosisIconKey;
  state: DiagnosisCardState;
}) {
  const isCompressed = state !== "default";
  const height = isCompressed
    ? diagnosisIconCompressedHeight
    : diagnosisIconDefaultHeight;
  const width = height * diagnosisIconAspectRatio;
  const Icon = diagnosisIcons[iconKey];

  return (
    <Icon
      alt=""
      aria-hidden="true"
      height={height}
      width={width}
    />
  );
}

function StateIcon({ state }: { state: DiagnosisCardState }) {
  if (state === "default" || state === "maxSelected") {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className="diagnosis-card-state-indicator diagnosis-card-state-indicator-hover"
    >
      {state === "selected" ? (
        <span className="diagnosis-card-state-indicator-core" />
      ) : null}
    </span>
  );
}

function SelectedAnimationLayer() {
  return (
    <svg
      aria-hidden="true"
      className="diagnosis-card-selected-animation-layer"
      fill="none"
      height="252"
      pointerEvents="none"
      viewBox="0 0 445.33 252"
      width="445.33"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="diagnosis-card-selected-animation-gradient"
          x1="0"
          x2="445.33"
          y1="252"
          y2="0"
        >
          <stop stopColor="#7D5330" />
          <stop offset="1" stopColor="#D99C56" />
        </linearGradient>
      </defs>
      <path
        className="diagnosis-card-selected-path diagnosis-card-selected-path-a"
        d="M 8 251 H 437.33 Q 444.33 251 444.33 244 V 8 Q 444.33 1 437.33 1"
        pathLength="1"
        stroke="url(#diagnosis-card-selected-animation-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        className="diagnosis-card-selected-path diagnosis-card-selected-path-b"
        d="M 8 251 Q 1 251 1 244 V 8 Q 1 1 8 1 H 437.33"
        pathLength="1"
        stroke="url(#diagnosis-card-selected-animation-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <rect
        className="diagnosis-card-selected-outline"
        height="250"
        rx="7"
        stroke="url(#diagnosis-card-selected-animation-gradient)"
        strokeWidth="1.5"
        width="443.33"
        x="1"
        y="1"
      />
    </svg>
  );
}

export function DiagnosisCard({
  iconKey = "align-a-team",
  state = "default"
}: DiagnosisCardProps) {
  const isSelected = state === "selected";
  const isMaxSelected = state === "maxSelected";
  const isLifted = state === "hover" || isSelected;
  const topBarHeight = state === "default" ? "70px" : "58.5px";

  return (
    <button
      aria-disabled={isMaxSelected}
      aria-label="Diagnosis card: Align a team"
      aria-pressed={isSelected}
      className="diagnosis-card-prototype"
      data-state={state}
      style={{
        alignItems: "flex-start",
        background: isMaxSelected
          ? "rgba(252, 251, 249, 0.34)"
          : isLifted
            ? "#FCFBF9"
            : "rgba(252, 251, 249, 0.5)",
        border: `1px solid ${state === "default" ? "#E6E2DC" : "#D8C08A"}`,
        borderRadius: "8px",
        boxShadow: isLifted
          ? "0px 4px 8px -2px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.06)"
          : "none",
        boxSizing: "border-box",
        cursor: isMaxSelected ? "not-allowed" : "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "252px",
        justifyContent: "center",
        opacity: isMaxSelected ? 0.64 : 1,
        padding: "16px 32px",
        position: "relative",
        textAlign: "left",
        transition:
          "background 200ms cubic-bezier(0.2, 0, 0, 1), box-shadow 200ms cubic-bezier(0.2, 0, 0, 1), opacity 200ms cubic-bezier(0.2, 0, 0, 1)",
        width: "445.33px"
      }}
      type="button"
    >
      {isSelected ? <SelectedAnimationLayer /> : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          width: "381.33px"
        }}
      >
        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            height: topBarHeight,
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <DiagnosisLeftIcon iconKey={iconKey} state={state} />
          <StateIcon state={state} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%"
          }}
        >
          <h3
            style={{
              color: "#062E27",
              fontFamily:
                "Newsreader, Georgia, 'Times New Roman', ui-serif, serif",
              fontSize: "24px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: "140%",
              margin: 0
            }}
          >
            Align a team
          </h3>
          <p
            style={{
              color: "#45413C",
              fontFamily:
                "Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: "20px",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: "175%",
              margin: 0
            }}
          >
            Bring people into alignment around a shared goal or direction.
          </p>
        </div>
      </div>
    </button>
  );
}
