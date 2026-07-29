export type Rect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

/**
 * Minimum reserved height (px) for the shared "stage" element that wraps the
 * card grid in every V3 concept. The real card set renders 2 rows at
 * 370px/card + a 24px gap (~764px), which already clears this floor — the
 * constant exists as a guard so a future/shorter card set (e.g. a single
 * row) still measures a stage tall enough to hold real
 * `ActivityDetailModal` content without the open-state panel looking
 * cramped. Every concept must derive its open-state width/height/position
 * from `rectFromElement` on this same stage element — never from viewport
 * units or a fixed/centered box.
 */
export const STAGE_MIN_HEIGHT_PX = 640;

export function rectFromElement(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect();

  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width
  };
}

/**
 * Builds a transform-only FLIP string that maps a fixed-size element sitting
 * at `destination` back onto `origin`, so the browser can animate a single
 * `transform` property (GPU-composited) toward `translate(0) scale(1)`
 * instead of tweening left/top/width/height (layout, main-thread, stepped).
 */
export function buildFlipTransform(origin: Rect, destination: Rect) {
  const scaleX = origin.width / destination.width;
  const scaleY = origin.height / destination.height;
  const translateX = origin.left - destination.left;
  const translateY = origin.top - destination.top;

  return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
}

/**
 * Concept 1 (Cohesive Surface) renders `ActivityCard` and
 * `ActivityDetailModal` (`contentOnly`) inside an animated surface that can
 * be any measured size. Both of those components have their own real,
 * fixed-pixel intrinsic size (Tailwind `h-[..]`/`w-[..]` on their root
 * element) that a CSS child selector can't reliably override. Rather than
 * fight that specificity, render each component at its true natural size
 * and scale that fixed-size box up to fill however big the surface
 * currently is — the same "always transform, never width/height" idea
 * `buildFlipTransform` already uses one level up, applied one level deeper.
 */
export const CARD_NATURAL_WIDTH_PX = 256;
export const CARD_NATURAL_HEIGHT_PX = 370;
export const MODAL_CONTENT_NATURAL_WIDTH_PX = 1364;
export const MODAL_CONTENT_NATURAL_HEIGHT_PX = 758;

/**
 * Builds a static `scale()` transform that maps a fixed-size box (`natural`)
 * onto `destination`'s current width/height. This is not part of the FLIP
 * open/close flight itself — the surface that contains this box is the
 * thing whose own transform animates from the origin card's rect to
 * `translate(0) scale(1)`; this inner scale only needs to correctly map the
 * fixed-size real content onto that surface's (constant) destination size,
 * so it can be computed once destination is known and left static.
 */
export function buildFillTransform(
  natural: { height: number; width: number },
  destination: Rect
) {
  const scaleX = destination.width / natural.width;
  const scaleY = destination.height / natural.height;

  return `scale(${scaleX}, ${scaleY})`;
}

export function scaleDuration(ms: number, speed: "normal" | "slow") {
  return speed === "slow" ? ms * 4 : ms;
}
