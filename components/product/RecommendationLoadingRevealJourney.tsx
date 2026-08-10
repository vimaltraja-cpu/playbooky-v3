"use client";

import { useCallback, useEffect, useState } from "react";

import { RecommendationLoadingExperience } from "@/components/product/RecommendationLoadingExperience";
import { RecommendationRevealGridHandoffExperience } from "@/components/product/RecommendationRevealGridHandoffExperience";
import { RecommendationRevealTemplateExperience } from "@/components/product/RecommendationRevealTemplateExperience";
import type { ActivityLibraryModalItem } from "@/lib/design-system/activity-library-modal";
import type {
  JourneyActivityCard,
  JourneyActivityMutation,
  JourneyGeneratedWorkshop
} from "@/src/features/recommendation-journey/journeySession";
import styles from "./RecommendationScreens.module.css";

type JourneyPhase = "loading" | "exiting" | "entering" | "reveal";

const EXIT_MS = 720;
const ENTER_MS = 900;
const HOLD_AT_BLUR_MS = 220;

/**
 * Green-lit recommendation segment:
 * watercolor loading → blur handoff → recommendation reveal.
 * Isolated reveal review remains at /recommendation-reveal-template.
 */
export function RecommendationLoadingRevealJourney({
  activityCards,
  continueLabel,
  includeGridHandoff = false,
  libraryActivities = [],
  onGridActivityMutation,
  onGridCardsChange,
  onGridContinue,
  onRevealComplete,
  workshop
}: {
  activityCards?: JourneyActivityCard[];
  continueLabel?: string;
  includeGridHandoff?: boolean;
  libraryActivities?: ActivityLibraryModalItem[];
  onGridActivityMutation?: (mutation: JourneyActivityMutation) => void;
  onGridCardsChange?: (cards: JourneyActivityCard[]) => void;
  onGridContinue?: () => void;
  onRevealComplete?: () => void;
  workshop?: JourneyGeneratedWorkshop;
} = {}) {
  const [phase, setPhase] = useState<JourneyPhase>("loading");

  const handleLoadingComplete = useCallback(() => {
    setPhase("exiting");
  }, []);

  useEffect(() => {
    if (phase !== "exiting") {
      return;
    }

    const swapTimeoutId = window.setTimeout(() => {
      setPhase("entering");
    }, EXIT_MS + HOLD_AT_BLUR_MS);

    return () => {
      window.clearTimeout(swapTimeoutId);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "entering") {
      return;
    }

    const settleTimeoutId = window.setTimeout(() => {
      setPhase("reveal");
    }, ENTER_MS);

    return () => {
      window.clearTimeout(settleTimeoutId);
    };
  }, [phase]);

  const showLoading = phase === "loading" || phase === "exiting";
  const surfaceMotionClass =
    phase === "exiting"
      ? styles.journeySurfaceExit
      : phase === "entering"
        ? styles.journeySurfaceEnter
        : "";

  return (
    <div className={styles.journeyRoot}>
      <div className={[styles.journeySurface, surfaceMotionClass].join(" ")}>
        {showLoading ? (
          <RecommendationLoadingExperience
            loop={false}
            onComplete={handleLoadingComplete}
          />
        ) : (
          includeGridHandoff ? (
            <RecommendationRevealGridHandoffExperience
              activityCards={activityCards}
              libraryActivities={libraryActivities}
              onActivityMutation={onGridActivityMutation}
              onCardsChange={onGridCardsChange}
              onContinue={onGridContinue}
              workshop={workshop}
            />
          ) : (
            <RecommendationRevealTemplateExperience
              activityCards={activityCards}
              continueLabel={continueLabel}
              onContinue={onRevealComplete}
              workshop={workshop}
            />
          )
        )}
      </div>
    </div>
  );
}
