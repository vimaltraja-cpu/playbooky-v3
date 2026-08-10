"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ActivityLibraryModalItem } from "@/lib/design-system/activity-library-modal";
import type { LibraryDataset } from "@/lib/product-system/library-read-model";
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
import {
  createSessionWorkshopFromDiagnosis
} from "@/src/features/recommendation-journey/journeyWorkshopAdapter";
import {
  patchJourneySession,
  readJourneySession,
  type JourneyActivityCard,
  type JourneyActivityMutation,
  type JourneySessionPayload
} from "@/src/features/recommendation-journey/journeySession";
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
  initialCards,
  initialOpenCardId,
  libraryActivities,
  onCardsChange,
  onActivityMutation
}: {
  initialCards?: JourneyActivityCard[];
  initialOpenCardId?: string;
  libraryActivities: ActivityLibraryModalItem[];
  onActivityMutation?: (mutation: JourneyActivityMutation) => void;
  onCardsChange?: (cards: JourneyActivityCard[]) => void;
}) {
  const router = useRouter();

  return (
    <ActiveGridWithLibrary
      initialCards={initialCards}
      initialOpenCardId={initialOpenCardId}
      libraryActivities={libraryActivities}
      onActivityMutation={onActivityMutation}
      onCardsChange={onCardsChange}
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
      patchJourneySession({
        activityCards: undefined,
        activityMutations: [],
        activityOrder: [],
        diagnosisAnswers: combinedAnswers,
        generatedWorkshop: undefined,
        interpretation,
        recommendationDescription: undefined,
        recommendationReasoning: undefined
      });
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
  sessionCards: JourneyActivityCard[] | undefined,
  sessionWorkshop: ReturnType<typeof createSessionWorkshopFromDiagnosis> | null,
  libraryActivities: ActivityLibraryModalItem[],
  onCardsChange: (cards: JourneyActivityCard[]) => void,
  onActivityMutation: (mutation: JourneyActivityMutation) => void,
  onGridContinue: () => void
) {
  if (stageId === "composer") {
    return <HomepageComposerLayout />;
  }

  if (stageId === "diagnosis") {
    return <DiagnosisFullPage />;
  }

  if (stageId === "loading") {
    return (
      <RecommendationLoadingRevealJourney
        activityCards={sessionCards}
        includeGridHandoff
        libraryActivities={libraryActivities}
        onGridContinue={onGridContinue}
        onGridActivityMutation={onActivityMutation}
        onGridCardsChange={onCardsChange}
        workshop={sessionWorkshop?.generatedWorkshop}
      />
    );
  }

  if (stageId === "reveal") {
    return <RecommendationCardRevealExperience />;
  }

  if (stageId === "active-grid") {
    return (
      <ActiveGridFullPage
        initialCards={sessionCards}
        libraryActivities={libraryActivities}
        onActivityMutation={onActivityMutation}
        onCardsChange={onCardsChange}
      />
    );
  }

  return (
    <ActiveGridFullPage
      initialCards={sessionCards}
      initialOpenCardId="commitment-check"
      libraryActivities={libraryActivities}
      onActivityMutation={onActivityMutation}
      onCardsChange={onCardsChange}
    />
  );
}

export function JourneyFullPage({
  dataset,
  libraryActivities,
  stage
}: {
  dataset: LibraryDataset;
  libraryActivities: ActivityLibraryModalItem[];
  stage: JourneyStage;
}) {
  const [session, setSession] = useState<JourneySessionPayload | null>(null);

  useEffect(() => {
    setSession(readJourneySession());
  }, []);

  const generatedSessionWorkshop = useMemo(() => {
    if (!session?.diagnosisAnswers) {
      return null;
    }

    return createSessionWorkshopFromDiagnosis({
      brief: session.brief,
      dataset,
      diagnosisAnswers: session.diagnosisAnswers
    });
  }, [dataset, session?.brief, session?.diagnosisAnswers]);

  const sessionCards =
    session?.activityCards ??
    generatedSessionWorkshop?.activityCards;

  useEffect(() => {
    if (
      !generatedSessionWorkshop ||
      session?.activityCards ||
      session?.generatedWorkshop
    ) {
      return;
    }

    const nextSession = patchJourneySession({
      activityCards: generatedSessionWorkshop.activityCards,
      activityMutations: session?.activityMutations ?? [],
      activityOrder: generatedSessionWorkshop.activityCards.map((card) => card.id),
      generatedWorkshop: generatedSessionWorkshop.generatedWorkshop,
      recommendationDescription: generatedSessionWorkshop.generatedWorkshop.description,
      recommendationReasoning: generatedSessionWorkshop.generatedWorkshop.reasoning
    });

    setSession(nextSession);
  }, [generatedSessionWorkshop, session]);

  const handleCardsChange = useCallback((cards: JourneyActivityCard[]) => {
    const nextSession = patchJourneySession((current) => ({
      activityCards: cards,
      activityOrder: cards.map((card) => card.id),
      generatedWorkshop:
        current?.generatedWorkshop ??
        generatedSessionWorkshop?.generatedWorkshop,
      recommendationDescription:
        current?.recommendationDescription ??
        generatedSessionWorkshop?.generatedWorkshop.description,
      recommendationReasoning:
        current?.recommendationReasoning ??
        generatedSessionWorkshop?.generatedWorkshop.reasoning
    }));

    setSession(nextSession);
  }, [generatedSessionWorkshop]);

  const handleActivityMutation = useCallback((mutation: JourneyActivityMutation) => {
    const nextSession = patchJourneySession((current) => ({
      activityMutations: [...(current?.activityMutations ?? []), mutation]
    }));

    setSession(nextSession);
  }, []);

  const handleGridContinue = useCallback(() => {
    window.location.assign("/facilitator-guide");
  }, []);

  return renderStage(
    stage.id,
    sessionCards,
    generatedSessionWorkshop,
    libraryActivities,
    handleCardsChange,
    handleActivityMutation,
    handleGridContinue
  );
}
