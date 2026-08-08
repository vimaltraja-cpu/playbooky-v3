"use client";

import { useMemo, useState, type ReactNode } from "react";

import type { DiagnosisQuestion } from "@/lib/design-system/diagnosis-options";
import {
  diagnosisProgressSteps,
  DiagnosisProgressNavigation
} from "@/components/product/DiagnosisProgressNavigation";
import { DiagnosisCard } from "@/components/ui/DiagnosisCard";
import { SiteBackgroundWash } from "@/components/ui/SiteBackgroundWash";

export type DiagnosisScreenViewport =
  | "mobile"
  | "tablet-portrait"
  | "tablet-landscape"
  | "desktop"
  | "large-desktop"
  | "xl-desktop";

type DiagnosisQuestionScreenProps = {
  challenge?: string;
  currentStep?: number;
  framed?: boolean;
  initialSelections?: Record<string, string[]>;
  isLoading?: boolean;
  onBack?: () => void;
  onContinue?: (answers: Record<string, string[]>) => void;
  question: DiagnosisQuestion;
  questions?: DiagnosisQuestion[];
  selectedOptionIds?: string[];
  showBottomPlaceholder?: boolean;
  showBack?: boolean;
  stepLabel?: string;
  totalSteps?: number;
  viewport?: DiagnosisScreenViewport;
};

type DiagnosisQuestionContent = {
  compactHeading?: ReactNode;
  heading: string;
  instruction: string;
  maxSelections: number;
};

const questionContent: Record<DiagnosisQuestion["id"], DiagnosisQuestionContent> = {
  challenges: {
    compactHeading: (
      <>
        <span className="diagnosis-question-heading__compact-line">
          What is getting
        </span>{" "}
        <span className="diagnosis-question-heading__compact-line">
          in the way?
        </span>
      </>
    ),
    heading: "What is getting in the way?",
    instruction: "Choose up to two challenges that best describe the situation.",
    maxSelections: 2
  },
  context: {
    heading: "What context should shape the workshop?",
    instruction: "Choose up to two context signals that should shape the workshop.",
    maxSelections: 2
  },
  goals: {
    compactHeading: (
      <>
        <span className="diagnosis-question-heading__compact-line">
          What are you trying
        </span>{" "}
        <span className="diagnosis-question-heading__compact-line">
          to achieve?
        </span>
      </>
    ),
    heading: "What are you trying to achieve?",
    instruction: "Choose up to two goals for the workshop.",
    maxSelections: 2
  },
  outcome: {
    heading: "What should be different by the end?",
    instruction: "Choose up to two outcomes the workshop should create.",
    maxSelections: 2
  },
  participants: {
    heading: "Who needs to be involved?",
    instruction: "Choose up to two participant groups for the workshop.",
    maxSelections: 2
  }
};

function DiagnosisChallengeContext({ challenge }: { challenge: string }) {
  return (
    <aside
      aria-label="Challenge from composer"
      className="diagnosis-challenge-context"
    >
      <p className="diagnosis-challenge-context__label">From your challenge</p>
      <p className="diagnosis-challenge-context__text">{challenge}</p>
    </aside>
  );
}

function DiagnosisQuestionHeader({
  question,
  viewport
}: {
  question: DiagnosisQuestion;
  viewport: DiagnosisScreenViewport;
}) {
  const content = questionContent[question.id];
  const useCompactHeading =
    viewport === "mobile" || viewport === "tablet-portrait";

  return (
    <header className="diagnosis-question-header">
      <h1 className="diagnosis-question-heading">
        {useCompactHeading && content.compactHeading
          ? content.compactHeading
          : content.heading}
      </h1>
      <p className="diagnosis-question-instruction">{content.instruction}</p>
    </header>
  );
}

