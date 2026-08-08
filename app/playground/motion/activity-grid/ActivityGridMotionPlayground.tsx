"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type VariantKey = "final" | "calm" | "playful" | "expressive";

type HeavyVariant = {
  label: string;
  ease: [number, number, number, number];
  layoutDuration: number;
  liftScale: number;
  liftY: number;
  initialRotate: number;
  activeRotate: number;
  maxRotate: number;
  velocityRotationFactor: number;
  rotationSpring: { stiffness: number; damping: number };
  shadow: string;
  dropDuration: number;
  snapBackOvershoot: number;
  snapBackSettleRatio: number;
};

const HEAVY_VARIANTS: Record<VariantKey, HeavyVariant> = {
  final: {
    label: "PlayBooky Final Candidate",
    ease: [0.2, 0.8, 0.2, 1],
    layoutDuration: 0.34,
    liftScale: 1.03,
    liftY: -14,
    initialRotate: -3,
    activeRotate: 6,
    maxRotate: 10,
    velocityRotationFactor: 0.035,
    rotationSpring: { stiffness: 320, damping: 20 },
    shadow: "0 32px 54px rgba(42, 34, 25, 0.24)",
    dropDuration: 0.32,
    snapBackOvershoot: 2,
    snapBackSettleRatio: 0.62
  },
  calm: {
    label: "Heavy Calm",
    ease: [0.2, 0.8, 0.2, 1],
    layoutDuration: 0.3,
    liftScale: 1.02,
    liftY: -10,
    initialRotate: -2,
    activeRotate: 3,
    maxRotate: 5,
    velocityRotationFactor: 0.015,
    rotationSpring: { stiffness: 260, damping: 28 },
    shadow: "0 24px 42px rgba(42, 34, 25, 0.2)",
    dropDuration: 0.28,
    snapBackOvershoot: 1.5,
    snapBackSettleRatio: 0.58
  },
  playful: {
    label: "Heavy Playful",
    ease: [0.2, 0.8, 0.2, 1],
    layoutDuration: 0.34,
    liftScale: 1.025,
    liftY: -12,
    initialRotate: -2,
    activeRotate: 4,
    maxRotate: 8,
    velocityRotationFactor: 0.025,
    rotationSpring: { stiffness: 300, damping: 24 },
    shadow: "0 28px 46px rgba(42, 34, 25, 0.22)",
    dropDuration: 0.32,
    snapBackOvershoot: 2,
    snapBackSettleRatio: 0.62
  },
  expressive: {
    label: "Heavy Expressive",
    ease: [0.2, 0.8, 0.2, 1],
    layoutDuration: 0.38,
    liftScale: 1.03,
    liftY: -14,
    initialRotate: -3,
    activeRotate: 6,
    maxRotate: 10,
    velocityRotationFactor: 0.035,
    rotationSpring: { stiffness: 320, damping: 20 },
    shadow: "0 32px 54px rgba(42, 34, 25, 0.24)",
    dropDuration: 0.36,
    snapBackOvershoot: 3,
    snapBackSettleRatio: 0.66
  }
};

const CARD_WIDTH = 256;
const CARD_HEIGHT = 370;
const GRID_GAP = 24;
const COLUMNS = 5;
const NORMAL_CARD_COUNT = 6;
const SLOT_COUNT = NORMAL_CARD_COUNT + 1;

const initialCards = Array.from({ length: NORMAL_CARD_COUNT }, (_, index) => ({
  id: `activity-${index + 1}`,
  label: `Activity ${index + 1}`
}));

type ActivityTemplateCard = (typeof initialCards)[number];

type DragState = {
  id: string;
  offsetX: number;
  offsetY: number;
  pointerId: number;
  rotate: number;
  x: number;
  y: number;
};

type DropCorrection = {
  id: string;
  rotate: number;
};

type DropPhase = "idle" | "lifting" | "dragging" | "dropping" | "settling";

type DebugReadout = {
  direction: "left" | "right" | "still";
  phase: DropPhase;
  rotation: number;
  velocity: number;
};

