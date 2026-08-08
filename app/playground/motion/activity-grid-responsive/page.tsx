"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ViewportMode = "desktop" | "tablet" | "mobile";
type VariantKey = "final" | "calm" | "playful" | "expressive";

type MotionConfig = {
  activeRotate: number;
  dropDuration: number;
  ease: [number, number, number, number];
  initialRotate: number;
  label: string;
  layoutDuration: number;
  liftScale: number;
  liftY: number;
  maxRotate: number;
  rotationSpring: { damping: number; stiffness: number };
  shadow: string;
  snapBackOvershoot: number;
  snapBackSettleRatio: number;
  velocityRotationFactor: number;
};

type ViewportConfig = {
  columns: number;
  gap: number;
  label: string;
  mode: ViewportMode;
  notes: string;
  shellWidth: number;
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

type DropCorrection = {
  id: string;
  rotate: number;
};

type DebugReadout = {
  phase: "idle" | "lifting" | "dragging" | "dropping" | "settling";
  rotation: number;
  velocity: number;
  viewport: ViewportMode;
};

const CARD_WIDTH = 256;
const CARD_HEIGHT = 370;
const NORMAL_CARD_COUNT = 6;
const SLOT_COUNT = NORMAL_CARD_COUNT + 1;

const cardsSeed = Array.from({ length: NORMAL_CARD_COUNT }, (_, index) => ({
  id: `responsive-activity-${index + 1}`,
  label: `Activity ${index + 1}`
}));

type ActivityTemplateCard = (typeof cardsSeed)[number];

const BASE_VARIANTS: Record<VariantKey, MotionConfig> = {
  final: {
    activeRotate: 6,
    dropDuration: 0.32,
    ease: [0.2, 0.8, 0.2, 1],
    initialRotate: -3,
    label: "PlayBooky Final Candidate",
    layoutDuration: 0.34,
    liftScale: 1.03,
    liftY: -14,
    maxRotate: 10,
    rotationSpring: { stiffness: 320, damping: 20 },
    shadow: "0 32px 54px rgba(42, 34, 25, 0.24)",
    snapBackOvershoot: 2,
    snapBackSettleRatio: 0.62,
    velocityRotationFactor: 0.035
  },
  calm: {
    activeRotate: 3,
    dropDuration: 0.28,
    ease: [0.2, 0.8, 0.2, 1],
    initialRotate: -2,
    label: "Heavy Calm",
    layoutDuration: 0.3,
    liftScale: 1.02,
    liftY: -10,
    maxRotate: 5,
    rotationSpring: { stiffness: 260, damping: 28 },
    shadow: "0 24px 42px rgba(42, 34, 25, 0.2)",
    snapBackOvershoot: 1.5,
    snapBackSettleRatio: 0.58,
    velocityRotationFactor: 0.015
  },
  playful: {
    activeRotate: 4,
    dropDuration: 0.32,
    ease: [0.2, 0.8, 0.2, 1],
    initialRotate: -2,
    label: "Heavy Playful",
    layoutDuration: 0.34,
    liftScale: 1.025,
    liftY: -12,
    maxRotate: 8,
    rotationSpring: { stiffness: 300, damping: 24 },
    shadow: "0 28px 46px rgba(42, 34, 25, 0.22)",
    snapBackOvershoot: 2,
    snapBackSettleRatio: 0.62,
    velocityRotationFactor: 0.025
  },
  expressive: {
    activeRotate: 6,
    dropDuration: 0.36,
    ease: [0.2, 0.8, 0.2, 1],
    initialRotate: -3,
    label: "Heavy Expressive",
    layoutDuration: 0.38,
    liftScale: 1.03,
    liftY: -14,
    maxRotate: 10,
    rotationSpring: { stiffness: 320, damping: 20 },
    shadow: "0 32px 54px rgba(42, 34, 25, 0.24)",
    snapBackOvershoot: 3,
    snapBackSettleRatio: 0.66,
    velocityRotationFactor: 0.035
  }
};

const VIEWPORTS: Record<ViewportMode, ViewportConfig> = {
  desktop: {
    columns: 5,
    gap: 24,
    label: "Desktop",
    mode: "desktop",
    notes: "Approved desktop grid pattern and PlayBooky Final Candidate motion.",
    shellWidth: 1500
  },
  tablet: {
    columns: 2,
    gap: 22,
    label: "Tablet",
    mode: "tablet",
    notes: "Two-column test with reduced rotation and slightly tighter movement.",
    shellWidth: 680
  },
  mobile: {
    columns: 1,
    gap: 18,
    label: "Mobile",
    mode: "mobile",
    notes: "Single-column stacked test with calmer rotation and vertical-first feel.",
    shellWidth: 360
  }
};

function getResponsiveMotion(
  viewportMode: ViewportMode,
  variantKey: VariantKey
): MotionConfig {
  const base = BASE_VARIANTS[variantKey];

  if (viewportMode === "desktop") {
    return base;
  }

  if (viewportMode === "tablet") {
    return {
      ...base,
      activeRotate: base.activeRotate * 0.72,
      dropDuration: Math.max(base.dropDuration - 0.02, 0.26),
      initialRotate: base.initialRotate * 0.7,
      layoutDuration: Math.max(base.layoutDuration - 0.02, 0.28),
      liftY: base.liftY * 0.8,
      maxRotate: base.maxRotate * 0.68,
      snapBackOvershoot: base.snapBackOvershoot * 0.75,
      velocityRotationFactor: base.velocityRotationFactor * 0.62
    };
  }

  return {
    ...base,
    activeRotate: base.activeRotate * 0.42,
    dropDuration: Math.max(base.dropDuration - 0.04, 0.24),
    initialRotate: base.initialRotate * 0.45,
    layoutDuration: Math.max(base.layoutDuration - 0.04, 0.26),
    liftScale: Math.min(base.liftScale, 1.02),
    liftY: base.liftY * 0.55,
    maxRotate: base.maxRotate * 0.4,
    rotationSpring: { stiffness: 280, damping: 28 },
    snapBackOvershoot: base.snapBackOvershoot * 0.52,
    velocityRotationFactor: base.velocityRotationFactor * 0.28
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toEaseValue(ease: MotionConfig["ease"]) {
  return `cubic-bezier(${ease.join(", ")})`;
}

function getSlotPosition(index: number, viewport: ViewportConfig) {
  return {
    x: (index % viewport.columns) * (CARD_WIDTH + viewport.gap),
    y: Math.floor(index / viewport.columns) * (CARD_HEIGHT + viewport.gap)
  };
}

function getNearestNormalSlot(
  x: number,
  y: number,
  viewport: ViewportConfig
) {
  const centerX = x + CARD_WIDTH / 2;
  const centerY = y + CARD_HEIGHT / 2;

  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < NORMAL_CARD_COUNT; index += 1) {
    const slot = getSlotPosition(index, viewport);
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

function getSpringInfluence({
  damping,
  stiffness
}: MotionConfig["rotationSpring"]) {
  return clamp(stiffness / 320 - damping / 120, 0.45, 0.82);
}

function BlankMotionCard() {
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <span className="block h-24 rounded-[10px] bg-[#f4efe6]" />
      <span className="block">
        <span className="block h-4 w-28 rounded-full bg-[#e2d8c8]" />
        <span className="mt-4 block h-3 w-44 rounded-full bg-[#ede5d8]" />
        <span className="mt-3 block h-3 w-36 rounded-full bg-[#ede5d8]" />
      </span>
      <span className="block h-8 w-24 rounded-full bg-[#f4efe6]" />
    </div>
  );
}

export default function ActivityGridResponsiveMotionPlaygroundPage() {
  const [cards, setCards] = useState(cardsSeed);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [variantKey, setVariantKey] = useState<VariantKey>("final");
  const [drag, setDrag] = useState<DragState | null>(null);
  const [dropCorrection, setDropCorrection] = useState<DropCorrection | null>(
    null
  );
  const [debugReadout, setDebugReadout] = useState<DebugReadout>({
    phase: "idle",
    rotation: 0,
    velocity: 0,
    viewport: "desktop"
  });
  const boardRef = useRef<HTMLDivElement | null>(null);
  const snapTimerRef = useRef<number | null>(null);
  const dropTimerRef = useRef<number | null>(null);
  const dragSampleRef = useRef({ rotate: 0, time: 0, x: 0, y: 0 });

  const viewport = VIEWPORTS[viewportMode];
  const motion = getResponsiveMotion(viewportMode, variantKey);
  const easeValue = toEaseValue(motion.ease);
  const slots = useMemo(
    () =>
      Array.from({ length: SLOT_COUNT }, (_, index) =>
        getSlotPosition(index, viewport)
      ),
    [viewport]
  );
  const rows = Math.ceil(SLOT_COUNT / viewport.columns);
  const gridWidth =
    viewport.columns * CARD_WIDTH + (viewport.columns - 1) * viewport.gap;
  const gridHeight = rows * CARD_HEIGHT + (rows - 1) * viewport.gap;

  const finishDrop = useCallback(
    (cardId: string, releaseRotate: number) => {
      const releaseDirection =
        releaseRotate === 0 ? 1 : Math.sign(releaseRotate);
      const counterRotate = -releaseDirection * motion.snapBackOvershoot;

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
        Math.ceil(motion.dropDuration * 1000 * motion.snapBackSettleRatio)
      );

      dropTimerRef.current = window.setTimeout(
        () => {
          setDropCorrection(null);
          setDebugReadout({
            phase: "idle",
            rotation: 0,
            velocity: 0,
            viewport: viewportMode
          });
          dropTimerRef.current = null;
        },
        Math.ceil(motion.dropDuration * 1000) + 90
      );
    },
    [
      motion.dropDuration,
      motion.snapBackOvershoot,
      motion.snapBackSettleRatio,
      viewportMode
    ]
  );

  function handleViewportChange(nextMode: ViewportMode) {
    setDrag(null);
    setDropCorrection(null);
    setViewportMode(nextMode);
    setDebugReadout({
      phase: "idle",
      rotation: 0,
      velocity: 0,
      viewport: nextMode
    });
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLButtonElement>,
    cardId: string
  ) {
    if (!boardRef.current) {
      return;
    }

    const cardRect = event.currentTarget.getBoundingClientRect();
    const boardRect = boardRef.current.getBoundingClientRect();
    const x = cardRect.left - boardRect.left;
    const y = cardRect.top - boardRect.top;

    event.currentTarget.setPointerCapture(event.pointerId);
    setDropCorrection(null);
    dragSampleRef.current = {
      rotate: motion.initialRotate,
      time: performance.now(),
      x,
      y
    };
    setDebugReadout({
      phase: "lifting",
      rotation: motion.initialRotate,
      velocity: 0,
      viewport: viewportMode
    });
    setDrag({
      id: cardId,
      offsetX: event.clientX - cardRect.left,
      offsetY: event.clientY - cardRect.top,
      pointerId: event.pointerId,
      rotate: motion.initialRotate,
      x,
      y
    });
  }

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
      const rotationSource =
        viewportMode === "mobile" ? deltaX * 0.35 : deltaX;
      const velocity = (Math.hypot(deltaX, deltaY) / elapsed) * 1000;
      const direction =
        Math.abs(rotationSource) > 0.8
          ? Math.sign(rotationSource)
          : Math.sign(activeDrag.rotate);
      const velocityRotation =
        (rotationSource / elapsed) * 100 * motion.velocityRotationFactor;
      const targetRotate = direction * motion.activeRotate + velocityRotation;
      const springInfluence = getSpringInfluence(motion.rotationSpring);
      const nextRotate = clamp(
        dragSampleRef.current.rotate +
          (targetRotate - dragSampleRef.current.rotate) * springInfluence,
        -motion.maxRotate,
        motion.maxRotate
      );

      dragSampleRef.current = {
        rotate: nextRotate,
        time: now,
        x: nextX,
        y: nextY
      };
      setDebugReadout({
        phase: "dragging",
        rotation: nextRotate,
        velocity,
        viewport: viewportMode
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

      const nextIndex = getNearestNormalSlot(nextX, nextY, viewport);
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
  }, [drag, finishDrop, motion, viewport, viewportMode]);

  return (
    <main className="min-h-screen overflow-auto bg-[#eee7dc] px-8 py-10 text-[#28231d]">
      <aside className="fixed right-6 top-6 z-50 w-[390px] rounded-[8px] border border-[#d9d0c1] bg-[#fffdf8]/95 p-3 shadow-[0_14px_34px_rgba(38,31,24,0.12)] backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7e7567]">
          Responsive motion sandbox
        </p>

        <div
          aria-label="Viewport mode"
          className="mt-3 grid grid-cols-3 rounded-[6px] border border-[#ddd4c5] bg-[#f4efe7] p-1"
          role="radiogroup"
        >
          {(["desktop", "tablet", "mobile"] as const).map((mode) => (
            <button
              aria-checked={viewportMode === mode}
              className={[
                "h-8 rounded-[4px] text-[11px] font-semibold transition",
                viewportMode === mode
                  ? "bg-white text-[#28231d] shadow-[0_2px_8px_rgba(38,31,24,0.12)]"
                  : "text-[#7e7567] hover:text-[#28231d]"
              ].join(" ")}
              key={mode}
              onClick={() => handleViewportChange(mode)}
              role="radio"
              type="button"
            >
              {VIEWPORTS[mode].label}
            </button>
          ))}
        </div>

        <div
          aria-label="Motion preset"
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
                : BASE_VARIANTS[key].label.replace("Heavy ", "")}
            </button>
          ))}
        </div>

        <dl className="mt-3 grid gap-1.5 border-t border-[#e5ddd0] pt-3 text-[11px] leading-4">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Viewport</dt>
            <dd className="font-medium">{viewport.label}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Preset</dt>
            <dd className="font-medium">{motion.label}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Columns</dt>
            <dd className="font-mono">{viewport.columns}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Max rotate</dt>
            <dd className="font-mono">{motion.maxRotate.toFixed(1)}deg</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Rotation</dt>
            <dd className="font-mono">{debugReadout.rotation.toFixed(2)}deg</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Velocity</dt>
            <dd className="font-mono">
              {Math.round(debugReadout.velocity)}px/s
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[#7e7567]">Phase</dt>
            <dd className="font-medium">{debugReadout.phase}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[11px] leading-4 text-[#8c8376]">
          {viewport.notes}
        </p>
      </aside>

      <section aria-label="Responsive Activity Grid Motion Playground">
        <div className="mb-10 max-w-[760px]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d806f]">
            Local responsive motion sandbox
          </p>
          <h1 className="mt-3 text-[22px] font-semibold tracking-normal">
            Activity Grid Responsive Motion Playground
          </h1>
          <p className="mt-3 max-w-[620px] text-sm leading-6 text-[#756b5f]">
            Tests the approved physics-only Activity Grid motion across
            desktop, tablet, and mobile layouts before it enters the Design
            Portal.
          </p>
        </div>

        <div
          className="rounded-[20px] border border-[#d9d0c1] bg-[#f7f2ea] p-8"
          style={{ width: viewport.shellWidth }}
        >
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
              const y = isDragging ? drag.y + motion.liftY : slot.y;
              const scale = isDragging ? motion.liftScale : 1;
              const rotate = isDragging
                ? drag.rotate
                : (correction?.rotate ?? 0);
              const duration = isDropping
                ? motion.dropDuration
                : motion.layoutDuration;

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
                      ? motion.shadow
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
                  <BlankMotionCard />
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
        </div>
      </section>
    </main>
  );
}
