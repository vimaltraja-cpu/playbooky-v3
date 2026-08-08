"use client";

import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import Image from "next/image";

import {
  BUBBLE_CURVE_TIMING,
  FOCUS_EASING_CSS,
  OUTGOING_FADE_EASING_CSS,
  RECOMMENDATION_WATERCOLOR_STAGE_SIZE,
  getRecommendationWatercolorLabelHandoffMs,
  getRecommendationWatercolorTotalCycleMs,
  jitterRecommendationWatercolorDroplet,
  recommendationWatercolorDroplets,
  recommendationWatercolorFirstStageHoldMs,
  recommendationWatercolorMotion
} from "@/lib/design-system/recommendation-watercolor-motion";
import styles from "./RecommendationScreens.module.css";

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

const RECOMMENDATION_WATERCOLOR_MOTION = recommendationWatercolorMotion;
const WATERCOLOR_DROPLETS = recommendationWatercolorDroplets;
const STAGE_ADVANCE_MS = getRecommendationWatercolorTotalCycleMs(
  RECOMMENDATION_WATERCOLOR_MOTION
);
const FIRST_STAGE_HOLD_MS = recommendationWatercolorFirstStageHoldMs;
const LABEL_HANDOFF_MS = getRecommendationWatercolorLabelHandoffMs(
  RECOMMENDATION_WATERCOLOR_MOTION
);
const WATERCOLOR_STAGE_SIZE = RECOMMENDATION_WATERCOLOR_STAGE_SIZE;
const WATERCOLOR_CENTER = WATERCOLOR_STAGE_SIZE / 2;

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
        styles.recommendationScreen,
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
  loop = true,
  onComplete,
  viewport
}: {
  className?: string;
  lockedStage?: RecommendationLoadingStageId;
  /** When false, finish after one full pass through all stages, then call onComplete. */
  loop?: boolean;
  onComplete?: () => void;
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
  const [labelIndex, setLabelIndex] = useState(getStageIndex(lockedStage));
  const [transitionKey, setTransitionKey] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [responsiveViewport, setResponsiveViewport] =
    useState<RecommendationLoadingViewport>("desktop");
  const onCompleteRef = useRef(onComplete);
  const labelHandoffTimerRef = useRef<number | null>(null);
  const isLocked = Boolean(lockedStage);
  const activeStage = recommendationLoadingStages[activeIndex];
  const previousStage =
    previousIndex === null ? null : recommendationLoadingStages[previousIndex];
  const labelStage = recommendationLoadingStages[labelIndex];
  const effectiveViewport = viewport ?? responsiveViewport;
  const loadingCopy = getLoadingCopy();
  // First beat has no previous stage, so watercolor cannot run yet — use a
  // short hold, then start the first bleed. Later beats use the full cycle.
  const advanceDelayMs =
    previousIndex === null ? FIRST_STAGE_HOLD_MS : STAGE_ADVANCE_MS;

  onCompleteRef.current = onComplete;

  // Keep the first paint deterministic so SSR HTML matches the client.
  // Organic jitter is applied only after mount / later stage transitions.
  const effectiveDroplets = useMemo(() => {
    if (
      !hasMounted ||
      !RECOMMENDATION_WATERCOLOR_MOTION.layer2.organicRandomize
    ) {
      return WATERCOLOR_DROPLETS.map((droplet) => ({
        ...droplet,
        id: `${droplet.id}-${transitionKey}`
      }));
    }

    return WATERCOLOR_DROPLETS.map((droplet) => ({
      ...jitterRecommendationWatercolorDroplet(droplet),
      id: `${droplet.id}-${transitionKey}`
    }));
  }, [hasMounted, transitionKey]);
  const dynamicWatercolorCss = useMemo(() => {
    const { layer1, layer2 } = RECOMMENDATION_WATERCOLOR_MOTION;
    const totalCycleMs = getRecommendationWatercolorTotalCycleMs(
      RECOMMENDATION_WATERCOLOR_MOTION
    );
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
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!lockedStage) {
      return;
    }

    if (labelHandoffTimerRef.current !== null) {
      window.clearTimeout(labelHandoffTimerRef.current);
      labelHandoffTimerRef.current = null;
    }

    const nextIndex = getStageIndex(lockedStage);
    setPreviousIndex(null);
    setActiveIndex(nextIndex);
    setLabelIndex(nextIndex);
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
    return () => {
      if (labelHandoffTimerRef.current !== null) {
        window.clearTimeout(labelHandoffTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLocked) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const isLastStage =
        activeIndex >= recommendationLoadingStages.length - 1;

      if (isLastStage && !loop) {
        onCompleteRef.current?.();
        return;
      }

      const nextIndex =
        (activeIndex + 1) % recommendationLoadingStages.length;

      // Illustration leads: start the bleed immediately, keep the shimmer
      // label on the outgoing stage until Layer 1 fade begins.
      setPreviousIndex(activeIndex);
      setActiveIndex(nextIndex);
      setTransitionKey((current) => current + 1);

      if (labelHandoffTimerRef.current !== null) {
        window.clearTimeout(labelHandoffTimerRef.current);
      }

      labelHandoffTimerRef.current = window.setTimeout(() => {
        setLabelIndex(nextIndex);
        labelHandoffTimerRef.current = null;
      }, LABEL_HANDOFF_MS);
    }, advanceDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeIndex, advanceDelayMs, isLocked, loop]);

  return (
    <RecommendationExperienceShell
      ariaLabel="Recommendation loading"
      className={className}
      copy={loadingCopy.copy}
      eyebrow={loadingCopy.eyebrow}
      heading={loadingCopy.heading}
      metadata={
        <p
          aria-live="polite"
          className="recommendation-loading-label"
          key={`recommendation-loading-label-${labelStage.id}`}
        >
          {labelStage.label}
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
