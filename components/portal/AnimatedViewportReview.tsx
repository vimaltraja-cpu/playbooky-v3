"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

import type { HomepageTextLayoutViewport } from "@/components/product/HomepageTextLayout";

export type AnimatedViewportId =
  | "mobile"
  | "tablet-portrait"
  | "tablet-landscape"
  | "desktop"
  | "large-desktop"
  | "xl-desktop";

export type AnimatedViewportConfig = {
  height: number;
  id: AnimatedViewportId;
  label: string;
  layoutViewport: HomepageTextLayoutViewport;
  width: number;
};

type AnimatedViewportReviewProps = {
  activeViewport: AnimatedViewportConfig;
  activeViewportId: AnimatedViewportId;
  ariaLabel: string;
  canvasClassName?: string;
  onSelectViewport: (viewportId: AnimatedViewportId) => void;
  previewHref: string;
  renderPreview: (viewport: HomepageTextLayoutViewport) => ReactNode;
  tabIdPrefix: string;
  viewports: AnimatedViewportConfig[];
};

const transition =
  "width 520ms cubic-bezier(0.22, 1, 0.36, 1), height 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 520ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 520ms cubic-bezier(0.22, 1, 0.36, 1)";

function getFrameRadius(viewport: AnimatedViewportConfig) {
  if (viewport.id === "mobile") {
    return 28;
  }

  if (viewport.id.startsWith("tablet")) {
    return 18;
  }

  return 10;
}

function getLayoutViewportFromSize(
  width: number,
  height: number
): HomepageTextLayoutViewport {
  if (width < 768) {
    return "mobile";
  }

  if (width < 1200) {
    return width > height ? "tablet-landscape" : "tablet-portrait";
  }

  return "desktop";
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

function useFitScale(width: number, height: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateScale = () => {
      const safeWidth = Math.max(0, element.clientWidth - 32);
      const safeHeight = Math.max(0, element.clientHeight - 32);
      const nextScale = Math.min(
        safeWidth / width,
        safeHeight / height,
        1
      );

      setScale(Number(nextScale.toFixed(3)));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [height, width]);

  return { ref, scale };
}

function getElementScale(element: HTMLElement | null) {
  if (!element) {
    return 1;
  }

  const transform = getComputedStyle(element).transform;

  if (!transform || transform === "none") {
    return 1;
  }

  if ("DOMMatrixReadOnly" in window) {
    return new DOMMatrixReadOnly(transform).a || 1;
  }

  const values = transform.match(/matrix\(([^)]+)\)/)?.[1].split(",");

  return values?.[0] ? Number(values[0]) : 1;
}

function useResponsivePreviewViewport(
  frameRef: React.RefObject<HTMLDivElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
  fallbackViewport: HomepageTextLayoutViewport
) {
  const [previewViewport, setPreviewViewport] = useState(fallbackViewport);

  useEffect(() => {
    const element = frameRef.current;

    if (!element) {
      return;
    }

    const updateViewport = () => {
      const rect = element.getBoundingClientRect();
      const contentScale = getElementScale(contentRef.current);
      const nextViewport = getLayoutViewportFromSize(
        rect.width / contentScale,
        rect.height / contentScale
      );

      setPreviewViewport((currentViewport) =>
        currentViewport === nextViewport ? currentViewport : nextViewport
      );
    };

    let frame = 0;
    const startedAt = performance.now();

    const updateDuringTransition = () => {
      updateViewport();

      if (performance.now() - startedAt < 650) {
        frame = window.requestAnimationFrame(updateDuringTransition);
      } else {
        setPreviewViewport(fallbackViewport);
      }
    };

    updateDuringTransition();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [contentRef, fallbackViewport, frameRef]);

  useEffect(() => {
    setPreviewViewport(fallbackViewport);
  }, [fallbackViewport]);

  return previewViewport;
}

export function AnimatedViewportReview({
  activeViewport,
  activeViewportId,
  ariaLabel,
  canvasClassName = "homepage-text-layout-review-canvas",
  onSelectViewport,
  previewHref,
  renderPreview,
  tabIdPrefix,
  viewports
}: AnimatedViewportReviewProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { ref: canvasRef, scale } = useFitScale(
    activeViewport.width,
    activeViewport.height
  );
  const previewViewport = useResponsivePreviewViewport(
    frameRef,
    contentRef,
    activeViewport.layoutViewport
  );
  const radius = getFrameRadius(activeViewport);
  const frameTransition = reducedMotion
    ? "opacity 140ms cubic-bezier(0.22, 1, 0.36, 1)"
    : transition;
  const preview = useMemo(
    () => renderPreview(previewViewport),
    [previewViewport, renderPreview]
  );
  const displayWidth = activeViewport.width * scale;
  const displayHeight = activeViewport.height * scale;

  return (
    <>
      <div
        aria-label={ariaLabel}
        className="mt-5 flex w-fit max-w-full overflow-x-auto rounded-md border border-white/[0.14] bg-[#0a0a0a] p-1"
        role="tablist"
      >
        {viewports.map((viewport) => {
          const isActive = activeViewportId === viewport.id;

          return (
            <button
              aria-controls={`${tabIdPrefix}-viewport-panel`}
              aria-selected={isActive}
              className={[
                "rounded px-3 py-1.5 text-[13px] font-medium leading-5 transition-colors duration-200 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/70 motion-reduce:transition-none",
                isActive
                  ? "bg-white/[0.08] text-[#ededed]"
                  : "text-[#8f8f8f] hover:bg-white/[0.055] hover:text-[#d4d4d4]"
              ].join(" ")}
              disabled={isActive}
              id={`${tabIdPrefix}-viewport-tab-${viewport.id}`}
              key={viewport.id}
              onClick={() => {
                if (!isActive) {
                  onSelectViewport(viewport.id);
                }
              }}
              role="tab"
              type="button"
            >
              {viewport.label}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`${tabIdPrefix}-viewport-tab-${activeViewport.id}`}
        className="viewport-review-panel mt-5 rounded-[10px] border border-white/[0.14] bg-[#111214]"
        id={`${tabIdPrefix}-viewport-panel`}
        role="tabpanel"
      >
        <div className="min-h-0 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.1] px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-medium leading-5">
            <span className="text-[#ededed]">{activeViewport.label}</span>
            <span className="font-mono text-[#a1a1a1]">
              {activeViewport.width} x {activeViewport.height}
            </span>
            <span className="font-mono text-[#737373]">
              Scale {Math.round(scale * 100)}%
            </span>
          </div>
          <Link
            className="inline-flex h-8 items-center rounded-md border border-white/[0.14] px-3 text-[12px] font-medium leading-5 text-[#ededed] transition-colors duration-200 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/70 motion-reduce:transition-none"
            href={previewHref}
            target="_blank"
          >
            Open full-size preview
          </Link>
        </div>

        <div
          className={`${canvasClassName} viewport-stage min-w-0 overflow-hidden`}
          ref={canvasRef}
        >
          <div
            className="viewport-frame pointer-events-auto border border-white/[0.18] bg-[#FCFBF9]"
            ref={frameRef}
            style={{
              borderRadius: radius,
              boxShadow:
                activeViewport.id === "mobile"
                  ? "0 24px 72px rgba(0,0,0,0.38)"
                  : "0 28px 90px rgba(0,0,0,0.42)",
              height: displayHeight,
              transition: frameTransition,
              width: displayWidth
            }}
          >
            <div
              className="viewport-content"
              ref={contentRef}
              style={{
                height: activeViewport.height,
                transform: `scale(${scale})`,
                transition: frameTransition,
                width: activeViewport.width
              }}
            >
              {preview}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