function DiagnosisPrivacyNotice() {
  return (
    <p className="diagnosis-privacy-notice">
      <svg
        aria-hidden="true"
        className="diagnosis-privacy-lock"
        fill="none"
        height="12"
        viewBox="0 0 12 12"
        width="12"
      >
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="diagnosis-privacy-lock-gradient"
            x1="1.5"
            x2="10.5"
            y1="10.5"
            y2="1.5"
          >
            <stop stopColor="#7D5330" />
            <stop offset="1" stopColor="#D99C56" />
          </linearGradient>
        </defs>
        <rect
          height="5.75"
          rx="1.25"
          stroke="url(#diagnosis-privacy-lock-gradient)"
          strokeWidth="1"
          width="7"
          x="2.5"
          y="5.25"
        />
        <path
          d="M4 5.25V4a2 2 0 0 1 4 0v1.25"
          stroke="url(#diagnosis-privacy-lock-gradient)"
          strokeLinecap="round"
          strokeWidth="1"
        />
      </svg>
      <span>Your responses are private and secure</span>
    </p>
  );
}

function DiagnosisGrid({
  question,
  onToggleOption,
  selectedOptionIds,
  viewport
}: {
  onToggleOption: (optionId: string) => void;
  question: DiagnosisQuestion;
  selectedOptionIds: string[];
  viewport: DiagnosisScreenViewport;
}) {
  const maxSelections = questionContent[question.id].maxSelections;
  const selectionLimitReached = selectedOptionIds.length >= maxSelections;

  return (
    <div className="diagnosis-question-grid">
      {question.options.map((option) => (
        <DiagnosisCard
          key={option.id}
          onClick={() => onToggleOption(option.id)}
          option={option}
          selected={selectedOptionIds.includes(option.id)}
          selectionLimitReached={
            selectionLimitReached && !selectedOptionIds.includes(option.id)
          }
          viewport={viewport}
        />
      ))}
    </div>
  );
}

function DiagnosisOptionsRegion({
  onToggleOption,
  question,
  selectedOptionIds,
  viewport
}: {
  onToggleOption: (optionId: string) => void;
  question: DiagnosisQuestion;
  selectedOptionIds: string[];
  viewport: DiagnosisScreenViewport;
}) {
  return (
    <section
      aria-label={`${question.label} answer options`}
      className="diagnosis-options-region"
    >
      {viewport === "desktop" ||
      viewport === "large-desktop" ||
      viewport === "xl-desktop" ? (
        <DiagnosisPrivacyNotice />
      ) : null}
      <DiagnosisGrid
        onToggleOption={onToggleOption}
        question={question}
        selectedOptionIds={selectedOptionIds}
        viewport={viewport}
      />
    </section>
  );
}

function DiagnosisBottomRegion({
  canContinue,
  currentStep,
  isLoading,
  onBack,
  onContinue,
  progressPercentage,
  showBack,
  stepLabel,
  totalSteps
}: {
  canContinue: boolean;
  currentStep: number;
  isLoading: boolean;
  onBack?: () => void;
  onContinue?: () => void;
  progressPercentage: number;
  showBack: boolean;
  stepLabel: string;
  totalSteps: number;
}) {
  return (
    <footer className="diagnosis-bottom-region" aria-label="Reserved progress and navigation area">
      <DiagnosisProgressNavigation
        canContinue={canContinue}
        currentStep={currentStep}
        isLoading={isLoading}
        onBack={onBack}
        onContinue={onContinue}
        progressPercentage={progressPercentage}
        showBack={showBack}
        stepLabel={stepLabel}
        totalSteps={totalSteps}
      />
    </footer>
  );
}

function buildInitialSelections(
  questions: DiagnosisQuestion[],
  initialSelections: Record<string, string[]>,
  question: DiagnosisQuestion,
  selectedOptionIds: string[]
) {
  const nextSelections: Record<string, string[]> = {};

  for (const diagnosisQuestion of questions) {
    const seeded = initialSelections[diagnosisQuestion.id];

    if (Array.isArray(seeded) && seeded.length > 0) {
      nextSelections[diagnosisQuestion.id] = seeded;
    }
  }

  if (selectedOptionIds.length > 0) {
    nextSelections[question.id] = selectedOptionIds;
  }

  return nextSelections;
}

