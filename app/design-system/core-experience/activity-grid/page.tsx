"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentPageShell,
  ComponentTokensSection,
  type ComponentAccessibilityItem,
  type ComponentSectionNavItem,
  type ComponentTokenRow
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";

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
  cardHeight: number;
  cardScrollHeight?: number;
  cardWidth: number;
  columns: number;
  frameHeight?: number;
  frameWidth?: number;
  gap: number;
  label: string;
  mode: ViewportMode;
  notes: string;
  scrollBehaviour: string;
};

type ActivityTemplateCard = {
  id: string;
  label: string;
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
};

const DEFAULT_CARD_WIDTH = 256;
const DEFAULT_CARD_HEIGHT = 370;
const NORMAL_CARD_COUNT = 6;
const SLOT_COUNT = NORMAL_CARD_COUNT + 1;

const initialCards: ActivityTemplateCard[] = Array.from(
  { length: NORMAL_CARD_COUNT },
  (_, index) => ({
    id: `portal-activity-${index + 1}`,
    label: `Activity ${index + 1}`
  })
);

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
    cardHeight: DEFAULT_CARD_HEIGHT,
    cardWidth: DEFAULT_CARD_WIDTH,
    columns: 5,
    gap: 24,
    label: "Desktop",
    mode: "desktop",
    notes: "Approved desktop pattern using the Final motion baseline.",
    scrollBehaviour: "Full-width canvas, no height cap."
  },
  tablet: {
    cardHeight: DEFAULT_CARD_HEIGHT,
    cardWidth: DEFAULT_CARD_WIDTH,
    columns: 2,
    frameHeight: 760,
    gap: 22,
    label: "Tablet",
    mode: "tablet",
    notes: "Two-column responsive test with reduced rotation.",
    scrollBehaviour: "Capped viewport with internal vertical scroll."
  },
  mobile: {
    cardHeight: 190,
    cardScrollHeight: 746,
    cardWidth: 333,
    columns: 1,
    frameHeight: 852,
    frameWidth: 394,
    gap: 18,
    label: "Mobile",
    mode: "mobile",
    notes: "Fixed 394px by 852px single-column mobile test.",
    scrollBehaviour: "Capped mobile viewport with internal vertical scroll."
  }
};

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-07-10",
  owner: "Design System",
  status: "Exploring",
  title: "Activity Grid"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Specs" },
  { id: "viewports", label: "Viewport" },
  { id: "states", label: "States" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" }
];

const overviewCopy = {
  statusNote:
    "Blank cards are intentional until ActivityCard visuals are fully signed off. This page validates grid behaviour, reordering, scroll treatment, and motion.",
  summary:
    "Activity Grid is the workshop arrangement surface where generated workshop activities are placed, reordered, and expanded over time.",
  whatItIs:
    "A responsive drag-and-reorder grid for arranging workshop activity cards with an Add Activity placeholder as part of the grid.",
  whenNotToUse:
    "Do not use this page to approve final ActivityCard visuals, activity content, library replacement flows, or production keyboard controls.",
  whenToUse:
    "Use it to review how activity cards stack, scroll, drag, reorder, and settle across desktop, tablet, and mobile.",
  whereItAppears:
    "Inside future workshop builder and arrangement experiences after portal approval.",
  whyItExists:
    "To make workshop planning feel tactile, like moving physical workshop cards on a table, while preserving clear structure across responsive layouts."
};

const specs = [
  ["Purpose", "Arrange generated workshop activities into an editable workshop flow."],
  ["Desktop behaviour", "Five-column grid using approved Final motion values."],
  ["Tablet behaviour", "Two-column responsive grid with capped vertical viewport and internal scroll."],
  [
    "Mobile behaviour",
    "394px x 852px viewport, 746px card scroll area, 333px x 190px cards, single-column stack."
  ],
  ["Add Activity", "Visible as the final non-draggable grid item."],
  ["Drag/reorder", "Cards can be dragged, reordered, dropped, and settled through physics-only motion."],
  ["Landing effects", "No decorative snap lines, pulses, glows, circles, ripples, or confirmation graphics."],
  ["Visual status", "Blank cards are used until the ActivityCard visual component is fully approved."]
];

