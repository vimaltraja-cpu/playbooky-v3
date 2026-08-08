"use client";

import type { CSSProperties, Ref } from "react";
import { forwardRef, useId, useRef } from "react";

import {
  diagnosisCardColor,
  diagnosisCardGeometry,
  diagnosisCardMotion,
  diagnosisCardSelectedDraw,
  diagnosisCardTypography,
  resolveDiagnosisCardSize,
  type DiagnosisCardSize,
  type DiagnosisCardViewport
} from "@/lib/design-system/diagnosis-card-tokens";
import { getDiagnosisCardSelectedDrawGeometry } from "@/lib/design-system/diagnosis-card-stroke-path";
import { useElementSize } from "@/lib/design-system/use-element-size";
import {
  diagnosisIcons,
  type DiagnosisIconKey
} from "@/lib/design-system/diagnosis-icons";
import type { DiagnosisQuestion } from "@/lib/design-system/diagnosis-options";

export type { DiagnosisCardSize, DiagnosisCardViewport };

export type DiagnosisCardState =
  | "default"
  | "hover"
  | "selected"
  | "disabled"
  | "selectionLimit";

type DiagnosisCardOption = DiagnosisQuestion["options"][number];

type DiagnosisCardProps = {
  /** @deprecated use `state="disabled"` */
  disabled?: boolean;
  description?: string;
  iconKey?: DiagnosisIconKey;
  label?: string;
  /** @deprecated use `viewport="mobile"` or `size="mobile"` */
  mobile?: boolean;
  onClick?: () => void;
  option?: DiagnosisCardOption;
  /** Forces the reduced-motion presentation regardless of the OS preference. Used by the review page's Motion control. */
  reducedMotion?: boolean;
  selected?: boolean;
  /** Marks the card unavailable because the user already selected the maximum allowed elsewhere. */
  selectionLimitReached?: boolean;
  /**
   * Forces the focus-visible outline on regardless of the browser's own
   * focus-visible heuristic, which does not reliably activate for a
   * programmatic `element.focus()` call. Used by the review page's Focus
   * control so it doesn't depend on that heuristic to show anything.
   */
  showFocusRing?: boolean;
  /** Direct layout override. Takes precedence over `viewport`/`mobile` when provided. */
  size?: DiagnosisCardSize;
  state?: DiagnosisCardState;
  /** One of the six design-system review viewports; resolves to a `size` via resolveDiagnosisCardSize. */
  viewport?: DiagnosisCardViewport;
};

function mergeRefs<T>(
  ...refs: Array<Ref<T> | undefined>
): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}

function DiagnosisLeftIcon({
  iconKey,
  size
}: {
  iconKey: DiagnosisIconKey;
  size: DiagnosisCardSize;
}) {
  const geometry = diagnosisCardGeometry[size];
  const Icon = diagnosisIcons[iconKey];

  // The icon used to shrink (72x70 -> 60.17x58.5) on every non-default
  // state. That resize, combined with the state-indicator ring popping in
  // or out of the layout at the same time, is what produced the "jagged" /
  // "bouncing" jump reported when moving between states on tablet and
  // desktop. The icon now stays a fixed size in every state; see
  // StateIcon below for how the ring's own layout space is now handled.
  return (
    <Icon
      alt=""
      aria-hidden="true"
      className="diagnosis-card-illustration"
      height={geometry.iconHeight}
      width={geometry.iconWidth}
    />
  );
}

/**
 * The top-right ring (desktop/tablet). Always rendered, in every state, so
 * it always occupies the same layout space — previously it was removed
 * from the DOM entirely for "default", so the icon (the ring's flex
 * sibling under `justify-content: space-between`) sat in a different
 * position in "default" than in every other state, producing a visible
 * jump the instant the ring appeared. Its visibility (not its presence) is
 * controlled by CSS keyed off `data-state` instead.
 */
function StateIcon({ state }: { state: DiagnosisCardState }) {
  return (
    <span
      aria-hidden="true"
      className="diagnosis-card-state-indicator diagnosis-card-state-indicator-hover"
    >
      {state === "selected" ? (
        <span className="diagnosis-card-state-indicator-core" />
      ) : null}
    </span>
  );
}

/**
 * The mobile equivalent of the ring above. Previously this returned `null`
 * for "disabled"/"selectionLimit", which freed up the width it had been
 * occupying and reflowed the description text from two lines to one —
 * exactly the mobile text-wrap inconsistency reported. Always rendering it
 * keeps the description column width constant across every state.
 */
