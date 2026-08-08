"use client";

import { useEffect, useRef } from "react";

export const fluidBrandWashMeta = {
  motionSpec: [
    {
      duration: "14-20s per loop, staggered so the four never sync",
      easing: "sinusoidal, continuous",
      note: "Four fields in the brand palette (gold, teal, rose, amber) drift and rescale on independent time-based loops, redrawn every frame on canvas. No JavaScript listens for the cursor — this is identical on desktop, tablet and mobile.",
      property: "Base wash drift"
    },
    {
      duration: "n/a (static filter)",
      easing: "n/a",
      note: "Each field is painted through the same feTurbulence + feDisplacementMap technique as the Watercolor Bleed loading transition, so the edges are genuinely irregular and bled rather than clean gradient circles.",
      property: "Watercolor edge texture"
    },
    {
      duration: "continuous while the cursor moves, eased not snapped",
      easing: "lerp toward pointer position",
      note: "The whole wash leans toward the cursor — a clear, felt pull rather than a barely-there nudge, but still eased so it never snaps or spawns anything new. Falls back to the ambient drift with no change in behaviour on touch devices, which never fire mousemove.",
      property: "Cursor influence"
    },
    {
      duration: "n/a, tied to system setting",
      easing: "n/a",
      note: "Runs at 25% speed rather than fully freezing when the OS has Reduce Motion enabled, so it stays present without demanding attention.",
      property: "Reduced motion"
    },
    {
      duration: "n/a (static)",
      easing: "n/a",
      note: "A soft radial lightening centred on the composer area, so the wash never reduces text or the composer border below a safe contrast.",
      property: "Readability clearing"
    }
  ],
  principle:
    "Continuous, gentle motion generated on its own, regardless of input, plus a light touch of cursor awareness on top. Four large fields in the brand palette (--gold, --accent teal, --rose, and the brand-gradient amber — no invented colours) drift and rescale on independent sinusoidal loops, redrawn on canvas every frame. Instead of a plain CSS/canvas blur, each field is filtered through the same feTurbulence + feDisplacementMap technique used by the Watercolor Bleed loading transition elsewhere in the system, so the edges read as bled and organic rather than as clean soft circles. On top of the ambient drift, the whole wash eases a few percent toward the cursor's position, so moving the pointer subtly shifts where the colour sits without ever snapping to it or spawning anything new. A soft lightening sits behind the composer specifically so text and the input stay legible regardless of what's drifting behind them.",
  tagline: "Continuously moving brand-colour wash with a light cursor pull"
};

type Field = {
  baseX: number;
  baseY: number;
  color: string;
  peakOpacity: number;
  phase: number;
  radiusFactor: number;
  speed: number;
};

const FIELDS: Field[] = [
  {
    baseX: 0.14,
    baseY: 0.12,
    color: "217,156,86",
    peakOpacity: 0.34,
    phase: 0,
    radiusFactor: 0.42,
    speed: 0.00036
  },
  {
    baseX: 0.86,
    baseY: 0.18,
    color: "54,92,85",
    peakOpacity: 0.28,
    phase: 2.1,
    radiusFactor: 0.38,
    speed: 0.00028
  },
  {
    baseX: 0.12,
    baseY: 0.86,
    color: "156,91,97",
    peakOpacity: 0.25,
    phase: 4.2,
    radiusFactor: 0.36,
    speed: 0.00032
  },
  {
    baseX: 0.88,
    baseY: 0.84,
    color: "178,139,75",
    peakOpacity: 0.25,
    phase: 1.4,
    radiusFactor: 0.34,
    speed: 0.00024
  }
];

const WATERCOLOR_FILTER_ID = "background-wash-watercolor-filter";

export function FluidBrandWashBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Slowed rather than frozen for prefers-reduced-motion: a canvas wash
    // that paints the same still frame forever is worse than one that just
    // moves gently.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const motionRate = reducedMotion ? 0.25 : 1;

    let raf = 0;
    const pull = { x: 0, y: 0 };
    let pullTarget = { x: 0, y: 0 };

    function onMouseMove(event: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      pullTarget = { x: px, y: py };
    }

    function onMouseLeave() {
      pullTarget = { x: 0, y: 0 };
    }

    function fit() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx?.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0
      );
    }

    function draw(now: number) {
      const width = canvas!.width / window.devicePixelRatio;
      const height = canvas!.height / window.devicePixelRatio;
      const spread = Math.max(width, height);
      const t = now * motionRate;

      pull.x += (pullTarget.x - pull.x) * 0.14;
      pull.y += (pullTarget.y - pull.y) * 0.14;

      ctx!.clearRect(0, 0, width, height);
      ctx!.filter = `url(#${WATERCOLOR_FILTER_ID})`;

      FIELDS.forEach((field) => {
        const driftX = Math.sin(t * field.speed + field.phase) * width * 0.13;
        const driftY =
          Math.cos(t * field.speed * 0.8 + field.phase) * height * 0.11;
        const scale = 1 + Math.sin(t * field.speed * 1.3 + field.phase) * 0.18;
        const cx = width * field.baseX + driftX + pull.x * width * 0.55;
        const cy = height * field.baseY + driftY + pull.y * height * 0.55;
        const radius = spread * field.radiusFactor * scale;

        const gradient = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, `rgba(${field.color},${field.peakOpacity})`);
        gradient.addColorStop(
          0.6,
          `rgba(${field.color},${field.peakOpacity * 0.4})`
        );
        gradient.addColorStop(1, `rgba(${field.color},0)`);
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, width, height);
      });

      ctx!.filter = "none";

      const clearing = ctx!.createRadialGradient(
        width * 0.5,
        height * 0.55,
        0,
        width * 0.5,
        height * 0.55,
        Math.max(width, height) * 0.4
      );
      clearing.addColorStop(0, "rgba(252,251,249,0.6)");
      clearing.addColorStop(1, "rgba(252,251,249,0)");
      ctx!.fillStyle = clearing;
      ctx!.fillRect(0, 0, width, height);

      raf = requestAnimationFrame(draw);
    }

    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <svg aria-hidden="true" height="0" width="0">
        <defs>
          <filter
            height="220%"
            id={WATERCOLOR_FILTER_ID}
            width="220%"
            x="-60%"
            y="-60%"
          >
            <feTurbulence
              baseFrequency="0.008 0.014"
              numOctaves={2}
              result="noise"
              seed={9}
              type="fractalNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              result="distorted"
              scale={60}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur in="distorted" stdDeviation={28} />
          </filter>
        </defs>
      </svg>
      <canvas aria-hidden="true" ref={canvasRef} />
    </>
  );
}
