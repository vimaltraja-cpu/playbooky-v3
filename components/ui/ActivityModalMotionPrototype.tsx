"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  ActivityCard,
  type ActivityCardData
} from "@/components/ui/ActivityCard";

export type ActivityModalMotionCard = {
  activity: ActivityCardData;
  id: string;
  label: string;
};

type ViewportRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type MotionPhase = "opening" | "open" | "closing";

type TransitionLayerState = {
  card: ActivityModalMotionCard;
  destinationRect: ViewportRect;
  phase: MotionPhase;
  progress: number;
  rect: ViewportRect;
  shouldAnimate: boolean;
};

const CARD_WIDTH = 256;
const MODAL_WIDTH = 1368;
const MODAL_HEIGHT = 762;
const CARD_GAP = 24;
const GRID_COLUMNS = 5;
const OPEN_DURATION_MS = 820;
const OPEN_GEOMETRY_MS = 760;
const CLOSE_DURATION_MS = 540;
const CLOSE_GEOMETRY_MS = 500;
const OPEN_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const CLOSE_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function interpolate(
  progress: number,
  inputStart: number,
  inputEnd: number,
  outputStart: number,
  outputEnd: number
) {
  const local = clamp((progress - inputStart) / (inputEnd - inputStart));

  return outputStart + (outputEnd - outputStart) * local;
}

function getFrostOpacity(progress: number) {
  if (progress < 0.5) {
    return interpolate(progress, 0, 0.5, 0, 0.66);
  }

  return interpolate(progress, 0.5, 1, 0.66, 0);
}

function getFrostBlur(progress: number) {
  if (progress < 0.5) {
    return interpolate(progress, 0, 0.5, 0, 16);
  }

  return interpolate(progress, 0.5, 1, 16, 0);
}

function getModalOpacity(progress: number) {
  if (progress < 0.2) {
    return interpolate(progress, 0, 0.2, 0, 0.08);
  }

  if (progress < 0.5) {
    return interpolate(progress, 0.2, 0.5, 0.08, 0.34);
  }

  if (progress < 0.7) {
    return interpolate(progress, 0.5, 0.7, 0.34, 0.74);
  }

  if (progress < 0.9) {
    return interpolate(progress, 0.7, 0.9, 0.74, 0.95);
  }

  return interpolate(progress, 0.9, 1, 0.95, 1);
}

function getModalBlur(progress: number) {
  if (progress < 0.2) {
    return interpolate(progress, 0, 0.2, 22, 18);
  }

  if (progress < 0.5) {
    return interpolate(progress, 0.2, 0.5, 18, 14);
  }

  if (progress < 0.7) {
    return interpolate(progress, 0.5, 0.7, 14, 7);
  }

  if (progress < 0.9) {
    return interpolate(progress, 0.7, 0.9, 7, 1.5);
  }

  return interpolate(progress, 0.9, 1, 1.5, 0);
}

function getSourceCardOpacity(progress: number) {
  if (progress < 0.35) {
    return 1;
  }

  if (progress < 0.65) {
    return interpolate(progress, 0.35, 0.65, 1, 0);
  }

  return 0;
}

function rectFromElement(element: HTMLElement): ViewportRect {
  const rect = element.getBoundingClientRect();

  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width
  };
}

