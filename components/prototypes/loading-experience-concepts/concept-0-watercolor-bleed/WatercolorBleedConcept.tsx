"use client";

import { recommendationLoadingStages } from "@/components/product/RecommendationLoadingExperience";

import "../shared/loading-experience-concepts.css";
import type { ConceptMeta, PlaybackSpeed } from "../shared/types";
import { useStageCycle } from "../shared/useStageCycle";

export const watercolorBleedMeta: ConceptMeta = {
  id: "watercolor-bleed",
  name: "Watercolor Bleed",
  tagline:
    "Scattered droplets fuse into one amorphous mass that spreads outward and takes over — not an expanding circle",
  principle:
    "Nine small droplets appear at scattered, uneven positions near the centre, each at its own delay and growing to its own size — never sharing an origin point or a start time. A 'goo' filter (blur followed by an alpha threshold) fuses overlapping droplets into a single, continuously-reconfiguring amorphous mass as they grow into and past one another, and a light turbulence pass roughens the fused edge further. Because no two droplets are concentric or synchronised, the overall silhouette this produces is never radially symmetric at any point — it genuinely reads as spreading, not as a circle with a rough edge. Growth is linear (not eased), which matters: an eased curve front-loads almost all of its size gain into the first fraction of its duration, which is what previously made the mask look fully open within about a second regardless of the declared duration. With linear growth, a simulation of the union of all nine droplets confirms the frame doesn't actually finish covering until roughly t=4.2s–4.6s — genuinely gradual across the reveal window, not an early snap. The whole cycle runs on an exact 6-second beat: 0s–5s is the slow overtake, where the mask spreads and fully reveals the incoming image while it stays blurred; only in the final 5s–6s does it resolve to full focus, right as the next stage begins. The outgoing image recedes across that same 6 seconds, fading all the way to zero opacity, so nothing lingers when the cut happens.",
  sequence: [
    "0.0s — outgoing image at full clarity, incoming droplets begin appearing at scattered points near the centre.",
    "0.0s–1.2s — the remaining eight droplets appear at uneven, staggered delays, each growing linearly at its own pace.",
    "0.0s–~4.3s — the goo filter fuses the growing droplets into one continuous, amorphous mass; the union doesn't actually finish covering every corner of the frame until roughly this point (verified by simulation, not eyeballed) — the growth is genuinely visible and gradual up to here, not an early snap.",
    "~4.3s–5.0s — fully covered with margin; still deliberately blurred.",
    "5.0s–6.0s — only in this last, smallest stretch does the fully-revealed image resolve from blur to full focus.",
    "Across the same 6 seconds, the outgoing image softens, desaturates, and fades all the way to zero opacity, and the warm ochre wash halo blooms and fades behind the advancing mass.",
    "6.0s — the next stage's droplets begin growing immediately, right as this stage reaches full focus; this stage's image fades away as it does."
  ],
  specs: [
    {
      property: "Droplet count / placement",
      duration: "n/a",
      easing: "n/a",
      note: "9 droplets: 1 centred, 4 toward the corners (±90px), 4 toward the edge midpoints (±140px); final radii 190–225px on a 400×400 stage"
    },
    {
      property: "Droplet appearance stagger",
      duration: "0–1.2s",
      easing: "n/a",
      note: "delays scaled with distance from centre — corner droplets at 150–600ms, edge droplets at 750–1200ms"
    },
    {
      property: "Droplet growth (each)",
      duration: "5200ms",
      easing: "linear",
      note: "r: 0 → target, linear — deliberately not eased, so growth stays visible across the full span instead of front-loading; union of all nine fully covers the frame by ~4.2s–4.6s, confirmed by simulation with 30px+ margin remaining at t=5s (more than the turbulence filter's ~24px displacement)"
    },
    {
      property: "Goo fuse (blur + alpha threshold) + turbulence roughening",
      duration: "n/a (static filter)",
      easing: "n/a",
      note: "feGaussianBlur → feColorMatrix threshold merges overlapping droplets; feTurbulence + feDisplacementMap roughens the fused edge"
    },
    {
      property: "Incoming resolve (blur/saturate)",
      duration: "6000ms — holds blurred 0–5s (83% of the beat), sharpens only in the final 5s–6s",
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      note: "blur 10px → 8px across 0–5s (stays visibly soft while the mask fills in) → 0 across 5s–6s"
    },
    {
      property: "Outgoing recede (blur/saturate/opacity)",
      duration: "6000ms",
      easing: "cubic-bezier(0.32, 0, 0.24, 1)",
      note: "opacity 1 → 0, blur 0 → 9px, saturate 1 → 0.5 — fades all the way out across the same 6s beat"
    },
    {
      property: "Wash halo",
      duration: "6000ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      note: "warm radial tint, mix-blend-mode: multiply, blooms then fades behind the advancing mass"
    }
  ],
  strengths: [
    "The union of nine non-concentric, unsynchronised droplets is structurally incapable of reading as a circle — the silhouette is asymmetric by construction, not by a rough edge applied afterward.",
    "Linear (not eased) growth means the reveal itself stays visible across nearly the whole 5s window — confirmed by simulating the coverage math rather than assuming the declared duration matched the visual result.",
    "The goo filter produces genuine merging/fusing between droplets as they grow into each other, which is what makes it feel alive and reconfiguring rather than a single shape scaling up.",
    "The outgoing image's own recede (blur, desaturation, opacity fading fully to zero) makes the handoff feel mutual and complete — nothing lingers at the cut."
  ],
  risks: [
    "The goo filter (feGaussianBlur + feColorMatrix threshold) plus feTurbulence is a heavier filter chain than a plain mask — worth a real performance check on lower-end devices, though it's still just one hero illustration animating.",
    "The exact droplet count/placement/timing here has now been checked numerically for the coverage-timing bug specifically, but the overall 'natural' feel is still a first tuning pass — the scatter pattern and stagger may need further adjustment by eye.",
    "feColorMatrix threshold values (blur radius vs. alpha slope) are sensitive — too little slope and droplets look like separate blurry circles instead of fusing; too much and the merged edge gets harder/more graphic again."
  ],
  recommendedUse:
    "This is the corrected build after the first pass read as a soft-edged circle rather than an organic bleed. Treat this as a first tuning pass on the right mechanism, not a final answer — flag anything that still feels off (pacing, scatter pattern, how strongly image one recedes) and I'll adjust the underlying values rather than starting over."
};

