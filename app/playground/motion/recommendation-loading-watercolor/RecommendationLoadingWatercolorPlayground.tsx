"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent
} from "react";
import Link from "next/link";

import { recommendationLoadingStages } from "@/components/product/RecommendationLoadingExperience";
import {
  BUBBLE_CURVE_TIMING,
  FOCUS_EASING_CSS,
  OUTGOING_FADE_EASING_CSS,
  RECOMMENDATION_WATERCOLOR_STAGE_SIZE,
  jitterRecommendationWatercolorDroplet,
  recommendationWatercolorDroplets,
  recommendationWatercolorMotion,
  type RecommendationWatercolorBubbleCurve,
  type RecommendationWatercolorDroplet,
  type RecommendationWatercolorFocusEasing,
  type RecommendationWatercolorOutgoingFadeEasing
} from "@/lib/design-system/recommendation-watercolor-motion";

const STAGE_SIZE = RECOMMENDATION_WATERCOLOR_STAGE_SIZE;
const CENTER = STAGE_SIZE / 2;

// A fixed ms-per-pixel scale for the master timeline grid. Fixed (not
// derived from the current total duration) so the ruler doesn't rescale
// itself while you're dragging on it — Layer 1 and Layer 2 always read
// their position off the exact same, never-shifting axis.
const TIMELINE_MS = 20000;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type Droplet = RecommendationWatercolorDroplet;

// The tuned, verified-safe default layout (angle + distance so each
// bubble is independently editable). Radii and delays were chosen by
// simulating the actual coverage math so the union of all nine reliably
// covers the whole frame by the end of Layer 2's "come in" — editing
// them by hand can break that guarantee, which is fine for exploring but
// worth knowing. Green-lit loading reads the same defaults from
// `recommendation-watercolor-motion`.
function tunedDefaultDroplets(): Droplet[] {
  return recommendationWatercolorDroplets.map((droplet) => ({
    ...droplet,
    id: `playground-${droplet.id}`
  }));
}

type BubbleCurve = RecommendationWatercolorBubbleCurve;

const BUBBLE_CURVE_LABELS: Record<BubbleCurve, string> = {
  "ease-in":
    "Ease-in (recommended) — no dead time; with the tuned defaults, coverage completes at ~95% of the come-in duration instead of ~85%.",
  linear:
    "Linear — constant speed the whole way, but with the tuned defaults it finishes covering the frame at ~85% of the come-in duration, leaving the tail idle."
};

type OutgoingFadeEasing = RecommendationWatercolorOutgoingFadeEasing;

const OUTGOING_FADE_EASING_LABELS: Record<OutgoingFadeEasing, string> = {
  gentle: "Gentle (default) — fades slowly at first, then drops away faster near the end",
  linear: "Linear — opacity drops at a constant rate",
  quick: "Quick — most of the fade happens early, then it lingers faint before disappearing"
};

type FocusEasing = RecommendationWatercolorFocusEasing;

const FOCUS_EASING_LABELS: Record<FocusEasing, string> = {
  "ease-out": "Ease-out (default) — fast at first, lingers soft at the very end",
  linear: "Linear — constant speed the whole way",
  snap: "Snap — stays soft longer, then resolves to sharp abruptly at the end"
};

let dropletIdCounter = 0;
function nextDropletId() {
  dropletIdCounter += 1;
  return `playground-bubble-${dropletIdCounter}`;
}

// Layer 2's own "hold, focus, stick" — matches current production
// exactly (blur-hold and stick both 0ms there — no pause at all: it
// starts sharpening the instant the bubbles finish covering, and cuts to
// the next stage the instant it's fully sharp).
const PRODUCTION_LAYER2 = {
  focusMs: 1000,
  holdMs: 0,
  stickMs: 0
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

  return { activeIndex, previousIndex, transitionKey };
}

