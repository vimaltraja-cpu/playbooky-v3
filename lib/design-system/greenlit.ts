/**
 * Green-lit product surfaces — approved for product use.
 *
 * IMPORTANT:
 * - Composer + Diagnosis were green-lit on `/internal/journey` on the Mac
 *   workspace. That work was never committed/pushed to GitHub.
 * - Do not invent substitute screens at `/journey`.
 * - When `/internal/journey` lands on this branch, wire Recommendation Loading
 *   into that spine — do not rebuild Composer/Diagnosis.
 */

export type GreenlitSurface = {
  id: string;
  label: string;
  portalHref?: string;
  productHref: string;
  summary: string;
};

export const greenlitSurfaces: GreenlitSurface[] = [
  {
    id: "recommendation-loading",
    label: "Recommendation Loading",
    portalHref: "/design-system/core-experience/recommendation-loading",
    productHref: "/recommendation-loading",
    summary:
      "Watercolour analysing sequence with shared Layer 1/2 motion config and label handoff."
  },
  {
    id: "recommendation-reveal",
    label: "Recommendation Reveal",
    portalHref: "/design-system/core-experience/recommendation-loading",
    productHref: "/recommendation-reveal-template",
    summary:
      "Centre-card elastic enter, then fan into the recommended workshop deck. Linked from loading."
  }
];

/** Signed-off Composer → Diagnosis spine (must come from Mac push). */
export const internalJourneyHref = "/internal/journey";