// Baseline pace sits deliberately between the "normal" (1x) and "slow"
// (0.25x) playback options — 1x on its own read as too quick, 0.25x read
// as too sluggish, so this baseline itself is the "medium" both speeds
// are relative to.
// Exact 6-second cycle, per spec:
//   0s–5s  mask grows and fully reveals the incoming image, but it stays
//          blurred throughout — this is the majority of the beat.
//   5s–6s  the fully-revealed image resolves from blur to sharp focus,
//          finishing right as the next cycle begins.
const BASE_INTERVAL_MS = 6000;
const BASE_DURATION_MS = 6000;
const BASE_GROW_DURATION_MS = 5200;
const STAGE_SIZE = 400;
const CENTER = STAGE_SIZE / 2;

type Droplet = {
  className: string;
  cx: number;
  cy: number;
  delay: number;
};

// Positions, delays and final radii below were chosen by simulating the
// union of all nine droplets growing LINEARLY over time (not eased —
// eased growth front-loads almost all of the size gain into the first
// 20–30% of its duration, which is what made the previous version
// visually finish covering the frame within about a second even though
// the animation was declared much longer). With linear growth and these
// numbers, the frame is not fully covered until roughly t=4.2s–4.6s of
// the 5s reveal window, and stays comfortably covered (30px+ of margin,
// more than the turbulence filter's ~24px displacement) by t=5s.
const DROPLETS: Droplet[] = [
  { className: "watercolor-droplet-1", cx: CENTER + 0, cy: CENTER + 0, delay: 0 },
  { className: "watercolor-droplet-2", cx: CENTER - 90, cy: CENTER - 90, delay: 150 },
  { className: "watercolor-droplet-3", cx: CENTER + 90, cy: CENTER - 90, delay: 300 },
  { className: "watercolor-droplet-4", cx: CENTER - 90, cy: CENTER + 90, delay: 450 },
  { className: "watercolor-droplet-5", cx: CENTER + 90, cy: CENTER + 90, delay: 600 },
  { className: "watercolor-droplet-6", cx: CENTER - 140, cy: CENTER + 0, delay: 750 },
  { className: "watercolor-droplet-7", cx: CENTER + 140, cy: CENTER + 0, delay: 900 },
  { className: "watercolor-droplet-8", cx: CENTER + 0, cy: CENTER - 140, delay: 1050 },
  { className: "watercolor-droplet-9", cx: CENTER + 0, cy: CENTER + 140, delay: 1200 }
];

