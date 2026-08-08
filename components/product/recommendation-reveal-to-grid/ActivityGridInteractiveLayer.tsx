"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  ActivityGridCardSurface,
  activityGridViewports,
  type ActivityGridViewportMode,
  type ActivityGridVisualCard
} from "@/components/product/ActivityGridVisualLayer";
import {
  useActivityModalShellTransition,
  type ActivityModalShellCard
} from "@/components/motion/activity-modal/ActivityModalShellTransition";

import { buildPlaceholderModalData } from "./placeholderActivityModalData";

// The approved "final" physics-only drag/reorder preset, lifted as-is
// from the reviewed Activity Grid design-system component -- this is
// the same feel, just without the Design Portal's variant picker /
// viewport switcher review harness wrapped around it.
const MOTION_FINAL = {
  activeRotate: 6,
  dropDuration: 0.32,
  ease: [0.2, 0.8, 0.2, 1] as const,
  initialRotate: -3,
  layoutDuration: 0.34,
  liftScale: 1.03,
  liftY: -14,
  maxRotate: 10,
  rotationSpring: { damping: 20, stiffness: 320 },
  shadow: "0 32px 54px rgba(42, 34, 25, 0.24)",
  snapBackOvershoot: 2,
  snapBackSettleRatio: 0.62,
  velocityRotationFactor: 0.035
};

type DragState = {
  id: string;
  offsetX: number;
  offsetY: number;
  pointerId: number;
  rotate: number;
  x: number;
  y: number;
};

