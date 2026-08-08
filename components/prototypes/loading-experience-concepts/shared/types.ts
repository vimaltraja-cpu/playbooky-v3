export const LOADING_CONCEPT_IDS = [
  "watercolor-bleed",
  "center-bloom",
  "liquid-takeover",
  "aperture-flare"
] as const;

export type LoadingConceptId = (typeof LOADING_CONCEPT_IDS)[number];

export function isLoadingConceptId(value: string): value is LoadingConceptId {
  return (LOADING_CONCEPT_IDS as readonly string[]).includes(value);
}

export type PlaybackSpeed = "normal" | "slow";

export type MotionSpecRow = {
  property: string;
  duration: string;
  easing: string;
  note?: string;
};

export type ConceptMeta = {
  id: LoadingConceptId;
  name: string;
  tagline: string;
  principle: string;
  sequence: string[];
  specs: MotionSpecRow[];
  strengths: string[];
  risks: string[];
  recommendedUse: string;
};
