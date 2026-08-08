"use client";

import { type ReactNode, useEffect, useId, useMemo, useState } from "react";
import Image from "next/image";

export type RecommendationLoadingStageId =
  "goal" | "challenges" | "context" | "participation" | "building";

export type RecommendationLoadingViewport =
  "mobile" | "tablet-portrait" | "tablet-landscape" | "desktop";

export type RecommendationLoadingStage = {
  id: RecommendationLoadingStageId;
  imageSrc: string;
  label: string;
  shortLabel: string;
};

export const recommendationLoadingStages: RecommendationLoadingStage[] = [
  {
    id: "goal",
    imageSrc: "/assets/recommendation-loading/goals.png",
    label: "Understanding your goal",
    shortLabel: "Goal"
  },
  {
    id: "challenges",
    imageSrc: "/assets/recommendation-loading/challenges.png",
    label: "Reviewing your challenges",
    shortLabel: "Challenges"
  },
  {
    id: "context",
    imageSrc: "/assets/recommendation-loading/context.png",
    label: "Considering the context",
    shortLabel: "Context"
  },
  {
    id: "participation",
    imageSrc: "/assets/recommendation-loading/participants.png",
    label: "Assessing participation",
    shortLabel: "Participation"
  },
  {
    id: "building",
    imageSrc: "/assets/recommendation-loading/outcome.png",
    label: "Building your workshop",
    shortLabel: "Building"
  }
];

const RECOMMENDATION_WATERCOLOR_MOTION = {
  layer1: {
    fadeDurationMs: 3000,
    fadeEasing: "gentle",
    fadeStartMs: 0,
    maxBlurPx: 9,
    maxDesaturatePct: 50
  },
  layer2: {
    bubbleCurve: "ease-in",
    bubbleCount: 9,
    comeInDurationMs: 5250,
    comeInStartMs: 300,
    focusEasing: "ease-out",
    focusPullMs: 1000,
    holdMs: 400,
    organicRandomize: true,
    stickMs: 400
  },
  totalCycleMs: 7350
} as const;

const STAGE_ADVANCE_MS = RECOMMENDATION_WATERCOLOR_MOTION.totalCycleMs;
const WATERCOLOR_STAGE_SIZE = 400;
const WATERCOLOR_CENTER = WATERCOLOR_STAGE_SIZE / 2;

type WatercolorDroplet = {
  angleDeg: number;
  delayPct: number;
  distancePx: number;
  id: string;
  radiusPx: number;
};