type DropCorrection = { id: string; rotate: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toEase(ease: readonly [number, number, number, number]) {
  return `cubic-bezier(${ease.join(", ")})`;
}

function getSpringInfluence({
  damping,
  stiffness
}: {
  damping: number;
  stiffness: number;
}) {
  return clamp(stiffness / 320 - damping / 120, 0.45, 0.82);
}

function toModalCard(card: ActivityGridVisualCard): ActivityModalShellCard {
  return {
    id: card.id,
    label: card.label,
    modalData: buildPlaceholderModalData(card.activity)
  };
}

// Real, interactive grid: cards can be dragged and reordered, and
// clicking one (a click that wasn't a drag) opens the activity detail
// modal. When `inert` is true it renders the exact same slot layout,
// unclickable, so the transition can still measure real slot positions
// before cards have arrived -- but no drag handlers run.
export function ActivityGridInteractiveLayer({
  cards,
  inert = false,
  initialOpenCardId,
  registerCard,
  viewport = "desktop"
}: {
  cards: ActivityGridVisualCard[];
  inert?: boolean;
  initialOpenCardId?: string;
  registerCard?: (id: string, element: HTMLButtonElement | null) => void;
  viewport?: ActivityGridViewportMode;
}) {
  const geometry = activityGridViewports[viewport];
  const { cardHeight, cardWidth, columns, gap } = geometry;

  const [orderedIds, setOrderedIds] = useState(() => cards.map((card) => card.id));
  const cardsById = useMemo(
    () => new Map(cards.map((card) => [card.id, card])),
    [cards]
  );
  const orderedCards = orderedIds.flatMap((id) => {
    const card = cardsById.get(id);
    return card ? [card] : [];
  });

  useEffect(() => {
    setOrderedIds((current) => {
      const ids = cards.map((card) => card.id);
      const same =
        ids.length === current.length && ids.every((id) => current.includes(id));

      return same ? current : ids;
    });
  }, [cards]);

  const [drag, setDrag] = useState<DragState | null>(null);
  const [dropCorrection, setDropCorrection] = useState<DropCorrection | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const dragSampleRef = useRef({ rotate: 0, time: 0, x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const snapTimerRef = useRef<number | null>(null);
  const dropTimerRef = useRef<number | null>(null);

  const {
    destinationRef: modalDestinationRef,
    isInteractionLocked,
    openCard,
    preloadCard,
    registerCard: registerModalCard,
    transitionLayer
  } = useActivityModalShellTransition();
  const initialOpenCardIdRef = useRef<string | null>(initialOpenCardId ?? null);

  const getSlotPosition = useCallback(
    (index: number) => ({
      x: (index % columns) * (cardWidth + gap),
      y: Math.floor(index / columns) * (cardHeight + gap)
    }),
    [cardHeight, cardWidth, columns, gap]
  );

  const getNearestSlot = useCallback(
    (x: number, y: number) => {
      const centerX = x + cardWidth / 2;
      const centerY = y + cardHeight / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (let index = 0; index < orderedCards.length; index += 1) {
        const slot = getSlotPosition(index);
        const dx = centerX - (slot.x + cardWidth / 2);
        const dy = centerY - (slot.y + cardHeight / 2);
        const distance = dx * dx + dy * dy;

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      }

      return nearestIndex;
    },
    [cardHeight, cardWidth, getSlotPosition, orderedCards.length]
  );

  function moveCard(ids: string[], activeId: string, nextIndex: number) {
    const currentIndex = ids.indexOf(activeId);

    if (currentIndex === -1 || currentIndex === nextIndex) {
      return ids;
    }

    const next = [...ids];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(nextIndex, 0, moved);

    return next;
  }

  const finishDrop = useCallback((cardId: string, releaseRotate: number) => {
    const direction = releaseRotate === 0 ? 1 : Math.sign(releaseRotate);
    const counterRotate = -direction * MOTION_FINAL.snapBackOvershoot;

    setDrag(null);
    setDropCorrection({ id: cardId, rotate: counterRotate });

    if (snapTimerRef.current !== null) {
      window.clearTimeout(snapTimerRef.current);
    }

    if (dropTimerRef.current !== null) {
      window.clearTimeout(dropTimerRef.current);
    }

    snapTimerRef.current = window.setTimeout(
      () => {
        setDropCorrection((current) =>
          current?.id === cardId ? { ...current, rotate: 0 } : current
        );
        snapTimerRef.current = null;
      },
      Math.ceil(MOTION_FINAL.dropDuration * 1000 * MOTION_FINAL.snapBackSettleRatio)
    );

    dropTimerRef.current = window.setTimeout(
      () => {
        setDropCorrection(null);
        dropTimerRef.current = null;
      },
      Math.ceil(MOTION_FINAL.dropDuration * 1000) + 90
    );
  }, []);

  useEffect(() => {
    return () => {
      if (snapTimerRef.current !== null) {
        window.clearTimeout(snapTimerRef.current);
      }

      if (dropTimerRef.current !== null) {
        window.clearTimeout(dropTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!drag) {
      return;
    }

    const activeDrag = drag;

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerId !== activeDrag.pointerId || !boardRef.current) {
        return;
      }

      const boardRect = boardRef.current.getBoundingClientRect();
      const nextX = event.clientX - boardRect.left - activeDrag.offsetX;
      const nextY = event.clientY - boardRect.top - activeDrag.offsetY;
      const now = performance.now();
      const elapsed = Math.max(now - dragSampleRef.current.time, 16);
      const deltaX = nextX - dragSampleRef.current.x;
      const deltaY = nextY - dragSampleRef.current.y;
      const rotationSource = viewport === "mobile" ? deltaX * 0.35 : deltaX;
      const velocityRotation =
        (rotationSource / elapsed) * 100 * MOTION_FINAL.velocityRotationFactor;
      const direction =
        Math.abs(rotationSource) > 0.8
          ? Math.sign(rotationSource)
          : Math.sign(activeDrag.rotate);
      const targetRotate = direction * MOTION_FINAL.activeRotate + velocityRotation;
      const springInfluence = getSpringInfluence(MOTION_FINAL.rotationSpring);
      const nextRotate = clamp(
        dragSampleRef.current.rotate +
          (targetRotate - dragSampleRef.current.rotate) * springInfluence,
        -MOTION_FINAL.maxRotate,
        MOTION_FINAL.maxRotate
      );

      if (Math.hypot(deltaX, deltaY) > 4) {
        hasDraggedRef.current = true;
      }

      dragSampleRef.current = { rotate: nextRotate, time: now, x: nextX, y: nextY };
      setDrag((current) =>
        current ? { ...current, rotate: nextRotate, x: nextX, y: nextY } : current
      );

      const nextIndex = getNearestSlot(nextX, nextY);
      setOrderedIds((current) => moveCard(current, activeDrag.id, nextIndex));
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId === activeDrag.pointerId) {
        finishDrop(activeDrag.id, dragSampleRef.current.rotate);
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [drag, finishDrop, getNearestSlot, viewport]);

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>, cardId: string) {
    if (inert || isInteractionLocked || !boardRef.current) {
      return;
    }

    const cardRect = event.currentTarget.getBoundingClientRect();
    const boardRect = boardRef.current.getBoundingClientRect();
    const x = cardRect.left - boardRect.left;
    const y = cardRect.top - boardRect.top;

    event.currentTarget.setPointerCapture(event.pointerId);
    hasDraggedRef.current = false;
    setDropCorrection(null);
    dragSampleRef.current = {
      rotate: MOTION_FINAL.initialRotate,
      time: performance.now(),
      x,
      y
    };
    setDrag({
      id: cardId,
      offsetX: event.clientX - cardRect.left,
      offsetY: event.clientY - cardRect.top,
      pointerId: event.pointerId,
      rotate: MOTION_FINAL.initialRotate,
      x,
      y
    });
  }

  function handleCardClick(card: ActivityGridVisualCard) {
    if (inert || hasDraggedRef.current) {
      return;
    }

    void openCard(toModalCard(card));
  }

  useEffect(() => {
    const cardId = initialOpenCardIdRef.current;

    if (!cardId || inert || isInteractionLocked) {
      return;
    }

    const card = cardsById.get(cardId);

    if (!card) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      initialOpenCardIdRef.current = null;
      void openCard(toModalCard(card));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [cardsById, inert, isInteractionLocked, openCard]);

  const easeValue = toEase(MOTION_FINAL.ease);
  const rows = Math.ceil((orderedCards.length + 1) / columns);
  const gridWidth = columns * cardWidth + (columns - 1) * gap;
  const gridHeight = rows * cardHeight + (rows - 1) * gap;
  const addSlot = getSlotPosition(orderedCards.length);

  const board = (
    <div
      className="relative"
      ref={(element) => {
        boardRef.current = element;
        modalDestinationRef.current = element;
      }}
      style={{ height: gridHeight, width: gridWidth }}
    >
      {orderedCards.map((card, index) => {
        const isDragging = drag?.id === card.id;
        const correction = dropCorrection?.id === card.id ? dropCorrection : null;
        const isDropping = Boolean(correction);
        const slot = getSlotPosition(index);
        const x = isDragging && drag ? drag.x : slot.x;
        const y = isDragging && drag ? drag.y + MOTION_FINAL.liftY : slot.y;
        const scale = isDragging ? MOTION_FINAL.liftScale : 1;
        const rotate = isDragging && drag ? drag.rotate : (correction?.rotate ?? 0);
        const duration = isDropping ? MOTION_FINAL.dropDuration : MOTION_FINAL.layoutDuration;

        return (
          <button
            aria-haspopup="dialog"
            aria-label={`Open ${card.label} activity details`}
            className="absolute left-0 top-0 touch-none select-none rounded-[16px] bg-transparent text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d3a]/50"
            disabled={inert}
            draggable={false}
            key={card.id}
            onClick={() => handleCardClick(card)}
            onDragStart={(event) => event.preventDefault()}
            onFocus={() => !inert && preloadCard(toModalCard(card))}
            onMouseEnter={() => !inert && preloadCard(toModalCard(card))}
            onPointerDown={(event) => handlePointerDown(event, card.id)}
            ref={(element) => {
              registerCard?.(card.id, element);
              registerModalCard(card.id, element);
            }}
            style={{
              boxShadow: isDragging ? MOTION_FINAL.shadow : "none",
              height: cardHeight,
              transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
              transition: isDragging
                ? "box-shadow 120ms ease, transform 0ms"
                : `transform ${duration}s ${easeValue}, box-shadow ${duration}s ${easeValue}`,
              width: cardWidth,
              zIndex: isDragging ? 20 : 2
            }}
            type="button"
          >
            <ActivityGridCardSurface activity={card.activity} viewport={viewport} />
          </button>
        );
      })}

      <div
        aria-label="Add Activity placeholder"
        className="absolute left-0 top-0 flex items-center justify-center rounded-[14px] border-2 border-dashed border-[#c8bcaa] bg-[#fbf7ef]/70 text-[40px] font-light text-[#9e927f]"
        style={{
          height: cardHeight,
          transform: `translate3d(${addSlot.x}px, ${addSlot.y}px, 0)`,
          width: cardWidth
        }}
      >
        +
      </div>
    </div>
  );

  // Both mobile and desktop/tablet render the same way now: no internal
  // scroll/clip box anywhere. A capped, internally-scrolling region
  // (overflow-y: auto with a maxHeight) clips a dragged card on every
  // edge, not just the one it scrolls -- setting overflow-y to a
  // scrolling value forces the browser to clip overflow-x too, and the
  // maxHeight boundary clips the bottom the same way the header's old
  // scroll box clipped the top. The real page scrolls instead, the
  // normal way a webpage does, so a dragged card is never a child of
  // anything that can clip it.
  return (
    <div className="flex w-full items-start justify-center">
      {board}
      {transitionLayer}
    </div>
  );
}
