/**
 * Green-lit product surfaces — approved for product use.
 *
 * Signed-off Composer + Diagnosis live at `/internal/journey`.
 * Recommendation Loading is green-lit and stitched as the loading stage.
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
    id: "composer",
    label: "Homepage Composer",
    productHref: "/internal/journey/composer",
    summary: "Signed-off homepage composer stage in the internal journey."
  },
  {
    id: "diagnosis",
    label: "Diagnosis Questions",
    productHref: "/internal/journey/diagnosis",
    summary: "Signed-off diagnosis stage with Dynamic Diagnosis handoff."
  },
  {
    id: "recommendation-loading",
    label: "Recommendation Loading",
    portalHref: "/design-system/core-experience/recommendation-loading",
    productHref: "/internal/journey/loading",
    summary:
      "Green-lit watercolour analysing sequence with blur handoff into reveal."
  },
  {
    id: "recommendation-reveal",
    label: "Recommendation Reveal",
    portalHref: "/design-system/core-experience/recommendation-loading",
    productHref: "/recommendation-reveal-template",
    summary:
      "Centre-card elastic enter, then fan into the recommended workshop deck."
  }
];

export const internalJourneyHref = "/internal/journey";
