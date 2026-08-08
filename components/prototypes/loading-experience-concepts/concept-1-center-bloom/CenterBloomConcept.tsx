"use client";

import { recommendationLoadingStages } from "@/components/product/RecommendationLoadingExperience";

import { ConceptStage } from "../shared/ConceptStage";
import "../shared/loading-experience-concepts.css";
import type { ConceptMeta, PlaybackSpeed } from "../shared/types";
import { useStageCycle } from "../shared/useStageCycle";

export const centerBloomMeta: ConceptMeta = {
  id: "center-bloom",
  name: "Center Bloom",
  tagline: "Concept 1 — the new image opens outward from a point at centre",
  principle:
    "The incoming illustration starts as a small, soft-edged disc right at the centre of the frame — blurred and slightly oversized — and opens outward through a circular reveal until it covers the whole frame, sharpening as it grows. The outgoing image doesn't just fade; it softens and drifts a touch larger, as if it's being gently pushed back and absorbed by the bloom taking its place. This is the most literal read of \"the second image comes through the first and takes over.\"",
  sequence: [
    "Outgoing image sits at full clarity during the hold.",
    "Incoming image appears as a small, blurred disc at dead centre and expands via a circular reveal (2% → 75% of frame radius) over 1400ms.",
    "In parallel, the outgoing image softens — blur and a faint upscale — as though dissolving into the bloom.",
    "New image reaches full sharpness and scale just as the reveal clears the frame's corners.",
    "Stage holds roughly 1100ms before the next bloom begins."
  ],
  specs: [
    {
      property: "Incoming reveal (clip-path circle)",
      duration: "1400ms",
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      note: "2% → 75% radius, well past the frame's corners so no hard edge is ever visible"
    },
    {
      property: "Incoming blur / scale",
      duration: "1400ms",
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      note: "blur 18px → 0, scale 1.14 → 1"
    },
    {
      property: "Outgoing softening",
      duration: "1400ms",
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      note: "opacity 1 → 0, blur 0 → 14px, scale 1 → 1.08"
    }
  ],
  strengths: [
    "Reads most literally as \"penetrates and expands\" — a genuine point-of-origin bloom, not a swap.",
    "Circular clip-path is cheap to run and predictable across browsers.",
    "The blur-to-sharp arc gives it a calm, organic settle rather than a mechanical wipe."
  ],
  risks: [
    "Because the edge is a true circle, at certain sizes it can still read slightly geometric rather than fully organic — Concept 2 softens this further.",
    "The frame's corners reveal last, which can feel a beat slow on wider illustrations."
  ],
  recommendedUse:
    "Best default if you want the clearest, most legible version of the \"bloom and take over\" idea without extra flourishes."
};

const BASE_INTERVAL_MS = 2500;
const BASE_DURATION_MS = 1400;

export function CenterBloomConcept({
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
      activeClassName="concept-stage-image concept-bloom-active"
      activeDurationMs={BASE_DURATION_MS / rate}
      activeIndex={activeIndex}
      paused={paused}
      previousClassName="concept-stage-image concept-bloom-previous"
      previousDurationMs={BASE_DURATION_MS / rate}
      previousIndex={previousIndex}
      transitionKey={transitionKey}
    />
  );
}
