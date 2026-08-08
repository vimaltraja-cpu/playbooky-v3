"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { DiagnosisQuestionScreen } from "@/components/product/DiagnosisQuestionScreen";
import {
  type DiagnosisScreenViewport
} from "@/components/product/DiagnosisQuestionScreen";
import { HomepageComposerLayout } from "@/components/product/HomepageTextLayout";
import { RecommendationLoadingRevealJourney } from "@/components/product/RecommendationLoadingRevealJourney";
import { SiteBackgroundWash } from "@/components/ui/SiteBackgroundWash";
import { diagnosisQuestions } from "@/lib/design-system/diagnosis-options";
import {
  readJourneyChallenge,
  writeJourneyDiagnosisAnswers
} from "@/src/features/recommendation-journey/journeyState";
import { matchChallengeToDiagnosis } from "@/src/features/recommendation-journey/matchChallengeToDiagnosis";
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

function LaterStagePlaceholder({ title }: { title: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F6F1E8] px-6 text-[#171614]">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#7D5330]">
          Internal journey
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">{title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#5E5A53]">
          Later stage — not part of the current Composer → Diagnosis → Loading
          stitch. Supporting files for this stage still need to be pushed from
          the Mac workspace.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full bg-[#171614] px-5 py-2.5 text-sm font-semibold text-white"
          href="/internal/journey/loading"
        >
          Open green-lit loading
        </Link>
      </div>
    </main>
  );
}

function DiagnosisFullPage() {
  const router = useRouter();
  const viewport = useResponsiveMode(
    getDiagnosisViewport,
    "desktop" satisfies DiagnosisScreenViewport
  );
  const [challenge, setChallenge] = useState<string | null>(null);

  useEffect(() => {
    setChallenge(readJourneyChallenge());
  }, []);

  const dynamicDiagnosis = useMemo(() => {
    if (challenge === null) {
      return null;
    }

    return matchChallengeToDiagnosis(challenge, diagnosisQuestions);
  }, [challenge]);

  useEffect(() => {
    if (!dynamicDiagnosis) {
      return;
    }

    if (dynamicDiagnosis.questionsToAsk.length > 0) {
      return;
    }

    writeJourneyDiagnosisAnswers(dynamicDiagnosis.matchedAnswers);
    router.replace("/internal/journey/loading");
  }, [dynamicDiagnosis, router]);

  if (challenge === null || !dynamicDiagnosis) {
    return (
      <main className="diagnosis-question-screen" data-viewport={viewport}>
        <SiteBackgroundWash />
        <div className="diagnosis-main-region" />
      </main>
    );
  }

  if (dynamicDiagnosis.questionsToAsk.length === 0) {
    return (
      <main className="diagnosis-question-screen" data-viewport={viewport}>
        <SiteBackgroundWash />
        <div className="diagnosis-main-region" />
      </main>
    );
  }

  return (
    <DiagnosisQuestionScreen
      challenge={challenge}
      onContinue={(answers) => {
        writeJourneyDiagnosisAnswers({
          ...dynamicDiagnosis.matchedAnswers,
          ...answers
        });
        router.push("/internal/journey/loading");
      }}
      question={dynamicDiagnosis.questionsToAsk[0]}
      questions={dynamicDiagnosis.questionsToAsk}
      totalSteps={dynamicDiagnosis.questionsToAsk.length}
      viewport={viewport}
    />
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
    // Green-lit segment: watercolor loading → blur handoff → reveal.
    return <RecommendationLoadingRevealJourney />;
  }

  if (stageId === "reveal") {
    return <LaterStagePlaceholder title="Recommendation Reveal" />;
  }

  if (stageId === "active-grid") {
    return <LaterStagePlaceholder title="Active Workshop Grid" />;
  }

  return <LaterStagePlaceholder title="Active Activity Modal" />;
}

export function JourneyFullPage({ stage }: { stage: JourneyStage }) {
  return renderStage(stage.id);
}
