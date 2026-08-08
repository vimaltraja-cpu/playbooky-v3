"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ChallengeExperience } from "@/components/product/ChallengeExperience";
import { DiagnosisExperience } from "@/components/product/DiagnosisExperience";
import { RecommendationActivitiesExperience } from "@/components/product/RecommendationActivitiesExperience";
import { RecommendationLoadingRevealJourney } from "@/components/product/RecommendationLoadingRevealJourney";
import styles from "./RecommendationScreens.module.css";

export type ProductJourneyStage =
  | "challenge"
  | "diagnosis"
  | "recommendation"
  | "activities";

const EXIT_MS = 720;
const ENTER_MS = 900;
const HOLD_AT_BLUR_MS = 180;

const STAGE_ORDER: ProductJourneyStage[] = [
  "challenge",
  "diagnosis",
  "recommendation",
  "activities"
];

function isProductJourneyStage(value: string | null): value is ProductJourneyStage {
  return Boolean(value && STAGE_ORDER.includes(value as ProductJourneyStage));
}

/**
 * Stitched Core Experience journey:
 * Challenge → Diagnosis → green-lit Recommendation (loading + reveal) → Activities.
 */
export function ProductJourney({
  initialStage = "challenge"
}: {
  initialStage?: ProductJourneyStage;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stageFromQuery = searchParams.get("stage");

  const resolvedInitialStage = useMemo(() => {
    if (isProductJourneyStage(stageFromQuery)) {
      return stageFromQuery;
    }
    return initialStage;
  }, [initialStage, stageFromQuery]);

  const [stage, setStage] = useState<ProductJourneyStage>(resolvedInitialStage);
  const [surfacePhase, setSurfacePhase] = useState<"idle" | "exiting" | "entering">(
    "idle"
  );
  const [pendingStage, setPendingStage] = useState<ProductJourneyStage | null>(
    null
  );
  const [challenge, setChallenge] = useState(
    "Create a 45-minute workshop for a new leadership team aligning on Q3 priorities."
  );

  useEffect(() => {
    if (isProductJourneyStage(stageFromQuery) && stageFromQuery !== stage) {
      setStage(stageFromQuery);
    }
  }, [stage, stageFromQuery]);

  const syncStageToUrl = useCallback(
    (nextStage: ProductJourneyStage) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("stage", nextStage);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const goToStage = useCallback(
    (nextStage: ProductJourneyStage) => {
      if (nextStage === stage || surfacePhase !== "idle") {
        return;
      }

      setPendingStage(nextStage);
      setSurfacePhase("exiting");
    },
    [stage, surfacePhase]
  );

  useEffect(() => {
    if (surfacePhase !== "exiting" || !pendingStage) {
      return;
    }

    const swapTimeoutId = window.setTimeout(() => {
      setStage(pendingStage);
      syncStageToUrl(pendingStage);
      setPendingStage(null);
      setSurfacePhase("entering");
    }, EXIT_MS + HOLD_AT_BLUR_MS);

    return () => {
      window.clearTimeout(swapTimeoutId);
    };
  }, [pendingStage, surfacePhase, syncStageToUrl]);

  useEffect(() => {
    if (surfacePhase !== "entering") {
      return;
    }

    const settleTimeoutId = window.setTimeout(() => {
      setSurfacePhase("idle");
    }, ENTER_MS);

    return () => {
      window.clearTimeout(settleTimeoutId);
    };
  }, [surfacePhase]);

  const surfaceMotionClass =
    surfacePhase === "exiting"
      ? styles.journeySurfaceExit
      : surfacePhase === "entering"
        ? styles.journeySurfaceEnter
        : "";

  return (
    <div className={styles.journeyRoot}>
      <div className={[styles.journeySurface, surfaceMotionClass].join(" ")}>
        {stage === "challenge" ? (
          <ChallengeExperience
            onComplete={(nextChallenge) => {
              setChallenge(nextChallenge);
              goToStage("diagnosis");
            }}
          />
        ) : null}

        {stage === "diagnosis" ? (
          <DiagnosisExperience
            challenge={challenge}
            onComplete={() => goToStage("recommendation")}
          />
        ) : null}

        {stage === "recommendation" ? (
          <RecommendationLoadingRevealJourney
            continueLabel="Continue to activities"
            onRevealComplete={() => goToStage("activities")}
          />
        ) : null}

        {stage === "activities" ? (
          <RecommendationActivitiesExperience challenge={challenge} />
        ) : null}
      </div>
    </div>
  );
}
