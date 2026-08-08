/**
 * Approved Recommendation Loading watercolor motion.
 * Tuned in `/playground/motion/recommendation-loading-watercolor/showcase`.
 * Green-lit loading must consume this config — do not fork timings in product UI.
 */

export type RecommendationWatercolorBubbleCurve = "linear" | "ease-in";
export type RecommendationWatercolorOutgoingFadeEasing =
  | "gentle"
  | "linear"
  | "quick";
export type RecommendationWatercolorFocusEasing =
  | "ease-out"
  | "linear"
  | "snap";

export type RecommendationWatercolorDroplet = {
  angleDeg: number;
  delayPct: number;
  distancePx: number;
  id: string;
  radiusPx: number;
};

export type RecommendationWatercolorMotion = {
  layer1: {
    fadeDurationMs: number;
    fadeEasing: RecommendationWatercolorOutgoingFadeEasing;
    fadeStartMs: number;
    maxBlurPx: number;
    maxDesaturatePct: number;
  };
  layer2: {
    bubbleCurve: RecommendationWatercolorBubbleCurve;
    bubbleCount: number;
    comeInDurationMs: number;
    comeInStartMs: number;
    focusEasing: RecommendationWatercolorFocusEasing;
    focusPullMs: number;
    holdMs: number;
    organicRandomize: boolean;
    stickMs: number;
  };
};

export const RECOMMENDATION_WATERCOLOR_STAGE_SIZE = 400;

export const recommendationWatercolorDroplets: RecommendationWatercolorDroplet[] =
  [
    {
      angleDeg: 0,
      delayPct: 0,
      distancePx: 0,
      id: "recommendation-loading-watercolor-droplet-1",
      radiusPx: 180
    },
    {
      angleDeg: 225,
      delayPct: 0.75,
      distancePx: 127,
      id: "recommendation-loading-watercolor-droplet-2",
      radiusPx: 235
    },
    {
      angleDeg: 315,
      delayPct: 1.5,
      distancePx: 127,
      id: "recommendation-loading-watercolor-droplet-3",
      radiusPx: 235
    },
    {
      angleDeg: 135,
      delayPct: 2.25,
      distancePx: 127,
      id: "recommendation-loading-watercolor-droplet-4",
      radiusPx: 235
    },
    {
      angleDeg: 45,
      delayPct: 3,
      distancePx: 127,
      id: "recommendation-loading-watercolor-droplet-5",
      radiusPx: 235
    },
    {
      angleDeg: 180,
      delayPct: 3.75,
      distancePx: 140,
      id: "recommendation-loading-watercolor-droplet-6",
      radiusPx: 175
    },
    {
      angleDeg: 0,
      delayPct: 4.5,
      distancePx: 140,
      id: "recommendation-loading-watercolor-droplet-7",
      radiusPx: 175
    },
    {
      angleDeg: 270,
      delayPct: 5.25,
      distancePx: 140,
      id: "recommendation-loading-watercolor-droplet-8",
      radiusPx: 175
    },
    {
      angleDeg: 90,
      delayPct: 6,
      distancePx: 140,
      id: "recommendation-loading-watercolor-droplet-9",
      radiusPx: 175
    }
  ];

export const recommendationWatercolorMotion: RecommendationWatercolorMotion = {
  layer1: {
    fadeDurationMs: 5550,
    fadeEasing: "gentle",
    fadeStartMs: 3400,
    maxBlurPx: 3,
    maxDesaturatePct: 20
  },
  layer2: {
    bubbleCurve: "ease-in",
    bubbleCount: recommendationWatercolorDroplets.length,
    comeInDurationMs: 5250,
    comeInStartMs: 600,
    focusEasing: "ease-out",
    focusPullMs: 700,
    holdMs: 0,
    organicRandomize: true,
    stickMs: 200
  }
};

export function getRecommendationWatercolorTotalCycleMs(
  motion: RecommendationWatercolorMotion = recommendationWatercolorMotion
) {
  return (
    motion.layer2.comeInStartMs +
    motion.layer2.comeInDurationMs +
    motion.layer2.holdMs +
    motion.layer2.focusPullMs +
    motion.layer2.stickMs
  );
}

export const recommendationWatercolorTotalCycleMs =
  getRecommendationWatercolorTotalCycleMs();

/**
 * First illustration (goals) is static until a previous stage exists.
 * Hold it briefly so the first-in can settle, then start the first bleed
 * — do not wait a full watercolor cycle with no motion.
 */
export const recommendationWatercolorFirstStageHoldMs = 1600;

/**
 * Keep the shimmer label on the outgoing stage until the bleed is underway.
 * Defaults to Layer 1 fade start — illustration leads, copy follows.
 */
export function getRecommendationWatercolorLabelHandoffMs(
  motion: RecommendationWatercolorMotion = recommendationWatercolorMotion
) {
  return motion.layer1.fadeStartMs;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Organic jitter matching the watercolor showcase / playground tuner. */
export function jitterRecommendationWatercolorDroplet(
  droplet: RecommendationWatercolorDroplet
): RecommendationWatercolorDroplet {
  const rand = (range: number) => (Math.random() * 2 - 1) * range;

  return {
    ...droplet,
    angleDeg: (droplet.angleDeg + rand(18) + 360) % 360,
    delayPct: clamp(droplet.delayPct + rand(0.6), 0, 100),
    distancePx: clamp(droplet.distancePx + rand(14), 0, 200),
    radiusPx: clamp(droplet.radiusPx + rand(16), 20, 280)
  };
}

export const BUBBLE_CURVE_TIMING: Record<
  RecommendationWatercolorBubbleCurve,
  string
> = {
  "ease-in": "cubic-bezier(0.32, 0, 0.67, 0)",
  linear: "linear"
};

export const OUTGOING_FADE_EASING_CSS: Record<
  RecommendationWatercolorOutgoingFadeEasing,
  string
> = {
  gentle: "cubic-bezier(0.32, 0, 0.24, 1)",
  linear: "linear",
  quick: "cubic-bezier(0.55, 0, 0.15, 1)"
};

export const FOCUS_EASING_CSS: Record<
  RecommendationWatercolorFocusEasing,
  string
> = {
  "ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
  linear: "linear",
  snap: "cubic-bezier(0.7, 0, 0.84, 0)"
};
