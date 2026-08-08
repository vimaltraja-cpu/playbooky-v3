/**
 * Geometry for the Diagnosis Card's selected-state draw-in animation.
 *
 * The permanent "selected" look is just the card's ordinary CSS border
 * switched to the gold colour (see components/ui/DiagnosisCard.tsx /
 * diagnosisCardColor.borderActive) — that border already follows the real
 * box model exactly, so it never has a radius-mismatch problem on its own.
 *
 * What lives here is only the transient flourish that plays once, on
 * selection: a single tapered stroke (thin at both corner tips, thick
 * through the middle — the "water-dropper" width profile) that travels
 * from the card's bottom-left corner to its top-right corner along the
 * card's real measured bounds, then disappears, leaving the plain gold
 * border already underneath it. Every coordinate below comes from the
 * card's actual pixel width/height and the shared radius/border-width
 * tokens — never a fixed, desktop-authored shape.
 */

type Point = { x: number; y: number };

export type DiagnosisCardSelectedDrawGeometry = {
  /** Plain, uniform-width path along the same route, used only as an animated reveal mask. */
  maskCenterlinePath: string;
  /** Width of the mask stroke — wide enough to always fully cover the tapered ribbon. */
  maskStrokeWidth: number;
  /** The filled, variable-width ribbon shape that the mask reveals. */
  ribbonPath: string;
};

type ArcSegment = {
  center: Point;
  fromDeg: number;
  radius: number;
  toDeg: number;
  type: "arc";
};

type LineSegment = {
  from: Point;
  to: Point;
  type: "line";
};

type RouteSegment = ArcSegment | LineSegment;

function pointOnArc(center: Point, radius: number, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y + radius * Math.sin(radians)
  };
}

function sampleRoute(
  segments: RouteSegment[],
  samplesPerArc: number
): Point[] {
  const points: Point[] = [];

  for (const segment of segments) {
    if (segment.type === "line") {
      if (points.length === 0) {
        points.push(segment.from);
      }
      points.push(segment.to);
      continue;
    }

    const { center, fromDeg, radius, toDeg } = segment;
    const startIndex = points.length === 0 ? 0 : 1;

    for (let i = startIndex; i <= samplesPerArc; i += 1) {
      const t = i / samplesPerArc;
      const degrees = fromDeg + (toDeg - fromDeg) * t;
      points.push(pointOnArc(center, radius, degrees));
    }
  }

  return points;
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * Builds the bottom-left -> bottom edge -> bottom-right corner -> right
 * edge -> top-right corner route both the mask stroke and the tapered
 * ribbon travel along.
 */
function buildRoute(
  width: number,
  height: number,
  radius: number,
  inset: number
) {
  const r = Math.max(
    0,
    Math.min(radius - inset, width / 2 - inset, height / 2 - inset)
  );
  const x0 = inset;
  const y0 = inset;
  const x1 = width - inset;
  const y1 = height - inset;

  const bottomLeftStart: Point = { x: x0 + r, y: y1 };
  const bottomRightEnd: Point = { x: x1 - r, y: y1 };
  const bottomRightCenter: Point = { x: x1 - r, y: y1 - r };
  const bottomRightStart: Point = { x: x1, y: y1 - r };
  const topRightEnd: Point = { x: x1, y: y0 + r };
  const topRightCenter: Point = { x: x1 - r, y: y0 + r };

  const segments: RouteSegment[] = [
    { from: bottomLeftStart, to: bottomRightEnd, type: "line" },
    {
      center: bottomRightCenter,
      fromDeg: 90,
      radius: r,
      toDeg: 0,
      type: "arc"
    },
    { from: bottomRightStart, to: topRightEnd, type: "line" },
    {
      center: topRightCenter,
      fromDeg: 0,
      radius: r,
      toDeg: -90,
      type: "arc"
    }
  ];

  return { r, segments };
}

function buildMaskCenterlinePath(
  width: number,
  height: number,
  radius: number,
  inset: number
): string {
  const { segments } = buildRoute(width, height, radius, inset);
  const [line1, , line2, arc2] = segments;

  if (line1.type !== "line" || line2.type !== "line" || arc2.type !== "arc") {
    return "";
  }

  const arc = (to: Point) => `A ${arc2.radius} ${arc2.radius} 0 0 0 ${to.x} ${to.y}`;
  const bottomRightStart = line2.from;
  const topRightStart = pointOnArc(arc2.center, arc2.radius, arc2.toDeg);

  return [
    `M ${line1.from.x} ${line1.from.y}`,
    `L ${line1.to.x} ${line1.to.y}`,
    arc(bottomRightStart),
    `L ${line2.to.x} ${line2.to.y}`,
    arc(topRightStart)
  ].join(" ");
}

/**
 * Computes the draw-in geometry: a plain path to drive the reveal
 * animation, and a tapered (thin -> thick -> thin) filled ribbon for the
 * reveal to uncover.
 */
export function getDiagnosisCardSelectedDrawGeometry(
  width: number,
  height: number,
  radius: number,
  borderStrokeWidth: number,
  peakWidth: number,
  samplesPerArc = 20
): DiagnosisCardSelectedDrawGeometry | null {
  if (width <= 0 || height <= 0) {
    return null;
  }

  const inset = borderStrokeWidth / 2;
  const { segments } = buildRoute(width, height, radius, inset);
  const points = sampleRoute(segments, samplesPerArc);

  if (points.length < 2) {
    return null;
  }

  const cumulative: number[] = [0];
  for (let i = 1; i < points.length; i += 1) {
    cumulative.push(cumulative[i - 1] + distance(points[i - 1], points[i]));
  }
  const totalLength = cumulative[cumulative.length - 1] || 1;

  const peakHalfWidth = peakWidth / 2;
  const outer: Point[] = [];
  const inner: Point[] = [];

  for (let i = 0; i < points.length; i += 1) {
    const previous = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const tangentX = next.x - previous.x;
    const tangentY = next.y - previous.y;
    const tangentLength = Math.hypot(tangentX, tangentY) || 1;
    const normalX = -tangentY / tangentLength;
    const normalY = tangentX / tangentLength;

    const t = cumulative[i] / totalLength;
    // Thin at both tips, thick through the middle of the run.
    const halfWidth = peakHalfWidth * Math.sin(Math.PI * t);

    const point = points[i];
    outer.push({
      x: point.x + normalX * halfWidth,
      y: point.y + normalY * halfWidth
    });
    inner.push({
      x: point.x - normalX * halfWidth,
      y: point.y - normalY * halfWidth
    });
  }

  const ribbonPath = [
    `M ${outer[0].x} ${outer[0].y}`,
    ...outer.slice(1).map((point) => `L ${point.x} ${point.y}`),
    ...inner
      .slice()
      .reverse()
      .map((point) => `L ${point.x} ${point.y}`),
    "Z"
  ].join(" ");

  return {
    maskCenterlinePath: buildMaskCenterlinePath(width, height, radius, inset),
    maskStrokeWidth: peakWidth + 2,
    ribbonPath
  };
}
