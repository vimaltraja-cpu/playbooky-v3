"use client";

/**
 * WorkshopModeNav — LOCKED production component
 *
 * Approved motion: Active Elastic Pop (RTL Icon)
 * Source exploration: /design-system/core-experience/workshop-navigation-motion
 *
 * Variants:
 * - labels — desktop text + active icon reveal (locked motion)
 * - icons — compact icon-only; same elastic surface, Neutral 500 glyphs
 * - auto — switches to icons when the host cannot keep ~24px side inset
 *   around the labels pill
 *
 * Do not fold other motion concepts into this file.
 * Do not change timing, geometry, or icon reveal direction without
 * a deliberate product approval of a new locked variant.
 */

import type {
  CSSProperties,
  KeyboardEvent,
  ReactElement
} from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import type { StaticImageData } from "next/image";

import alignATeamIcon from "@/assets/icons/align-a-team.svg";
import makeDecisionsIcon from "@/assets/icons/make-decisions.svg";
import slowDecisionMakingIcon from "@/assets/icons/slow-decision-making.svg";
import {
  AlignATeamIcon,
  MakeDecisionsIcon,
  SlowDecisionMakingIcon,
  type DiagnosisIconComponent
} from "@/lib/design-system/diagnosis-icons";

export type WorkshopModeId = "guide" | "figjam" | "live";

export type WorkshopModeNavVariant = "labels" | "icons" | "auto";

export type WorkshopModeNavProps = {
  "aria-label"?: string;
  className?: string;
  defaultValue?: WorkshopModeId;
  onChange?: (mode: WorkshopModeId) => void;
  value?: WorkshopModeId;
  /** labels (default locked), icons (compact), or auto (24px inset rule). */
  variant?: WorkshopModeNavVariant;
};

type ItemRect = {
  center: number;
  left: number;
  width: number;
};

type MotionState = {
  direction: number;
  distance: number;
  duration: number;
  from: WorkshopModeId;
  fromRect: ItemRect;
  iconExitDuration: number;
  iconRevealDelay: number;
  iconRevealDuration: number;
  replayKey: number;
  to: WorkshopModeId;
  toRect: ItemRect;
  version: number;
};

type Destination = {
  Icon: DiagnosisIconComponent;
  glyphSrc: string;
  id: WorkshopModeId;
  label: string;
};

function assetSrc(asset: string | StaticImageData) {
  return typeof asset === "string" ? asset : asset.src;
}

const destinations: Destination[] = [
  {
    Icon: AlignATeamIcon,
    glyphSrc: assetSrc(alignATeamIcon),
    id: "guide",
    label: "Facilitator Guide"
  },
  {
    Icon: MakeDecisionsIcon,
    glyphSrc: assetSrc(makeDecisionsIcon),
    id: "figjam",
    label: "FigJam Board"
  },
  {
    Icon: SlowDecisionMakingIcon,
    glyphSrc: assetSrc(slowDecisionMakingIcon),
    id: "live",
    label: "PlayBooky Live"
  }
];

const destinationIndex = new Map(
  destinations.map((destination, index) => [destination.id, index])
);

// Icon (18px) + fixed 16px icon-to-label gap. Reserved only on the
// active/destination tab in the labels variant.
const ICON_RESERVE = 34;

/** Keep ~24px clear on each side of the labels pill before compacting. */
const SIDE_INSET_PX = 24;

function getIndex(id: WorkshopModeId) {
  return destinationIndex.get(id) ?? 0;
}

function getTiming(distance: number, reduced: boolean) {
  if (reduced) {
    return {
      commitAt: 1,
      iconExitDuration: 100,
      iconRevealDelay: 220,
      iconRevealDuration: 140,
      surfaceDuration: 220
    };
  }

  const surfaceDuration = distance > 1 ? 340 : 300;

  return {
    commitAt: 0.85,
    iconExitDuration: 150,
    iconRevealDelay: Math.round(surfaceDuration * 0.78),
    iconRevealDuration: 190,
    surfaceDuration
  };
}

