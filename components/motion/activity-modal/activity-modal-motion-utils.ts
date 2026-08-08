import type { ShellMotionVariant } from "./activity-modal-motion-config";

export type Rect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export type FrostState = {
  backdropBlur: number;
  frostOpacity: number;
  frostStrength: number;
  saturation: number;
};

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function mix(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

export function range(
  progress: number,
  inputStart: number,
  inputEnd: number,
  outputStart: number,
  outputEnd: number
) {
  const local = clamp(
    (progress - inputStart) / Math.max(inputEnd - inputStart, 0.0001)
  );

  return mix(outputStart, outputEnd, local);
}

export function rectFromElement(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect();

  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width
  };
}

export function interpolateRect(from: Rect, to: Rect, progress: number): Rect {
  return {
    height: mix(from.height, to.height, progress),
    left: mix(from.left, to.left, progress),
    top: mix(from.top, to.top, progress),
    width: mix(from.width, to.width, progress)
  };
}

export function createCubicBezierSolver(value: string) {
  const match = value.match(
    /cubic-bezier\(([-.\d]+),\s*([-.\d]+),\s*([-.\d]+),\s*([-.\d]+)\)/
  );

  if (!match) {
    return (progress: number) => progress;
  }

  const [, x1, y1, x2, y2] = match.map(Number);

  function sampleCurveX(t: number) {
    return (
      3 * x1 * (1 - t) * (1 - t) * t +
      3 * x2 * (1 - t) * t * t +
      t * t * t
    );
  }

  function sampleCurveY(t: number) {
    return (
      3 * y1 * (1 - t) * (1 - t) * t +
      3 * y2 * (1 - t) * t * t +
      t * t * t
    );
  }

  function sampleDerivativeX(t: number) {
    return (
      3 * x1 * (1 - t) * (1 - t) +
      6 * (x2 - x1) * (1 - t) * t +
      3 * (1 - x2) * t * t
    );
  }

  function solveCurveX(x: number) {
    let t = x;

    for (let index = 0; index < 8; index += 1) {
      const xEstimate = sampleCurveX(t) - x;
      const derivative = sampleDerivativeX(t);

      if (Math.abs(xEstimate) < 0.000001 || Math.abs(derivative) < 0.000001) {
        return t;
      }

      t -= xEstimate / derivative;
    }

    let lower = 0;
    let upper = 1;
    t = x;

    while (lower < upper) {
      const xEstimate = sampleCurveX(t);

      if (Math.abs(xEstimate - x) < 0.000001) {
        return t;
      }

      if (x > xEstimate) {
        lower = t;
      } else {
        upper = t;
      }

      t = (upper + lower) / 2;
    }

    return t;
  }

  return (progress: number) => sampleCurveY(solveCurveX(clamp(progress)));
}

export function getGeometryProgress(
  progress: number,
  variant: ShellMotionVariant
) {
  const normalized = variant.geometryCompletion
    ? range(progress, 0, variant.geometryCompletion, 0, 1)
    : progress;
  const ease = createCubicBezierSolver(variant.geometryEasing);

  return ease(normalized);
}

export function getFrostStrength(
  progress: number,
  variant: ShellMotionVariant
) {
  if (progress <= variant.frostPeak) {
    return range(progress, 0, variant.frostPeak, 0, 1);
  }

  return range(progress, variant.frostPeak, 1, 1, 0);
}

export function getFrostState(
  progress: number,
  variant: ShellMotionVariant
): FrostState {
  const frostStrength = getFrostStrength(progress, variant);

  return {
    backdropBlur: mix(0, variant.maxBackdropBlur, frostStrength),
    frostOpacity: mix(0, variant.maxFrostOpacity, frostStrength),
    frostStrength,
    saturation: mix(1, variant.minSaturation, frostStrength)
  };
}
