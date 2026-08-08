/**
 * Single source of truth for Diagnosis Card geometry, typography, color, and
 * motion values.
 *
 * The component (components/ui/DiagnosisCard.tsx) and the design-system
 * review page (app/design-system/core-experience/diagnosis-card/page.tsx)
 * both read from this module instead of keeping their own copies of the same
 * numbers. That is what makes the stroke, the border, and the documentation
 * table impossible to drift apart: there is only one radius value per size,
 * one stroke width, one padding value, and everything downstream (CSS custom
 * properties, the SVG stroke's arc geometry, the specs table) is derived
 * from it.
 */

export type DiagnosisCardSize = "mobile" | "tablet" | "desktop";

/**
 * The six real-world breakpoints the design system needs to sign off. They
 * are a review/consumer concern, not a card concern: the card itself only
 * ever renders three structurally distinct layouts (mobile row layout,
 * tablet/desktop column layout at two densities). Tablet Portrait and Tablet
 * Landscape share the "tablet" layout and simply receive a different
 * container width; the same is true for Desktop, Large Desktop, and XL
 * Desktop sharing the "desktop" layout. The card is fluid within each
 * bucket, so it does not need to know which of the two/three real viewports
 * it is currently sitting inside.
 */
export type DiagnosisCardViewport =
  | "mobile"
  | "tablet-portrait"
  | "tablet-landscape"
  | "desktop"
  | "large-desktop"
  | "xl-desktop";

export const diagnosisCardViewports: DiagnosisCardViewport[] = [
  "mobile",
  "tablet-portrait",
  "tablet-landscape",
  "desktop",
  "large-desktop",
  "xl-desktop"
];

export const diagnosisCardViewportLabels: Record<
  DiagnosisCardViewport,
  string
> = {
  desktop: "Desktop",
  "large-desktop": "Large Desktop",
  mobile: "Mobile",
  "tablet-landscape": "Tablet Landscape",
  "tablet-portrait": "Tablet Portrait",
  "xl-desktop": "XL Desktop"
};

/** A representative simulated frame width for each of the six review viewports. */
export const diagnosisCardViewportFrameWidth: Record<
  DiagnosisCardViewport,
  number
> = {
  desktop: 1280,
  "large-desktop": 1440,
  mobile: 394,
  "tablet-landscape": 1024,
  "tablet-portrait": 768,
  "xl-desktop": 1920
};

/**
 * Maps one of the six real viewports down to one of the three layouts the
 * card actually implements. This is the single mapping used everywhere
 * (component default and review pages) so the
 * three-vs-six distinction can never quietly diverge between call sites the
 * way it previously did.
 */
export function resolveDiagnosisCardSize(
  viewport: DiagnosisCardViewport
): DiagnosisCardSize {
  if (viewport === "mobile") {
    return "mobile";
  }

  if (viewport === "tablet-portrait" || viewport === "tablet-landscape") {
    return "tablet";
  }

  return "desktop";
}

type DiagnosisCardGeometry = {
  /** Row (mobile) vs column (tablet/desktop) composition. */
  layout: "row" | "column";
  /** Shared by the card's CSS border-radius and the stroke SVG's arc radius. */
  radius: number;
  /** Shared by the card's CSS border width and the stroke SVG's stroke-width. */
  strokeWidth: number;
  paddingBlock: number;
  paddingInlineStart: number;
  paddingInlineEnd: number;
  gap: number;
  innerGap: number;
  copyGap: number;
  /** Exact target height in px, or "auto" for mobile's content-driven row height. */
  height: number | "auto";
  /** Only meaningful when height is "auto" (mobile). */
  minHeight: number | null;
  /** Reference width used by standalone review slots; product grids own actual card width. */
  targetWidth: number;
  /** Fixed icon box size for the mobile row layout. */
  iconBoxSize: number | null;
  /** The icon is a fixed size in every state — see DiagnosisLeftIcon. */
  iconWidth: number;
  iconHeight: number;
  stateIndicatorSize: number;
  titleFontSize: number;
  titleLetterSpacing: string;
  descriptionFontSize: number;
  descriptionLineHeight: string;
  descriptionLetterSpacing: string;
};

