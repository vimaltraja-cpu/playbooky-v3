"use client";

// The locked-in, production background wash. Drop <SiteBackgroundWash />
// once near the top of any real product page (composer, diagnosis,
// recommendation, card review, activity grid, etc.) and it fills the
// viewport behind that page's content — no wrapper markup required.
//
// Do not use on the Facilitator Guide page — that page is intentionally
// excluded from the fluid wash treatment.
//
// Tuned live on /background-implementation-plan using the colour, opacity
// and speed dials there. If you want to retune it, adjust
// DEFAULT_WASH_CONFIG in ./site-background-wash/config.ts (or copy a config
// exported from the playground) rather than editing this file.

import { DEFAULT_WASH_CONFIG } from "./site-background-wash/config";
import { SiteBackgroundWashEngine } from "./site-background-wash/SiteBackgroundWashEngine";

import "./site-background-wash/site-background-wash.css";

export function SiteBackgroundWash() {
  return (
    <div aria-hidden="true" className="site-background-wash">
      <SiteBackgroundWashEngine config={DEFAULT_WASH_CONFIG} />
    </div>
  );
}
