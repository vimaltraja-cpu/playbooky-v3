"use client";

import Link from "next/link";

import {
  recommendationRevealCards
} from "@/components/product/RecommendationCardReveal";
import { ActivityCard } from "@/components/ui/ActivityCard";
import styles from "./ProductJourney.module.css";

const JOURNEY_STAGES = [
  "Challenge",
  "Diagnosis",
  "Recommendation",
  "Activities"
] as const;

export function RecommendationActivitiesExperience({
  challenge
}: {
  challenge: string;
}) {
  return (
    <section aria-label="Recommended activities" className={styles.shell}>
      <div aria-hidden="true" className={styles.wash} />
      <div className={styles.inner}>
        <ol aria-label="Journey stages" className={styles.stageRail}>
          {JOURNEY_STAGES.map((stage, index) => (
            <li
              className={[
                styles.stageChip,
                index < 3 ? styles.stageChipDone : "",
                index === 3 ? styles.stageChipActive : ""
              ].join(" ")}
              key={stage}
            >
              {stage}
            </li>
          ))}
        </ol>

        <div>
          <p className={styles.eyebrow}>Recommended activities</p>
          <h1 className={styles.title}>Your sequence is ready to build</h1>
          <p className={styles.copy}>
            {challenge.trim()
              ? `Green-lit recommendation cards shaped around “${
                  challenge.trim().length > 72
                    ? `${challenge.trim().slice(0, 72)}…`
                    : challenge.trim()
                }”. Next stop is the builder.`
              : "Green-lit recommendation cards from your diagnosis. Next stop is the builder."}
          </p>
        </div>

        <div className={styles.activitiesGrid}>
          {recommendationRevealCards.map((card) => (
            <div className={styles.activitiesCard} key={card.id}>
              <ActivityCard activity={card.activity} size="desktop" variant="library" />
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <Link
            className={styles.secondaryButton}
            href="/design-system/core-experience/activity-grid"
          >
            Open activity grid
          </Link>
          <Link
            className={styles.primaryButton}
            href="/design-system/core-experience/activity-detail-modal"
          >
            Continue to builder review
          </Link>
        </div>
      </div>
    </section>
  );
}