function TransitionLayer({
  layer,
  renderModalContent,
  onClose
}: {
  layer: TransitionLayerState;
  renderModalContent: (
    card: ActivityModalMotionCard,
    controls: { close: () => void; isOpen: boolean }
  ) => ReactNode;
  onClose: () => void;
}) {
  const isOpen = layer.phase === "open";
  const isClosing = layer.phase === "closing";
  const geometryDuration = isClosing ? CLOSE_GEOMETRY_MS : OPEN_GEOMETRY_MS;
  const easing = isClosing ? CLOSE_EASE : OPEN_EASE;
  const transition = layer.shouldAnimate
    ? `top ${geometryDuration}ms ${easing}, left ${geometryDuration}ms ${easing}, width ${geometryDuration}ms ${easing}, height ${geometryDuration}ms ${easing}, border-radius ${geometryDuration}ms ${easing}, box-shadow ${geometryDuration}ms ${easing}, background-color ${geometryDuration}ms ${easing}`
    : "none";
  const modalPositionTransition = layer.shouldAnimate
    ? `left ${geometryDuration}ms ${easing}, top ${geometryDuration}ms ${easing}`
    : "none";
  const modalOffsetX = layer.destinationRect.left - layer.rect.left;
  const modalOffsetY = layer.destinationRect.top - layer.rect.top;
  const frostOpacity = getFrostOpacity(layer.progress);
  const frostBlur = getFrostBlur(layer.progress);
  const modalOpacity = getModalOpacity(layer.progress);
  const modalBlur = getModalBlur(layer.progress);

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed z-[80]"
      style={{
        height: layer.rect.height,
        left: layer.rect.left,
        top: layer.rect.top,
        transition,
        width: layer.rect.width
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden border-[2px] border-[#B77B32]"
        style={{
          backgroundColor: "rgba(252,251,250,0.9)",
          borderRadius: 16,
          boxShadow:
            isOpen
              ? "0 24px 80px rgba(36, 31, 24, 0.22)"
              : "0 4px 8px -2px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.06)",
          transition
        }}
      >
        <div
          className={[
            "absolute origin-top-left",
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          ].join(" ")}
          style={{
            filter: `blur(${modalBlur}px)`,
            height: MODAL_HEIGHT,
            left: modalOffsetX,
            opacity: modalOpacity,
            top: modalOffsetY,
            transition: modalPositionTransition,
            width: MODAL_WIDTH
          }}
        >
          {renderModalContent(layer.card, { close: onClose, isOpen })}
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#FCFBFA]/35"
          style={{
            backdropFilter: `blur(${frostBlur}px)`,
            opacity: frostOpacity,
            WebkitBackdropFilter: `blur(${frostBlur}px)`
          }}
        />
      </div>
    </div>,
    document.body
  );
}

export function ActivityModalMotionPrototype({
  cards,
  framed = true,
  renderModalContent
}: {
  cards: ActivityModalMotionCard[];
  framed?: boolean;
  renderModalContent: (
    card: ActivityModalMotionCard,
    controls: { close: () => void; isOpen: boolean }
  ) => ReactNode;
}) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const progressFrameRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const [layer, setLayer] = useState<TransitionLayerState | null>(null);
  const activeCardId = layer?.card.id ?? null;
  const isOpen = layer?.phase === "open";
  const isMoving = layer?.phase === "opening" || layer?.phase === "closing";

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
      if (progressFrameRef.current !== null) {
        window.cancelAnimationFrame(progressFrameRef.current);
      }
    };
  }, []);

  function setManagedTimeout(callback: () => void, delay: number) {
    const timer = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((item) => item !== timer);
      callback();
    }, delay);

    timersRef.current.push(timer);
  }

  function animateProgress(from: number, to: number, duration: number) {
    if (progressFrameRef.current !== null) {
      window.cancelAnimationFrame(progressFrameRef.current);
    }

    const startTime = window.performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = clamp(elapsed / duration);
      const nextValue = from + (to - from) * progress;

      setLayer((current) =>
        current
          ? {
              ...current,
              progress: nextValue
            }
          : current
      );

      if (progress < 1) {
        progressFrameRef.current = window.requestAnimationFrame(tick);
      } else {
        progressFrameRef.current = null;
      }
    };

    progressFrameRef.current = window.requestAnimationFrame(tick);
  }

  function openFromCard(card: ActivityModalMotionCard) {
    const cardElement = cardRefs.current[card.id];
    const gridElement = gridRef.current;

    if (!cardElement || !gridElement || layer) {
      return;
    }

    const cardRect = rectFromElement(cardElement);
    const gridRect = rectFromElement(gridElement);

    setLayer({
      card,
      destinationRect: gridRect,
      phase: "opening",
      progress: 0,
      rect: cardRect,
      shouldAnimate: false
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLayer({
          card,
          destinationRect: gridRect,
          phase: "opening",
          progress: 0,
          rect: gridRect,
          shouldAnimate: true
        });
        animateProgress(0, 1, OPEN_DURATION_MS);
      });
    });

    setManagedTimeout(() => {
      setLayer({
        card,
        destinationRect: gridRect,
        phase: "open",
        progress: 1,
        rect: gridRect,
        shouldAnimate: false
      });
    }, OPEN_DURATION_MS);
  }

  function closeToCard() {
    if (!layer) {
      return;
    }

    const cardElement = cardRefs.current[layer.card.id];

    if (!cardElement) {
      setLayer(null);
      return;
    }

    const nextCardRect = rectFromElement(cardElement);
    const card = layer.card;
    const destinationRect = layer.destinationRect;

    setLayer((current) =>
      current
        ? {
            ...current,
            phase: "closing",
            progress: 1,
            shouldAnimate: true
          }
        : current
    );

    requestAnimationFrame(() => {
      setLayer({
        card,
        destinationRect,
        phase: "closing",
        progress: 1,
        rect: nextCardRect,
        shouldAnimate: true
      });
      animateProgress(1, 0, CLOSE_DURATION_MS);
    });

    setManagedTimeout(() => {
      setLayer(null);
    }, CLOSE_DURATION_MS);
  }

  return (
    <div className="relative w-full">
      <div
        className={[
          "mx-auto w-fit",
          framed
            ? "rounded-[24px] border border-[#d5cab9] bg-[#eee7dc] p-6 shadow-[0_16px_40px_-30px_rgba(38,31,24,0.45)]"
            : ""
        ].join(" ")}
      >
        <div
          aria-hidden={isOpen ? "true" : undefined}
          className="grid"
          ref={gridRef}
          style={{
            filter: layer ? (isMoving ? "blur(1.8px)" : "blur(2.4px)") : "blur(0)",
            gap: CARD_GAP,
            gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${CARD_WIDTH}px)`,
            opacity: layer ? (isMoving ? 0.58 : 0.44) : 1,
            transition: layer
              ? `filter ${isOpen ? 280 : 640}ms ${OPEN_EASE}, opacity ${
                  isOpen ? 280 : 640
                }ms ${OPEN_EASE}`
              : `filter 260ms ${CLOSE_EASE}, opacity 260ms ${CLOSE_EASE}`
          }}
        >
          {cards.map((card) => {
            const isOriginCard = activeCardId === card.id;
            const originCardOpacity =
              isOriginCard && layer ? getSourceCardOpacity(layer.progress) : 1;

            return (
              <button
                aria-label={`Open modal motion from ${card.label}`}
                className="rounded-[16px] text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d3a]/50"
                disabled={Boolean(layer)}
                key={card.id}
                onClick={() => openFromCard(card)}
                ref={(element) => {
                  cardRefs.current[card.id] = element;
                }}
                style={{
                  opacity: originCardOpacity,
                  transition: isOriginCard
                    ? "none"
                    : `opacity ${isMoving ? 460 : 240}ms ${
                        isMoving ? OPEN_EASE : CLOSE_EASE
                      }`
                }}
                type="button"
              >
                <ActivityCard activity={card.activity} variant="builder" />
              </button>
            );
          })}
        </div>
      </div>

      {layer ? (
        <TransitionLayer
          layer={layer}
          renderModalContent={renderModalContent}
          onClose={closeToCard}
        />
      ) : null}
    </div>
  );
}
