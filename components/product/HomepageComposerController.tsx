"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AIComposer } from "@/components/ui/AIComposer";
import type { HomepageTextLayoutViewport } from "@/components/product/HomepageTextLayout";
import { writeJourneyChallenge } from "@/src/features/recommendation-journey/journeyState";

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

    writeJourneyChallenge(trimmedChallenge);

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
