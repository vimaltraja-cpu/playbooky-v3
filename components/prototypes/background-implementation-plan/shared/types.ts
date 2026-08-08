import type { RefObject } from "react";

export const BACKGROUND_CONCEPT_IDS = [
  "spectrum-max",
  "spectrum-strong",
  "spectrum-medium",
  "spectrum-light",
  "spectrum-barely"
] as const;

export type BackgroundConceptId = (typeof BACKGROUND_CONCEPT_IDS)[number];

export function isBackgroundConceptId(
  value: string
): value is BackgroundConceptId {
  return (BACKGROUND_CONCEPT_IDS as readonly string[]).includes(value);
}

export type BackgroundConceptMeta = {
  id: BackgroundConceptId;
  name: string;
  principle: string;
  recommendedUse: string;
  risks: string[];
  strengths: string[];
  tagline: string;
};

export type BackgroundConceptProps = {
  active: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
};