function getSurfaceStyle(
  motion: MotionState,
  from: ItemRect,
  to: ItemRect
): CSSProperties {
  const travel = to.left - from.left;
  const stretch = motion.distance > 1 ? 14 : 8;
  const restingWidth = to.width;
  const maxWidth = Math.abs(to.center - from.center) + restingWidth + stretch;

  return {
    "--wmn-start-x": `${from.left}px`,
    "--wmn-stretch-x": `${Math.min(from.left, to.left) - stretch / 2}px`,
    "--wmn-stretch-width": `${maxWidth}px`,
    "--wmn-end-x": `${to.left}px`,
    "--wmn-start-width": `${from.width}px`,
    "--wmn-end-width": `${restingWidth}px`,
    "--wmn-quiet-start-x": `${from.left}px`,
    "--wmn-quiet-end-x": `${to.left}px`,
    "--wmn-quiet-start-width": `${from.width}px`,
    "--wmn-quiet-end-width": `${to.width}px`,
    transform: `translateX(${from.left + travel}px)`,
    width: to.width
  } as CSSProperties;
}

function ModeIcon({
  Icon,
  style,
  token,
  visible
}: {
  Icon: DiagnosisIconComponent;
  style?: CSSProperties;
  token: number;
  visible: boolean;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!visible) {
      setEntered(false);
      return;
    }

    setEntered(false);
    const frame = requestAnimationFrame(() => setEntered(true));

    return () => cancelAnimationFrame(frame);
  }, [token, visible]);

  return (
    <span
      aria-hidden="true"
      className="wmn__icon"
      data-icon-visible={entered ? "true" : "false"}
      style={style}
    >
      <Icon alt="" height={18} width={18} />
    </span>
  );
}

