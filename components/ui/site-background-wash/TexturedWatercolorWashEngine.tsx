"use client";

import { useEffect, useRef } from "react";

import {
  hexToRgb,
  mulberry32,
  TEXTURED_WATERCOLOR_FILTER_ID,
  type TexturedWashConfig
} from "./texturedConfig";

type BlobLayout = { dx: number; dy: number; radiusScale: number };
type ShimmerLayout = { phase: number; radius: number; x: number; y: number };
type LineworkLayout = {
  nodes: { x: number; y: number }[];
  phase: number;
};

export function TexturedWatercolorWashEngine({
  config
}: {
  config: TexturedWashConfig;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const motionRate = reducedMotion ? 0.25 : 1;

    let raf = 0;
    const pull = { x: 0, y: 0 };
    let pullTarget = { x: 0, y: 0 };

    // Layout for the cellular sub-blobs, shimmer flecks and constellation
    // linework is generated once per field/size and reused every frame —
    // regenerating it per-frame would make the texture crawl instead of
    // drift.
    let fieldLayouts: BlobLayout[][] = [];
    let shimmerLayout: ShimmerLayout[] = [];
    let lineworkLayout: LineworkLayout[] = [];
    let grainPattern: CanvasPattern | null = null;

    function buildGrainPattern() {
      const grainCanvas = document.createElement("canvas");
      grainCanvas.width = 160;
      grainCanvas.height = 160;
      const gctx = grainCanvas.getContext("2d");
      if (!gctx) return;
      const image = gctx.createImageData(160, 160);
      const rand = mulberry32(7);
      for (let i = 0; i < image.data.length; i += 4) {
        const shade = Math.floor(180 + rand() * 60);
        image.data[i] = shade;
        image.data[i + 1] = shade;
        image.data[i + 2] = shade;
        image.data[i + 3] = Math.floor(rand() * 255);
      }
      gctx.putImageData(image, 0, 0);
      grainPattern = ctx!.createPattern(grainCanvas, "repeat");
    }

    function buildLayout() {
      const cfg = configRef.current;

      fieldLayouts = cfg.fields.map((field, fieldIndex) => {
        const rand = mulberry32(fieldIndex * 97 + 11);
        const blobs: BlobLayout[] = [];
        for (let i = 0; i < field.clusterCount; i++) {
          const angle = rand() * Math.PI * 2;
          const distance = rand() * field.cellularity;
          blobs.push({
            dx: Math.cos(angle) * distance,
            dy: Math.sin(angle) * distance,
            radiusScale: 0.45 + rand() * 0.55
          });
        }
        return blobs;
      });

      const shimmerRand = mulberry32(211);
      shimmerLayout = [];
      cfg.fields.forEach((field, fieldIndex) => {
        for (let i = 0; i < cfg.shimmer.density; i++) {
          const angle = shimmerRand() * Math.PI * 2;
          const distance = shimmerRand() * field.spread * 0.6;
          shimmerLayout.push({
            phase: shimmerRand() * Math.PI * 2 + fieldIndex,
            radius: 1 + shimmerRand() * 2,
            x: field.anchorX + Math.cos(angle) * distance,
            y: field.anchorY + Math.sin(angle) * distance
          });
        }
      });

      const lineRand = mulberry32(509);
      lineworkLayout = [];
      for (let i = 0; i < cfg.linework.density; i++) {
        const baseX = 0.08 + lineRand() * 0.3;
        const baseY = 0.06 + lineRand() * 0.22;
        const nodeCount = 2 + Math.floor(lineRand() * 2);
        const nodes = Array.from({ length: nodeCount }, () => ({
          x: baseX + (lineRand() - 0.5) * 0.18,
          y: baseY + (lineRand() - 0.5) * 0.14
        }));
        lineworkLayout.push({ nodes, phase: lineRand() * Math.PI * 2 });
      }
    }

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
      buildLayout();
    }

    function draw(now: number) {
      const cfg = configRef.current;
      const width = canvas!.width / window.devicePixelRatio;
      const height = canvas!.height / window.devicePixelRatio;
      const spread = Math.max(width, height);
      const t = now * motionRate * cfg.motion.speed;

      pull.x += (pullTarget.x - pull.x) * cfg.motion.cursorEase;
      pull.y += (pullTarget.y - pull.y) * cfg.motion.cursorEase;

      ctx!.clearRect(0, 0, width, height);
      ctx!.filter = `url(#${TEXTURED_WATERCOLOR_FILTER_ID})`;

      cfg.fields.forEach((field, fieldIndex) => {
        const color = hexToRgb(field.colorHex);
        const driftX =
          Math.sin(t * 0.0003 + field.phase) * width * field.driftAmount;
        const driftY =
          Math.cos(t * 0.00024 + field.phase) * height * field.driftAmount;
        const anchorCx =
          width * field.anchorX +
          driftX +
          pull.x * width * cfg.motion.cursorPull;
        const anchorCy =
          height * field.anchorY +
          driftY +
          pull.y * height * cfg.motion.cursorPull;
        const footprint = spread * field.spread;

        (fieldLayouts[fieldIndex] ?? []).forEach((blob) => {
          const cx = anchorCx + blob.dx * footprint;
          const cy = anchorCy + blob.dy * footprint;
          const radius = footprint * 0.4 * blob.radiusScale;
          const gradient = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius);
          gradient.addColorStop(0, `rgba(${color},${field.opacity})`);
          gradient.addColorStop(0.65, `rgba(${color},${field.opacity * 0.35})`);
          gradient.addColorStop(1, `rgba(${color},0)`);
          ctx!.fillStyle = gradient;
          ctx!.fillRect(0, 0, width, height);
        });
      });

      ctx!.filter = "none";

      // Paper grain overlay.
      if (grainPattern && cfg.texture.grain > 0) {
        ctx!.globalAlpha = cfg.texture.grain;
        ctx!.fillStyle = grainPattern;
        ctx!.fillRect(0, 0, width, height);
        ctx!.globalAlpha = 1;
      }

      // Constellation linework — faint lines with small node dots.
      if (cfg.linework.enabled) {
        ctx!.strokeStyle = `rgba(9,77,64,${cfg.linework.opacity})`;
        ctx!.fillStyle = `rgba(9,77,64,${cfg.linework.opacity * 1.4})`;
        ctx!.lineWidth = 1;
        lineworkLayout.forEach((line) => {
          const flicker = 0.7 + 0.3 * Math.sin(t * 0.0006 + line.phase);
          ctx!.globalAlpha = flicker;
          ctx!.beginPath();
          line.nodes.forEach((node, i) => {
            const x = node.x * width;
            const y = node.y * height;
            if (i === 0) ctx!.moveTo(x, y);
            else ctx!.lineTo(x, y);
          });
          ctx!.stroke();
          line.nodes.forEach((node) => {
            ctx!.beginPath();
            ctx!.arc(node.x * width, node.y * height, 1.6, 0, Math.PI * 2);
            ctx!.fill();
          });
          ctx!.globalAlpha = 1;
        });
      }

      // Shimmer flecks — small twinkling highlights within each bloom.
      if (cfg.shimmer.enabled) {
        const shimmerColor = hexToRgb(cfg.shimmer.colorHex);
        shimmerLayout.forEach((point) => {
          const twinkle =
            0.5 + 0.5 * Math.sin(t * 0.001 * cfg.shimmer.speed + point.phase);
          const opacity = twinkle * cfg.shimmer.intensity;
          if (opacity <= 0.01) return;
          ctx!.beginPath();
          ctx!.fillStyle = `rgba(${shimmerColor},${opacity})`;
          ctx!.shadowBlur = 6;
          ctx!.shadowColor = `rgba(${shimmerColor},${opacity})`;
          ctx!.arc(
            point.x * width,
            point.y * height,
            point.radius,
            0,
            Math.PI * 2
          );
          ctx!.fill();
          ctx!.shadowBlur = 0;
        });
      }

      // Readability clearing so the composer/text always sits on a legible
      // patch regardless of what's drifting behind it.
      const clearing = ctx!.createRadialGradient(
        width * 0.5,
        height * 0.55,
        0,
        width * 0.5,
        height * 0.55,
        spread * cfg.fade.clearingRadius
      );
      clearing.addColorStop(0, `rgba(252,251,249,${cfg.fade.clearingOpacity})`);
      clearing.addColorStop(1, "rgba(252,251,249,0)");
      ctx!.fillStyle = clearing;
      ctx!.fillRect(0, 0, width, height);

      raf = requestAnimationFrame(draw);
    }

    buildGrainPattern();
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
            id={TEXTURED_WATERCOLOR_FILTER_ID}
            width="220%"
            x="-60%"
            y="-60%"
          >
            <feTurbulence
              baseFrequency="0.012 0.018"
              numOctaves={3}
              result="noise"
              seed={9}
              type="fractalNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              result="distorted"
              scale={config.texture.edgeTurbulenceScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur
              in="distorted"
              stdDeviation={config.texture.edgeBlur}
            />
          </filter>
        </defs>
      </svg>
      <canvas aria-hidden="true" ref={canvasRef} />
    </>
  );
}
