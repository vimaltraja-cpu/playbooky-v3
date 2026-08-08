"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import playBookyHorizontalLogo from "@/assets/logos/Horizontal Logo.svg";
import type { ActivityGridViewportMode } from "@/components/product/ActivityGridVisualLayer";
import { DiagnosisQuestionScreen } from "@/components/product/DiagnosisQuestionScreen";
import {
  type DiagnosisScreenViewport
} from "@/components/product/DiagnosisQuestionScreen";
import { HomepageComposerLayout } from "@/components/product/HomepageTextLayout";
import {
  recommendationRevealCards
} from "@/components/product/RecommendationCardReveal";
import { RecommendationCardRevealExperience } from "@/components/product/RecommendationCardRevealExperience";
import { RecommendationLoadingExperience } from "@/components/product/RecommendationLoadingExperience";
import { ActivityGridInteractiveLayer } from "@/components/product/recommendation-reveal-to-grid/ActivityGridInteractiveLayer";
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

function getActivityGridViewport(): ActivityGridViewportMode {
  if (typeof window === "undefined") {
    return "desktop";
  }

  if (window.innerWidth < 768) {
    return "mobile";
  }

  if (window.innerWidth < 1200) {
    return "tablet";
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

function InternalJourneyHeader() {
  return (
    <header className="relative z-10 flex h-[72px] shrink-0 items-center px-6 md:px-10">
      <Link aria-label="PlayBooky home" href="/">
        <Image
          alt=""
          aria-hidden="true"
          height={35}
          priority
          src={playBookyHorizontalLogo}
          width={142}
        />
      </Link>
    </header>
  );
}

function ActiveGridFullPage({
  initialOpenCardId
}: {
  initialOpenCardId?: string;
}) {
  const viewport = useResponsiveMode(
    getActivityGridViewport,
    "desktop" satisfies ActivityGridViewportMode
  );
  const cards = useMemo(
    () =>
      recommendationRevealCards.map((card) => ({
        activity: card.activity,
        id: card.id,
        label: card.activity.title
      })),
    []
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F1E8] text-[#171614]">
      <InternalJourneyHeader />
      <section className="px-4 pb-12 pt-4 md:px-8">
        <ActivityGridInteractiveLayer
          cards={cards}
          initialOpenCardId={initialOpenCardId}
          viewport={viewport}
        />
      </section>
    </main>
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

function renderStage(stageId: JourneyStageId) {
  if (stageId === "composer") {
    return <HomepageComposerLayout />;
  }

  if (stageId === "diagnosis") {
    return <DiagnosisFullPage />;
  }

  if (stageId === "loading") {
    return <RecommendationLoadingExperience />;
  }

  if (stageId === "reveal") {
    return <RecommendationCardRevealExperience />;
  }

  if (stageId === "active-grid") {
    return <ActiveGridFullPage />;
  }

  return <ActiveGridFullPage initialOpenCardId="commitment-check" />;
}

export function JourneyFullPage({ stage }: { stage: JourneyStage }) {
  return renderStage(stage.id);
}
