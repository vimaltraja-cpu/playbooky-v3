"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";

import { recommendationLoadingStages } from "@/components/product/RecommendationLoadingExperience";

const STAGE_SIZE = 400;
const CENTER = STAGE_SIZE / 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type Droplet = {
  angleDeg: number;
  delayPct: number;
  distancePx: number;
  id: string;
  radiusPx: number;
};

let dropletIdCounter = 0;
function nextDropletId() {
  dropletIdCounter += 1;
  return `showcase-bubble-${dropletIdCounter}`;
}

function tunedDefaultDroplets(): Droplet[] {
  return [
    { angleDeg: 0, delayPct: 0, distancePx: 0, id: nextDropletId(), radiusPx: 180 },
    { angleDeg: 225, delayPct: 0.75, distancePx: 127, id: nextDropletId(), radiusPx: 235 },
    { angleDeg: 315, delayPct: 1.5, distancePx: 127, id: nextDropletId(), radiusPx: 235 },
    { angleDeg: 135, delayPct: 2.25, distancePx: 127, id: nextDropletId(), radiusPx: 235 },
    { angleDeg: 45, delayPct: 3, distancePx: 127, id: nextDropletId(), radiusPx: 235 },
    { angleDeg: 180, delayPct: 3.75, distancePx: 140, id: nextDropletId(), radiusPx: 175 },
    { angleDeg: 0, delayPct: 4.5, distancePx: 140, id: nextDropletId(), radiusPx: 175 },
    { angleDeg: 270, delayPct: 5.25, distancePx: 140, id: nextDropletId(), radiusPx: 175 },
    { angleDeg: 90, delayPct: 6, distancePx: 140, id: nextDropletId(), radiusPx: 175 }
  ];
}

function jitterDroplet(droplet: Droplet): Droplet {
  const rand = (range: number) => (Math.random() * 2 - 1) * range;
  return {
    ...droplet,
    angleDeg: (droplet.angleDeg + rand(18) + 360) % 360,
    delayPct: clamp(droplet.delayPct + rand(0.6), 0, 100),
    distancePx: clamp(droplet.distancePx + rand(14), 0, 200),
    radiusPx: clamp(droplet.radiusPx + rand(16), 20, 280)
  };
}

type BubbleCurve = "linear" | "ease-in";
const BUBBLE_CURVE_TIMING: Record<BubbleCurve, string> = {
  "ease-in": "cubic-bezier(0.32, 0, 0.67, 0)",
  linear: "linear"
};

type OutgoingFadeEasing = "gentle" | "linear" | "quick";
const OUTGOING_FADE_EASING_CSS: Record<OutgoingFadeEasing, string> = {
  gentle: "cubic-bezier(0.32, 0, 0.24, 1)",
  linear: "linear",
  quick: "cubic-bezier(0.55, 0, 0.15, 1)"
};

type FocusEasing = "ease-out" | "linear" | "snap";
const FOCUS_EASING_CSS: Record<FocusEasing, string> = {
  "ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
  linear: "linear",
  snap: "cubic-bezier(0.7, 0, 0.84, 0)"
};

function useStageCycle({
  intervalMs,
  paused,
  resetSignal,
  stageCount
}: {
  intervalMs: number;
  paused: boolean;
  resetSignal: string;
  stageCount: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    setPreviousIndex(null);
    setTransitionKey((key) => key + 1);
  }, [resetSignal]);

  useEffect(() => {
    if (paused || intervalMs <= 0) {
      return;
    }
    const id = window.setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % stageCount;
        setPreviousIndex(current);
        setTransitionKey((key) => key + 1);
        return next;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, paused, stageCount]);

  const jumpTo = (index: number) => {
    setActiveIndex((current) => {
      if (index === current) {
        return current;
      }
      setPreviousIndex(current);
      setTransitionKey((key) => key + 1);
      return index;
    });
  };

  return { activeIndex, jumpTo, previousIndex, transitionKey };
}

function PanelSlider({
  max,
  min,
  onChange,
  step,
  suffix = "ms",
  title,
  value
}: {
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  suffix?: string;
  title: string;
  value: number;
}) {
  return (
    <div className="py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#171614]">{title}</span>
        <span className="font-mono text-[13px] text-[#8a8378]">
          {value}
          {suffix === "ms" ? "" : suffix}
        </span>
      </div>
      <input
        className="watercolor-showcase-range w-full"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </div>
  );
}