const WATERCOLOR_DROPLETS: WatercolorDroplet[] = [
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

const BUBBLE_CURVE_TIMING = {
  "ease-in": "cubic-bezier(0.32, 0, 0.67, 0)",
  linear: "linear"
} as const;

const OUTGOING_FADE_EASING_CSS = {
  gentle: "cubic-bezier(0.32, 0, 0.24, 1)",
  linear: "linear",
  quick: "cubic-bezier(0.55, 0, 0.15, 1)"
} as const;

const FOCUS_EASING_CSS = {
  "ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
  linear: "linear",
  snap: "cubic-bezier(0.7, 0, 0.84, 0)"
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function jitterDroplet(droplet: WatercolorDroplet): WatercolorDroplet {
  const rand = (range: number) => (Math.random() * 2 - 1) * range;

  return {
    ...droplet,
    angleDeg: (droplet.angleDeg + rand(18) + 360) % 360,
    delayPct: clamp(droplet.delayPct + rand(0.6), 0, 100),
    distancePx: clamp(droplet.distancePx + rand(14), 0, 200),
    radiusPx: clamp(droplet.radiusPx + rand(16), 20, 280)
  };
}

function formatPercent(value: number) {
  return value.toFixed(2);
}

function getLoadingCopy() {
  return {
    copy: (
      <>
        Looking for signals that shape the right
        <br />
        workshop structure.
      </>
    ),
    eyebrow: "Analysing your challenge",
    heading: (
      <>
        Reviewing the content
        <br />
        around your challenge
      </>
    )
  };
}

function getStageIndex(stageId?: RecommendationLoadingStageId) {
  if (!stageId) {
    return 0;
  }

  const index = recommendationLoadingStages.findIndex(
    (stage) => stage.id === stageId
  );

  return index === -1 ? 0 : index;
}

function getResponsiveViewport(): RecommendationLoadingViewport {
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

  return "desktop";
}

export function RecommendationExperienceShell({
  ariaLabel,
  children,
  className = "",
  copy,
  eyebrow,
  heading,
  metadata,
  viewport,
  wideContent = false
}: {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  copy: ReactNode;
  eyebrow: ReactNode;
  heading: ReactNode;
  metadata?: ReactNode;
  viewport: RecommendationLoadingViewport;
  wideContent?: boolean;
}) {
  const isMobile = viewport === "mobile";

  return (
    <div
      aria-label={ariaLabel}
      className={[
        "recommendation-loading-experience relative isolate flex min-h-screen flex-col overflow-hidden bg-[#F6F1E8] text-[#171614]",
        className
      ].join(" ")}
      data-viewport={viewport}
    >
      <header aria-hidden="true" className="relative z-10 h-[72px] shrink-0" />
      <div aria-hidden="true" className="recommendation-loading-paper" />
      <div
        aria-hidden="true"
        className="recommendation-loading-wash recommendation-loading-wash-one"
      />
      <div
        aria-hidden="true"
        className="recommendation-loading-wash recommendation-loading-wash-two"
      />

      <div
        className={[
          "recommendation-loading-content relative z-10 mx-auto flex w-full flex-1 flex-col items-center text-center",
          wideContent ? "max-w-none" : "",
          isMobile && !wideContent ? "max-w-[394px] px-5" : "max-w-[760px] px-8"
        ].join(" ")}
      >
        <div className="recommendation-loading-layout">
          <div className="recommendation-loading-text">
            <p className="recommendation-loading-eyebrow">{eyebrow}</p>
            <h1 className="recommendation-loading-heading">{heading}</h1>
            <p className="recommendation-loading-copy">{copy}</p>
            {metadata}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export function RecommendationLoadingExperience({
  className = "",
  lockedStage,
  viewport
}: {
  className?: string;
  lockedStage?: RecommendationLoadingStageId;
  viewport?: RecommendationLoadingViewport;
}) {
  // useId() output (e.g. ":r0:") includes colons, which are valid in an
  // id attribute but best avoided inside a url(#...) fragment reference.
  const watercolorInstanceId = useId().replace(/:/g, "");
  const watercolorFilterId = `recommendation-loading-watercolor-filter-${watercolorInstanceId}`;
  const watercolorMaskId = `recommendation-loading-watercolor-mask-${watercolorInstanceId}`;
  const activeKeyframesName = `recommendation-loading-watercolor-active-${watercolorInstanceId}`;
  const previousKeyframesName = `recommendation-loading-watercolor-previous-${watercolorInstanceId}`;
  const washKeyframesName = `recommendation-loading-watercolor-wash-${watercolorInstanceId}`;
  const [activeIndex, setActiveIndex] = useState(getStageIndex(lockedStage));
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [transitionKey, setTransitionKey] = useState(0);
  const [responsiveViewport, setResponsiveViewport] =
    useState<RecommendationLoadingViewport>("desktop");
  const isLocked = Boolean(lockedStage);
  const activeStage = recommendationLoadingStages[activeIndex];
  const previousStage =
    previousIndex === null ? null : recommendationLoadingStages[previousIndex];
  const effectiveViewport = viewport ?? responsiveViewport;
  const loadingCopy = getLoadingCopy();
  const effectiveDroplets = useMemo(() => {
    if (!RECOMMENDATION_WATERCOLOR_MOTION.layer2.organicRandomize) {
      return WATERCOLOR_DROPLETS;
    }

    return WATERCOLOR_DROPLETS.map((droplet) => ({
      ...jitterDroplet(droplet),
      id: `${droplet.id}-${transitionKey}`
    }));
  }, [transitionKey]);
  const dynamicWatercolorCss = useMemo(() => {
    const { layer1, layer2, totalCycleMs } = RECOMMENDATION_WATERCOLOR_MOTION;
    const h1 = layer2.comeInStartMs + layer2.comeInDurationMs;
    const h2 = h1 + layer2.holdMs;
    const h3 = h2 + layer2.focusPullMs;
    const outgoingFadeEndMs = layer1.fadeStartMs + layer1.fadeDurationMs;
    const p1 = totalCycleMs > 0 ? (h1 / totalCycleMs) * 100 : 0;
    const p2 = totalCycleMs > 0 ? (h2 / totalCycleMs) * 100 : 0;
    const p3 = totalCycleMs > 0 ? (h3 / totalCycleMs) * 100 : 0;
    const fadeStartPct =
      totalCycleMs > 0
        ? Math.min(100, (layer1.fadeStartMs / totalCycleMs) * 100)
        : 0;
    const fadeEndPctRaw =
      totalCycleMs > 0
        ? Math.min(100, (outgoingFadeEndMs / totalCycleMs) * 100)
        : 0;
    const fadeEndPct = Math.max(fadeStartPct + 0.5, fadeEndPctRaw);
    const outgoingSaturate = Math.max(0, 1 - layer1.maxDesaturatePct / 100);
    const focusEasingCss = FOCUS_EASING_CSS[layer2.focusEasing];
    const outgoingFadeEasingCss = OUTGOING_FADE_EASING_CSS[layer1.fadeEasing];
    const dropletTimingFn = BUBBLE_CURVE_TIMING[layer2.bubbleCurve];

    return `
@keyframes ${activeKeyframesName} {
  0% { filter: blur(10px) saturate(0.8) brightness(1.05); }
  ${formatPercent(p1)}% { filter: blur(8px) saturate(0.86) brightness(1.03); }
  ${formatPercent(p2)}% {
    filter: blur(8px) saturate(0.86) brightness(1.03);
    animation-timing-function: ${focusEasingCss};
  }
  ${formatPercent(p3)}% { filter: blur(0) saturate(1) brightness(1); }
  100% { filter: blur(0) saturate(1) brightness(1); }
}
@keyframes ${previousKeyframesName} {
  0% { filter: blur(0) saturate(1) brightness(1); opacity: 1; }
  ${formatPercent(fadeStartPct)}% {
    filter: blur(0) saturate(1) brightness(1);
    opacity: 1;
    animation-timing-function: ${outgoingFadeEasingCss};
  }
  ${formatPercent(fadeEndPct)}% {
    filter: blur(${layer1.maxBlurPx}px) saturate(${outgoingSaturate}) brightness(1.05);
    opacity: 0;
  }
  100% {
    filter: blur(${layer1.maxBlurPx}px) saturate(${outgoingSaturate}) brightness(1.05);
    opacity: 0;
  }
}
@keyframes ${washKeyframesName} {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
  ${formatPercent(p1)}% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.82); }
  ${formatPercent(p3)}% { opacity: 0; transform: translate(-50%, -50%) scale(1.02); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.02); }
}
.${activeKeyframesName}-el {
  animation: ${activeKeyframesName} ${totalCycleMs}ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.${previousKeyframesName}-el {
  animation: ${previousKeyframesName} ${totalCycleMs}ms linear both;
}
.${washKeyframesName}-el {
  animation: ${washKeyframesName} ${totalCycleMs}ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
${effectiveDroplets
  .map(
    (droplet, index) => `
@keyframes recommendation-loading-watercolor-droplet-${watercolorInstanceId}-${index} {
  0% { r: 0; }
  100% { r: ${droplet.radiusPx}; }
}
.recommendation-loading-watercolor-droplet-${watercolorInstanceId}-${index} {
  animation: recommendation-loading-watercolor-droplet-${watercolorInstanceId}-${index} ${layer2.comeInDurationMs}ms ${dropletTimingFn} ${
    layer2.comeInStartMs + layer2.comeInDurationMs * (droplet.delayPct / 100)
  }ms both;
}`
  )
  .join("\n")}
@media (prefers-reduced-motion: reduce) {
  .${activeKeyframesName}-el,
  .${previousKeyframesName}-el,
  .${washKeyframesName}-el,
  ${effectiveDroplets
    .map(
      (_droplet, index) =>
        `.recommendation-loading-watercolor-droplet-${watercolorInstanceId}-${index}`
    )
    .join(",\n  ")} {
    animation-duration: 1ms !important;
  }
}
`;
  }, [
    activeKeyframesName,
    effectiveDroplets,
    previousKeyframesName,
    washKeyframesName,
    watercolorInstanceId
  ]);

  useEffect(() => {
    if (!lockedStage) {
      return;
    }

    setPreviousIndex(null);
    setActiveIndex(getStageIndex(lockedStage));
  }, [lockedStage]);

  useEffect(() => {
    if (viewport) {
      return;
    }

    const updateViewport = () => setResponsiveViewport(getResponsiveViewport());

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, [viewport]);

  useEffect(() => {
    if (isLocked) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousIndex(activeIndex);
      setActiveIndex(
        (current) => (current + 1) % recommendationLoadingStages.length
      );
      setTransitionKey((current) => current + 1);
    }, STAGE_ADVANCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex, isLocked]);

  return (
    <RecommendationExperienceShell
      ariaLabel="Recommendation loading"
      className={className}
      copy={loadingCopy.copy}
      eyebrow={loadingCopy.eyebrow}
      heading={loadingCopy.heading}
      metadata={
        <p aria-live="polite" className="recommendation-loading-label">
          {activeStage.label}
        </p>
      }
      viewport={effectiveViewport}
    >
      <style dangerouslySetInnerHTML={{ __html: dynamicWatercolorCss }} />
      <div className="recommendation-loading-illustration relative grid aspect-square place-items-center">
        {previousStage ? (
          <svg
            aria-hidden="true"
            className="recommendation-loading-watercolor-svg"
            preserveAspectRatio="xMidYMid meet"
            viewBox={`0 0 ${WATERCOLOR_STAGE_SIZE} ${WATERCOLOR_STAGE_SIZE}`}
          >
            <defs>
              <filter
                height="240%"
                id={watercolorFilterId}
                width="240%"
                x="-70%"
                y="-70%"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  result="blur"
                  stdDeviation={10}
                />
                <feColorMatrix
                  in="blur"
                  result="goo"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                />
                <feTurbulence
                  baseFrequency="0.02 0.05"
                  numOctaves={2}
                  result="noise"
                  seed={11}
                  type="fractalNoise"
                />
                <feDisplacementMap
                  in="goo"
                  in2="noise"
                  result="distorted"
                  scale={24}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
                <feGaussianBlur in="distorted" stdDeviation={1.4} />
              </filter>

              <mask
                height={WATERCOLOR_STAGE_SIZE}
                id={watercolorMaskId}
                maskUnits="userSpaceOnUse"
                width={WATERCOLOR_STAGE_SIZE}
                x={0}
                y={0}
              >
                <g
                  filter={`url(#${watercolorFilterId})`}
                  key={`droplets-${transitionKey}`}
                >
                  {effectiveDroplets.map((droplet, index) => {
                    const rad = (droplet.angleDeg * Math.PI) / 180;
                    const cx =
                      WATERCOLOR_CENTER + droplet.distancePx * Math.cos(rad);
                    const cy =
                      WATERCOLOR_CENTER + droplet.distancePx * Math.sin(rad);

                    return (
                      <circle
                        className={[
                          "recommendation-loading-watercolor-droplet",
                          `recommendation-loading-watercolor-droplet-${watercolorInstanceId}-${index}`
                        ].join(" ")}
                        cx={cx}
                        cy={cy}
                        fill="#fff"
                        key={droplet.id}
                        r={0}
                      />
                    );
                  })}
                </g>
              </mask>
            </defs>

            <image
              className={[
                "recommendation-loading-watercolor-image",
                `${previousKeyframesName}-el`
              ].join(" ")}
              height={WATERCOLOR_STAGE_SIZE}
              href={previousStage.imageSrc}
              key={`${transitionKey}-${previousStage.id}-previous`}
              preserveAspectRatio="xMidYMid meet"
              width={WATERCOLOR_STAGE_SIZE}
              x={0}
              y={0}
            />

            <g mask={`url(#${watercolorMaskId})`}>
              <image
                className={[
                  "recommendation-loading-watercolor-image",
                  `${activeKeyframesName}-el`
                ].join(" ")}
                height={WATERCOLOR_STAGE_SIZE}
                href={activeStage.imageSrc}
                key={`${transitionKey}-${activeStage.id}-active`}
                preserveAspectRatio="xMidYMid meet"
                width={WATERCOLOR_STAGE_SIZE}
                x={0}
                y={0}
              />
            </g>
          </svg>
        ) : null}
        {previousStage ? (
          <span
            aria-hidden="true"
            className={[
              "recommendation-loading-watercolor-wash",
              `${washKeyframesName}-el`
            ].join(" ")}
            key={`wash-${transitionKey}`}
          />
        ) : null}
        {!previousStage ? (
          <Image
            alt=""
            aria-hidden="true"
            className="recommendation-loading-image recommendation-loading-image-first-in"
            fill
            key={`${transitionKey}-${activeStage.id}-active`}
            sizes="(max-width: 767px) 270px, 420px"
            src={activeStage.imageSrc}
            unoptimized
          />
        ) : null}
      </div>
    </RecommendationExperienceShell>
  );
}

export function RecommendationRevealTemplateExperience({
  className = "",
  lockedStage,
  viewport
}: {
  className?: string;
  lockedStage?: RecommendationLoadingStageId;
  viewport?: RecommendationLoadingViewport;
}) {
  const [activeIndex, setActiveIndex] = useState(getStageIndex(lockedStage));
  const [responsiveViewport, setResponsiveViewport] =
    useState<RecommendationLoadingViewport>("desktop");
  const activeStage = recommendationLoadingStages[activeIndex];
  const effectiveViewport = viewport ?? responsiveViewport;
  const loadingCopy = getLoadingCopy();

  useEffect(() => {
    if (!lockedStage) {
      return;
    }

    setActiveIndex(getStageIndex(lockedStage));
  }, [lockedStage]);

  useEffect(() => {
    if (viewport) {
      return;
    }

    const updateViewport = () => setResponsiveViewport(getResponsiveViewport());

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, [viewport]);

  useEffect(() => {
    if (lockedStage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveIndex(
        (current) => (current + 1) % recommendationLoadingStages.length
      );
    }, STAGE_ADVANCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex, lockedStage]);

  return (
    <RecommendationExperienceShell
      ariaLabel="Recommendation reveal template"
      className={className}
      copy={loadingCopy.copy}
      eyebrow={loadingCopy.eyebrow}
      heading={loadingCopy.heading}
      metadata={
        <p aria-live="polite" className="recommendation-loading-label">
          {activeStage.label}
        </p>
      }
      viewport={effectiveViewport}
    >
      <div
        aria-hidden="true"
        className="recommendation-loading-illustration recommendation-loading-illustration-empty relative grid aspect-square place-items-center"
      />
    </RecommendationExperienceShell>
  );
}