function SliderRow({
  highlight = false,
  hint,
  label,
  max,
  min,
  onChange,
  step,
  suffix = "ms",
  value
}: {
  highlight?: boolean;
  hint: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  suffix?: string;
  value: number;
}) {
  return (
    <div
      className={[
        "rounded-[12px] border p-4",
        highlight
          ? "border-[#aa7d3a] bg-[#FFF6E8] shadow-[0_0_0_3px_rgba(170,125,58,0.18)]"
          : "border-[#d8cbb8] bg-[#FCFBFA]/70"
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-[#324236]">{label}</label>
        <div className="flex items-center gap-1">
          <input
            className="w-20 rounded-[8px] border border-[#d8cbb8] bg-white px-2 py-1 text-right text-sm font-mono text-[#324236]"
            max={max}
            min={min}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (!Number.isNaN(next)) {
                onChange(Math.min(max, Math.max(min, next)));
              }
            }}
            step={step}
            type="number"
            value={value}
          />
          <span className="text-xs font-mono text-[#7D5330]">{suffix}</span>
        </div>
      </div>
      <input
        className="mt-3 w-full accent-[#324236]"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <p className="mt-2 text-xs leading-relaxed text-[#5b6b5c]">{hint}</p>
    </div>
  );
}

function DropletTable({
  droplets,
  onChange
}: {
  droplets: Droplet[];
  onChange: (next: Droplet[]) => void;
}) {
  const updateDroplet = (id: string, patch: Partial<Droplet>) => {
    onChange(droplets.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  return (
    <div className="overflow-x-auto rounded-[10px] border border-[#d8cbb8]">
      <table className="w-full min-w-[560px] border-collapse text-xs">
        <thead>
          <tr className="border-b border-[#d8cbb8] bg-[#FCFBFA] text-left text-[#7D5330]">
            <th className="px-3 py-2 font-semibold">#</th>
            <th className="px-3 py-2 font-semibold">Angle (°)</th>
            <th className="px-3 py-2 font-semibold">Distance (px)</th>
            <th className="px-3 py-2 font-semibold">Radius (px)</th>
            <th className="px-3 py-2 font-semibold">Delay (% of come-in)</th>
            <th className="px-3 py-2 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {droplets.map((droplet, index) => (
            <tr className="border-b border-[#ece3d5]" key={droplet.id}>
              <td className="px-3 py-1.5 font-mono text-[#324236]">{index + 1}</td>
              <td className="px-3 py-1.5">
                <input
                  className="w-16 rounded-[6px] border border-[#d8cbb8] px-1.5 py-1 text-right font-mono"
                  max={360}
                  min={0}
                  onChange={(event) =>
                    updateDroplet(droplet.id, {
                      angleDeg: Number(event.target.value)
                    })
                  }
                  type="number"
                  value={droplet.angleDeg}
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  className="w-16 rounded-[6px] border border-[#d8cbb8] px-1.5 py-1 text-right font-mono"
                  max={200}
                  min={0}
                  onChange={(event) =>
                    updateDroplet(droplet.id, {
                      distancePx: Number(event.target.value)
                    })
                  }
                  type="number"
                  value={droplet.distancePx}
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  className="w-16 rounded-[6px] border border-[#d8cbb8] px-1.5 py-1 text-right font-mono"
                  max={280}
                  min={20}
                  onChange={(event) =>
                    updateDroplet(droplet.id, {
                      radiusPx: Number(event.target.value)
                    })
                  }
                  type="number"
                  value={droplet.radiusPx}
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  className="w-16 rounded-[6px] border border-[#d8cbb8] px-1.5 py-1 text-right font-mono"
                  max={100}
                  min={0}
                  onChange={(event) =>
                    updateDroplet(droplet.id, {
                      delayPct: Number(event.target.value)
                    })
                  }
                  step={0.25}
                  type="number"
                  value={droplet.delayPct}
                />
              </td>
              <td className="px-3 py-1.5">
                <button
                  className="rounded-[6px] border border-[#d8cbb8] px-2 py-1 text-[#B4472E] transition hover:bg-[#fdeee9] disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={droplets.length <= 1}
                  onClick={() => onChange(droplets.filter((d) => d.id !== droplet.id))}
                  type="button"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Layer 1 has exactly one thing on the timeline: a go-out window
// (start → end). Layer 2 has one continuous, sequential run of four
// sub-stages: come in (bubbles) → blurred hold → focus pull → stick.
// Every drag kind below maps to exactly one of those.
type DragKind =
  | "l1-start"
  | "l1-end"
  | "l1-move"
  | "l2-start"
  | "l2-h1"
  | "l2-h2"
  | "l2-h3"
  | "l2-h4"
  | "l2-move";

type DragInfo = {
  kind: DragKind;
  startClientX: number;
  startDuration: number;
  startStart: number;
};

function TimelineEditor({
  incomingFocusMs,
  incomingGrowMs,
  incomingHoldMs,
  incomingStartMs,
  incomingStickMs,
  instanceId,
  outgoingFadeEndMs,
  outgoingFadeStartMs,
  paused,
  setIncomingFocusMs,
  setIncomingGrowMs,
  setIncomingHoldMs,
  setIncomingStartMs,
  setIncomingStickMs,
  setOutgoingFadeEndMs,
  setOutgoingFadeStartMs,
  totalMs,
  transitionKey
}: {
  incomingFocusMs: number;
  incomingGrowMs: number;
  incomingHoldMs: number;
  incomingStartMs: number;
  incomingStickMs: number;
  instanceId: string;
  outgoingFadeEndMs: number;
  outgoingFadeStartMs: number;
  paused: boolean;
  setIncomingFocusMs: (ms: number) => void;
  setIncomingGrowMs: (ms: number) => void;
  setIncomingHoldMs: (ms: number) => void;
  setIncomingStartMs: (ms: number) => void;
  setIncomingStickMs: (ms: number) => void;
  setOutgoingFadeEndMs: (ms: number) => void;
  setOutgoingFadeStartMs: (ms: number) => void;
  totalMs: number;
  transitionKey: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);

  const latest = useRef({
    incomingFocusMs,
    incomingGrowMs,
    incomingHoldMs,
    incomingStartMs,
    incomingStickMs,
    outgoingFadeEndMs,
    outgoingFadeStartMs
  });
  latest.current = {
    incomingFocusMs,
    incomingGrowMs,
    incomingHoldMs,
    incomingStartMs,
    incomingStickMs,
    outgoingFadeEndMs,
    outgoingFadeStartMs
  };

  const pxToMs = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) {
      return 0;
    }
    const rect = el.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return ratio * TIMELINE_MS;
  }, []);

  useEffect(() => {
    if (!dragInfo) {
      return;
    }

    const handleMove = (event: PointerEvent) => {
      const currentMs = pxToMs(event.clientX);
      const l = latest.current;

      switch (dragInfo.kind) {
        case "l1-start": {
          setOutgoingFadeStartMs(clamp(currentMs, 0, l.outgoingFadeEndMs - 50));
          break;
        }
        case "l1-end": {
          setOutgoingFadeEndMs(
            clamp(currentMs, l.outgoingFadeStartMs + 50, TIMELINE_MS)
          );
          break;
        }
        case "l1-move": {
          const deltaMs = currentMs - pxToMs(dragInfo.startClientX);
          const duration = dragInfo.startDuration;
          const newStart = clamp(
            dragInfo.startStart + deltaMs,
            0,
            TIMELINE_MS - duration
          );
          setOutgoingFadeStartMs(newStart);
          setOutgoingFadeEndMs(newStart + duration);
          break;
        }
        case "l2-start": {
          // Trim the come-in stage from its left edge: keep h1 (where
          // come-in ends / blurred hold begins) fixed, shorten or
          // lengthen come-in itself.
          const oldH1 = l.incomingStartMs + l.incomingGrowMs;
          const newStart = clamp(currentMs, 0, oldH1 - 100);
          setIncomingStartMs(newStart);
          setIncomingGrowMs(oldH1 - newStart);
          break;
        }
        case "l2-h1": {
          // Boundary between come-in and blurred hold: resize come-in,
          // keep its start fixed.
          const start = l.incomingStartMs;
          const newH1 = clamp(currentMs, start + 100, TIMELINE_MS);
          setIncomingGrowMs(newH1 - start);
          break;
        }
        case "l2-h2": {
          // Boundary between blurred hold and focus pull.
          const h1 = l.incomingStartMs + l.incomingGrowMs;
          const newH2 = clamp(currentMs, h1, TIMELINE_MS);
          setIncomingHoldMs(newH2 - h1);
          break;
        }
        case "l2-h3": {
          // Boundary between focus pull and stick.
          const h2 = l.incomingStartMs + l.incomingGrowMs + l.incomingHoldMs;
          const newH3 = clamp(currentMs, h2 + 50, TIMELINE_MS);
          setIncomingFocusMs(newH3 - h2);
          break;
        }
        case "l2-h4": {
          // End of stick — end of the whole Layer 2 run.
          const h3 =
            l.incomingStartMs +
            l.incomingGrowMs +
            l.incomingHoldMs +
            l.incomingFocusMs;
          const newH4 = clamp(currentMs, h3, TIMELINE_MS);
          setIncomingStickMs(newH4 - h3);
          break;
        }
        case "l2-move": {
          const deltaMs = currentMs - pxToMs(dragInfo.startClientX);
          const newStart = clamp(
            dragInfo.startStart + deltaMs,
            0,
            TIMELINE_MS - dragInfo.startDuration
          );
          setIncomingStartMs(newStart);
          break;
        }
        default:
          break;
      }
    };

    const handleUp = () => setDragInfo(null);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [
    dragInfo,
    pxToMs,
    setIncomingFocusMs,
    setIncomingGrowMs,
    setIncomingHoldMs,
    setIncomingStartMs,
    setIncomingStickMs,
    setOutgoingFadeEndMs,
    setOutgoingFadeStartMs
  ]);

  const beginDrag = (
    kind: DragKind,
    event: ReactPointerEvent,
    startStart = 0,
    startDuration = 0
  ) => {
    event.preventDefault();
    setDragInfo({
      kind,
      startClientX: event.clientX,
      startDuration,
      startStart
    });
  };

  const h0 = incomingStartMs;
  const h1 = h0 + incomingGrowMs;
  const h2 = h1 + incomingHoldMs;
  const h3 = h2 + incomingFocusMs;
  const h4 = h3 + incomingStickMs;
  const toPct = (ms: number) => clamp((ms / TIMELINE_MS) * 100, 0, 100);
  const layer2Duration = h4 - h0;

  return (
    <div>
      <div
        className="relative h-24 select-none overflow-visible rounded-[8px] border border-[#d8cbb8] bg-white"
        ref={trackRef}
      >
        {[2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000].map((tick) => (
          <div
            aria-hidden="true"
            className="absolute top-0 h-full w-px bg-[#ece3d5]"
            key={tick}
            style={{ left: `${toPct(tick)}%` }}
          />
        ))}

        <p className="absolute left-1.5 top-1 text-[9px] font-semibold uppercase tracking-wide text-[#7d5aa0]">
          Layer 1 — current image
        </p>
        {/* Layer 1 — outgoing (purple): one go-out window */}
        <div
          className="absolute top-6 h-6 cursor-grab rounded-[4px] border border-[#7d5aa0] bg-[#d9c7ef]/80 active:cursor-grabbing"
          onPointerDown={(event) =>
            beginDrag(
              "l1-move",
              event,
              outgoingFadeStartMs,
              outgoingFadeEndMs - outgoingFadeStartMs
            )
          }
          style={{
            left: `${toPct(outgoingFadeStartMs)}%`,
            width: `${Math.max(0.5, toPct(outgoingFadeEndMs) - toPct(outgoingFadeStartMs))}%`
          }}
          title="Layer 1 go-out — drag to move"
        >
          <span className="pointer-events-none block truncate px-1 text-[9px] font-semibold leading-6 text-[#4b3068]">
            Go out {outgoingFadeStartMs}–{outgoingFadeEndMs}ms
          </span>
          <div
            className="absolute -left-1 top-0 h-full w-2 cursor-ew-resize"
            onPointerDown={(event) => {
              event.stopPropagation();
              beginDrag("l1-start", event);
            }}
          />
          <div
            className="absolute -right-1 top-0 h-full w-2 cursor-ew-resize"
            onPointerDown={(event) => {
              event.stopPropagation();
              beginDrag("l1-end", event);
            }}
          />
        </div>

        <p className="absolute left-1.5 top-[3.1rem] text-[9px] font-semibold uppercase tracking-wide text-[#245536]">
          Layer 2 — new image
        </p>
        {/* Layer 2 — incoming (green): come in → blurred hold → focus → stick, sequential */}
        <div
          className="absolute top-[4.4rem] h-6 cursor-grab overflow-hidden rounded-[4px] border border-[#3f8a5c] active:cursor-grabbing"
          onPointerDown={(event) => beginDrag("l2-move", event, h0, layer2Duration)}
          style={{
            left: `${toPct(h0)}%`,
            width: `${Math.max(0.5, toPct(h4) - toPct(h0))}%`
          }}
          title="Layer 2 — drag to move the whole run"
        >
          <div className="flex h-full w-full">
            <div
              className="h-full bg-[#bfe6cf]"
              style={{ width: `${layer2Duration > 0 ? ((h1 - h0) / layer2Duration) * 100 : 0}%` }}
              title="Come in (bubbles)"
            />
            <div
              className="h-full bg-[#d8c9a3]"
              style={{ width: `${layer2Duration > 0 ? ((h2 - h1) / layer2Duration) * 100 : 0}%` }}
              title="Blurred hold"
            />
            <div
              className="h-full bg-[#e8c08a]"
              style={{ width: `${layer2Duration > 0 ? ((h3 - h2) / layer2Duration) * 100 : 0}%` }}
              title="Focus pull"
            />
            <div
              className="h-full bg-[#c9c2d6]"
              style={{ width: `${layer2Duration > 0 ? ((h4 - h3) / layer2Duration) * 100 : 0}%` }}
              title="Stick"
            />
          </div>
          <div
            className="absolute -left-1 top-0 h-full w-2 cursor-ew-resize"
            onPointerDown={(event) => {
              event.stopPropagation();
              beginDrag("l2-start", event);
            }}
            title="Trim come-in start"
          />
          {[
            { kind: "l2-h1" as const, pos: h1, title: "Come in ↔ blurred hold" },
            { kind: "l2-h2" as const, pos: h2, title: "Blurred hold ↔ focus pull" },
            { kind: "l2-h3" as const, pos: h3, title: "Focus pull ↔ stick" }
          ].map(({ kind, pos, title }) => (
            <div
              className="absolute top-0 h-full w-1.5 -translate-x-1/2 cursor-ew-resize bg-[#171614]/50 hover:bg-[#171614]"
              key={kind}
              onPointerDown={(event) => {
                event.stopPropagation();
                beginDrag(kind, event);
              }}
              style={{ left: `${layer2Duration > 0 ? ((pos - h0) / layer2Duration) * 100 : 0}%` }}
              title={title}
            />
          ))}
          <div
            className="absolute -right-1 top-0 h-full w-2 cursor-ew-resize"
            onPointerDown={(event) => {
              event.stopPropagation();
              beginDrag("l2-h4", event);
            }}
            title="Resize stick"
          />
        </div>

        {!paused && totalMs > 0 ? (
          <div
            className="pointer-events-none absolute top-0 z-10 h-full w-[2px] bg-[#171614]"
            key={`playhead-${transitionKey}`}
            style={{
              animation: `wc-tune-playhead-${instanceId} ${totalMs}ms linear both`,
              left: 0
            }}
          />
        ) : null}
      </div>
      <p className="mt-1.5 text-[11px] text-[#5b6b5c]">
        Purple bar = Layer 1&apos;s go-out window: drag its edges to trim,
        or its middle to move it — nothing else on this grid moves with
        it. Green bar = Layer 2&apos;s whole run: come in (bright green) →
        blurred hold (tan) → focus pull (orange) → stick (lavender), each
        one sequential and each with its own drag handle at the boundary;
        drag the green bar&apos;s own middle to shift the whole run
        without changing any of its internal durations. Gridlines every
        2000ms.
      </p>
    </div>
  );
}

export function RecommendationLoadingWatercolorPlayground() {
  const instanceId = useId().replace(/:/g, "");
  const [paused, setPaused] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const [focusEasing, setFocusEasing] = useState<FocusEasing>(
    recommendationWatercolorMotion.layer2.focusEasing
  );
  const [bubbleCurve, setBubbleCurve] = useState<BubbleCurve>(
    recommendationWatercolorMotion.layer2.bubbleCurve
  );
  const [droplets, setDroplets] = useState<Droplet[]>(() => tunedDefaultDroplets());
  // On by default: every cycle jitters each bubble's angle, distance,
  // radius, and delay a little so the bleed is never quite identical
  // twice. The table above stays the source of truth you edit — this
  // just wobbles a fresh copy of it each time the stage advances.
  const [organicRandomize, setOrganicRandomize] = useState(
    recommendationWatercolorMotion.layer2.organicRandomize
  );

  // ---- Layer 1 (purple) — the current illustration already on screen.
  // Its only job on this timeline is going out: a start point and an end
  // point, in raw ms, fully independent of Layer 2.
  const [outgoingFadeStartMs, setOutgoingFadeStartMs] = useState(
    recommendationWatercolorMotion.layer1.fadeStartMs
  );
  const [outgoingFadeEndMs, setOutgoingFadeEndMs] = useState(
    recommendationWatercolorMotion.layer1.fadeStartMs +
      recommendationWatercolorMotion.layer1.fadeDurationMs
  );
  const [outgoingFadeEasing, setOutgoingFadeEasing] =
    useState<OutgoingFadeEasing>(recommendationWatercolorMotion.layer1.fadeEasing);
  const [outgoingMaxBlurPx, setOutgoingMaxBlurPx] = useState(
    recommendationWatercolorMotion.layer1.maxBlurPx
  );
  const [outgoingMaxDesaturatePct, setOutgoingMaxDesaturatePct] = useState(
    recommendationWatercolorMotion.layer1.maxDesaturatePct
  );

  // ---- Layer 2 (green) — the new illustration. One continuous,
  // sequential run: come in (bubbles) → blurred hold → focus pull →
  // stick. incomingStartMs positions the whole run on the timeline;
  // everything else is a duration for one stage of it.
  const [incomingStartMs, setIncomingStartMs] = useState(
    recommendationWatercolorMotion.layer2.comeInStartMs
  );
  const [incomingGrowMs, setIncomingGrowMs] = useState(
    recommendationWatercolorMotion.layer2.comeInDurationMs
  );
  const [incomingHoldMs, setIncomingHoldMs] = useState(
    recommendationWatercolorMotion.layer2.holdMs
  );
  const [incomingFocusMs, setIncomingFocusMs] = useState(
    recommendationWatercolorMotion.layer2.focusPullMs
  );
  const [incomingStickMs, setIncomingStickMs] = useState(
    recommendationWatercolorMotion.layer2.stickMs
  );

  const clampedIncomingStartMs = clamp(incomingStartMs, 0, TIMELINE_MS);
  const h1 = clampedIncomingStartMs + incomingGrowMs;
  const h2 = h1 + incomingHoldMs;
  const h3 = h2 + incomingFocusMs;
  const h4 = h3 + incomingStickMs;
  const totalMs = h4;

  const dropletsKey = droplets
    .map((d) => `${d.angleDeg}.${d.distancePx}.${d.radiusPx}.${d.delayPct}`)
    .join("|");
  const settingsKey = [
    outgoingFadeStartMs,
    outgoingFadeEndMs,
    outgoingFadeEasing,
    outgoingMaxBlurPx,
    outgoingMaxDesaturatePct,
    incomingStartMs,
    incomingGrowMs,
    incomingHoldMs,
    incomingFocusMs,
    incomingStickMs,
    focusEasing,
    bubbleCurve,
    dropletsKey,
    organicRandomize,
    replayCount
  ].join("-");

  const { activeIndex, previousIndex, transitionKey } = useStageCycle({
    intervalMs: totalMs,
    paused,
    resetSignal: settingsKey,
    stageCount: recommendationLoadingStages.length
  });

  const activeStage = recommendationLoadingStages[activeIndex];
  const previousStage =
    previousIndex === null ? null : recommendationLoadingStages[previousIndex];

  // A freshly jittered copy of the bubble layout, recomputed once per
  // cycle (keyed on transitionKey) — not on every render — so each pass
  // gets its own random wobble instead of a new one every frame.
  const effectiveDroplets = useMemo(() => {
    if (!organicRandomize) {
      return droplets;
    }
    return droplets.map((droplet) =>
      jitterRecommendationWatercolorDroplet(droplet)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [droplets, organicRandomize, transitionKey]);

  // Breakpoints for the active image's own blur→focus arc, expressed as
  // % of the whole cycle (totalMs === h4 exactly, by construction).
  const p1 = totalMs > 0 ? (h1 / totalMs) * 100 : 0;
  const p2 = totalMs > 0 ? (h2 / totalMs) * 100 : 0;
  const p3 = totalMs > 0 ? (h3 / totalMs) * 100 : 0;

  // Layer 1's go-out breakpoints. Raw ms measured from t=0 of the master
  // timeline, clamped only to the timeline's own bounds — NOT to Layer 2.
  const clampedFadeStartMs = clamp(outgoingFadeStartMs, 0, TIMELINE_MS);
  const clampedFadeEndMs = clamp(outgoingFadeEndMs, 0, TIMELINE_MS);
  const fadeStartPct =
    totalMs > 0 ? Math.min(100, (clampedFadeStartMs / totalMs) * 100) : 0;
  const fadeEndPctRaw =
    totalMs > 0 ? Math.min(100, (clampedFadeEndMs / totalMs) * 100) : 0;
  const fadeEndPct = Math.max(fadeStartPct + 0.5, fadeEndPctRaw);

  const dropletGrowMs = Math.max(1, incomingGrowMs);
  const dropletTimingFn = BUBBLE_CURVE_TIMING[bubbleCurve];

  const filterId = `wc-tune-filter-${instanceId}`;
  const maskId = `wc-tune-mask-${instanceId}`;
  const activeKeyframesName = `wc-tune-active-${instanceId}`;
  const previousKeyframesName = `wc-tune-previous-${instanceId}`;
  const washKeyframesName = `wc-tune-wash-${instanceId}`;

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
@keyframes wc-tune-playhead-${instanceId} {
  0% { left: 0%; }
  100% { left: ${fmt((totalMs / TIMELINE_MS) * 100)}%; }
}
${effectiveDroplets
  .map(
    (droplet, index) => `
@keyframes wc-tune-droplet-${index}-${instanceId} {
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

  const matchesProduction =
    incomingHoldMs === PRODUCTION_LAYER2.holdMs &&
    incomingFocusMs === PRODUCTION_LAYER2.focusMs &&
    incomingStickMs === PRODUCTION_LAYER2.stickMs;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F3EEE7] px-6 py-7 text-[#324236]">
      <style dangerouslySetInnerHTML={{ __html: dynamicCss }} />

      <Link
        className="fixed left-6 top-6 z-40 inline-flex min-h-11 items-center rounded-[12px] border border-[#d8cbb8] bg-[#FCFBFA]/85 px-4 text-sm font-semibold text-[#324236] shadow-[0_10px_28px_rgba(36,31,24,0.08)] backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#aa7d3a]/50"
        href="/design-system/core-experience/recommendation-loading"
      >
        ← Back to production review
      </Link>

      <div className="mx-auto flex min-h-screen max-w-[1100px] flex-col justify-center gap-6 py-16">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7D5330]">
            Watercolor Bleed — Full Timing Playground
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            Two layers. That&apos;s the whole timeline.
          </h1>
          <p className="mx-auto mt-2 max-w-[70ch] text-sm leading-relaxed text-[#4b5c4c]">
            Layer 1 is the illustration already on screen — it only has a
            go-out window. Layer 2 is the new illustration — it comes in
            through the bubbles, then holds blurred, then pulls into
            focus, then sticks before the cycle repeats. Drag either bar
            on the grid below, or use the exact ms controls underneath.
          </p>
        </header>

        <section className="rounded-[20px] border border-[#d8cbb8] bg-[#FCFBFA]/60 p-5 shadow-[0_10px_28px_rgba(36,31,24,0.06)]">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
            <button
              className="rounded-[10px] bg-[#324236] px-3 py-1.5 font-semibold text-[#FCFBFA] transition"
              onClick={() => setReplayCount((value) => value + 1)}
              type="button"
            >
              ↺ Replay
            </button>
            <button
              className="rounded-[10px] border border-[#d8cbb8] bg-[#FCFBFA]/70 px-3 py-1.5 font-semibold text-[#324236] transition hover:bg-white"
              onClick={() => setPaused((value) => !value)}
              type="button"
            >
              {paused ? "▶ Play" : "⏸ Pause"}
            </button>
            <button
              className="rounded-[10px] border border-[#d8cbb8] bg-[#FCFBFA]/70 px-3 py-1.5 font-semibold text-[#324236] transition hover:bg-white"
              onClick={() => {
                setIncomingHoldMs(PRODUCTION_LAYER2.holdMs);
                setIncomingFocusMs(PRODUCTION_LAYER2.focusMs);
                setIncomingStickMs(PRODUCTION_LAYER2.stickMs);
              }}
              type="button"
            >
              Reset Layer 2&apos;s hold/focus/stick to production (0 / 1000 / 0)
            </button>
          </div>

          <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-[16px] border border-[#ece3d5] bg-[#F3EEE7] py-10">
            <div className="relative aspect-square w-[min(60vw,360px)]">
              {previousStage ? (
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox={`0 0 ${STAGE_SIZE} ${STAGE_SIZE}`}
                >
                  <defs>
                    <filter
                      height="240%"
                      id={filterId}
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
                      height={STAGE_SIZE}
                      id={maskId}
                      maskUnits="userSpaceOnUse"
                      width={STAGE_SIZE}
                      x={0}
                      y={0}
                    >
                      <g filter={`url(#${filterId})`} key={`droplets-${transitionKey}`}>
                        {effectiveDroplets.map((droplet, index) => {
                          const rad = (droplet.angleDeg * Math.PI) / 180;
                          const cx = CENTER + droplet.distancePx * Math.cos(rad);
                          const cy = CENTER + droplet.distancePx * Math.sin(rad);
                          const delayMs =
                            clampedIncomingStartMs +
                            incomingGrowMs * (droplet.delayPct / 100);

                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              fill="#fff"
                              key={droplet.id}
                              r={0}
                              style={{
                                animation: `wc-tune-droplet-${index}-${instanceId} ${dropletGrowMs}ms ${dropletTimingFn} ${delayMs}ms both`,
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
              ) : null}

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

          <p className="mt-4 text-center text-sm font-semibold text-[#7D5330]">
            {activeStage.label}
          </p>

          <div className="mt-4">
            <TimelineEditor
              incomingFocusMs={incomingFocusMs}
              incomingGrowMs={incomingGrowMs}
              incomingHoldMs={incomingHoldMs}
              incomingStartMs={clampedIncomingStartMs}
              incomingStickMs={incomingStickMs}
              instanceId={instanceId}
              outgoingFadeEndMs={clampedFadeEndMs}
              outgoingFadeStartMs={clampedFadeStartMs}
              paused={paused}
              setIncomingFocusMs={setIncomingFocusMs}
              setIncomingGrowMs={setIncomingGrowMs}
              setIncomingHoldMs={setIncomingHoldMs}
              setIncomingStartMs={setIncomingStartMs}
              setIncomingStickMs={setIncomingStickMs}
              setOutgoingFadeEndMs={setOutgoingFadeEndMs}
              setOutgoingFadeStartMs={setOutgoingFadeStartMs}
              totalMs={totalMs}
              transitionKey={transitionKey}
            />
          </div>
        </section>

        <section className="rounded-[16px] border-2 border-[#7d5aa0] bg-[#f6f1fb] p-4">
          <p className="text-sm font-semibold text-[#4b3068]">
            Layer 1 — the current illustration, on screen now
          </p>
          <p className="mt-1 text-xs text-[#5b6b5c]">
            This layer is a given — it&apos;s already fully visible when
            the cycle starts. The only thing you control is how it goes
            out: a start point and an end point in ms, plus how it looks
            while fading. Nothing here is linked to Layer 2 below.
          </p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <SliderRow
              hint="The moment, in ms on the timeline, this layer starts fading out."
              label="Go out — starts at"
              max={TIMELINE_MS}
              min={0}
              onChange={(value) =>
                setOutgoingFadeStartMs(Math.min(value, outgoingFadeEndMs - 50))
              }
              step={50}
              value={outgoingFadeStartMs}
            />
            <SliderRow
              hint="The moment, in ms on the timeline, this layer is fully gone (zero opacity)."
              label="Go out — fully gone at"
              max={TIMELINE_MS}
              min={0}
              onChange={(value) =>
                setOutgoingFadeEndMs(Math.max(value, outgoingFadeStartMs + 50))
              }
              step={50}
              value={outgoingFadeEndMs}
            />
            <SliderRow
              hint="How blurred it gets by the time it's fully faded. 0 keeps it sharp the whole time (just losing opacity); higher softens it as it goes."
              label="Max blur while going out"
              max={20}
              min={0}
              onChange={setOutgoingMaxBlurPx}
              step={1}
              suffix="px"
              value={outgoingMaxBlurPx}
            />
            <SliderRow
              hint="How much colour drains out as it fades. 0 = full colour until gone; 100 = fades to greyscale first."
              label="Max desaturation while going out"
              max={100}
              min={0}
              onChange={setOutgoingMaxDesaturatePct}
              step={5}
              suffix="%"
              value={outgoingMaxDesaturatePct}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["gentle", "linear", "quick"] as const).map((option) => (
              <button
                className={[
                  "rounded-[8px] px-3 py-1.5 text-xs font-semibold transition",
                  outgoingFadeEasing === option
                    ? "bg-[#4b3068] text-[#FCFBFA]"
                    : "border border-[#c9b6e0] bg-white text-[#4b3068] hover:bg-[#f6f1fb]"
                ].join(" ")}
                key={option}
                onClick={() => setOutgoingFadeEasing(option)}
                type="button"
              >
                {OUTGOING_FADE_EASING_LABELS[option]}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[16px] border-2 border-[#3f8a5c] bg-[#eef8f1] p-4">
          <p className="text-sm font-semibold text-[#245536]">
            Layer 2 — the new illustration, coming in
          </p>
          <p className="mt-1 text-xs text-[#5b6b5c]">
            One continuous run, four sequential stages: come in through
            the bubbles, hold blurred, pull into focus, then stick before
            the cycle repeats. &quot;Come in starts at&quot; positions the
            whole run on the timeline; every other number here is a
            duration for one stage of it — they chain, one after another,
            they don&apos;t overlap.
          </p>

          <div className="mt-4 rounded-[12px] border border-[#bfe0cc] bg-white/60 p-3">
            <p className="text-xs font-semibold text-[#245536]">
              1. Come in — the bubbles bleed the new image into view
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <SliderRow
                hint="The moment, in ms on the timeline, this whole run begins — before this, not a single bubble has started growing."
                label="Come in — starts at"
                max={TIMELINE_MS}
                min={0}
                onChange={setIncomingStartMs}
                step={50}
                value={incomingStartMs}
              />
              <SliderRow
                hint="How long each bubble takes to grow — this is the bright-green segment's length on the timeline above."
                label="Come in — duration"
                max={8000}
                min={200}
                onChange={setIncomingGrowMs}
                step={50}
                value={incomingGrowMs}
              />
            </div>
            <div className="mt-3 rounded-[10px] border border-[#bfe0cc] bg-white/70 p-3">
              <p className="text-xs font-semibold text-[#245536]">
                Bubble growth curve
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["ease-in", "linear"] as const).map((option) => (
                  <button
                    className={[
                      "rounded-[8px] px-2.5 py-1 text-[11px] font-semibold transition",
                      bubbleCurve === option
                        ? "bg-[#245536] text-[#FCFBFA]"
                        : "border border-[#bfe0cc] bg-white text-[#245536] hover:bg-[#eef8f1]"
                    ].join(" ")}
                    key={option}
                    onClick={() => setBubbleCurve(option)}
                    type="button"
                  >
                    {option === "ease-in" ? "Ease-in (recommended)" : "Linear"}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-[#5b6b5c]">
                {BUBBLE_CURVE_LABELS[bubbleCurve]}
              </p>
            </div>

            <label className="mt-3 flex cursor-pointer items-start gap-2 rounded-[10px] border border-[#bfe0cc] bg-white/70 p-3">
              <input
                checked={organicRandomize}
                className="mt-0.5"
                onChange={(event) => setOrganicRandomize(event.target.checked)}
                type="checkbox"
              />
              <span>
                <span className="block text-xs font-semibold text-[#245536]">
                  Randomize each cycle (organic)
                </span>
                <span className="block text-[11px] leading-relaxed text-[#5b6b5c]">
                  On: every time the stage advances, each bubble&apos;s
                  angle, distance, radius, and delay gets a fresh small
                  jitter, so the bleed never plays out exactly the same
                  way twice. Off: uses the exact numbers in the table
                  below every time. The table itself never changes — this
                  just wobbles a copy of it each cycle.
                </span>
              </span>
            </label>

            <div className="mt-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#245536]">
                  Bubbles ({droplets.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-[8px] border border-[#bfe0cc] bg-white px-3 py-1.5 text-xs font-semibold text-[#245536] transition hover:bg-[#eef8f1]"
                    onClick={() =>
                      setDroplets((current) => [
                        ...current,
                        {
                          angleDeg: Math.round(Math.random() * 359),
                          delayPct: 3,
                          distancePx: 100,
                          id: nextDropletId(),
                          radiusPx: 200
                        }
                      ])
                    }
                    type="button"
                  >
                    + Add bubble
                  </button>
                  <button
                    className="rounded-[8px] border border-[#bfe0cc] bg-white px-3 py-1.5 text-xs font-semibold text-[#245536] transition hover:bg-[#eef8f1]"
                    onClick={() =>
                      setDroplets((current) =>
                        current.map((d) => ({
                          ...d,
                          angleDeg: Math.round(Math.random() * 359),
                          distancePx: 60 + Math.round(Math.random() * 90)
                        }))
                      )
                    }
                    type="button"
                  >
                    🎲 Randomize angles &amp; distances
                  </button>
                  <button
                    className="rounded-[8px] border border-[#bfe0cc] bg-white px-3 py-1.5 text-xs font-semibold text-[#245536] transition hover:bg-[#eef8f1]"
                    onClick={() => setDroplets(tunedDefaultDroplets())}
                    type="button"
                  >
                    Reset to tuned defaults
                  </button>
                </div>
              </div>
              <DropletTable droplets={droplets} onChange={setDroplets} />
              <p className="mt-2 text-[11px] text-[#5b6b5c]">
                Angle: 0° = right, 90° = down, 180° = left, 270° = up.
                Delay is a % of &quot;Come in — duration&quot; above — 0
                starts the instant come-in starts, 6 means it waits an
                extra 6% of that duration. Manual or randomized layouts
                aren&apos;t guaranteed to fully cover the frame — watch
                the preview for gaps at the corners; if you see one, add a
                bubble, raise a radius, or lower a delay.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[12px] border border-[#d8c9a3] bg-white/60 p-3">
            <p className="text-xs font-semibold text-[#7a6a3e]">
              2. Blurred hold — sits fully revealed but still blurred
            </p>
            <p className="mt-1 text-[11px] text-[#5b6b5c]">
              Once the bubbles finish covering the frame, how long it
              waits here — still blurred — before starting to sharpen.
              Chained right after &quot;Come in&quot; ends; this is the
              tan segment on the timeline above.
            </p>
            <div className="mt-3">
              <SliderRow
                hint="0ms = starts sharpening the instant the bubbles finish. Higher values hold the reveal blurred for a beat first."
                label="Blurred hold — duration"
                max={4000}
                min={0}
                onChange={setIncomingHoldMs}
                step={50}
                value={incomingHoldMs}
              />
            </div>
          </div>

          <div className="mt-4 rounded-[12px] border border-[#e8c08a] bg-white/60 p-3">
            <p className="text-xs font-semibold text-[#96632c]">
              3. Focus pull — blurred to fully sharp
            </p>
            <p className="mt-1 text-[11px] text-[#5b6b5c]">
              Chained right after the blurred hold ends; this is the
              orange segment above.
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <SliderRow
                highlight
                hint="The actual duration of the blur-to-sharp transition."
                label="Focus pull — duration"
                max={4000}
                min={100}
                onChange={setIncomingFocusMs}
                step={50}
                value={incomingFocusMs}
              />
              <div className="rounded-[10px] border border-[#d8cbb8] bg-white/70 p-3">
                <p className="text-xs font-semibold text-[#324236]">Easing</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["ease-out", "linear", "snap"] as const).map((option) => (
                    <button
                      className={[
                        "rounded-[8px] px-2.5 py-1 text-[11px] font-semibold transition",
                        focusEasing === option
                          ? "bg-[#324236] text-[#FCFBFA]"
                          : "border border-[#d8cbb8] bg-white text-[#324236] hover:bg-[#FCFBFA]"
                      ].join(" ")}
                      key={option}
                      onClick={() => setFocusEasing(option)}
                      type="button"
                    >
                      {FOCUS_EASING_LABELS[option]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[12px] border border-[#c9c2d6] bg-white/60 p-3">
            <p className="text-xs font-semibold text-[#4b3f5c]">
              4. Stick — sits fully sharp before the cycle repeats
            </p>
            <p className="mt-1 text-[11px] text-[#5b6b5c]">
              Chained right after focus pull ends; this is the lavender
              segment above. When this runs out, the cycle advances to
              the next illustration and Layer 1/Layer 2 swap roles.
            </p>
            <div className="mt-3">
              <SliderRow
                hint="After focus is reached, how long it sits fully sharp before cutting to the next stage."
                label="Stick — duration"
                max={4000}
                min={0}
                onChange={setIncomingStickMs}
                step={50}
                value={incomingStickMs}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[16px] border border-[#d8cbb8] bg-[#0a0a0a] p-4 font-mono text-xs text-[#ededed]">
          <p className="mb-2 text-[#a1a1a1]">
            Current settings — read these off and tell me the numbers you land on:
          </p>
          <p className="mt-1 text-[#c9b6e0]">Layer 1 (go out):</p>
          <p>outgoingFadeStartMs: {outgoingFadeStartMs}</p>
          <p>outgoingFadeEndMs: {outgoingFadeEndMs}</p>
          <p>outgoingFadeEasing: {outgoingFadeEasing}</p>
          <p>outgoingMaxBlurPx: {outgoingMaxBlurPx}</p>
          <p>outgoingMaxDesaturatePct: {outgoingMaxDesaturatePct}%</p>
          <p className="mt-2 text-[#bfe6cf]">Layer 2 (come in → hold → focus → stick):</p>
          <p>incomingStartMs: {incomingStartMs}</p>
          <p>incomingGrowMs: {incomingGrowMs}</p>
          <p>bubbleCurve: {bubbleCurve}</p>
          <p>organicRandomize: {organicRandomize ? "on" : "off"}</p>
          <p>bubbles: {droplets.length}</p>
          <p>incomingHoldMs: {incomingHoldMs}</p>
          <p>incomingFocusMs: {incomingFocusMs}</p>
          <p>focusEasing: {focusEasing}</p>
          <p>incomingStickMs: {incomingStickMs}</p>
          <p className="mt-2 text-[#d99c56]">totalMs (full loop per stage): {totalMs}</p>
          {matchesProduction ? (
            <p className="mt-2 text-[#7fbf7f]">
              Layer 2&apos;s hold/focus/stick match current production
              exactly. Everything else here — Layer 1&apos;s go-out window
              and Layer 2&apos;s bubble layout — are new controls
              production doesn&apos;t expose yet.
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
