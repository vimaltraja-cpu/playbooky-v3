"use client";

import { useState } from "react";

import { AIComposer } from "@/components/ui/AIComposer";
import styles from "./ProductJourney.module.css";

const JOURNEY_STAGES = [
  "Challenge",
  "Diagnosis",
  "Recommendation",
  "Activities"
] as const;

export function ChallengeExperience({
  onComplete
}: {
  onComplete: (challenge: string) => void;
}) {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = () => {
    const challenge = value.trim();
    if (!challenge || isSending) {
      return;
    }

    setIsSending(true);
    window.setTimeout(() => {
      onComplete(challenge);
    }, 480);
  };

  return (
    <section aria-label="Challenge" className={styles.shell}>
      <div aria-hidden="true" className={styles.wash} />
      <div className={styles.inner}>
        <ol aria-label="Journey stages" className={styles.stageRail}>
          {JOURNEY_STAGES.map((stage, index) => (
            <li
              className={[
                styles.stageChip,
                index === 0 ? styles.stageChipActive : ""
              ].join(" ")}
              key={stage}
            >
              {stage}
            </li>
          ))}
        </ol>

        <div>
          <p className={styles.eyebrow}>PlayBooky</p>
          <h1 className={styles.title}>What challenge are you shaping?</h1>
          <p className={styles.copy}>
            Start with the problem, team, or outcome. PlayBooky will diagnose
            the shape of the workshop from here.
          </p>
        </div>

        <div className={styles.composerWrap}>
          <AIComposer
            onChange={setValue}
            onSubmit={handleSubmit}
            state={isSending ? "loading" : value.trim() ? "typing" : "empty"}
            value={value}
            viewport="desktop"
          />
        </div>
      </div>
    </section>
  );
}