const stateDocs = [
  [
    "Default",
    "Cards rest in the current grid order. Add Activity remains visible as a fixed placeholder item."
  ],
  [
    "Hover",
    "Cards show cursor affordance only. No additional visual controls or decorative effects are introduced."
  ],
  [
    "Press / Lift",
    "The active card lifts slightly, scales, and takes the initial directional rotation from the selected motion preset."
  ],
  [
    "Dragging",
    "The card follows pointer movement, nearby cards reflow into available slots, and rotation responds to direction and velocity."
  ],
  [
    "Drop / Settling",
    "The card snaps back with the approved physics timing. Confirmation comes from movement only."
  ],
  [
    "Add Activity placeholder",
    "Placeholder is visible at the end of the grid and is intentionally non-draggable in this demo."
  ],
  [
    "Scroll fade on mobile",
    "Top and bottom fades sit over the 746px mobile card scroll area and do not block pointer interaction."
  ]
];

const tokenRows: ComponentTokenRow[] = [
  { implementationValue: "1.03", label: "liftScale", status: "hardcoded" },
  { implementationValue: "-14px", label: "liftY", status: "hardcoded" },
  { implementationValue: "-3deg", label: "initialRotate", status: "hardcoded" },
  { implementationValue: "6deg", label: "activeRotate", status: "hardcoded" },
  { implementationValue: "10deg", label: "maxRotate", status: "hardcoded" },
  {
    implementationValue: "0.035",
    label: "velocityRotationFactor",
    status: "hardcoded"
  },
  {
    implementationValue: "stiffness 320 / damping 20",
    label: "rotationSpring",
    status: "hardcoded"
  },
  {
    implementationValue: "0.34s",
    label: "layoutDuration",
    status: "hardcoded"
  },
  {
    implementationValue: "0.32s",
    label: "dropDuration",
    status: "hardcoded"
  },
  {
    implementationValue: "2deg",
    label: "snapBackOvershoot",
    status: "hardcoded"
  },
  {
    implementationValue: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    label: "ease",
    status: "hardcoded"
  },
  {
    implementationValue: "5 columns",
    label: "desktop columns",
    status: "hardcoded"
  },
  {
    implementationValue: "2 columns",
    label: "tablet columns",
    status: "hardcoded"
  },
  {
    implementationValue: "333px x 190px",
    label: "mobile card size",
    status: "hardcoded"
  },
  {
    implementationValue: "746px",
    label: "mobile scroll area height",
    status: "hardcoded"
  }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Blank cards are structural placeholders. Final card contrast belongs to ActivityCard approval.",
      title: "Placeholder contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "Production cards require visible focus states that do not depend only on colour.",
      title: "Focus states required"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "Keyboard reorder support is not implemented in this motion demo and must be added before production use.",
      title: "Keyboard reordering pending"
    },
    {
      description:
        "Drag controls and Add Activity controls must be reachable through keyboard and assistive technology.",
      title: "Reachable controls"
    }
  ],
  reducedMotion: [
    {
      description:
        "Production implementation should respect prefers-reduced-motion and provide a non-animated reorder path.",
      title: "Reduced motion path"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "Add Activity placeholder has an accessible label in the demo; production must announce reorder state and position changes.",
      title: "Labels and announcements"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Mobile scroll fades use pointer-events: none and should remain non-blocking when final card interactions are added.",
      title: "Scroll fades"
    }
  ]
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
    x: (index % viewport.columns) * (viewport.cardWidth + viewport.gap),
    y: Math.floor(index / viewport.columns) * (viewport.cardHeight + viewport.gap)
  };
}

function getNearestNormalSlot(
  x: number,
  y: number,
  viewport: ViewportConfig
) {
  const centerX = x + viewport.cardWidth / 2;
  const centerY = y + viewport.cardHeight / 2;

  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < NORMAL_CARD_COUNT; index += 1) {
    const slot = getSlotPosition(index, viewport);
    const slotCenterX = slot.x + viewport.cardWidth / 2;
    const slotCenterY = slot.y + viewport.cardHeight / 2;
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

function BlankMotionCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <span
        className={[
          "block rounded-[10px] bg-[#f4efe6]",
          compact ? "h-10" : "h-24"
        ].join(" ")}
      />
      <span className="block">
        <span className="block h-4 w-28 rounded-full bg-[#e2d8c8]" />
        <span
          className={[
            "block h-3 rounded-full bg-[#ede5d8]",
            compact ? "mt-3 w-52" : "mt-4 w-44"
          ].join(" ")}
        />
        <span
          className={[
            "mt-3 block h-3 rounded-full bg-[#ede5d8]",
            compact ? "w-44" : "w-36"
          ].join(" ")}
        />
      </span>
      <span
        className={[
          "block rounded-full bg-[#f4efe6]",
          compact ? "h-5 w-20" : "h-8 w-24"
        ].join(" ")}
      />
    </div>
  );
}

