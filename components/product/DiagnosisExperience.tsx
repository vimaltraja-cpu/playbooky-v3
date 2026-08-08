"use client";

import { useMemo, useState } from "react";

import { DiagnosisCard } from "@/components/ui/DiagnosisCard";
import { diagnosisQuestions } from "@/lib/design-system/diagnosis-options";
import styles from "./ProductJourney.module.css";

const JOURNEY_STAGES = ["Composer", "Diagnosis", "Recommendation"] as const;

export function DiagnosisExperience({
  challenge,
  onComplete
}: {
  challenge: string;
  onComplete: (answers: Record<string, string>) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const question = diagnosisQuestions[questionIndex];
  const selectedId = answers[question.id] ?? null;
  const isLastQuestion = questionIndex >= diagnosisQuestions.length - 1;

  const challengeSummary = useMemo(() => {
    const trimmed = challenge.trim();
    if (trimmed.length <= 96) {
      return trimmed;
    }
    return `${trimmed.slice(0, 93)}...`;
  }, [challenge]);

  const handleSelect = (optionId: string) => {
    setAnswers((current) => ({
      ...current,
      [question.id]: optionId
    }));
  };

  const handleContinue = () => {
    if (!selectedId) {
      return;
    }

    if (isLastQuestion) {
      onComplete({
        ...answers,
        [question.id]: selectedId
      });
      return;
    }

    setQuestionIndex((current) => current + 1);
    setHoveredId(null);
  };

  return (
    <section aria-label="Diagnosis" className={styles.shell}>
      <div aria-hidden="true" className={styles.wash} />
      <div className={styles.inner}>
        <ol aria-label="Journey stages" className={styles.stageRail}>
          {JOURNEY_STAGES.map((stage, index) => (
            <li
              className={[
                styles.stageChip,
                index < 1 ? styles.stageChipDone : "",
                index === 1 ? styles.stageChipActive : ""
              ].join(" ")}
              key={stage}
            >
              {stage}
            </li>
          ))}
        </ol>

        <div>
          <p className={styles.eyebrow}>Diagnosis</p>
          <h1 className={styles.title}>
            Shape the workshop around your challenge
          </h1>
          <p className={styles.copy}>{challengeSummary}</p>
        </div>

        <div>
          <p className={styles.questionLabel}>{question.label}</p>
          <p className={styles.progress}>
            Question {questionIndex + 1} of {diagnosisQuestions.length}
          </p>
        </div>

        <div className={styles.grid}>
          {question.options.map((option) => {
            const isSelected = selectedId === option.id;
            const state = isSelected
              ? "selected"
              : hoveredId === option.id
                ? "hover"
                : "default";

            return (
              <div
                key={option.id}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() =>
                  setHoveredId((current) =>
                    current === option.id ? null : current
                  )
                }
              >
                <DiagnosisCard
                  description={option.description}
                  iconKey={option.iconKey}
                  label={option.label}
                  onClick={() => handleSelect(option.id)}
                  state={state}
                />
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          {questionIndex > 0 ? (
            <button
              className={styles.secondaryButton}
              onClick={() => {
                setQuestionIndex((current) => Math.max(0, current - 1));
                setHoveredId(null);
              }}
              type="button"
            >
              Back
            </button>
          ) : null}
          <button
            className={styles.primaryButton}
            disabled={!selectedId}
            onClick={handleContinue}
            type="button"
          >
            {isLastQuestion ? "Continue to loading" : "Continue"}
          </button>
        </div>
      </div>
    </section>
  );
}
