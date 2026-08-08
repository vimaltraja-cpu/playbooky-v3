// Config for the "textured watercolor" direction — corner-anchored,
// cellular/blotchy blooms with paper grain, shimmer flecks and faint
// constellation linework, referencing the illustrated paper-texture mood
// board rather than the earlier smooth four-field wash.

export type TexturedField = {
  anchorX: number;
  anchorY: number;
  cellularity: number;
  clusterCount: number;
  colorHex: string;
  driftAmount: number;
  id: string;
  label: string;
  opacity: number;
  phase: number;
  spread: number;
};

export type TexturedWashConfig = {
  fade: {
    clearingOpacity: number;
    clearingRadius: number;
  };
  fields: TexturedField[];
  linework: {
    density: number;
    enabled: boolean;
    opacity: number;
  };
  motion: {
    cursorEase: number;
    cursorPull: number;
    speed: number;
  };
  shimmer: {
    colorHex: string;
    density: number;
    enabled: boolean;
    intensity: number;
    speed: number;
  };
  texture: {
    edgeBlur: number;
    edgeTurbulenceScale: number;
    grain: number;
  };
};

export const TEXTURED_WATERCOLOR_FILTER_ID = "textured-watercolor-wash-filter";

export const DEFAULT_TEXTURED_WASH_CONFIG: TexturedWashConfig = {
  fade: {
    clearingOpacity: 0.55,
    clearingRadius: 0.42
  },
  fields: [
    {
      anchorX: 0.92,
      anchorY: 0.08,
      cellularity: 0.6,
      clusterCount: 16,
      colorHex: "#365c55",
      driftAmount: 0.09,
      id: "top-right",
      label: "Top-right bloom (teal)",
      opacity: 0.32,
      phase: 1.1,
      spread: 0.46
    },
    {
      anchorX: 0.04,
      anchorY: 0.96,
      cellularity: 0.7,
      clusterCount: 20,
      colorHex: "#9c5b61",
      driftAmount: 0.08,
      id: "bottom-left",
      label: "Bottom-left bloom (rose)",
      opacity: 0.3,
      phase: 3.4,
      spread: 0.5
    },
    {
      anchorX: 0.96,
      anchorY: 0.94,
      cellularity: 0.55,
      clusterCount: 12,
      colorHex: "#b28b4b",
      driftAmount: 0.07,
      id: "bottom-right",
      label: "Bottom-right bloom (gold)",
      opacity: 0.26,
      phase: 5.2,
      spread: 0.34
    }
  ],
  linework: {
    density: 5,
    enabled: true,
    opacity: 0.1
  },
  motion: {
    cursorEase: 0.14,
    cursorPull: 0.4,
    speed: 1
  },
  shimmer: {
    colorHex: "#d99c56",
    density: 10,
    enabled: true,
    intensity: 0.5,
    speed: 1
  },
  texture: {
    edgeBlur: 30,
    edgeTurbulenceScale: 70,
    grain: 0.05
  }
};

export function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

// Small deterministic PRNG so bloom sub-blob / shimmer / linework layout is
// stable between renders of the same seed instead of jumping every resize.
export function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