function Segmented<T extends string>({
  labels,
  onChange,
  options,
  value
}: {
  labels: Record<T, string>;
  onChange: (value: T) => void;
  options: readonly T[];
  value: T;
}) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((option) => (
        <button
          className={[
            "rounded-[10px] border px-2 py-2 text-[11px] font-semibold transition",
            value === option
              ? "border-[#6D5BD0] bg-[#6D5BD0]/10 text-[#6D5BD0]"
              : "border-[#e5dfd3] bg-white text-[#8a8378] hover:border-[#d6cfc0]"
          ].join(" ")}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  label,
  onChange
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      className="flex w-full items-center justify-between rounded-[10px] border border-[#e5dfd3] bg-white px-3 py-2.5 text-left transition hover:border-[#d6cfc0]"
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span className="text-[13px] font-medium text-[#171614]">{label}</span>
      <span
        className={[
          "relative h-5 w-9 shrink-0 rounded-full transition",
          checked ? "bg-[#6D5BD0]" : "bg-[#e5dfd3]"
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition",
            checked ? "left-[18px]" : "left-0.5"
          ].join(" ")}
        />
      </span>
    </button>
  );
}

const FOCUS_EASING_LABELS: Record<FocusEasing, string> = {
  "ease-out": "Ease-out",
  linear: "Linear",
  snap: "Snap"
};

const OUTGOING_FADE_EASING_LABELS: Record<OutgoingFadeEasing, string> = {
  gentle: "Gentle",
  linear: "Linear",
  quick: "Quick"
};

const BUBBLE_CURVE_LABELS: Record<BubbleCurve, string> = {
  "ease-in": "Ease-in",
  linear: "Linear"
};

type LayerTab = "layer1" | "layer2";

