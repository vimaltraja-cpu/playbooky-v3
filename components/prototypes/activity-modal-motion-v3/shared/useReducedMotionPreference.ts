"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the OS-level `prefers-reduced-motion` setting. Prototypes also
 * accept a `previewOverride` so evaluators can see the reduced-motion
 * behaviour without changing their system setting.
 */
export function useSystemReducedMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}
