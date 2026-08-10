"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AIComposer } from "@/components/ui/AIComposer";
import type { HomepageTextLayoutViewport } from "@/components/product/HomepageTextLayout";
import {
  interpretComposerChallenge,
  journeyChallengeStorageKey
} from "@/src/features/recommendation-journey/diagnosisIntelligence";
import {
  createJourneySession,
  writeJourneySession
} from "@/src/features/recommendation-journey/journeySession";

export function HomepageComposerController({
  viewport
}: {
  viewport: HomepageTextLayoutViewport;
}) {
  const router = useRouter();
  const [challenge, setChallenge] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(nextChallenge: string) {
    const trimmedChallenge = nextChallenge.trim();

    if (!trimmedChallenge) {
      return;
    }

    try {
      const interpretation = interpretComposerChallenge(trimmedChallenge);

      window.sessionStorage.setItem(
        journeyChallengeStorageKey,
        trimmedChallenge
      );
      writeJourneySession(
        createJourneySession({
          activityCards: undefined,
          activityMutations: [],
          activityOrder: [],
          brief: trimmedChallenge,
          diagnosisAnswers: undefined,
          generatedWorkshop: undefined,
          interpretation,
          recommendationDescription: undefined,
          recommendationReasoning: undefined
        })
      );
    } catch {
      // Navigation is the meaningful journey action; storage is only a temporary handoff aid.
    }

    startTransition(() => {
      router.push("/internal/journey/diagnosis");
    });
  }

  return (
    <AIComposer
      isSubmitting={isPending}
      onChange={setChallenge}
      onSubmit={handleSubmit}
      placeholder="Describe the challenge you want to solve..."
      value={challenge}
      viewport={viewport === "mobile" ? "mobile" : "desktop"}
    />
  );
}
