"use client";

import { useCallback, useEffect, useState } from "react";

import { RecommendationLoadingExperience } from "@/components/product/RecommendationLoadingExperience";
import { RecommendationRevealGridHandoffExperience } from "@/components/product/RecommendationRevealGridHandoffExperience";
import { RecommendationRevealTemplateExperience } from "@/components/product/RecommendationRevealTemplateExperience";
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
  continueLabel,
  includeGridHandoff = false,
  onRevealComplete
}: {
  continueLabel?: string;
  includeGridHandoff?: boolean;
  onRevealComplete?: () => void;
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
            <RecommendationRevealGridHandoffExperience />
          ) : (
            <RecommendationRevealTemplateExperience
              continueLabel={continueLabel}
              onContinue={onRevealComplete}
            />
          )
        )}
      </div>
    </div>
  );
}
