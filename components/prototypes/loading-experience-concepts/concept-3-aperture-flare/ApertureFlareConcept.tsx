"use client";

import { recommendationLoadingStages } from "@/components/product/RecommendationLoadingExperience";

import { ConceptStage } from "../shared/ConceptStage";
import "../shared/loading-experience-concepts.css";
import type { ConceptMeta, PlaybackSpeed } from "../shared/types";
import { useStageCycle } from "../shared/useStageCycle";

export const apertureFlareMeta: ConceptMeta = {
  id: "aperture-flare",
  name: "Aperture Flare",
  tagline: "Concept 3 — a bloom of light leads the reveal, like an aperture opening",
  principle:
    "A soft burst of warm light ignites at the centre of the frame a beat before the new image appears, then the incoming image forms up through that same point, masked open in sync with the light easing back down. The outgoing image doesn't dissolve quietly — it blows out (brightens) and burns away, as though it's being overtaken by the light rather than fading. This is the most energetic and dramatic of the three: less \"soft dissolve,\" more \"the next idea arrives and washes the last one out.\"",
  sequence: [
    "A radial glow ignites at dead centre and begins expanding outward (starts 0ms).",
    "140ms later, the incoming image starts forming through a centre-out mask, timed so the image seems to arrive inside the light rather than race it.",
    "The outgoing image brightens and blurs away (900ms) as the glow passes over it, rather than simply fading.",
    "The glow itself keeps expanding and fading past the edges of the frame (1300ms total), overlapping the tail end of the image reveal.",
    "Stage holds roughly 1000ms before the next flare begins."
  ],
  specs: [
    {
      property: "Centre glow burst",
      duration: "1300ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      note: "scale 0.15 → 3.2, screen blend mode so it lifts the frame rather than sitting flat on top"
    },
    {
      property: "Incoming mask + brightness",
      duration: "1300ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      note: "140ms delay so the light arrives first; brightness 1.6 → 1, mask 10% → 95%"
    },
    {
      property: "Outgoing blow-out",
      duration: "900ms",
      easing: "cubic-bezier(0.4, 0, 1, 1)",
      note: "brightness ramps to 2.2 while opacity drops — reads as \"burned away\" rather than faded"
    }
  ],
  strengths: [
    "Most distinct emotional register of the three — energetic and a little theatrical, good if the loading moment should feel eventful rather than calm.",
    "The light-leads-image sequencing gives a strong sense of causality: the glow is what conjures the new image.",
    "Still fundamentally the same centre-out \"takeover\" mechanic as Concepts 1 and 2, just with an added light layer."
  ],
  risks: [
    "The brightness/blow-out treatment is the boldest choice here — it can read as too intense or \"flashy\" for a calm loading state depending on brand tone.",
    "Screen-blend glow can look different across displays with varying colour profiles/brightness; worth checking on a few real screens.",
    "Uses one extra DOM layer (the glow) per stage versus the other two concepts."
  ],
  recommendedUse:
    "Consider this if the loading moment should feel like discovery/reveal rather than a quiet ambient wait — e.g. paired with more upbeat copy."
};

const BASE_INTERVAL_MS = 2400;
const BASE_ACTIVE_DURATION_MS = 1300;
const BASE_ACTIVE_DELAY_MS = 140;
const BASE_PREVIOUS_DURATION_MS = 900;
const BASE_GLOW_DURATION_MS = 1300;

export function ApertureFlareConcept({
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
  const playState = paused ? "paused" : "running";

  return (
    <ConceptStage
      activeClassName="concept-stage-image concept-flare-active"
      activeDelayMs={BASE_ACTIVE_DELAY_MS / rate}
      activeDurationMs={BASE_ACTIVE_DURATION_MS / rate}
      activeIndex={activeIndex}
      extraLayer={
        <span
          className="concept-flare-glow"
          key={`glow-${transitionKey}`}
          style={{
            animationDuration: `${BASE_GLOW_DURATION_MS / rate}ms`,
            animationPlayState: playState
          }}
        />
      }
      paused={paused}
      previousClassName="concept-stage-image concept-flare-previous"
      previousDurationMs={BASE_PREVIOUS_DURATION_MS / rate}
      previousIndex={previousIndex}
      transitionKey={transitionKey}
    />
  );
}
