"use client";

import { useEffect, useState } from "react";

import { SiteBackgroundWash } from "@/components/ui/SiteBackgroundWash";

/**
 * Keeps the fluid wash on the composer hero only.
 * Fades out as the first viewport scrolls away so marketing sits on a quiet surface.
 */
export function HomepageComposerWash() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const update = () => {
      const main = document.querySelector(".homepage-text-layout__main");
      if (!(main instanceof HTMLElement)) {
        setOpacity(1);
        return;
      }

      const rect = main.getBoundingClientRect();
      const fadeStart = window.innerHeight * 0.85;
      const fadeEnd = window.innerHeight * 0.2;
      const range = Math.max(fadeStart - fadeEnd, 1);
      const next = Math.min(1, Math.max(0, (rect.bottom - fadeEnd) / range));
      setOpacity(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="homepage-composer-layout__wash-layer"
      style={{ opacity }}
    >
      <SiteBackgroundWash />
    </div>
  );
}
