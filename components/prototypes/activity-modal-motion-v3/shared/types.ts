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
