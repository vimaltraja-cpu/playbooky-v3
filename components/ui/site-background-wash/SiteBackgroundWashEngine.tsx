"use client";

import { useEffect, useRef } from "react";

import {
  FIELD_SPEED_BASE,
  hexToRgbString,
  WATERCOLOR_FILTER_ID,
  type WashConfig
} from "./config";

export function SiteBackgroundWashEngine({ config }: { config: WashConfig }) {
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
      const cfg = configRef.current;
      const width = canvas!.width / window.devicePixelRatio;
      const height = canvas!.height / window.devicePixelRatio;
      const spread = Math.max(width, height);
      const t = now * motionRate * cfg.speed;

      pull.x += (pullTarget.x - pull.x) * cfg.cursorEase;
      pull.y += (pullTarget.y - pull.y) * cfg.cursorEase;

      ctx!.clearRect(0, 0, width, height);
      ctx!.filter = `url(#${WATERCOLOR_FILTER_ID})`;

      cfg.fields.forEach((field, index) => {
        const speed = FIELD_SPEED_BASE[index] ?? FIELD_SPEED_BASE[0];
        const color = hexToRgbString(field.colorHex);
        const driftX = Math.sin(t * speed + field.phase) * width * 0.13;
        const driftY = Math.cos(t * speed * 0.8 + field.phase) * height * 0.11;
        const scale = 1 + Math.sin(t * speed * 1.3 + field.phase) * 0.18;
        const cx =
          width * field.baseX + driftX + pull.x * width * cfg.cursorPull;
        const cy =
          height * field.baseY + driftY + pull.y * height * cfg.cursorPull;
        const radius = spread * field.radiusFactor * scale;

        const gradient = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, `rgba(${color},${field.peakOpacity})`);
        gradient.addColorStop(0.6, `rgba(${color},${field.peakOpacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${color},0)`);
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
      clearing.addColorStop(0, `rgba(252,251,249,${cfg.clearingOpacity})`);
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
