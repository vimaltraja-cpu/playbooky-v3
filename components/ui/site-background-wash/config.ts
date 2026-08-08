export type WashFieldConfig = {
  baseX: number;
  baseY: number;
  colorHex: string;
  label: string;
  peakOpacity: number;
  phase: number;
  radiusFactor: number;
};

export type WashConfig = {
  clearingOpacity: number;
  cursorEase: number;
  cursorPull: number;
  fields: WashFieldConfig[];
  speed: number;
};

export const WATERCOLOR_FILTER_ID = "background-wash-watercolor-filter";

// The locked-in, brand-approved defaults. These are the values the design
// system ships with — only --gold, --accent (teal), --rose and the
// brand-gradient amber, no invented colours. Speed is a single multiplier
// applied on top of each field's own drift rate so the four never sync.
export const DEFAULT_WASH_CONFIG: WashConfig = {
  clearingOpacity: 0.6,
  cursorEase: 0.14,
  cursorPull: 0.55,
  fields: [
    {
      baseX: 0.14,
      baseY: 0.12,
      colorHex: "#d99c56",
      label: "Brand gradient amber",
      peakOpacity: 0.34,
      phase: 0,
      radiusFactor: 0.42
    },
    {
      baseX: 0.86,
      baseY: 0.18,
      colorHex: "#365c55",
      label: "Accent teal",
      peakOpacity: 0.28,
      phase: 2.1,
      radiusFactor: 0.38
    },
    {
      baseX: 0.12,
      baseY: 0.86,
      colorHex: "#9c5b61",
      label: "Rose",
      peakOpacity: 0.25,
      phase: 4.2,
      radiusFactor: 0.36
    },
    {
      baseX: 0.88,
      baseY: 0.84,
      colorHex: "#b28b4b",
      label: "Gold",
      peakOpacity: 0.25,
      phase: 1.4,
      radiusFactor: 0.34
    }
  ],
  speed: 1
};

export const FIELD_SPEED_BASE = [0.00036, 0.00028, 0.00032, 0.00024];

export function hexToRgbString(hex: string): string {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}
