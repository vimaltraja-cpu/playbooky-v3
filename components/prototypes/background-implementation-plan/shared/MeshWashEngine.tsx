"use client";

import { useEffect, useRef } from "react";

import type { BackgroundConceptProps } from "./types";

export type MeshWashField = {
  color: string;
  x: number;
  y: number;
};

export type MeshWashConfig = {
  blurPx: number;
  coreOpacity: number;
  fields: MeshWashField[];
  grainOpacity: number;
  lineOpacity: number;
  midOpacity: number;
  peakOpacity: number;
  spreadFactor: number;
};

const MUTED_FIELDS: MeshWashField[] = [
  { color: "200,150,86", x: 0.06, y: 0.08 },
  { color: "104,140,110", x: 0.94, y: 0.1 },
  { color: "108,132,158", x: 0.05, y: 0.92 },
  { color: "150,110,140", x: 0.95, y: 0.9 }
];

const VIVID_FIELDS: MeshWashField[] = [
  { color: "232,165,69", x: 0.06, y: 0.08 },
  { color: "79,138,99", x: 0.94, y: 0.1 },
  { color: "79,118,168", x: 0.05, y: 0.92 },
  { color: "160,83,143", x: 0.95, y: 0.9 }
];

export const SPECTRUM_PRESETS: Record<
  "max" | "strong" | "medium" | "light" | "barely",
  MeshWashConfig
> = {
  barely: {
    blurPx: 95,
    coreOpacity: 0,
    fields: MUTED_FIELDS,
    grainOpacity: 0.015,
    lineOpacity: 0.015,
    midOpacity: 0.02,
    peakOpacity: 0.05,
    spreadFactor: 1.2
  },
  light: {
    blurPx: 90,
    coreOpacity: 0,
    fields: MUTED_FIELDS,
    grainOpacity: 0.03,
    lineOpacity: 0.035,
    midOpacity: 0.06,
    peakOpacity: 0.14,
    spreadFactor: 1.1
  },
  max: {
    blurPx: 60,
    coreOpacity: 0.5,
    fields: VIVID_FIELDS,
    grainOpacity: 0.08,
    lineOpacity: 0.12,
    midOpacity: 0.4,
    peakOpacity: 0.65,
    spreadFactor: 0.72
  },
  medium: {
    blurPx: 85,
    coreOpacity: 0,
    fields: MUTED_FIELDS,
    grainOpacity: 0.05,
    lineOpacity: 0.06,
    midOpacity: 0.12,
    peakOpacity: 0.28,
    spreadFactor: 1
  },
  strong: {
    blurPx: 72,
    coreOpacity: 0.25,
    fields: VIVID_FIELDS,
    grainOpacity: 0.06,
    lineOpacity: 0.09,
    midOpacity: 0.22,
    peakOpacity: 0.45,
    spreadFactor: 0.85
  }
};

function buildGrainDataUrl() {
  return (
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E" +
    "%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E" +
    "%3CfeColorMatrix type='matrix' values='0 0 0 0 0.1  0 0 0 0 0.09  0 0 0 0 0.08  0 0 0 0.5 0'/%3E%3C/filter%3E" +
    "%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")"
  );
}

export function MeshWashEngine({
  active,
  config,
  stageRef
}: BackgroundConceptProps & { config: MeshWashConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const pull = { x: 0, y: 0 };
    let pullTarget = { x: 0, y: 0 };
    let raf = 0;

    function fit() {
      if (!canvas || !stage) return;
      const rect = stage.getBoundingClientRect();
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

    function onMouseMove(event: MouseEvent) {
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      pullTarget = { x: px * 22, y: py * 22 };
    }

    function onMouseLeave() {
      pullTarget = { x: 0, y: 0 };
    }

    function draw() {
      const width = canvas!.width / window.devicePixelRatio;
      const height = canvas!.height / window.devicePixelRatio;

      pull.x += (pullTarget.x - pull.x) * (reducedMotion ? 0.01 : 0.03);
      pull.y += (pullTarget.y - pull.y) * (reducedMotion ? 0.01 : 0.03);

      ctx!.clearRect(0, 0, width, height);
      ctx!.filter = `blur(${config.blurPx}px)`;

      const spread = Math.max(width, height) * config.spreadFactor;
      config.fields.forEach((field) => {
        const cx = width * field.x + pull.x;
        const cy = height * field.y + pull.y;
        const gradient = ctx!.createRadialGradient(cx, cy, 0, cx, cy, spread);
        gradient.addColorStop(0, `rgba(${field.color},${config.peakOpacity})`);
        gradient.addColorStop(0.6, `rgba(${field.color},${config.midOpacity})`);
        gradient.addColorStop(1, `rgba(${field.color},0)`);
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, width, height);

        if (config.coreOpacity > 0) {
          const core = ctx!.createRadialGradient(
            cx,
            cy,
            0,
            cx,
            cy,
            spread * 0.35
          );
          core.addColorStop(0, `rgba(${field.color},${config.coreOpacity})`);
          core.addColorStop(1, `rgba(${field.color},0)`);
          ctx!.fillStyle = core;
          ctx!.fillRect(0, 0, width, height);
        }
      });

      ctx!.filter = "none";

      if (config.lineOpacity > 0) {
        ctx!.save();
        ctx!.translate(pull.x * 0.4, pull.y * 0.4);
        ctx!.beginPath();
        ctx!.moveTo(width * 0.08, height * 0.85);
        ctx!.bezierCurveTo(
          width * 0.28,
          height * 0.55,
          width * 0.4,
          height * 0.75,
          width * 0.55,
          height * 0.4
        );
        ctx!.bezierCurveTo(
          width * 0.68,
          height * 0.14,
          width * 0.8,
          height * 0.3,
          width * 0.94,
          height * 0.1
        );
        ctx!.strokeStyle = `rgba(69,65,60,${config.lineOpacity})`;
        ctx!.lineWidth = 1.5;
        ctx!.setLineDash([2, 10]);
        ctx!.stroke();
        ctx!.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    fit();
    window.addEventListener("resize", fit);
    stage.addEventListener("mousemove", onMouseMove);
    stage.addEventListener("mouseleave", onMouseLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", fit);
      stage.removeEventListener("mousemove", onMouseMove);
      stage.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, [active, config, stageRef]);

  return (
    <>
      <canvas aria-hidden="true" ref={canvasRef} />
      {config.grainOpacity > 0 ? (
        <div
          aria-hidden="true"
          style={{
            backgroundImage: buildGrainDataUrl(),
            height: "100%",
            mixBlendMode: "multiply",
            opacity: config.grainOpacity,
            position: "absolute",
            width: "100%"
          }}
        />
      ) : null}
    </>
  );
}