function ActivityGridPlayArea({
  variantKey,
  viewport
}: {
  variantKey: VariantKey;
  viewport: ViewportConfig;
}) {
  const [cards, setCards] = useState(initialCards);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [dropCorrection, setDropCorrection] = useState<DropCorrection | null>(
    null
  );
  const [debugReadout, setDebugReadout] = useState<DebugReadout>({
    phase: "idle",
    rotation: 0,
    velocity: 0
  });
  const boardRef = useRef<HTMLDivElement | null>(null);
  const snapTimerRef = useRef<number | null>(null);
  const dropTimerRef = useRef<number | null>(null);
  const dragSampleRef = useRef({ rotate: 0, time: 0, x: 0, y: 0 });

  const motion = getResponsiveMotion(viewport.mode, variantKey);
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
    viewport.columns * viewport.cardWidth +
    (viewport.columns - 1) * viewport.gap;
  const gridHeight =
    rows * viewport.cardHeight + (rows - 1) * viewport.gap;
  const isCompactCard = viewport.cardHeight < 260;
  const isMobile = viewport.mode === "mobile";

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
            velocity: 0
          });
          dropTimerRef.current = null;
        },
        Math.ceil(motion.dropDuration * 1000) + 90
      );
    },
    [motion.dropDuration, motion.snapBackOvershoot, motion.snapBackSettleRatio]
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
      const rotationSource = viewport.mode === "mobile" ? deltaX * 0.35 : deltaX;
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
  }, [drag, finishDrop, motion, viewport]);

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
      velocity: 0
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

  const viewportStyle =
    viewport.mode === "desktop"
      ? {
          minHeight: gridHeight,
          width: "100%"
        }
      : {
          height: viewport.frameHeight,
          width: viewport.frameWidth ?? "100%"
        };

  const board = (
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
              height: viewport.cardHeight,
              transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
              transition: isDragging
                ? "box-shadow 120ms ease, transform 0ms"
                : `transform ${duration}s ${easeValue}, box-shadow ${duration}s ${easeValue}`,
              width: viewport.cardWidth,
              zIndex: isDragging ? 20 : 2
            }}
            type="button"
          >
            <BlankMotionCard compact={isCompactCard} />
          </button>
        );
      })}

      <div
        aria-label="Add Activity placeholder"
        className="absolute left-0 top-0 flex items-center justify-center rounded-[14px] border-2 border-dashed border-[#c8bcaa] bg-[#fbf7ef]/70 text-[40px] font-light text-[#9e927f]"
        style={{
          height: viewport.cardHeight,
          transform: `translate3d(${slots[NORMAL_CARD_COUNT].x}px, ${slots[NORMAL_CARD_COUNT].y}px, 0)`,
          width: viewport.cardWidth
        }}
      >
        +
      </div>
    </div>
  );

  return (
    <article className="py-12">
      <div className="mb-5">
        <h3 className="text-2xl font-semibold">{viewport.label}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
          {viewport.notes}
        </p>
      </div>

      <div
        className={[
          "rounded-[24px] border border-[#d9d0c1] bg-[#f7f2ea] p-6 shadow-[0_18px_50px_-38px_rgba(38,31,24,0.3)]",
          viewport.mode === "desktop"
            ? "overflow-x-auto"
            : isMobile
              ? "overflow-hidden"
              : "overflow-y-auto"
        ].join(" ")}
        style={viewportStyle}
      >
        {isMobile ? (
          <div
            className="relative mx-auto"
            style={{
              height: viewport.cardScrollHeight,
              width: gridWidth
            }}
          >
            <div
              className="h-full overflow-y-auto"
              style={{
                width: gridWidth
              }}
            >
              {board}
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-30 h-16 bg-gradient-to-b from-[#f7f2ea] via-[#f7f2ea]/80 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-20 bg-gradient-to-t from-[#f7f2ea] via-[#f7f2ea]/80 to-transparent"
            />
          </div>
        ) : (
          <div
            style={{
              height: gridHeight,
              width: gridWidth
            }}
          >
            {board}
          </div>
        )}
      </div>

      <dl className="mt-5 grid gap-3 rounded-[18px] border border-[#e4d8c8] bg-[#fffdf8]/70 p-5 text-sm leading-6 text-[#5f564c] md:grid-cols-3">
        {[
          ["Viewport width", viewport.frameWidth ? `${viewport.frameWidth}px` : "Full available width"],
          ["Viewport height", viewport.frameHeight ? `${viewport.frameHeight}px` : "Uncapped"],
          [
            "Card scroll area",
            viewport.cardScrollHeight
              ? `${viewport.cardScrollHeight}px`
              : "Matches viewport"
          ],
          ["Card size", `${viewport.cardWidth}px x ${viewport.cardHeight}px`],
          ["Columns", String(viewport.columns)],
          ["Card count", `${NORMAL_CARD_COUNT} cards + Add Activity`],
          ["Scroll behaviour", viewport.scrollBehaviour],
          ["Motion preset", motion.label]
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B77B32]">
              {label}
            </dt>
            <dd className="mt-1">{value}</dd>
          </div>
        ))}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B77B32]">
            Current phase
          </dt>
          <dd className="mt-1">
            {debugReadout.phase}, {debugReadout.rotation.toFixed(1)}deg,{" "}
            {Math.round(debugReadout.velocity)}px/s
          </dd>
        </div>
      </dl>
    </article>
  );
}

