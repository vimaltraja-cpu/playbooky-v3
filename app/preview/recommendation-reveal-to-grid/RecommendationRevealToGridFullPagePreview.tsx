"use client";

import { useEffect, useState } from "react";

import type { ActivityGridViewportMode } from "@/components/product/ActivityGridVisualLayer";
import { RecommendationRevealToGridTransition } from "@/components/product/recommendation-reveal-to-grid/RecommendationRevealToGridTransition";

// Full-viewport, chrome-free test surface. This route fills the real
// browser window and renders the actual reveal -> grid transition at its
// true, real breakpoint size. There is NO transform: scale anywhere here
// -- resizing the window switches between the real mobile / tablet /
// desktop layouts (matching the breakpoints used everywhere else in the
// product), it never shrinks or grows a card.

function getRealViewport(width: number): ActivityGridViewportMode {
  if (width < 768) {
    return "mobile";
  }

  if (width < 1200) {
    return "tablet";
  }

  return "desktop";
}

function useRealViewport() {
  const [viewport, setViewport] = useState<ActivityGridViewportMode>("desktop");

  useEffect(() => {
    function updateViewport() {
      setViewport(getRealViewport(window.innerWidth));
    }

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return viewport;
}

function RestartButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      className="fixed bottom-5 right-5 z-50 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[13px] font-medium text-[#28231d] shadow-[0_10px_24px_rgba(38,31,24,0.16)] backdrop-blur transition hover:bg-white"
      onClick={onReset}
      type="button"
    >
      Restart
    </button>
  );
}

export function RecommendationRevealToGridFullPagePreview() {
  const [resetKey, setResetKey] = useState(0);
  const viewport = useRealViewport();

  return (
    <>
      <RecommendationRevealToGridTransition
        fillViewport
        key={viewport}
        reducedMotion={false}
        resetKey={resetKey}
        slow={false}
        viewport={viewport}
      />

      <RestartButton onReset={() => setResetKey((key) => key + 1)} />
    </>
  );
}
