"use client";

import { recommendationLoadingStages } from "@/components/product/RecommendationLoadingExperience";

import { ConceptStage } from "../shared/ConceptStage";
import "../shared/loading-experience-concepts.css";
import type { ConceptMeta, PlaybackSpeed } from "../shared/types";
import { useStageCycle } from "../shared/useStageCycle";

export const liquidTakeoverMeta: ConceptMeta = {
  id: "liquid-takeover",
  name: "Liquid Takeover",
  tagline: "Concept 2 — a feathered, elastic bloom with an inward-collapsing outgoing image",
  principle:
    "Instead of a crisp circular reveal, the incoming image is masked by a soft radial gradient with a wide feathered edge — so it never has a hard boundary, it just seems to well up out of the centre like liquid. The reveal slightly overshoots past full size before settling, giving it a stretchy, elastic quality rather than a mechanical expand. The outgoing image mirrors this in reverse: rather than fading in place, its own mask collapses inward toward the centre, so it looks genuinely swallowed by the incoming image rather than merely disappearing behind it.",
  sequence: [
    "Incoming image begins as a tiny, heavily feathered, blurred core at centre (mask radius ~6%).",
    "Over 1600ms the mask radius grows past its resting point (to ~66%) before settling back to ~92%, an elastic overshoot-and-settle.",
    "Simultaneously, the outgoing image's own mask contracts from full coverage down to a pinprick at the centre over 1500ms — it is consumed rather than faded.",
    "Both layers finish within ~100ms of each other so the handoff feels continuous, not staggered.",
    "Stage holds roughly 1000ms before the next takeover begins."
  ],
  specs: [
    {
      property: "Incoming mask (radial-gradient)",
      duration: "1600ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      note: "feathered edge (46%→66% falloff), overshoots to 66% radius at 55% before settling near 92%"
    },
    {
      property: "Incoming scale / blur",
      duration: "1600ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      note: "scale 0.86 → 1.035 (overshoot) → 1, blur 10px → 0"
    },
    {
      property: "Outgoing mask collapse",
      duration: "1500ms",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      note: "mask radius 130% → 8%, image is masked away toward its own centre rather than faded in place"
    }
  ],
  strengths: [
    "The feathered mask reads as genuinely organic — no visible edge at any point in the animation, which is the biggest gap in Concept 1.",
    "The slight overshoot gives it a floaty, elastic quality that matches \"floating out and becoming the new image.\"",
    "Having the outgoing image collapse inward (rather than just fade) reinforces \"taking over\" more than a simple cross-dissolve does."
  ],
  risks: [
    "CSS mask-image support needs the -webkit- prefix for Safari; both are included, but it's worth a real cross-browser check before shipping.",
    "The overshoot needs a light touch — pushed further it can start to feel bouncy/playful rather than calm."
  ],
  recommendedUse:
    "Strongest match for the specific brief — organic, no hard edges, genuinely reads as one image dissolving into and being replaced by the next."
};

const BASE_INTERVAL_MS = 2700;
const BASE_ACTIVE_DURATION_MS = 1600;
const BASE_PREVIOUS_DURATION_MS = 1500;

export function LiquidTakeoverConcept({
  paused,
  resetSignal,
  speed
}: {
  paused: boolean;
  resetSignal: number;
  speed: PlaybackSpeed;
}) {
  const rate = speed === "slow" ? 0.25 : 1;
  const { activeIndex, previousIndex, transitionKey } = useStageCycle({
    intervalMs: BASE_INTERVAL_MS / rate,
    paused,
    resetSignal,
    stageCount: recommendationLoadingStages.length
  });

  return (
    <ConceptStage
      activeClassName="concept-stage-image concept-liquid-active"
      activeDurationMs={BASE_ACTIVE_DURATION_MS / rate}
      activeIndex={activeIndex}
      paused={paused}
      previousClassName="concept-stage-image concept-liquid-previous"
      previousDurationMs={BASE_PREVIOUS_DURATION_MS / rate}
      previousIndex={previousIndex}
      transitionKey={transitionKey}
    />
  );
}
