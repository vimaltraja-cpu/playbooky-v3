/**
 * Shared "blur-glass expand-to-focus" motion language for every V3 concept.
 *
 * The treatment (independent of each concept's spatial mechanism — FLIP
 * transform for Concept 1, depth/scale resolve for Concept 2, directional
 * clip-path for Concept 3) is always the same three beats:
 *
 *   1. The origin card's content simplifies into a blurred, frosted glass
 *      surface (`backdrop-filter: blur()` + reduced-opacity tonal fill) —
 *      never a flat, fully-opaque neutralize panel.
 *   2. That glass surface expands/resolves fluidly to the grid-bound stage
 *      rect, using a single continuous transform/opacity/clip curve — no
 *      discrete phase snaps.
 *   3. Once the surface is most of the way to its final size, the modal
 *      content itself resolves from blurred to sharp focus (a `filter:
 *      blur()` animation, not an opacity-only fade), then the surface's own
 *      glass blur clears to reveal the fully sharp final state.
 *
 * Closing reverses the same three beats: content defocuses first, then the
 * (still frosted) surface contracts back to the origin card's rect, then the
 * card itself defocuses back to its normal, fully sharp resting state.
 *
 * Every duration below is fed through `scaleDuration()` for slow-motion
 * preview, and every easing curve is a purposeful weighted-deceleration
 * cubic-bezier — no linear or generic `ease-in-out` chains — so chained
 * phases read as one continuous motion instead of visibly seaming.
 */

/** Card content -> frosted glass surface. */
export const CARD_TO_GLASS_BLUR_PX = 8;
export const CARD_TO_GLASS_DURATION_MS = 160;

/** Frosted glass surface expanding to the measured grid/stage rect. */
export const GLASS_EXPAND_DURATION_MS = 380;
/** Weighted deceleration — fast start, long soft settle. No bounce. */
export const GLASS_EXPAND_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

/** How blurred the glass surface itself reads while still expanding. */
export const GLASS_SURFACE_BLUR_PX = 10;
/** Tonal fill alpha for the frosted surface (never fully opaque). */
export const GLASS_SURFACE_TINT = "rgba(252, 251, 250, 0.62)";

/** Content resolving from blurred to sharp focus, once the surface has
 * mostly settled (see GLASS_CONTENT_FOCUS_START_FRACTION below). */
export const CONTENT_BLUR_START_PX = 10;
export const CONTENT_FOCUS_DURATION_MS = 190;
export const CONTENT_FOCUS_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Fraction of the expand duration elapsed before content starts focusing. */
export const GLASS_CONTENT_FOCUS_START_FRACTION = 0.8;

/** Closing reverses the language, slightly faster than the open beats. */
export const CLOSE_CONTENT_DEFOCUS_DURATION_MS = 140;
export const CLOSE_GLASS_CONTRACT_DURATION_MS = 300;
export const CLOSE_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

/** Card itself defocusing back to its normal sharp resting state, the last
 * beat of a close. */
export const CARD_DEFOCUS_DURATION_MS = 180;
export const CARD_DEFOCUS_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Concept 1 (Cohesive Surface) specific: the origin card's own blurred
 * content layer cross-dissolves into the destination modal's blurred
 * content layer roughly halfway through the expand (open) / contract
 * (close) flight, rather than an instant swap. Both layers are real
 * rendered content (ActivityCard / ActivityDetailModal), not a flat tint.
 */
export const CONTENT_CROSSFADE_DURATION_MS = 180;
/** Fraction of the expand/contract duration at which the crossfade is
 * centered — the two blurred layers swap visibility here. Deliberately
 * early (shortly after the expand/contract transform begins) rather than at
 * the midpoint, so the content handoff starts while the surface is still
 * mostly in flight instead of waiting until it's halfway settled. The fade
 * itself (its duration/character) is unchanged — only when it starts. */
export const GLASS_CONTENT_CROSSFADE_CENTER_FRACTION = 0.15;

/** The border/stroke fade used by Concept 1's "frameless" stroke variant —
 * the border fades out once content reaches sharp focus on open, and fades
 * back in as content starts to defocus on close. The "framed" variant never
 * animates this; the constant exists so both variants share one timing
 * value. */
export const STROKE_FADE_DURATION_MS = CONTENT_FOCUS_DURATION_MS;

/** The origin card's own visual treatment (`ActivityCard`:
 * `rounded-[16px] border-[2px] border-[#B77B32]`) — reused so Concept 1's
 * animated surface can keep this exact radius/stroke unchanged for the
 * entire transition instead of snapping to a different shape at the moment
 * of click. */
export const CARD_STROKE_COLOR = "#B77B32";
export const CARD_STROKE_COLOR_TRANSPARENT = "rgba(183, 123, 50, 0)";
export const CARD_STROKE_WIDTH_PX = 2;
export const CARD_CONTENT_RADIUS_PX = 16;

export function blurFilter(px: number) {
  return px <= 0 ? "blur(0px)" : `blur(${px}px)`;
}

export function strokeColor(visible: boolean) {
  return visible ? CARD_STROKE_COLOR : CARD_STROKE_COLOR_TRANSPARENT;
}
