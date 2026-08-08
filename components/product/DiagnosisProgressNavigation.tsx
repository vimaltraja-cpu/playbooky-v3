"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export const diagnosisProgressSteps = [
  { id: "goals", label: "Goals" },
  { id: "challenges", label: "Challenges" },
  { id: "context", label: "Context" },
  { id: "participants", label: "Participation" },
  { id: "outcome", label: "Outcomes" }
] as const;

type DiagnosisProgressNavigationProps = {
  canContinue: boolean;
  currentStep: number;
  isLoading?: boolean;
  onBack?: () => void;
  onContinue?: () => void;
  progressPercentage: number;
  showBack?: boolean;
  stepLabel: string;
  totalSteps: number;
};

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      className="diagnosis-progress-navigation__button-icon"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
    >
      <path
        d="M10 13 5 8l5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="diagnosis-progress-navigation__button-icon"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
    >
      <path
        d="m6 3 5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <span
      aria-hidden="true"
      className="diagnosis-progress-navigation__spinner"
    />
  );
}

export function DiagnosisPrimaryCTA({
  children,
  className = "",
  disabled = false,
  isLoading = false,
  onClick,
  tabIndex,
  ...buttonProps
}: Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  isLoading?: boolean;
}) {
  return (
    <button
      {...buttonProps}
      aria-disabled={buttonProps["aria-disabled"] ?? disabled}
      className={[
        "diagnosis-progress-navigation__button diagnosis-progress-navigation__button--continue",
        className
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      tabIndex={tabIndex}
      type={buttonProps.type ?? "button"}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          Loading
        </>
      ) : (
        <>
          {children}
          <ArrowRightIcon />
        </>
      )}
    </button>
  );
}

export function DiagnosisProgressNavigation({
  canContinue,
  currentStep,
  isLoading = false,
  onBack,
  onContinue,
  progressPercentage,
  showBack = false,
  stepLabel,
  totalSteps
}: DiagnosisProgressNavigationProps) {
  const safeTotalSteps = Math.max(1, totalSteps);
  const safeCurrentStep = Math.min(
    Math.max(1, currentStep),
    safeTotalSteps
  );
  const canSubmit = canContinue && !isLoading;
  const safeProgressPercentage = Math.min(
    100,
    Math.max(0, Math.round(progressPercentage))
  );
  const progress = `${safeProgressPercentage}%`;
  const continueLabel =
    safeCurrentStep === safeTotalSteps ? "Go to results" : "Continue";

  return (
    <nav
      aria-label="Diagnosis progress and navigation"
      className="diagnosis-progress-navigation"
    >
      <div className="diagnosis-progress-navigation__progress-info">
        <div
          aria-label={`${safeProgressPercentage}% completed`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={safeProgressPercentage}
          className="diagnosis-progress-navigation__track"
          role="progressbar"
        >
          <span
            className="diagnosis-progress-navigation__fill"
            style={{ width: progress }}
          />
        </div>

        <div className="diagnosis-progress-navigation__metadata">
          <span className="diagnosis-progress-navigation__metadata-left">
            <span className="diagnosis-progress-navigation__count">
              Step {safeCurrentStep} of {safeTotalSteps}
            </span>
            <span
              aria-hidden="true"
              className="diagnosis-progress-navigation__separator"
            />
            <span className="diagnosis-progress-navigation__step">
              {stepLabel}
            </span>
          </span>
          <span className="diagnosis-progress-navigation__completed">
            {safeProgressPercentage}% completed
          </span>
        </div>
      </div>

      <div className="diagnosis-progress-navigation__actions">
        {showBack ? (
          <button
            className="diagnosis-progress-navigation__button diagnosis-progress-navigation__button--back"
            disabled={isLoading}
            onClick={onBack}
            type="button"
          >
            <ArrowLeftIcon />
            Back
          </button>
        ) : null}
        <DiagnosisPrimaryCTA
          disabled={!canSubmit}
          isLoading={isLoading}
          onClick={onContinue}
        >
          {continueLabel}
        </DiagnosisPrimaryCTA>
      </div>
    </nav>
  );
}