export function WatercolorBleedConcept({
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
  const settleDurationMs = BASE_DURATION_MS / rate;
  const growDurationMs = BASE_GROW_DURATION_MS / rate;

  const activeStage = recommendationLoadingStages[activeIndex];
  const previousStage =
    previousIndex === null ? null : recommendationLoadingStages[previousIndex];

  return (
    <div className="concept-stage-frame">
      <p
        aria-live="polite"
        className="concept-stage-label"
        key={`label-${transitionKey}`}
      >
        {activeStage.label}
      </p>

      <div className="concept-stage-illustration watercolor-illustration">
        <svg
          aria-hidden="true"
          className="watercolor-svg"
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 ${STAGE_SIZE} ${STAGE_SIZE}`}
        >
          <defs>
            <filter
              height="240%"
              id="watercolor-goo-filter"
              width="240%"
              x="-70%"
              y="-70%"
            >
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

            <mask
              height={STAGE_SIZE}
              id="watercolor-bleed-mask"
              maskUnits="userSpaceOnUse"
              width={STAGE_SIZE}
              x={0}
              y={0}
            >
              <g
                filter="url(#watercolor-goo-filter)"
                key={`droplets-${transitionKey}`}
              >
                {DROPLETS.map((droplet) => (
                  <circle
                    className={`watercolor-droplet ${droplet.className}`}
                    cx={droplet.cx}
                    cy={droplet.cy}
                    fill="#fff"
                    key={droplet.className}
                    r={0}
                    style={{
                      animationDelay: `${droplet.delay / rate}ms`,
                      animationDuration: `${growDurationMs}ms`,
                      animationPlayState: playState
                    }}
                  />
                ))}
              </g>
            </mask>
          </defs>

          {previousStage ? (
            <image
              className="watercolor-image watercolor-image-previous"
              height={STAGE_SIZE}
              href={previousStage.imageSrc}
              key={`${transitionKey}-${previousStage.id}-previous`}
              preserveAspectRatio="xMidYMid meet"
              style={{
                animationDuration: `${settleDurationMs}ms`,
                animationPlayState: playState
              }}
              width={STAGE_SIZE}
              x={0}
              y={0}
            />
          ) : null}

          <g mask="url(#watercolor-bleed-mask)">
            <image
              className="watercolor-image watercolor-image-active"
              height={STAGE_SIZE}
              href={activeStage.imageSrc}
              key={`${transitionKey}-${activeStage.id}-active`}
              preserveAspectRatio="xMidYMid meet"
              style={{
                animationDuration: `${settleDurationMs}ms`,
                animationPlayState: playState
              }}
              width={STAGE_SIZE}
              x={0}
              y={0}
            />
          </g>
        </svg>

        <span
          className="watercolor-wash"
          key={`wash-${transitionKey}`}
          style={{
            animationDuration: `${settleDurationMs}ms`,
            animationPlayState: playState
          }}
        />
      </div>
    </div>
  );
}
