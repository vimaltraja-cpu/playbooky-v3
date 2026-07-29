export type Rect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

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
