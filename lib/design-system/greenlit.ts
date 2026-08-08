/**
 * Green-lit product surfaces — approved for product use.
 * Playground tuners may still exist for refinement, but product screens must
 * consume these green-lit implementations (not forked exploration copies).
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

/** Stitched product journey: Composer → Diagnosis → green-lit Recommendation. */
export const productJourneyHref = "/journey";

export const productJourneyStages = [
  { id: "composer", label: "Composer", href: "/journey?stage=composer" },
  { id: "diagnosis", label: "Diagnosis", href: "/journey?stage=diagnosis" },
  {
    id: "recommendation",
    label: "Recommendation",
    href: "/journey?stage=recommendation"
  }
] as const;
