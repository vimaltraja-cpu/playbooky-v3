import type { ActivityCardData } from "@/components/ui/ActivityCard";
import type { ActivityDetailModalData } from "@/components/ui/ActivityDetailModal";

export type V3PrototypeCard = {
  id: string;
  label: string;
  activity: ActivityCardData;
  modalData: ActivityDetailModalData;
};

export type PlaybackSpeed = "normal" | "slow";

export type ConceptPhase =
  | "idle"
  | "acknowledge"
  | "soften"
  | "transform"
  | "content-enter"
  | "open"
  | "closing-content"
  | "closing-surface"
  | "restoring";

export type MotionSpecRow = {
  property: string;
  duration: string;
  easing: string;
  note?: string;
};

export type ConceptMeta = {
  id: string;
  name: string;
  tagline: string;
  principle: string;
  sequence: string[];
  specs: MotionSpecRow[];
  strengths: string[];
  risks: string[];
  recommendedUse: string;
};

/**
 * The three V3 concept ids, shared between the consolidated route's server
 * page (for reading the `?concept=` search param) and its client tab
 * switcher. Kept in a plain (non "use client") module so both sides can
 * import it — a Server Component cannot call a function exported from a
 * "use client" file.
 */
export const V3_CONCEPT_IDS = [
  "cohesive-surface",
  "focus-field",
  "threshold-unfold"
] as const;

export type V3ConceptId = (typeof V3_CONCEPT_IDS)[number];

export function isV3ConceptId(value: string): value is V3ConceptId {
  return (V3_CONCEPT_IDS as readonly string[]).includes(value);
}