export function RecommendationLoadingWatercolorShowcase() {
  const instanceId = useId().replace(/:/g, "");
  const [activeTab, setActiveTab] = useState<LayerTab>("layer2");
  const [paused, setPaused] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const [outgoingFadeStartMs, setOutgoingFadeStartMs] = useState(0);
  const [outgoingFadeDurationMs, setOutgoingFadeDurationMs] = useState(3000);
  const [outgoingFadeEasing, setOutgoingFadeEasing] = useState<OutgoingFadeEasing>("gentle");
  const [outgoingMaxBlurPx, setOutgoingMaxBlurPx] = useState(9);
  const [outgoingMaxDesaturatePct, setOutgoingMaxDesaturatePct] = useState(50);

  const [incomingStartMs, setIncomingStartMs] = useState(300);
  const [incomingGrowMs, setIncomingGrowMs] = useState(5250);
  const [bubbleCurve, setBubbleCurve] = useState<BubbleCurve>("ease-in");
  const [incomingHoldMs, setIncomingHoldMs] = useState(400);
  const [incomingFocusMs, setIncomingFocusMs] = useState(1000);
  const [focusEasing, setFocusEasing] = useState<FocusEasing>("ease-out");
  const [incomingStickMs, setIncomingStickMs] = useState(400);
  const [organicRandomize, setOrganicRandomize] = useState(true);
  const [droplets] = useState<Droplet[]>(() => tunedDefaultDroplets());

  const outgoingFadeEndMs = outgoingFadeStartMs + outgoingFadeDurationMs;
  const h1 = incomingStartMs + incomingGrowMs;
  const h2 = h1 + incomingHoldMs;
  const h3 = h2 + incomingFocusMs;
  const h4 = h3 + incomingStickMs;
  const totalMs = h4;

  const dropletsKey = droplets.map((d) => `${d.angleDeg}.${d.distancePx}.${d.radiusPx}.${d.delayPct}`).join("|");
  const settingsKey = [
    outgoingFadeStartMs,
    outgoingFadeDurationMs,
    outgoingFadeEasing,
    outgoingMaxBlurPx,
    outgoingMaxDesaturatePct,
    incomingStartMs,
    incomingGrowMs,
    bubbleCurve,
    incomingHoldMs,
    incomingFocusMs,
    focusEasing,
    incomingStickMs,
    organicRandomize,
    dropletsKey,
    replayCount
  ].join("-");

  const { activeIndex, jumpTo, previousIndex, transitionKey } = useStageCycle({
    intervalMs: totalMs,
    paused,
    resetSignal: settingsKey,
    stageCount: recommendationLoadingStages.length
  });

  const activeStage = recommendationLoadingStages[activeIndex];
  const previousStage = previousIndex === null ? null : recommendationLoadingStages[previousIndex];

  const effectiveDroplets = useMemo(() => {
    if (!organicRandomize) {
      return droplets;
    }
    return droplets.map((droplet) => jitterDroplet(droplet));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [droplets, organicRandomize, transitionKey]);

  const p1 = totalMs > 0 ? (h1 / totalMs) * 100 : 0;
  const p2 = totalMs > 0 ? (h2 / totalMs) * 100 : 0;
  const p3 = totalMs > 0 ? (h3 / totalMs) * 100 : 0;
  const fadeStartPct = totalMs > 0 ? Math.min(100, (outgoingFadeStartMs / totalMs) * 100) : 0;
  const fadeEndPctRaw = totalMs > 0 ? Math.min(100, (outgoingFadeEndMs / totalMs) * 100) : 0;
  const fadeEndPct = Math.max(fadeStartPct + 0.5, fadeEndPctRaw);

  const dropletGrowMs = Math.max(1, incomingGrowMs);
  const dropletTimingFn = BUBBLE_CURVE_TIMING[bubbleCurve];

  const filterId = `wc-showcase-filter-${instanceId}`;
  const maskId = `wc-showcase-mask-${instanceId}`;
  const activeKeyframesName = `wc-showcase-active-${instanceId}`;
  const previousKeyframesName = `wc-showcase-previous-${instanceId}`;
  const washKeyframesName = `wc-showcase-wash-${instanceId}`;

  const dynamicCss = useMemo(() => {
    const fmt = (value: number) => value.toFixed(2);
    const focusEasingCss = FOCUS_EASING_CSS[focusEasing];
    const outgoingFadeEasingCss = OUTGOING_FADE_EASING_CSS[outgoingFadeEasing];
    const outgoingSaturate = Math.max(0, 1 - outgoingMaxDesaturatePct / 100);

    return `
@keyframes ${activeKeyframesName} {
  0% { filter: blur(10px) saturate(0.8) brightness(1.05); }
  ${fmt(p1)}% { filter: blur(8px) saturate(0.86) brightness(1.03); }
  ${fmt(p2)}% {
    filter: blur(8px) saturate(0.86) brightness(1.03);
    animation-timing-function: ${focusEasingCss};
  }
  ${fmt(p3)}% { filter: blur(0) saturate(1) brightness(1); }
  100% { filter: blur(0) saturate(1) brightness(1); }
}
@keyframes ${previousKeyframesName} {
  0% { filter: blur(0) saturate(1) brightness(1); opacity: 1; }
  ${fmt(fadeStartPct)}% {
    filter: blur(0) saturate(1) brightness(1);
    opacity: 1;
    animation-timing-function: ${outgoingFadeEasingCss};
  }
  ${fmt(fadeEndPct)}% {
    filter: blur(${outgoingMaxBlurPx}px) saturate(${outgoingSaturate}) brightness(1.05);
    opacity: 0;
  }
  100% {
    filter: blur(${outgoingMaxBlurPx}px) saturate(${outgoingSaturate}) brightness(1.05);
    opacity: 0;
  }
}
@keyframes ${washKeyframesName} {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
  ${fmt(p1)}% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.82); }
  ${fmt(p3)}% { opacity: 0; transform: translate(-50%, -50%) scale(1.02); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.02); }
}
.${activeKeyframesName}-el {
  animation: ${activeKeyframesName} ${totalMs}ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.${previousKeyframesName}-el {
  animation: ${previousKeyframesName} ${totalMs}ms linear both;
}
.${washKeyframesName}-el {
  animation: ${washKeyframesName} ${totalMs}ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
${effectiveDroplets
  .map(
    (droplet, index) => `
@keyframes wc-showcase-droplet-${index}-${instanceId} {
  0% { r: 0; }
  100% { r: ${droplet.radiusPx}; }
}`
  )
  .join("\n")}
`;
  }, [
    activeKeyframesName,
    effectiveDroplets,
    fadeEndPct,
    fadeStartPct,
    focusEasing,
    instanceId,
    outgoingFadeEasing,
    outgoingMaxBlurPx,
    outgoingMaxDesaturatePct,
    p1,
    p2,
    p3,
    previousKeyframesName,
    totalMs,
    washKeyframesName
  ]);

  const playState = paused ? "paused" : "running";

  const handleCopySettings = async () => {
    const payload = {
      layer1: {
        fadeDurationMs: outgoingFadeDurationMs,
        fadeEasing: outgoingFadeEasing,
        fadeStartMs: outgoingFadeStartMs,
        maxBlurPx: outgoingMaxBlurPx,
        maxDesaturatePct: outgoingMaxDesaturatePct
      },
      layer2: {
        bubbleCurve,
        bubbleCount: droplets.length,
        comeInDurationMs: incomingGrowMs,
        comeInStartMs: incomingStartMs,
        focusEasing,
        focusPullMs: incomingFocusMs,
        holdMs: incomingHoldMs,
        organicRandomize,
        stickMs: incomingStickMs
      },
      totalCycleMs: totalMs
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("idle");
    }
  };

  return (
    <main className="min-h-screen bg-[#EDE8DF] px-4 py-8 text-[#171614] sm:px-8">
      <style dangerouslySetInnerHTML={{ __html: dynamicCss }} />

      <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[28px] border border-[#e5dfd3] bg-[#FCFBF9] shadow-[0_30px_80px_rgba(23,22,20,0.10)]">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-[#eee9df] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-6 w-6 rounded-full bg-[linear-gradient(135deg,#a78bfa,#f0a868)]" />
            <span className="text-[15px] font-semibold tracking-tight">Watercolor Bleed</span>
            <span className="ml-1 rounded-full bg-[#f4f1ea] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8a8378]">
              Prototype
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-full border border-[#e5dfd3] px-3.5 py-2 text-[13px] font-medium text-[#171614] transition hover:border-[#d6cfc0] sm:inline-block"
              href="/design-system/core-experience/recommendation-loading"
            >
              ← Back
            </Link>
            <button
              className="inline-flex items-center gap-1.5 rounded-full bg-[#171614] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#2c2a26]"
              onClick={handleCopySettings}
              type="button"
            >
              {copyState === "copied" ? "Copied ✓" : "Export settings"}
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_320px]">
          {/* Left sidebar */}
          <div className="border-b border-[#eee9df] px-4 py-5 lg:border-b-0 lg:border-r">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-[#8a8378]">Layers</p>
            <div className="mt-2 flex flex-col gap-1">
              <button
                className={[
                  "flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[13px] font-medium transition",
                  activeTab === "layer1" ? "bg-[#6D5BD0]/10 text-[#6D5BD0]" : "text-[#171614] hover:bg-[#f4f1ea]"
                ].join(" ")}
                onClick={() => setActiveTab("layer1")}
                type="button"
              >
                <span className="h-3 w-3 rounded-full bg-[#a78bfa]" />
                Layer 1 — Go out
              </button>
              <button
                className={[
                  "flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[13px] font-medium transition",
                  activeTab === "layer2" ? "bg-[#6D5BD0]/10 text-[#6D5BD0]" : "text-[#171614] hover:bg-[#f4f1ea]"
                ].join(" ")}
                onClick={() => setActiveTab("layer2")}
                type="button"
              >
                <span className="h-3 w-3 rounded-full bg-[#6fbf8f]" />
                Layer 2 — Come in
              </button>
            </div>

            <div className="mt-6 flex gap-1.5">
              <button
                className="flex-1 rounded-[10px] bg-[#171614] px-2 py-2 text-[12px] font-semibold text-white transition hover:bg-[#2c2a26]"
                onClick={() => setReplayCount((value) => value + 1)}
                type="button"
              >
                ↺ Replay
              </button>
              <button
                className="flex-1 rounded-[10px] border border-[#e5dfd3] bg-white px-2 py-2 text-[12px] font-semibold text-[#171614] transition hover:border-[#d6cfc0]"
                onClick={() => setPaused((value) => !value)}
                type="button"
              >
                {paused ? "▶ Play" : "⏸ Pause"}
              </button>
            </div>

            <div className="mt-6 rounded-[14px] border border-[#e9e2d3] bg-[#FBF7EE] p-3.5">
              <p className="text-[12px] font-semibold text-[#7a6a3e]">How this works</p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#8a7d5a]">
                Two independent layers on one timeline: the current
                illustration fades out on its own schedule, while the new
                one bleeds in through nine hand-placed, procedurally
                jittered watercolor droplets — no two plays are identical.
              </p>
            </div>

            <p className="mt-6 px-2 text-[11px] text-[#b3ab9c]">
              Made with a hand-tuned SVG goo filter · {droplets.length} droplets
            </p>
          </div>

          {/* Center canvas */}
          <div className="flex flex-col items-center justify-center border-b border-[#eee9df] px-6 py-10 lg:border-b-0 lg:border-r">
            <div className="relative flex aspect-square w-full max-w-[440px] items-center justify-center overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#f4f1ea,#ece6d8)]">
              <div className="relative aspect-square w-[78%]">
                {previousStage ? (
                  <svg
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full drop-shadow-[0_20px_45px_rgba(23,22,20,0.14)]"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox={`0 0 ${STAGE_SIZE} ${STAGE_SIZE}`}
                  >
                    <defs>
                      <filter height="240%" id={filterId} width="240%" x="-70%" y="-70%">
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={10} />
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

                      <mask height={STAGE_SIZE} id={maskId} maskUnits="userSpaceOnUse" width={STAGE_SIZE} x={0} y={0}>
                        <g filter={`url(#${filterId})`} key={`droplets-${transitionKey}`}>
                          {effectiveDroplets.map((droplet, index) => {
                            const rad = (droplet.angleDeg * Math.PI) / 180;
                            const cx = CENTER + droplet.distancePx * Math.cos(rad);
                            const cy = CENTER + droplet.distancePx * Math.sin(rad);
                            const delayMs = incomingStartMs + incomingGrowMs * (droplet.delayPct / 100);

                            return (
                              <circle
                                cx={cx}
                                cy={cy}
                                fill="#fff"
                                key={droplet.id}
                                r={0}
                                style={{
                                  animation: `wc-showcase-droplet-${index}-${instanceId} ${dropletGrowMs}ms ${dropletTimingFn} ${delayMs}ms both`,
                                  animationPlayState: playState
                                }}
                              />
                            );
                          })}
                        </g>
                      </mask>
                    </defs>

                    <image
                      className={`${previousKeyframesName}-el`}
                      height={STAGE_SIZE}
                      href={previousStage.imageSrc}
                      key={`${transitionKey}-${previousStage.id}-previous`}
                      preserveAspectRatio="xMidYMid meet"
                      style={{ animationPlayState: playState }}
                      width={STAGE_SIZE}
                      x={0}
                      y={0}
                    />

                    <g mask={`url(#${maskId})`}>
                      <image
                        className={`${activeKeyframesName}-el`}
                        height={STAGE_SIZE}
                        href={activeStage.imageSrc}
                        key={`${transitionKey}-${activeStage.id}-active`}
                        preserveAspectRatio="xMidYMid meet"
                        style={{ animationPlayState: playState }}
                        width={STAGE_SIZE}
                        x={0}
                        y={0}
                      />
                    </g>
                  </svg>
                ) : (
                  <img
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_20px_45px_rgba(23,22,20,0.14)]"
                    src={activeStage.imageSrc}
                  />
                )}

                {previousStage ? (
                  <span
                    aria-hidden="true"
                    className={`${washKeyframesName}-el pointer-events-none absolute left-1/2 top-1/2 z-10 h-[52%] w-[52%] rounded-full`}
                    key={`wash-${transitionKey}`}
                    style={{
                      animationPlayState: playState,
                      background:
                        "radial-gradient(circle, rgba(217,156,86,0.46) 0%, rgba(125,83,48,0.3) 35%, transparent 72%)",
                      filter: "blur(20px)",
                      mixBlendMode: "multiply"
                    }}
                  />
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-full border border-[#e5dfd3] bg-white px-4 py-2 shadow-[0_8px_20px_rgba(23,22,20,0.06)]">
              <span className="text-[13px] font-semibold text-[#171614]">{activeStage.label}</span>
              <span className="text-[11px] text-[#b3ab9c]">·</span>
              <span className="font-mono text-[11px] text-[#8a8378]">{totalMs}ms cycle</span>
            </div>

            <div className="mt-6 flex gap-2.5">
              {recommendationLoadingStages.map((stage, index) => (
                <button
                  className={[
                    "h-14 w-14 overflow-hidden rounded-[12px] border-2 bg-white transition",
                    index === activeIndex
                      ? "border-[#6D5BD0] shadow-[0_0_0_3px_rgba(109,91,208,0.15)]"
                      : "border-[#e5dfd3] hover:border-[#d6cfc0]"
                  ].join(" ")}
                  key={stage.id}
                  onClick={() => jumpTo(index)}
                  title={stage.label}
                  type="button"
                >
                  <img alt={stage.label} className="h-full w-full object-cover" src={stage.imageSrc} />
                </button>
              ))}
            </div>
          </div>

          {/* Right settings panel */}
          <div className="px-5 py-5">
            {activeTab === "layer1" ? (
              <div>
                <p className="text-[13px] font-semibold text-[#171614]">Layer 1 — Go out</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[#8a8378]">
                  The current illustration is already fully visible when
                  the cycle starts. This is the only thing it does.
                </p>

                <div className="mt-3 divide-y divide-[#f0ece2]">
                  <PanelSlider
                    max={8000}
                    min={0}
                    onChange={setOutgoingFadeStartMs}
                    step={50}
                    title="Starts fading at"
                    value={outgoingFadeStartMs}
                  />
                  <PanelSlider
                    max={8000}
                    min={200}
                    onChange={setOutgoingFadeDurationMs}
                    step={50}
                    title="Fade duration"
                    value={outgoingFadeDurationMs}
                  />
                  <PanelSlider
                    max={20}
                    min={0}
                    onChange={setOutgoingMaxBlurPx}
                    step={1}
                    suffix="px"
                    title="Max blur"
                    value={outgoingMaxBlurPx}
                  />
                  <PanelSlider
                    max={100}
                    min={0}
                    onChange={setOutgoingMaxDesaturatePct}
                    step={5}
                    suffix="%"
                    title="Max desaturation"
                    value={outgoingMaxDesaturatePct}
                  />
                </div>

                <p className="mt-4 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8a8378]">
                  Fade easing
                </p>
                <Segmented
                  labels={OUTGOING_FADE_EASING_LABELS}
                  onChange={setOutgoingFadeEasing}
                  options={["gentle", "linear", "quick"] as const}
                  value={outgoingFadeEasing}
                />
              </div>
            ) : (
              <div>
                <p className="text-[13px] font-semibold text-[#171614]">Layer 2 — Come in</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[#8a8378]">
                  One sequential run: come in, hold blurred, pull into
                  focus, then stick before the cycle repeats.
                </p>

                <div className="mt-3 divide-y divide-[#f0ece2]">
                  <PanelSlider
                    max={8000}
                    min={0}
                    onChange={setIncomingStartMs}
                    step={50}
                    title="Come in — starts at"
                    value={incomingStartMs}
                  />
                  <PanelSlider
                    max={8000}
                    min={200}
                    onChange={setIncomingGrowMs}
                    step={50}
                    title="Come in — duration"
                    value={incomingGrowMs}
                  />
                  <PanelSlider
                    max={4000}
                    min={0}
                    onChange={setIncomingHoldMs}
                    step={50}
                    title="Blurred hold"
                    value={incomingHoldMs}
                  />
                  <PanelSlider
                    max={4000}
                    min={100}
                    onChange={setIncomingFocusMs}
                    step={50}
                    title="Focus pull duration"
                    value={incomingFocusMs}
                  />
                  <PanelSlider
                    max={4000}
                    min={0}
                    onChange={setIncomingStickMs}
                    step={50}
                    title="Stick"
                    value={incomingStickMs}
                  />
                </div>

                <p className="mt-4 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8a8378]">
                  Bubble growth curve
                </p>
                <Segmented
                  labels={BUBBLE_CURVE_LABELS}
                  onChange={setBubbleCurve}
                  options={["ease-in", "linear"] as const}
                  value={bubbleCurve}
                />

                <p className="mt-4 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8a8378]">
                  Focus easing
                </p>
                <Segmented
                  labels={FOCUS_EASING_LABELS}
                  onChange={setFocusEasing}
                  options={["ease-out", "linear", "snap"] as const}
                  value={focusEasing}
                />

                <div className="mt-4">
                  <Toggle checked={organicRandomize} label="Randomize each cycle" onChange={setOrganicRandomize} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
.watercolor-showcase-range {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 999px;
  background: #eee9df;
  outline: none;
}
.watercolor-showcase-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 999px;
  background: #6d5bd0;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 4px rgba(23, 22, 20, 0.25);
  cursor: pointer;
}
.watercolor-showcase-range::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 999px;
  background: #6d5bd0;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 4px rgba(23, 22, 20, 0.25);
  cursor: pointer;
}
`
        }}
      />
    </main>
  );
}