function getSlotPosition(index: number) {
  return {
    x: (index % COLUMNS) * (CARD_WIDTH + GRID_GAP),
    y: Math.floor(index / COLUMNS) * (CARD_HEIGHT + GRID_GAP)
  };
}

function getNearestNormalSlot(x: number, y: number) {
  const centerX = x + CARD_WIDTH / 2;
  const centerY = y + CARD_HEIGHT / 2;

  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < NORMAL_CARD_COUNT; index += 1) {
    const slot = getSlotPosition(index);
    const slotCenterX = slot.x + CARD_WIDTH / 2;
    const slotCenterY = slot.y + CARD_HEIGHT / 2;
    const distance =
      (centerX - slotCenterX) * (centerX - slotCenterX) +
      (centerY - slotCenterY) * (centerY - slotCenterY);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  }

  return nearestIndex;
}

function moveCard(
  cards: ActivityTemplateCard[],
  activeId: string,
  nextIndex: number
) {
  const currentIndex = cards.findIndex((card) => card.id === activeId);

  if (currentIndex === -1 || currentIndex === nextIndex) {
    return cards;
  }

  const nextCards = [...cards];
  const [activeCard] = nextCards.splice(currentIndex, 1);
  nextCards.splice(nextIndex, 0, activeCard);

  return nextCards;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toEaseValue(ease: HeavyVariant["ease"]) {
  return `cubic-bezier(${ease.join(", ")})`;
}

function getSpringInfluence({
  damping,
  stiffness
}: HeavyVariant["rotationSpring"]) {
  return clamp(stiffness / 320 - damping / 120, 0.45, 0.82);
}

export function ActivityGridMotionPlayground() {
  const [cards, setCards] = useState(initialCards);
  const [variantKey, setVariantKey] = useState<VariantKey>("final");
  const [drag, setDrag] = useState<DragState | null>(null);
  const [dropCorrection, setDropCorrection] = useState<DropCorrection | null>(
    null
  );
  const [debugReadout, setDebugReadout] = useState<DebugReadout>({
    direction: "still",
    phase: "idle",
    rotation: 0,
    velocity: 0
  });
  const boardRef = useRef<HTMLDivElement | null>(null);
  const dropTimerRef = useRef<number | null>(null);
  const snapTimerRef = useRef<number | null>(null);
  const dragSampleRef = useRef({ rotate: 0, time: 0, x: 0 });

  const variant = HEAVY_VARIANTS[variantKey];
  const easeValue = toEaseValue(variant.ease);

  const slots = useMemo(
    () =>
      Array.from({ length: SLOT_COUNT }, (_, index) => getSlotPosition(index)),
    []
  );

  const gridWidth = COLUMNS * CARD_WIDTH + (COLUMNS - 1) * GRID_GAP;
  const gridHeight = 2 * CARD_HEIGHT + GRID_GAP;

  const finishDrop = useCallback(
    (cardId: string, releaseRotate: number) => {
      const releaseDirection =
        releaseRotate === 0 ? 1 : Math.sign(releaseRotate);
      const counterRotate = -releaseDirection * variant.snapBackOvershoot;

      setDrag(null);
      setDropCorrection({ id: cardId, rotate: counterRotate });
      setDebugReadout((current) => ({
        ...current,
        phase: "dropping",
        rotation: counterRotate
      }));

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
          setDebugReadout((current) => ({
            ...current,
            phase: "settling",
            rotation: 0
          }));
          snapTimerRef.current = null;
        },
        Math.ceil(variant.dropDuration * 1000 * variant.snapBackSettleRatio)
      );

      dropTimerRef.current = window.setTimeout(
        () => {
          setDropCorrection(null);
          setDebugReadout({
            direction: "still",
            phase: "idle",
            rotation: 0,
            velocity: 0
          });
          dropTimerRef.current = null;
        },
        Math.ceil(variant.dropDuration * 1000) + 90
      );
    },
    [
      variant.dropDuration,
      variant.snapBackOvershoot,
      variant.snapBackSettleRatio
    ]
  );

  useEffect(() => {
    return () => {
      if (dropTimerRef.current !== null) {
        window.clearTimeout(dropTimerRef.current);
      }

      if (snapTimerRef.current !== null) {
        window.clearTimeout(snapTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "1") {
        setVariantKey("final");
      }

      if (event.key === "2") {
        setVariantKey("calm");
      }

      if (event.key === "3") {
        setVariantKey("playful");
      }

      if (event.key === "4") {
        setVariantKey("expressive");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
      const velocity = (deltaX / elapsed) * 1000;
      const direction =
        Math.abs(deltaX) > 0.8
          ? Math.sign(deltaX)
          : Math.sign(activeDrag.rotate);
      const velocityRotation =
        (deltaX / elapsed) * 100 * variant.velocityRotationFactor;
      const targetRotate = direction * variant.activeRotate + velocityRotation;
      const springInfluence = getSpringInfluence(variant.rotationSpring);
      const nextRotate = clamp(
        dragSampleRef.current.rotate +
          (targetRotate - dragSampleRef.current.rotate) * springInfluence,
        -variant.maxRotate,
        variant.maxRotate
      );

      dragSampleRef.current = {
        rotate: nextRotate,
        time: now,
        x: nextX
      };
      setDebugReadout({
        direction: velocity < -4 ? "left" : velocity > 4 ? "right" : "still",
        phase: "dragging",
        rotation: nextRotate,
        velocity
      });

      setDrag((current) =>
        current
          ? {
              ...current,
              rotate: nextRotate,
              x: nextX,
              y: nextY
            }
          : current
      );

      const nextIndex = getNearestNormalSlot(nextX, nextY);
      setCards((currentCards) =>
        moveCard(currentCards, activeDrag.id, nextIndex)
      );
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
  }, [
    drag,
    finishDrop,
    variant.activeRotate,
    variant.maxRotate,
    variant.rotationSpring,
    variant.velocityRotationFactor
  ]);

  function handlePointerDown(
    event: React.PointerEvent<HTMLButtonElement>,
    cardId: string
  ) {
    if (!boardRef.current) {
      return;
    }

    const cardRect = event.currentTarget.getBoundingClientRect();
    const boardRect = boardRef.current.getBoundingClientRect();

    event.currentTarget.setPointerCapture(event.pointerId);
    setDropCorrection(null);
    dragSampleRef.current = {
      rotate: variant.initialRotate,
      time: performance.now(),
      x: cardRect.left - boardRect.left
    };
    setDebugReadout({
      direction: "still",
      phase: "lifting",
      rotation: variant.initialRotate,
      velocity: 0
    });
    setDrag({
      id: cardId,
      offsetX: event.clientX - cardRect.left,
      offsetY: event.clientY - cardRect.top,
      pointerId: event.pointerId,
      rotate: variant.initialRotate,
      x: cardRect.left - boardRect.left,
      y: cardRect.top - boardRect.top
    });
  }

  return (
    <main className="min-h-screen min-w-[1500px] overflow-auto bg-[#eee7dc] px-14 py-12 text-[#28231d]">
      <aside className="fixed right-6 top-6 z-50 w-[360px] rounded-[8px] border border-[#d9d0c1] bg-[#fffdf8]/95 p-3 shadow-[0_14px_34px_rgba(38,31,24,0.12)] backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7e7567]">
          Heavy motion variant
        </p>
        <div
          aria-label="Heavy motion variant"
          className="mt-3 grid grid-cols-4 rounded-[6px] border border-[#ddd4c5] bg-[#f4efe7] p-1"
          role="radiogroup"
        >
          {(["final", "calm", "playful", "expressive"] as const).map((key) => (
            <button
              aria-checked={variantKey === key}
              className={[
                "h-8 rounded-[4px] text-[11px] font-semibold transition",
                variantKey === key
                  ? "bg-white text-[#28231d] shadow-[0_2px_8px_rgba(38,31,24,0.12)]"
                  : "text-[#7e7567] hover:text-[#28231d]"
              ].join(" ")}
              key={key}
              onClick={() => setVariantKey(key)}
              role="radio"
              type="button"
            >
              {key === "final"
                ? "Final"
                : HEAVY_VARIANTS[key].label.replace("Heavy ", "")}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#e5ddd0] pt-3 text-xs">
          <span className="text-[#7e7567]">Current</span>
          <span className="font-semibold">{variant.label}</span>
        </div>
        <dl className="mt-3 grid gap-1.5 border-t border-[#e5ddd0] pt-3 text-[11px] leading-4">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Variant</dt>
            <dd className="font-medium">{variant.label}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Rotation</dt>
            <dd className="font-mono">{debugReadout.rotation.toFixed(2)}deg</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Velocity</dt>
            <dd className="font-mono">
              {Math.round(debugReadout.velocity)}px/s {debugReadout.direction}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Phase</dt>
            <dd className="font-medium">{debugReadout.phase}</dd>
          </div>
        </dl>
        <p className="mt-2 text-[11px] leading-4 text-[#8c8376]">
          Press 1, 2, 3, or 4 to switch feel.
        </p>
      </aside>

      <section aria-label="Activity Grid Motion Playground">
        <div className="mb-10 max-w-[760px]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d806f]">
            Desktop motion sandbox
          </p>
          <h1 className="mt-3 text-[22px] font-semibold tracking-normal">
            Activity Grid Motion Playground
          </h1>
        </div>

        <div
          className="relative"
          ref={boardRef}
          style={{
            height: gridHeight,
            width: gridWidth
          }}
        >
          {cards.map((card, index) => {
            const isDragging = drag?.id === card.id;
            const correction =
              dropCorrection?.id === card.id ? dropCorrection : null;
            const isDropping = Boolean(correction);
            const slot = slots[index];
            const x = isDragging ? drag.x : slot.x;
            const y = isDragging ? drag.y + variant.liftY : slot.y;
            const scale = isDragging ? variant.liftScale : 1;
            const rotate = isDragging ? drag.rotate : (correction?.rotate ?? 0);
            const duration = isDropping
              ? variant.dropDuration
              : variant.layoutDuration;

            return (
              <button
                aria-label={`Drag ${card.label}`}
                className={[
                  "absolute left-0 top-0 select-none rounded-[14px] border border-[#ded6c9] bg-[#fffdf8] text-left",
                  "touch-none will-change-transform focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d3a]/50",
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                ].join(" ")}
                key={card.id}
                onPointerDown={(event) => handlePointerDown(event, card.id)}
                style={{
                  boxShadow: isDragging
                    ? variant.shadow
                    : "0 4px 10px rgba(42, 34, 25, 0.08)",
                  height: CARD_HEIGHT,
                  transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
                  transition: isDragging
                    ? "box-shadow 120ms ease, transform 0ms"
                    : `transform ${duration}s ${easeValue}, box-shadow ${duration}s ${easeValue}`,
                  width: CARD_WIDTH,
                  zIndex: isDragging ? 20 : 2
                }}
                type="button"
              >
                <div className="flex h-full flex-col justify-between p-5">
                  <span className="block h-24 rounded-[10px] bg-[#f4efe6]" />
                  <span className="block">
                    <span className="block h-4 w-28 rounded-full bg-[#e2d8c8]" />
                    <span className="mt-4 block h-3 w-44 rounded-full bg-[#ede5d8]" />
                    <span className="mt-3 block h-3 w-36 rounded-full bg-[#ede5d8]" />
                  </span>
                  <span className="block h-8 w-24 rounded-full bg-[#f4efe6]" />
                </div>
              </button>
            );
          })}

          <div
            aria-label="Add Activity placeholder"
            className="absolute left-0 top-0 flex items-center justify-center rounded-[14px] border-2 border-dashed border-[#c8bcaa] bg-[#fbf7ef]/70 text-[40px] font-light text-[#9e927f]"
            style={{
              height: CARD_HEIGHT,
              transform: `translate3d(${slots[NORMAL_CARD_COUNT].x}px, ${slots[NORMAL_CARD_COUNT].y}px, 0)`,
              width: CARD_WIDTH
            }}
          >
            +
          </div>
        </div>
      </section>
    </main>
  );
}