function ModeGlyph({
  active,
  src,
  token
}: {
  active: boolean;
  src: string;
  token: number;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(false);
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [token, active]);

  return (
    <span
      aria-hidden="true"
      className="wmn__glyph"
      data-active={active ? "true" : "false"}
      data-icon-visible={entered ? "true" : "false"}
      style={{
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`
      }}
    />
  );
}

function WorkshopModeNavStyles() {
  return (
    <style>{`
      .wmn {
        align-items: center;
        display: inline-flex;
        min-width: max-content;
        overflow: visible;
      }

      .wmn__track {
        --wmn-duration: 0ms;
        align-items: center;
        background: #fcfbf9;
        border: 1px solid #dfd4c5;
        border-radius: 12px;
        box-shadow: 0 6px 24px color-mix(in srgb, #a39e95 22%, transparent);
        color: #324236;
        column-gap: 16px;
        display: inline-flex;
        isolation: isolate;
        min-width: max-content;
        overflow: visible;
        padding: 6px;
        position: relative;
      }

      .wmn__indicator {
        background: #f3eee7;
        border: 1px solid #dfd4c5;
        border-radius: 8px;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 10px 24px rgba(50, 66, 54, 0.1);
        height: calc(100% - 12px);
        left: 0;
        pointer-events: none;
        position: absolute;
        top: 6px;
        transform-origin: center;
        z-index: 1;
      }

      .wmn__track[data-motion="active"]:not([data-reduced-motion="true"]) .wmn__indicator {
        animation: wmn-surface var(--wmn-duration) cubic-bezier(0.33, 0, 0.18, 1) both;
      }

      .wmn__track[data-motion="active"][data-reduced-motion="true"] .wmn__indicator {
        animation: wmn-surface-reduced var(--wmn-duration) cubic-bezier(0.2, 0, 0, 1) both;
      }

      .wmn__group {
        align-items: center;
        column-gap: 16px;
        display: inline-flex;
      }

      .wmn__item {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 8px;
        color: transparent;
        column-gap: 0;
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        height: 44px;
        justify-content: center;
        min-width: 0;
        overflow: visible;
        padding: 0 18px;
        position: relative;
        white-space: nowrap;
        z-index: 2;
      }

      .wmn__item:focus-visible {
        outline: 3px solid rgba(217, 156, 86, 0.5);
        outline-offset: 4px;
      }

      .wmn__label {
        background: none;
        color: #6f6a62;
        display: inline-block;
        font-family: Geist, sans-serif;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 1.5;
        overflow: visible;
        padding: 2px 0 4px;
        position: relative;
        -webkit-text-fill-color: #6f6a62;
        vertical-align: middle;
        z-index: 1;
      }

      .wmn__item[data-active="true"] .wmn__label,
      .wmn__item[data-displayed="true"] .wmn__label {
        background: linear-gradient(45deg, #7d5330 0%, #d99c56 100%);
        background-clip: text;
        color: transparent;
        -webkit-background-clip: text;
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
        -webkit-text-fill-color: transparent;
      }

      .wmn__divider {
        background: #dfd4c5;
        flex: 0 0 auto;
        height: 26px;
        width: 1px;
        z-index: 0;
      }

      .wmn__icon-slot {
        align-items: center;
        display: inline-flex;
        margin-right: 0;
        overflow: hidden;
        transition:
          margin-right var(--wmn-slot-duration, 200ms) cubic-bezier(0.33, 0, 0.2, 1),
          width var(--wmn-slot-duration, 200ms) cubic-bezier(0.33, 0, 0.2, 1);
        width: 0;
      }

      .wmn__icon-slot[data-reserved="true"] {
        margin-right: 16px;
        width: 18px;
      }

      .wmn__icon-slot[data-instant="true"] {
        transition: none;
      }

      /* RTL icon reveal — locked Active Elastic Pop (RTL Icon) behaviour */
      .wmn__icon {
        align-items: center;
        display: inline-flex;
        flex: 0 0 auto;
        height: 18px;
        justify-content: center;
        opacity: 0;
        transform: translateX(10px) scale(0.88);
        transition:
          opacity var(--wmn-icon-duration, 190ms) cubic-bezier(0.33, 0, 0.2, 1),
          transform var(--wmn-icon-duration, 190ms) cubic-bezier(0.33, 0, 0.2, 1);
        width: 18px;
      }

      .wmn__icon[data-icon-visible="true"] {
        opacity: 1;
        transform: translateX(0) scale(1);
      }

      /* Icons variant — compact, Neutral 500 glyphs, gold indicator still travels */
      .wmn[data-variant="icons"] .wmn__track {
        column-gap: 8px;
      }

      .wmn[data-variant="icons"] .wmn__group {
        column-gap: 8px;
      }

      .wmn[data-variant="icons"] .wmn__item {
        height: 44px;
        padding: 0 14px;
        width: 44px;
      }

      .wmn[data-variant="icons"] .wmn__label {
        border: 0;
        clip: rect(0, 0, 0, 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      .wmn[data-variant="icons"] .wmn__icon-slot {
        display: none;
      }

      .wmn__glyph {
        background: #6f6a62;
        display: block;
        flex: none;
        height: 20px;
        mask-position: center;
        mask-repeat: no-repeat;
        mask-size: contain;
        -webkit-mask-position: center;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: contain;
        opacity: 1;
        position: relative;
        transform: scale(0.92);
        transition:
          background 180ms cubic-bezier(0.2, 0, 0, 1),
          opacity 190ms cubic-bezier(0.33, 0, 0.2, 1),
          transform 190ms cubic-bezier(0.33, 0, 0.2, 1);
        width: 20px;
        z-index: 1;
      }

      .wmn__glyph[data-icon-visible="true"] {
        transform: scale(1);
      }

      .wmn__glyph[data-active="true"] {
        background: linear-gradient(45deg, #7d5330 0%, #d99c56 100%);
      }

      .wmn__track[data-reduced-motion="true"] .wmn__icon,
      .wmn__track[data-reduced-motion="true"] .wmn__glyph {
        transform: none !important;
        transition: opacity var(--wmn-icon-duration, 190ms) linear;
      }

      .wmn__track[data-reduced-motion="true"] .wmn__icon-slot {
        transition:
          margin-right var(--wmn-slot-duration, 200ms) linear,
          width var(--wmn-slot-duration, 200ms) linear;
      }

      @keyframes wmn-surface {
        0% {
          transform: translateX(var(--wmn-start-x));
          width: var(--wmn-start-width);
        }
        55% {
          transform: translateX(var(--wmn-stretch-x));
          width: var(--wmn-stretch-width);
        }
        100% {
          transform: translateX(var(--wmn-end-x));
          width: var(--wmn-end-width);
        }
      }

      @keyframes wmn-surface-reduced {
        0% {
          opacity: 0.65;
          transform: translateX(var(--wmn-quiet-start-x));
          width: var(--wmn-quiet-start-width);
        }
        100% {
          opacity: 1;
          transform: translateX(var(--wmn-quiet-end-x));
          width: var(--wmn-quiet-end-width);
        }
      }

      @media (max-width: 760px) {
        .wmn[data-variant="labels"] .wmn__item {
          padding-left: 14px;
          padding-right: 14px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .wmn__indicator,
        .wmn__item,
        .wmn__icon,
        .wmn__icon-slot,
        .wmn__glyph {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>
  );
}

export function WorkshopModeNav({
  "aria-label": ariaLabel = "Workshop navigation",
  className,
  defaultValue = "guide",
  onChange,
  value,
  variant = "auto"
}: WorkshopModeNavProps): ReactElement {
  const isControlled = value !== undefined;
  const [uncontrolledActive, setUncontrolledActive] =
    useState<WorkshopModeId>(defaultValue);
  const active = isControlled ? value : uncontrolledActive;
  const [displayed, setDisplayed] = useState<WorkshopModeId>(active);
  const [motion, setMotion] = useState<MotionState | null>(null);
  const [revealedTargetId, setRevealedTargetId] =
    useState<WorkshopModeId | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [resolvedVariant, setResolvedVariant] = useState<"labels" | "icons">(
    variant === "icons" ? "icons" : "labels"
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const labelsWidthRef = useRef(520);
  const itemRefs = useRef<Record<WorkshopModeId, HTMLButtonElement | null>>({
    figjam: null,
    guide: null,
    live: null
  });
  const [rects, setRects] = useState<Record<WorkshopModeId, ItemRect>>({
    figjam: { center: 0, left: 0, width: 0 },
    guide: { center: 0, left: 0, width: 0 },
    live: { center: 0, left: 0, width: 0 }
  });

  const versionRef = useRef(0);
  const motionRef = useRef<MotionState | null>(null);
  const timeouts = useRef<number[]>([]);
  const onChangeRef = useRef(onChange);
  const isIcons = resolvedVariant === "icons";

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    motionRef.current = motion;
  }, [motion]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (isControlled) {
      setDisplayed(value);
    }
  }, [isControlled, value]);

  const syncAutoVariant = useCallback(() => {
    if (variant === "icons") {
      setResolvedVariant("icons");
      return;
    }

    if (variant === "labels") {
      setResolvedVariant("labels");
      return;
    }

    const host = rootRef.current?.parentElement ?? rootRef.current;
    const available = host?.clientWidth ?? window.innerWidth;
    const needsIcons = available < labelsWidthRef.current + SIDE_INSET_PX * 2;
    setResolvedVariant(needsIcons ? "icons" : "labels");
  }, [variant]);

  useLayoutEffect(() => {
    syncAutoVariant();
  }, [syncAutoVariant]);

  useEffect(() => {
    if (variant !== "auto") {
      return;
    }

    const host = rootRef.current?.parentElement ?? rootRef.current;
    if (!host || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", syncAutoVariant);
      return () => window.removeEventListener("resize", syncAutoVariant);
    }

    const observer = new ResizeObserver(() => syncAutoVariant());
    observer.observe(host);
    window.addEventListener("resize", syncAutoVariant);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncAutoVariant);
    };
  }, [syncAutoVariant, variant]);

  const measure = useCallback(() => {
    const nav = navRef.current;

    if (!nav) {
      return;
    }

    if (resolvedVariant === "labels") {
      labelsWidthRef.current = Math.max(
        labelsWidthRef.current,
        nav.getBoundingClientRect().width
      );
    }

    const navRect = nav.getBoundingClientRect();
    const nextRects: Record<WorkshopModeId, ItemRect> = {
      figjam: { center: 0, left: 0, width: 0 },
      guide: { center: 0, left: 0, width: 0 },
      live: { center: 0, left: 0, width: 0 }
    };

    destinations.forEach((destination) => {
      const item = itemRefs.current[destination.id];

      if (!item) {
        return;
      }

      const itemRect = item.getBoundingClientRect();
      nextRects[destination.id] = {
        center: itemRect.left - navRect.left + itemRect.width / 2,
        left: itemRect.left - navRect.left,
        width: itemRect.width
      };
    });

    setRects(nextRects);
  }, [resolvedVariant]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    measure();
  }, [active, displayed, measure, motion, resolvedVariant]);

  const clearPendingTimeouts = useCallback(() => {
    timeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    timeouts.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearPendingTimeouts();
    };
  }, [clearPendingTimeouts]);

  const commitValue = useCallback(
    (next: WorkshopModeId) => {
      if (!isControlled) {
        setUncontrolledActive(next);
      }
      onChangeRef.current?.(next);
    },
    [isControlled]
  );

  const startTransition = useCallback(
    (target: WorkshopModeId) => {
      if (target === active) {
        return;
      }

      const inFlight = motionRef.current;
      let fromRect = rects[active];

      if (inFlight && indicatorRef.current && navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        const indicatorRect = indicatorRef.current.getBoundingClientRect();
        fromRect = {
          center: indicatorRect.left - navRect.left + indicatorRect.width / 2,
          left: indicatorRect.left - navRect.left,
          width: indicatorRect.width
        };
      }

      const reservedIdBeforeClick = inFlight ? inFlight.to : active;
      const targetAlreadyReserved = target === reservedIdBeforeClick;
      const targetRestRect = rects[target];
      const targetIndex = getIndex(target);
      const reservedIndex = getIndex(reservedIdBeforeClick);
      const oldWasBeforeTarget =
        !targetAlreadyReserved && reservedIndex < targetIndex;
      const iconOffset =
        isIcons || targetAlreadyReserved ? 0 : ICON_RESERVE;
      const toLeft =
        targetRestRect.left -
        (!isIcons && oldWasBeforeTarget ? ICON_RESERVE : 0);
      const toWidth = targetRestRect.width + iconOffset;
      const toRect: ItemRect = {
        center: toLeft + toWidth / 2,
        left: toLeft,
        width: toWidth
      };

      clearPendingTimeouts();
      versionRef.current += 1;

      const version = versionRef.current;
      const fromIndex = getIndex(active);
      const toIndex = getIndex(target);
      const distance = Math.max(Math.abs(toIndex - fromIndex), 1);
      const timing = getTiming(distance, reducedMotion);

      setDisplayed(active);
      setRevealedTargetId(null);
      setMotion({
        direction: Math.sign(toIndex - fromIndex) || 1,
        distance,
        duration: timing.surfaceDuration,
        from: active,
        fromRect,
        iconExitDuration: timing.iconExitDuration,
        iconRevealDelay: timing.iconRevealDelay,
        iconRevealDuration: timing.iconRevealDuration,
        replayKey: 0,
        to: target,
        toRect,
        version
      });

      const commitTimeout = window.setTimeout(() => {
        if (versionRef.current !== version) {
          return;
        }
        commitValue(target);
        setDisplayed(target);
      }, timing.surfaceDuration * timing.commitAt);

      const revealTimeout = window.setTimeout(() => {
        if (versionRef.current !== version) {
          return;
        }
        setRevealedTargetId(target);
      }, timing.iconRevealDelay);

      const finishTimeout = window.setTimeout(
        () => {
          if (versionRef.current !== version) {
            return;
          }
          setMotion(null);
        },
        Math.max(
          timing.surfaceDuration,
          timing.iconRevealDelay + timing.iconRevealDuration
        ) + 80
      );

      timeouts.current.push(commitTimeout, revealTimeout, finishTimeout);
    },
    [
      active,
      clearPendingTimeouts,
      commitValue,
      isIcons,
      rects,
      reducedMotion
    ]
  );

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    destination: WorkshopModeId
  ) => {
    const currentIndex = getIndex(destination);

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = destinations[(currentIndex + 1) % destinations.length];
      itemRefs.current[next.id]?.focus();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const previous =
        destinations[
          (currentIndex - 1 + destinations.length) % destinations.length
        ];
      itemRefs.current[previous.id]?.focus();
    }
  };

  const indicatorStyle = motion
    ? getSurfaceStyle(motion, motion.fromRect, motion.toRect)
    : {
        transform: `translateX(${rects[displayed].left}px)`,
        width: rects[displayed].width
      };

  return (
    <>
      <WorkshopModeNavStyles />
      <div
        className={["wmn", className].filter(Boolean).join(" ")}
        data-variant={resolvedVariant}
        ref={rootRef}
      >
        <div
          aria-label={ariaLabel}
          className="wmn__track"
          data-motion={motion ? "active" : "idle"}
          data-reduced-motion={reducedMotion ? "true" : "false"}
          ref={navRef}
          role="tablist"
          style={
            {
              "--wmn-duration": `${motion?.duration ?? 0}ms`
            } as CSSProperties
          }
        >
          <span
            aria-hidden="true"
            className="wmn__indicator"
            key={`wmn-indicator-${resolvedVariant}-${motion?.version ?? "idle"}`}
            ref={indicatorRef}
            style={indicatorStyle}
          />

          {destinations.map((destination, index) => {
            const isActive = active === destination.id;
            const isDisplayed = displayed === destination.id;
            const isMotionTarget = motion?.to === destination.id;
            const isMotionSource = motion?.from === destination.id;
            const isReserved = motion ? isMotionTarget : isActive;
            const showIcon = motion
              ? revealedTargetId === destination.id
              : isActive;
            const iconDuration = isMotionTarget
              ? (motion?.iconRevealDuration ?? 190)
              : (motion?.iconExitDuration ?? 190);
            const slotDuration = isMotionSource
              ? (motion?.iconExitDuration ?? 150)
              : (motion?.duration ?? 200);
            const token = motion?.version ?? 0;
            const glyphActive = isDisplayed;

            return (
              <span className="wmn__group" key={destination.id}>
                <button
                  aria-label={destination.label}
                  aria-selected={isActive}
                  className="wmn__item"
                  data-active={isActive ? "true" : "false"}
                  data-displayed={isDisplayed ? "true" : "false"}
                  onClick={() => startTransition(destination.id)}
                  onKeyDown={(event) => handleKeyDown(event, destination.id)}
                  ref={(element) => {
                    itemRefs.current[destination.id] = element;
                  }}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  {isIcons ? (
                    <ModeGlyph
                      active={glyphActive}
                      src={destination.glyphSrc}
                      token={token + (glyphActive ? 1 : 0)}
                    />
                  ) : (
                    <span
                      className="wmn__icon-slot"
                      data-instant={isMotionTarget ? "true" : "false"}
                      data-reserved={isReserved ? "true" : "false"}
                      style={
                        {
                          "--wmn-slot-duration": `${slotDuration}ms`
                        } as CSSProperties
                      }
                    >
                      <ModeIcon
                        Icon={destination.Icon}
                        style={
                          {
                            "--wmn-icon-duration": `${iconDuration}ms`
                          } as CSSProperties
                        }
                        token={token}
                        visible={showIcon}
                      />
                    </span>
                  )}
                  <span className="wmn__label">{destination.label}</span>
                </button>
                {index < destinations.length - 1 ? (
                  <span aria-hidden="true" className="wmn__divider" />
                ) : null}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