export function DiagnosisQuestionScreen({
  challenge,
  currentStep = 1,
  framed = false,
  initialSelections = {},
  isLoading = false,
  onBack,
  onContinue,
  question,
  questions = [question],
  selectedOptionIds = [],
  showBottomPlaceholder = false,
  showBack = false,
  stepLabel = question.label,
  totalSteps = 5,
  viewport = "desktop"
}: DiagnosisQuestionScreenProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(
    Math.min(Math.max(0, currentStep - 1), Math.max(0, questions.length - 1))
  );
  void showBottomPlaceholder;
  const activeQuestion = questions[activeStepIndex] ?? question;
  const activeStepNumber = activeStepIndex + 1;
  const progressStep = diagnosisProgressSteps[activeStepIndex];
  const activeStepLabel =
    progressStep ? progressStep.label : stepLabel;
  const activeTotalSteps = Math.max(totalSteps, questions.length);
  const [selectedIdsByQuestion, setSelectedIdsByQuestion] = useState<
    Record<string, string[]>
  >(() =>
    buildInitialSelections(
      questions,
      initialSelections,
      question,
      selectedOptionIds
    )
  );
  const selectedIds = selectedIdsByQuestion[activeQuestion.id] ?? [];
  const maxSelections = questionContent[activeQuestion.id].maxSelections;
  const answeredQuestionCount = questions.filter((diagnosisQuestion) => {
    const answer = selectedIdsByQuestion[diagnosisQuestion.id];

    return Array.isArray(answer) && answer.length > 0;
  }).length;
  const progressPercentage =
    questions.length > 0
      ? Math.round((answeredQuestionCount / questions.length) * 100)
      : 0;
  const trimmedChallenge = useMemo(() => challenge?.trim() ?? "", [challenge]);

  const handleToggleOption = (optionId: string) => {
    setSelectedIdsByQuestion((currentSelections) => {
      const currentIds = currentSelections[activeQuestion.id] ?? [];

      if (currentIds.includes(optionId)) {
        return {
          ...currentSelections,
          [activeQuestion.id]: currentIds.filter((id) => id !== optionId)
        };
      }

      if (currentIds.length >= maxSelections) {
        return currentSelections;
      }

      return {
        ...currentSelections,
        [activeQuestion.id]: [...currentIds, optionId]
      };
    });
  };

  const handleBack = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((index) => Math.max(0, index - 1));
      onBack?.();
      return;
    }

    onBack?.();
  };

  const handleContinue = () => {
    if (selectedIds.length < 1 || isLoading) {
      return;
    }

    if (activeStepIndex < questions.length - 1) {
      setActiveStepIndex((index) =>
        Math.min(questions.length - 1, index + 1)
      );
      return;
    }

    onContinue?.(selectedIdsByQuestion);
  };

  return (
    <main
      className={[
        "diagnosis-question-screen",
        framed ? "diagnosis-question-screen--framed" : ""
      ]
        .filter(Boolean)
        .join(" ")}
      data-viewport={viewport}
    >
      <SiteBackgroundWash />
      <div className="diagnosis-content-shell">
        <section
          className="diagnosis-main-content"
          aria-label="Diagnosis question and answer options"
        >
          {trimmedChallenge ? (
            <DiagnosisChallengeContext challenge={trimmedChallenge} />
          ) : null}
          <DiagnosisQuestionHeader question={activeQuestion} viewport={viewport} />
          <DiagnosisOptionsRegion
            onToggleOption={handleToggleOption}
            question={activeQuestion}
            selectedOptionIds={selectedIds}
            viewport={viewport}
          />
        </section>
        <DiagnosisBottomRegion
          canContinue={selectedIds.length >= 1}
          currentStep={activeStepNumber}
          isLoading={isLoading}
          onBack={handleBack}
          onContinue={handleContinue}
          progressPercentage={progressPercentage}
          showBack={activeStepIndex > 0 || showBack}
          stepLabel={activeStepLabel}
          totalSteps={activeTotalSteps}
        />
      </div>
    </main>
  );
}