function MobileStateIcon({ state }: { state: DiagnosisCardState }) {
  return (
    <span
      aria-hidden="true"
      className="diagnosis-card-mobile-state-indicator"
    >
      {state === "selected" ? (
        <span className="diagnosis-card-state-indicator-core" />
      ) : null}
    </span>
  );
}

/**
 * The selected-state draw-in flourish.
 *
 * This is a transient overlay only: the card's ordinary CSS border (see the
 * `borderColor` logic in the main component) already switches to the gold
 * colour the instant `resolvedState` becomes non-default, and that border
 * already follows the box model exactly — it never had a radius-mismatch
 * problem, because it never had its own separate geometry. What this
 * component adds on top, once, on selection, is a tapered stroke (thin at
 * both corner tips, thick through the middle) that travels from the card's
 * bottom-left corner to its top-right corner along the card's real measured
 * bounds, then fades out — leaving the plain gold border, which was already
 * there underneath the whole time, as the permanent selected look.
 *
 * The reveal is driven by an SVG <mask> containing a plain, uniform-width
 * animated stroke (the same dash-offset technique as before), rather than by
 * redrawing the tapered shape frame by frame — the tapered ribbon itself is
 * a single static, precomputed fill.
 */
function SelectedStroke({
  cardSize,
  gradientId,
  size
}: {
  cardSize: { height: number; width: number };
  gradientId: string;
  size: DiagnosisCardSize;
}) {
  const geometry = diagnosisCardGeometry[size];
  const maskId = `${gradientId}-mask`;
  const drawGeometry = getDiagnosisCardSelectedDrawGeometry(
    cardSize.width,
    cardSize.height,
    geometry.radius,
    geometry.strokeWidth,
    diagnosisCardSelectedDraw.peakWidth
  );

  if (!drawGeometry) {
    // Nothing measured yet (first paint, before ResizeObserver reports a
    // size). Rendering nothing here is preferable to falling back to a
    // fixed desktop shape, which is the bug this component replaces.
    return null;
  }

  return (
    <svg
      aria-hidden="true"
      className="diagnosis-card-selected-stroke"
      fill="none"
      viewBox={`0 0 ${cardSize.width} ${cardSize.height}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="1" y2="0">
          <stop stopColor={diagnosisCardColor.gradientFrom} />
          <stop offset="1" stopColor={diagnosisCardColor.gradientTo} />
        </linearGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <path
            className="diagnosis-card-selected-mask-path"
            d={drawGeometry.maskCenterlinePath}
            fill="none"
            pathLength="1"
            stroke="white"
            strokeLinecap="round"
            strokeWidth={drawGeometry.maskStrokeWidth}
          />
        </mask>
      </defs>
      <path
        className="diagnosis-card-selected-ribbon"
        d={drawGeometry.ribbonPath}
        fill={`url(#${gradientId})`}
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}

export const DiagnosisCard = forwardRef<HTMLButtonElement, DiagnosisCardProps>(
  function DiagnosisCard(
    {
      disabled,
      description = "Bring people into alignment around a shared goal or direction.",
      iconKey = "align-a-team",
      label = "Align a team",
      mobile = false,
      onClick,
      option,
      reducedMotion = false,
      selected,
      selectionLimitReached,
      showFocusRing = false,
      size,
      state = "default",
      viewport
    },
    forwardedRef
  ) {
    const gradientId = useId().replace(/:/g, "");
    const cardRef = useRef<HTMLButtonElement>(null);
    const cardSize = useElementSize(cardRef);

    const resolvedSize: DiagnosisCardSize =
      size ?? (viewport ? resolveDiagnosisCardSize(viewport) : mobile ? "mobile" : "desktop");
    const resolvedState: DiagnosisCardState = disabled
      ? "disabled"
      : selectionLimitReached
        ? "selectionLimit"
        : selected
          ? "selected"
          : state;

    const geometry = diagnosisCardGeometry[resolvedSize];
    const resolvedLabel = option?.label ?? label;
    const resolvedDescription = option?.description ?? description;
    const resolvedIconKey = option?.iconKey ?? iconKey;
    const isSelected = resolvedState === "selected";
    const isUnavailable =
      resolvedState === "disabled" || resolvedState === "selectionLimit";
    const isLifted = resolvedState === "hover" || isSelected;

    // The icon no longer changes size between states, so the top row's
    // height is a constant per size bucket — nothing here depends on
    // `resolvedState` anymore, which is what used to make the row (and the
    // icon inside it) jump on every state change.
    const topRowHeight = geometry.iconBoxSize ?? geometry.iconHeight;

    const cssVariables = {
      "--diagnosis-card-content-opacity": isUnavailable ? 0.64 : 1,
      "--diagnosis-card-copy-gap": `${geometry.copyGap}px`,
      "--diagnosis-card-description-font-size": `${geometry.descriptionFontSize}px`,
      "--diagnosis-card-description-letter-spacing": geometry.descriptionLetterSpacing,
      "--diagnosis-card-description-line-height": geometry.descriptionLineHeight,
      "--diagnosis-card-gap": `${geometry.gap}px`,
      "--diagnosis-card-height":
        geometry.height === "auto" ? "auto" : `${geometry.height}px`,
      "--diagnosis-card-icon-box-size":
        geometry.iconBoxSize != null ? `${geometry.iconBoxSize}px` : "auto",
      "--diagnosis-card-inner-gap": `${geometry.innerGap}px`,
      "--diagnosis-card-min-height":
        geometry.minHeight != null ? `${geometry.minHeight}px` : "0",
      "--diagnosis-card-padding-block": `${geometry.paddingBlock}px`,
      "--diagnosis-card-padding-inline-end": `${geometry.paddingInlineEnd}px`,
      "--diagnosis-card-padding-inline-start": `${geometry.paddingInlineStart}px`,
      "--diagnosis-card-radius": `${geometry.radius}px`,
      "--diagnosis-card-state-indicator-size": `${geometry.stateIndicatorSize}px`,
      "--diagnosis-card-stroke-draw-duration": `${diagnosisCardMotion.strokeDrawMs}ms`,
      "--diagnosis-card-stroke-width": `${geometry.strokeWidth}px`,
      "--diagnosis-card-title-font-size": `${geometry.titleFontSize}px`,
      "--diagnosis-card-title-letter-spacing": geometry.titleLetterSpacing,
      "--diagnosis-card-top-row-height": `${topRowHeight}px`,
      "--diagnosis-card-transition-duration": `${diagnosisCardMotion.stateTransitionMs}ms`,
      "--diagnosis-card-width": "100%",
      background: isUnavailable
        ? diagnosisCardColor.backgroundMaxSelected
        : isLifted
          ? diagnosisCardColor.backgroundLifted
          : diagnosisCardColor.backgroundDefault,
      borderColor: isUnavailable
        ? diagnosisCardColor.borderNeutral
        : resolvedState === "default"
          ? diagnosisCardColor.borderDefault
          : diagnosisCardColor.borderActive,
      boxShadow: isLifted ? diagnosisCardColor.hoverShadow : "none",
      transitionDuration: `${diagnosisCardMotion.stateTransitionMs}ms`
    } as CSSProperties;

    return (
      <button
        aria-disabled={isUnavailable}
        aria-label={`Diagnosis card: ${resolvedLabel}`}
        aria-pressed={isSelected}
        className="diagnosis-card-prototype"
        data-force-focus={showFocusRing ? "true" : undefined}
        data-layout={geometry.layout}
        data-motion={reducedMotion ? "reduced" : "normal"}
        data-size={resolvedSize}
        data-state={resolvedState}
        data-viewport={viewport ?? resolvedSize}
        onClick={onClick}
        ref={mergeRefs(cardRef, forwardedRef)}
        style={cssVariables}
        type="button"
      >
        {isSelected ? (
          <SelectedStroke
            cardSize={cardSize}
            gradientId={gradientId}
            size={resolvedSize}
          />
        ) : null}
        <div className="diagnosis-card-inner">
          <div className="diagnosis-card-top-row">
            <DiagnosisLeftIcon iconKey={resolvedIconKey} size={resolvedSize} />
            <StateIcon state={resolvedState} />
          </div>

          <div className="diagnosis-card-copy">
            <h3
              className="diagnosis-card-title"
              style={{
                color: diagnosisCardTypography.titleColor,
                fontFamily: diagnosisCardTypography.titleFontFamily
              }}
            >
              {resolvedLabel}
            </h3>
            <p
              className="diagnosis-card-description"
              style={{
                color:
                  resolvedSize === "mobile"
                    ? diagnosisCardTypography.mobileDescriptionColor
                    : diagnosisCardTypography.descriptionColor,
                fontFamily: diagnosisCardTypography.descriptionFontFamily
              }}
            >
              {resolvedDescription}
            </p>
          </div>
        </div>
        <MobileStateIcon state={resolvedState} />
      </button>
    );
  }
);
