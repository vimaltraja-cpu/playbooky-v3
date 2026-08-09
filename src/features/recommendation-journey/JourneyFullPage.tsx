"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { ActivityLibraryModalItem } from "@/lib/design-system/activity-library-modal";
import { ActiveGridWithLibrary } from "@/src/features/recommendation-journey/ActiveGridWithLibrary";
import { DiagnosisQuestionScreen } from "@/components/product/DiagnosisQuestionScreen";
import {
  type DiagnosisScreenViewport
} from "@/components/product/DiagnosisQuestionScreen";
import { HomepageComposerLayout } from "@/components/product/HomepageTextLayout";
import { RecommendationCardRevealExperience } from "@/components/product/RecommendationCardRevealExperience";
import { RecommendationLoadingRevealJourney } from "@/components/product/RecommendationLoadingRevealJourney";
import { SiteBackgroundWash } from "@/components/ui/SiteBackgroundWash";
import { diagnosisQuestions } from "@/lib/design-system/diagnosis-options";
import type { DiagnosisQuestionId } from "@/lib/design-system/diagnosis-options";
import {
  getResolvedComposerDimensionCount,
  getUnresolvedDiagnosisQuestions,
  interpretComposerChallenge,
  journeyChallengeStorageKey,
  journeyDiagnosisAnswersStorageKey,
  journeyDiagnosisInterpretationStorageKey,
  mergeDiagnosisAnswers,
  type DiagnosisAnswersByQuestion
} from "@/src/features/recommendation-journey/diagnosisIntelligence";
import type {
  JourneyStage,
  JourneyStageId
} from "@/src/features/recommendation-journey/journeyManifest";

function getDiagnosisViewport(): DiagnosisScreenViewport {
  if (typeof window === "undefined") {
    return "desktop";
  }

  if (window.innerWidth < 768) {
    return "mobile";
  }

  if (window.innerWidth < 1200) {
    return window.innerWidth > window.innerHeight
      ? "tablet-landscape"
      : "tablet-portrait";
  }

  if (window.innerWidth >= 1920) {
    return "xl-desktop";
  }

  if (window.innerWidth >= 1728) {
    return "large-desktop";
  }

  return "desktop";
}

function useResponsiveMode<Mode extends string>(
  getMode: () => Mode,
  initialMode: Mode
) {
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    const updateMode = () => setMode(getMode());

    updateMode();
    window.addEventListener("resize", updateMode);

    return () => window.removeEventListener("resize", updateMode);
  }, [getMode]);

  return mode;
}

function ActiveGridFullPage({
  initialOpenCardId,
  libraryActivities
}: {
  initialOpenCardId?: string;
  libraryActivities: ActivityLibraryModalItem[];
}) {
  const router = useRouter();

  return (
    <ActiveGridWithLibrary
      initialOpenCardId={initialOpenCardId}
      libraryActivities={libraryActivities}
      onContinue={() => router.push("/facilitator-guide")}
    />
  );
}

function DiagnosisFullPage() {
  const router = useRouter();
  const viewport = useResponsiveMode(
    getDiagnosisViewport,
    "desktop" satisfies DiagnosisScreenViewport
  );
  const [challenge, setChallenge] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    try {
      return window.sessionStorage.getItem(journeyChallengeStorageKey) ?? "";
    } catch {
      return "";
    }
  });
  const [diagnosisAnswers, setDiagnosisAnswers] =
    useState<DiagnosisAnswersByQuestion>({});

  useEffect(() => {
    try {
      setChallenge(
        window.sessionStorage.getItem(journeyChallengeStorageKey) ?? ""
      );
    } catch {
      setChallenge("");
    }
  }, []);

  const interpretation = useMemo(
    () => interpretComposerChallenge(challenge),
    [challenge]
  );
  const unresolvedQuestions = useMemo(
    () => getUnresolvedDiagnosisQuestions(interpretation),
    [interpretation]
  );
  const resolvedComposerCount =
    getResolvedComposerDimensionCount(interpretation);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        journeyDiagnosisInterpretationStorageKey,
        JSON.stringify(interpretation)
      );
    } catch {
      // Interpretation is recoverable from the original challenge.
    }
  }, [interpretation]);

  useEffect(() => {
    if (!challenge || unresolvedQuestions.length > 0) {
      return;
    }

    try {
      window.sessionStorage.setItem(
        journeyDiagnosisAnswersStorageKey,
        JSON.stringify(interpretation.resolvedAnswers)
      );
    } catch {
      // Navigation can still continue if temporary storage is unavailable.
    }

    router.replace("/internal/journey/loading");
  }, [challenge, interpretation, router, unresolvedQuestions.length]);

  function persistCombinedAnswers(
    nextDiagnosisAnswers: DiagnosisAnswersByQuestion
  ) {
    const combinedAnswers = mergeDiagnosisAnswers(
      interpretation,
      nextDiagnosisAnswers
    );

    try {
      window.sessionStorage.setItem(
        journeyDiagnosisAnswersStorageKey,
        JSON.stringify(combinedAnswers)
      );
    } catch {
      // Diagnosis can continue; storage is a journey handoff aid.
    }
  }

  function handleSelectionsChange(
    selectedIdsByQuestion: Partial<Record<DiagnosisQuestionId, string[]>>
  ) {
    setDiagnosisAnswers(selectedIdsByQuestion);
    persistCombinedAnswers(selectedIdsByQuestion);
  }

  function handleContinue() {
    persistCombinedAnswers(diagnosisAnswers);
    router.push("/internal/journey/loading");
  }

  if (challenge && unresolvedQuestions.length === 0) {
    return null;
  }

  const visibleQuestions =
    unresolvedQuestions.length > 0 ? unresolvedQuestions : diagnosisQuestions;

  return (
    <div className="diagnosis-journey-page">
      <SiteBackgroundWash />
      <DiagnosisQuestionScreen
        onContinue={handleContinue}
        onSelectionsChange={handleSelectionsChange}
        progressResolvedCount={resolvedComposerCount}
        question={visibleQuestions[0]}
        questions={visibleQuestions}
        totalSteps={diagnosisQuestions.length}
        viewport={viewport}
      />
    </div>
  );
}

function renderStage(
  stageId: JourneyStageId,
  libraryActivities: ActivityLibraryModalItem[]
) {
  if (stageId === "composer") {
    return <HomepageComposerLayout />;
  }

  if (stageId === "diagnosis") {
    return <DiagnosisFullPage />;
  }

  if (stageId === "loading") {
    return <RecommendationLoadingRevealJourney includeGridHandoff />;
  }

  if (stageId === "reveal") {
    return <RecommendationCardRevealExperience />;
  }

  if (stageId === "active-grid") {
    return <ActiveGridFullPage libraryActivities={libraryActivities} />;
  }

  return (
    <ActiveGridFullPage
      initialOpenCardId="commitment-check"
      libraryActivities={libraryActivities}
    />
  );
}

export function JourneyFullPage({
  libraryActivities,
  stage
}: {
  libraryActivities: ActivityLibraryModalItem[];
  stage: JourneyStage;
}) {
  return renderStage(stage.id, libraryActivities);
}
