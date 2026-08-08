export type ShellMotionVariant = {
  closeDuration: number;
  frostPeak: number;
  geometryCompletion?: number;
  geometryEasing: string;
  id: string;
  label: string;
  maxBackdropBlur: number;
  maxFrostOpacity: number;
  minSaturation: number;
  openDuration: number;
};

export const SHELL_VARIANTS: ShellMotionVariant[] = [
  {
    closeDuration: 650,
    frostPeak: 0.52,
    geometryEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    id: "balanced",
    label: "Balanced Frost",
    maxBackdropBlur: 18,
    maxFrostOpacity: 0.62,
    minSaturation: 0.82,
    openDuration: 900
  },
  {
    closeDuration: 700,
    frostPeak: 0.45,
    geometryCompletion: 0.72,
    geometryEasing: "cubic-bezier(0.2, 0.85, 0.25, 1)",
    id: "lingering",
    label: "Fast Geometry / Lingering Glass",
    maxBackdropBlur: 20,
    maxFrostOpacity: 0.66,
    minSaturation: 0.78,
    openDuration: 950
  },
  {
    closeDuration: 520,
    frostPeak: 0.48,
    geometryEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    id: "restrained",
    label: "Restrained Product",
    maxBackdropBlur: 10,
    maxFrostOpacity: 0.42,
    minSaturation: 0.9,
    openDuration: 720
  }
];

export const DEFAULT_VARIANT_ID = "balanced";

export const APPROVED_PRODUCT_VARIANT =
  SHELL_VARIANTS.find((variant) => variant.id === DEFAULT_VARIANT_ID) ??
  SHELL_VARIANTS[0];
