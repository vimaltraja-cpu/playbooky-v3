"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const DESKTOP_FRAME_WIDTH = 1440;
const DESKTOP_FRAME_HEIGHT = 900;
const MOCKUP_HORIZONTAL_PADDING = 24;

export function ScaledDesktopMockup({
  "aria-label": ariaLabel,
  children
}: {
  "aria-label": string;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.78);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateScale = () => {
      const availableWidth = Math.max(
        0,
        container.clientWidth - MOCKUP_HORIZONTAL_PADDING
      );

      setScale(Math.min(1, availableWidth / DESKTOP_FRAME_WIDTH));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      aria-label={ariaLabel}
      className="w-full overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA] p-3"
      ref={containerRef}
      role="group"
    >
      <div
        className="relative mx-auto"
        style={{
          height: DESKTOP_FRAME_HEIGHT * scale,
          width: DESKTOP_FRAME_WIDTH * scale
        }}
      >
        <div
          className="absolute left-0 top-0 overflow-hidden rounded-[24px] border border-[#E8DFD3] bg-[#F7F2EA] shadow-[0_24px_70px_rgba(36,31,24,0.12)]"
          style={{
            height: DESKTOP_FRAME_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: DESKTOP_FRAME_WIDTH
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export const desktopMockupFrame = {
  height: DESKTOP_FRAME_HEIGHT,
  width: DESKTOP_FRAME_WIDTH
};