/**
 * These numbers are the original, already-approved mobile/tablet/desktop
 * specs (445.33 / 390 / 370px reference review widths, 252 / 220px fixed
 * heights, existing paddings and gaps). Product grids stretch the card to
 * the available column width; these widths remain useful for standalone card
 * review slots and documentation tables. Only `radius` and `strokeWidth` are
 * new shared values (previously the stroke's radius lived only inside a
 * separate, incorrect SVG shape) — everything else here is a straight
 * transcription of what was already signed off.
 */
export const diagnosisCardGeometry: Record<
  DiagnosisCardSize,
  DiagnosisCardGeometry
> = {
  desktop: {
    copyGap: 8,
    descriptionFontSize: 17,
    descriptionLetterSpacing: "0",
    descriptionLineHeight: "160%",
    gap: 10,
    height: 252,
    iconBoxSize: null,
    iconHeight: 70,
    iconWidth: 72,
    innerGap: 32,
    layout: "column",
    minHeight: null,
    paddingBlock: 16,
    paddingInlineEnd: 32,
    paddingInlineStart: 32,
    radius: 8,
    stateIndicatorSize: 28,
    strokeWidth: 1.5,
    targetWidth: 445.33,
    titleFontSize: 24,
    titleLetterSpacing: "-0.01em"
  },
  mobile: {
    copyGap: 0,
    descriptionFontSize: 13,
    descriptionLetterSpacing: "-0.01em",
    descriptionLineHeight: "150%",
    gap: 10,
    height: "auto",
    iconBoxSize: 50,
    iconHeight: 50,
    iconWidth: 50,
    innerGap: 16,
    layout: "row",
    minHeight: 72,
    paddingBlock: 8,
    paddingInlineEnd: 16,
    paddingInlineStart: 32,
    radius: 16,
    stateIndicatorSize: 20,
    strokeWidth: 1.5,
    targetWidth: 370,
    titleFontSize: 16,
    titleLetterSpacing: "-0.01em"
  },
  tablet: {
    copyGap: 8,
    descriptionFontSize: 14,
    descriptionLetterSpacing: "0",
    descriptionLineHeight: "1.5",
    gap: 10,
    height: 220,
    iconBoxSize: null,
    iconHeight: 70,
    iconWidth: 72,
    innerGap: 24,
    layout: "column",
    minHeight: null,
    paddingBlock: 16,
    paddingInlineEnd: 24,
    paddingInlineStart: 24,
    radius: 8,
    stateIndicatorSize: 28,
    strokeWidth: 1.5,
    targetWidth: 390,
    titleFontSize: 20,
    titleLetterSpacing: "-0.01em"
  }
};

export const diagnosisCardTypography = {
  descriptionColor: "#45413C",
  descriptionFontFamily:
    "Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mobileDescriptionColor: "#5E5A53",
  titleColor: "#062E27",
  titleFontFamily: "Newsreader, Georgia, 'Times New Roman', ui-serif, serif"
};

export const diagnosisCardColor = {
  backgroundDefault: "rgba(252, 251, 249, 0.5)",
  backgroundLifted: "#FCFBF9",
  backgroundMaxSelected: "rgba(252, 251, 249, 0.34)",
  borderDefault: "#E6E2DC",
  borderActive: "#D8C08A",
  /** Disabled / Selection limit reached — a neutral gray, not a faded gold. */
  borderNeutral: "#C9C4BB",
  gradientFrom: "#7D5330",
  gradientTo: "#D99C56",
  hoverShadow:
    "0px 4px 8px -2px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.06)"
};

export const diagnosisCardMotion = {
  circleEnterMs: 260,
  stateTransitionMs: 200,
  /** Duration of the selected-state draw-in flourish, bottom-left -> top-right. */
  strokeDrawMs: 820
};

/**
 * The transient draw-in stroke's width profile: 0 at both corner tips,
 * `peakWidth` at the midpoint of the run. See
 * lib/design-system/diagnosis-card-stroke-path.ts.
 */
export const diagnosisCardSelectedDraw = {
  // Confirmed by direct SVG rendering (not just visual inspection): at 3px
  // this taper is invisible at the card's real rendered size — it only
  // becomes visible zoomed in ~8x. 8px is the smallest value that reads
  // clearly at actual card scale.
  peakWidth: 8
};
