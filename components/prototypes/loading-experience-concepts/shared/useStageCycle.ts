"use client";

import { useEffect, useState } from "react";

export function useStageCycle({
  intervalMs,
  paused,
  resetSignal,
  stageCount
}: {
  intervalMs: number;
  paused: boolean;
  resetSignal: number;
  stageCount: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [transitionKey, setTransitionKey] = useState(0);

  // Replay: snap back to the first stage and force a remount of the image
  // layers so the enter animation plays cleanly from the start.
  useEffect(() => {
    setActiveIndex(0);
    setPreviousIndex(null);
    setTransitionKey((key) => key + 1);
  }, [resetSignal]);

  useEffect(() => {
    if (paused) {
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