function SpecsSection() {
  return (
    <section id="specs" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Specs</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
        Activity Grid specs describe the workshop arrangement surface only.
        Production activity content, library replacement, and final card visuals
        remain outside this page.
      </p>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white/55">
        {specs.map(([label, value]) => (
          <div
            className="grid gap-3 border-b border-[color:var(--line)] p-4 last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)]"
            key={label}
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
              {label}
            </dt>
            <dd className="text-sm leading-6 text-[color:var(--muted)]">
              {value}
            </dd>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatesSection() {
  return (
    <section id="states" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">States</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
        These are documented interaction states for the grid behaviour. The
        demo keeps visual styling intentionally plain so motion can be reviewed
        without final card design noise.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {stateDocs.map(([label, value]) => (
          <article
            className="rounded-[20px] border border-[color:var(--line)] bg-white/55 p-5"
            key={label}
          >
            <h4 className="text-sm font-semibold text-[color:var(--foreground)]">
              {label}
            </h4>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              {value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ViewportSection() {
  const [activeViewport, setActiveViewport] =
    useState<ViewportMode>("desktop");
  const [variantKey, setVariantKey] = useState<VariantKey>("final");
  const viewport = VIEWPORTS[activeViewport];

  return (
    <section id="viewports" className="scroll-mt-40 py-10">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h3 className="text-2xl font-semibold">Viewport</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
            One active play area shows how the grid stacks, scrolls, drags,
            reorders, and snaps in the selected viewport. Measurement notes sit
            below the viewport so the play area keeps maximum room.
          </p>
        </div>

        <div className="space-y-3">
          <div
            aria-label="Viewport"
            className="grid grid-cols-3 rounded-[10px] border border-[#ddd4c5] bg-[#f4efe7] p-1"
            role="radiogroup"
          >
            {(["desktop", "tablet", "mobile"] as const).map((mode) => (
              <button
                aria-checked={activeViewport === mode}
                className={[
                  "h-9 rounded-[7px] px-4 text-[12px] font-semibold transition",
                  activeViewport === mode
                    ? "bg-white text-[#28231d] shadow-[0_2px_8px_rgba(38,31,24,0.12)]"
                    : "text-[#7e7567] hover:text-[#28231d]"
                ].join(" ")}
                key={mode}
                onClick={() => setActiveViewport(mode)}
                role="radio"
                type="button"
              >
                {VIEWPORTS[mode].label}
              </button>
            ))}
          </div>

          <div
            aria-label="Motion preset"
            className="grid grid-cols-4 rounded-[10px] border border-[#ddd4c5] bg-[#f4efe7] p-1"
            role="radiogroup"
          >
            {(["final", "calm", "playful", "expressive"] as const).map(
              (key) => (
                <button
                  aria-checked={variantKey === key}
                  className={[
                    "h-8 rounded-[7px] px-3 text-[11px] font-semibold transition",
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
              )
            )}
          </div>
        </div>
      </div>

      <ActivityGridPlayArea
        key={`${activeViewport}-${variantKey}`}
        variantKey={variantKey}
        viewport={viewport}
      />
    </section>
  );
}

export default function ActivityGridMotionPortalPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-grid" />

        <ComponentPageShell
          description="The workshop arrangement grid for testing responsive drag, reorder, scroll, and snap behaviour before production use."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <SpecsSection />

          <ViewportSection />

          <StatesSection />

          <ComponentTokensSection
            description="These motion and viewport values are implementation-level prototype values. They should become approved motion and layout tokens before production use."
            tokens={tokenRows}
          />

          <ComponentAccessibilitySection
            contrastNotes={accessibilityNotes.contrastNotes}
            focusBehaviour={accessibilityNotes.focusBehaviour}
            keyboardBehaviour={accessibilityNotes.keyboardBehaviour}
            reducedMotion={accessibilityNotes.reducedMotion}
            screenReaderNotes={accessibilityNotes.screenReaderNotes}
            unresolvedIssues={accessibilityNotes.unresolvedIssues}
          />
        </ComponentPageShell>
      </div>
    </main>
  );
}
