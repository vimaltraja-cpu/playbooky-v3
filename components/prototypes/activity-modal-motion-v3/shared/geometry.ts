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

export function scaleDuration(ms: number, speed: "normal" | "slow") {
  return speed === "slow" ? ms * 4 : ms;
}
