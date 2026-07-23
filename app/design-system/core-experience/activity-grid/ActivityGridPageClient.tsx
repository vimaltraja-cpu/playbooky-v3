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
import { ViewportReviewLayout } from "@/components/portal/ViewportReviewLayout";
import {
  ActivityCard,
  type ActivityCardData
} from "@/components/ui/ActivityCard";
import {
  useActivityModalShellTransition,
  type ActivityModalShellCard
} from "@/components/motion/activity-modal/ActivityModalShellTransition";
import type { CanonicalActivityCardRecord } from "@/lib/data/canonical-activity-cards";
import { getActivityDetailModalData } from "@/lib/design-system/activity-detail-modal-demo";

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
  gap: number;
  intrinsicHeight: number;
  intrinsicWidth: number;
  label: string;
  mode: ViewportMode;
  notes: string;
  scrollBehaviour: string;
};

type ActivityTemplateCard = {
  activity: ActivityCardData;
  id: string;
  label: string;
  modalData: ActivityModalShellCard["modalData"];
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
const DESKTOP_REPRESENTATIVE_WORKSHOP_ACTIVITY_SLUGS = [
  "problem-statement",
  "five-whys",
  "journey-map",
  "stakeholder-map",
  "how-might-we",
  "okrs"
] as const;

function toActivityCardData(activity: CanonicalActivityCardRecord) {
  return {
    description: activity.description,
    duration: activity.duration,
    illustration: activity.illustration,
    title: activity.title,
    workshopType: activity.workshopType
  } satisfies ActivityCardData;
}

function getInitialCards(activities: CanonicalActivityCardRecord[]) {
  const activitiesBySlug = new Map(
    activities.map((activity) => [activity.slug, activity])
  );

  return DESKTOP_REPRESENTATIVE_WORKSHOP_ACTIVITY_SLUGS.map((slug) => {
    const activity = activitiesBySlug.get(slug);

    if (!activity) {
      throw new Error(`Missing representative workshop activity: ${slug}`);
    }

    const cardData = toActivityCardData(activity);

    return {
      activity: cardData,
      id: `canonical-activity-${activity.slug}`,
      label: cardData.title,
      modalData: getActivityDetailModalData(activity)
    } satisfies ActivityTemplateCard;
  });
}

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
    intrinsicHeight: 900,
    intrinsicWidth: 1440,
    label: "Desktop",
    mode: "desktop",
    notes: "1440px by 900px desktop viewport using the Final motion baseline.",
    scrollBehaviour: "Scaled-to-fit viewport, no internal scroll."
  },
  tablet: {
    cardHeight: DEFAULT_CARD_HEIGHT,
    cardWidth: DEFAULT_CARD_WIDTH,
    columns: 4,
    gap: 22,
    intrinsicHeight: 834,
    intrinsicWidth: 1194,
    label: "Tablet",
    mode: "tablet",
    notes: "1194px by 834px landscape tablet viewport with four columns.",
    scrollBehaviour: "Scaled-to-fit landscape viewport; internal scroll only if content exceeds the viewport."
  },
  mobile: {
    cardHeight: 190,
    cardScrollHeight: 746,
    cardWidth: 333,
    columns: 1,
    gap: 18,
    intrinsicHeight: 852,
    intrinsicWidth: 394,
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
  { id: "viewports", label: "Viewport" },
  { id: "states", label: "States" },
  { id: "specs", label: "Specs" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" }
];

const overviewCopy = {
  statusNote:
    "Desktop now uses the approved ActivityCard component. Tablet and mobile remain neutral motion placeholders until their responsive card treatments are approved.",
  summary:
    "Activity Grid is the workshop arrangement surface where generated workshop activities are placed, reordered, and expanded over time.",
  whatItIs:
    "A responsive drag-and-reorder grid for arranging workshop activity cards with an Add Activity placeholder as part of the grid.",
  whenNotToUse:
    "Do not use this page to approve tablet/mobile ActivityCard visuals, activity content, library replacement flows, or production keyboard controls.",
  whenToUse:
    "Use it to review how approved desktop activity cards and responsive placeholders stack, scroll, drag, reorder, and settle.",
  whereItAppears:
    "Inside future workshop builder and arrangement experiences after portal approval.",
  whyItExists:
    "To make workshop planning feel tactile, like moving physical workshop cards on a table, while preserving clear structure across responsive layouts."
};

const specs = [
  ["Purpose", "Arrange generated workshop activities into an editable workshop flow."],
  [
    "Desktop behaviour",
    "1440px x 900px target viewport, five-column grid, approved ActivityCard component, scaled to fit the Design Portal content width."
  ],
  [
    "Tablet behaviour",
    "1194px x 834px landscape tablet target, four neutral motion placeholder columns where space permits, scaled to fit the portal content width."
  ],
  [
    "Mobile behaviour",
    "394px x 852px viewport, 746px card scroll area, 333px x 190px neutral placeholder cards, single-column stack."
  ],
  ["Add Activity", "Visible as the final non-draggable grid item."],
  ["Drag/reorder", "Cards can be dragged, reordered, dropped, and settled through physics-only motion."],
  ["Landing effects", "No decorative snap lines, pulses, glows, circles, ripples, or confirmation graphics."],
  [
    "Viewport scaling",
    "Demonstrations scale numerically to fit available portal width while preserving card proportions, spacing, and pointer accuracy."
  ],
  [
    "Production dimensions",
    "Desktop uses the approved ActivityCard dimensions. Tablet and mobile card treatments remain pending."
  ],
  [
    "Visual status",
    "Desktop uses approved cards; tablet and mobile intentionally remain blank motion placeholders."
  ]
];

const stateDocs = [
  [
    "Default",
    "Desktop cards rest as approved ActivityCards. Tablet and mobile placeholders rest in the current grid order. Add Activity remains visible as a fixed placeholder item."
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
    "The desktop ActivityCard or responsive placeholder follows pointer movement, nearby cards reflow into available slots, and rotation responds to direction and velocity."
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
    implementationValue: "1440px x 900px",
    label: "desktop viewport",
    status: "hardcoded"
  },
  {
    implementationValue: "4 columns",
    label: "tablet columns",
    status: "hardcoded"
  },
  {
    implementationValue: "1194px x 834px",
    label: "tablet landscape viewport",
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
        "Desktop uses the approved ActivityCard contrast treatment. Tablet and mobile placeholders are structural until responsive card visuals are approved.",
      title: "Card contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "Production grid wrappers require visible focus states that do not depend only on colour.",
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

function getScaledViewport(
  viewport: ViewportConfig,
  scale: number
): ViewportConfig {
  return {
    ...viewport,
    cardHeight: viewport.cardHeight * scale,
    cardScrollHeight: viewport.cardScrollHeight
      ? viewport.cardScrollHeight * scale
      : undefined,
    cardWidth: viewport.cardWidth * scale,
    gap: viewport.gap * scale,
    intrinsicHeight: viewport.intrinsicHeight * scale,
    intrinsicWidth: viewport.intrinsicWidth * scale
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
    y:
      Math.floor(index / viewport.columns) *
      (viewport.cardHeight + viewport.gap)
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

function DesktopActivityCardPreview({
  activity,
  scale
}: {
  activity: ActivityCardData;
  scale: number;
}) {
  return (
    <div
      style={{
        height: DEFAULT_CARD_HEIGHT * scale,
        width: DEFAULT_CARD_WIDTH * scale
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left"
        }}
      >
        <ActivityCard activity={activity} variant="builder" />
      </div>
    </div>
  );
}

function ActivityGridPlayArea({
  initialCards,
  variantKey,
  viewport
}: {
  initialCards: ActivityTemplateCard[];
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
  const hasDraggedRef = useRef(false);
  const previewShellRef = useRef<HTMLDivElement | null>(null);
  const [actionStatus, setActionStatus] = useState(
    "Replace Activity and Remove are non-destructive placeholders in this review surface."
  );
  const [availablePreviewWidth, setAvailablePreviewWidth] = useState(0);
  const {
    destinationRef: modalDestinationRef,
    isInteractionLocked,
    openCard,
    phase: modalPhase,
    preloadCard,
    registerCard,
    transitionLayer
  } = useActivityModalShellTransition({
    onRemoveActivity: (card) => {
      setActionStatus(
        `Remove is not connected yet for ${card.label}; no activity was changed.`
      );
    },
    onReplaceActivity: (card) => {
      setActionStatus(
        `Replace Activity is not connected yet for ${card.label}; no activity was changed.`
      );
    }
  });

  useEffect(() => {
    const element = previewShellRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setAvailablePreviewWidth(Math.max(0, element.clientWidth - 40));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const viewportScale = Math.min(
    1,
    availablePreviewWidth > 0
      ? availablePreviewWidth / viewport.intrinsicWidth
      : 1
  );
  const runtimeViewport = useMemo(
    () => getScaledViewport(viewport, viewportScale),
    [viewport, viewportScale]
  );
  const baseMotion = useMemo(
    () => getResponsiveMotion(viewport.mode, variantKey),
    [variantKey, viewport.mode]
  );
  const motion = useMemo(
    () => ({
      ...baseMotion,
      liftY: baseMotion.liftY * viewportScale
    }),
    [baseMotion, viewportScale]
  );
  const easeValue = toEaseValue(motion.ease);
  const slots = useMemo(
    () =>
      Array.from({ length: SLOT_COUNT }, (_, index) =>
        getSlotPosition(index, runtimeViewport)
      ),
    [runtimeViewport]
  );
  const rows = Math.ceil(SLOT_COUNT / runtimeViewport.columns);
  const gridWidth =
    runtimeViewport.columns * runtimeViewport.cardWidth +
    (runtimeViewport.columns - 1) * runtimeViewport.gap;
  const gridHeight =
    rows * runtimeViewport.cardHeight + (rows - 1) * runtimeViewport.gap;
  const isCompactCard = runtimeViewport.cardHeight < 260;
  const isMobile = viewport.mode === "mobile";
  // Desktop uses the approved ActivityCard; tablet/mobile remain motion placeholders pending responsive card approval.
  const usesApprovedActivityCard = viewport.mode === "desktop";

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

      if (Math.hypot(deltaX, deltaY) > 4) {
        hasDraggedRef.current = true;
      }

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

      const nextIndex = getNearestNormalSlot(nextX, nextY, runtimeViewport);
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
  }, [drag, finishDrop, motion, runtimeViewport, viewport.mode]);

  function handlePointerDown(
    event: React.PointerEvent<HTMLButtonElement>,
    cardId: string
  ) {
    if (!boardRef.current || isInteractionLocked) {
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

  const viewportChromeLabel =
    viewport.mode === "desktop"
      ? "Desktop minimum viewport"
      : viewport.mode === "tablet"
        ? "Landscape tablet viewport"
        : "Mobile viewport";

  const board = (
    <div
      aria-hidden={isInteractionLocked ? true : undefined}
      className="relative"
      ref={(element) => {
        boardRef.current = element;
        modalDestinationRef.current = element;
      }}
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
            aria-haspopup={usesApprovedActivityCard ? "dialog" : undefined}
            aria-label={
              usesApprovedActivityCard
                ? `Open ${card.label} activity details`
                : `Drag ${card.label}`
            }
            className={[
              "absolute left-0 top-0 select-none text-left",
              "touch-none will-change-transform focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d3a]/50",
              usesApprovedActivityCard
                ? "rounded-[16px] bg-transparent"
                : "rounded-[14px] border border-[#ded6c9] bg-[#fffdf8]",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            ].join(" ")}
            disabled={isInteractionLocked}
            draggable={false}
            key={card.id}
            onClick={() => {
              if (!usesApprovedActivityCard) {
                return;
              }

              void openCard(card);
            }}
            onDragStart={(event) => event.preventDefault()}
            onFocus={() => {
              if (usesApprovedActivityCard) {
                preloadCard(card);
              }
            }}
            onMouseEnter={() => {
              if (usesApprovedActivityCard) {
                preloadCard(card);
              }
            }}
            onPointerDown={(event) => handlePointerDown(event, card.id)}
            ref={(element) => {
              registerCard(card.id, element);
            }}
            style={{
              boxShadow: isDragging
                ? motion.shadow
                : usesApprovedActivityCard
                  ? "none"
                  : "0 4px 10px rgba(42, 34, 25, 0.08)",
              height: runtimeViewport.cardHeight,
              transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
              transition: isDragging
                ? "box-shadow 120ms ease, transform 0ms"
                : `transform ${duration}s ${easeValue}, box-shadow ${duration}s ${easeValue}`,
              width: runtimeViewport.cardWidth,
              zIndex: isDragging ? 20 : 2
            }}
            type="button"
          >
            {usesApprovedActivityCard ? (
              <DesktopActivityCardPreview
                activity={card.activity}
                scale={viewportScale}
              />
            ) : (
              <BlankMotionCard compact={isCompactCard} />
            )}
          </button>
        );
      })}

      <div
        aria-label="Add Activity placeholder"
        className="absolute left-0 top-0 flex items-center justify-center rounded-[14px] border-2 border-dashed border-[#c8bcaa] bg-[#fbf7ef]/70 text-[40px] font-light text-[#9e927f]"
        style={{
          height: runtimeViewport.cardHeight,
          transform: `translate3d(${slots[NORMAL_CARD_COUNT].x}px, ${slots[NORMAL_CARD_COUNT].y}px, 0)`,
          width: runtimeViewport.cardWidth
        }}
      >
        +
      </div>
    </div>
  );

  return (
    <article className="py-8">
      <div
        className="w-full rounded-[28px] border border-[#d9d0c1] bg-[#f6efe5] p-5 shadow-[0_18px_50px_-38px_rgba(38,31,24,0.3)]"
        ref={previewShellRef}
      >
        <div className="mb-3 flex items-center justify-between gap-4 text-xs text-[#7e7567]">
          <span className="font-semibold uppercase tracking-[0.16em]">
            {viewportChromeLabel}
          </span>
          <span>
            {viewport.intrinsicWidth} x {viewport.intrinsicHeight} scaled to{" "}
            {Math.round(viewportScale * 100)}%
          </span>
        </div>
        <div
          className="mx-auto overflow-hidden rounded-[20px] border border-[#d5cab9] bg-[#eee7dc] shadow-[0_16px_40px_-30px_rgba(38,31,24,0.45)]"
          style={{
            height: runtimeViewport.intrinsicHeight,
            width: runtimeViewport.intrinsicWidth
          }}
        >
          {isMobile ? (
            <div
              className="relative mx-auto"
              style={{
                height: runtimeViewport.cardScrollHeight,
                marginTop:
                  (runtimeViewport.intrinsicHeight -
                    (runtimeViewport.cardScrollHeight ?? 0)) /
                  2,
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
              className="mx-auto"
              style={{
                height: gridHeight,
                marginTop: Math.max(
                  0,
                  (runtimeViewport.intrinsicHeight - gridHeight) / 2
                ),
                width: gridWidth
              }}
            >
              {board}
            </div>
          )}
        </div>
      </div>

      <dl className="mt-5 grid gap-3 rounded-[18px] border border-[#e4d8c8] bg-[#fffdf8]/70 p-5 text-sm leading-6 text-[#5f564c] md:grid-cols-3">
        {[
          [
            "Intrinsic viewport",
            `${viewport.intrinsicWidth}px x ${viewport.intrinsicHeight}px`
          ],
          ["Rendered scale", `${Math.round(viewportScale * 100)}%`],
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
          ["Motion preset", motion.label],
          ["Activity detail modal", modalPhase]
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
      <p
        aria-live="polite"
        className="mt-3 text-sm leading-6 text-[color:var(--muted)]"
      >
        {actionStatus}
      </p>
      {transitionLayer}
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

function ViewportSection({
  initialCards
}: {
  initialCards: ActivityTemplateCard[];
}) {
  const [variantKey, setVariantKey] = useState<VariantKey>("final");
  const viewportItems = (["desktop", "tablet", "mobile"] as const).map(
    (mode) => {
      const viewport = VIEWPORTS[mode];

      return {
        id: mode,
        label: viewport.label,
        notes: [
          [
            "Frame",
            `${viewport.intrinsicWidth}px x ${viewport.intrinsicHeight}px`
          ],
          ["Grid", `${viewport.columns} columns`],
          ["Card", `${viewport.cardWidth}px x ${viewport.cardHeight}px`],
          ["Scroll", viewport.scrollBehaviour]
        ] satisfies Array<[string, string]>
      };
    }
  );

  return (
    <ViewportReviewLayout
      actions={
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
      }
      canvasClassName="p-0 sm:p-0"
      description="One active play area shows how the grid stacks, scrolls, drags, reorders, and snaps in the selected viewport."
      renderPreview={(activeViewport) => (
        <ActivityGridPlayArea
          key={`${activeViewport}-${variantKey}`}
          initialCards={initialCards}
          variantKey={variantKey}
          viewport={VIEWPORTS[activeViewport]}
        />
      )}
      viewports={viewportItems}
    />
  );
}

export function ActivityGridPageClient({
  activities
}: {
  activities: CanonicalActivityCardRecord[];
}) {
  const initialCards = useMemo(() => getInitialCards(activities), [activities]);

  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-grid" />

        <ComponentPageShell
          description="The workshop arrangement grid for testing responsive drag, reorder, scroll, and snap behaviour before production use."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />

          <ViewportSection initialCards={initialCards} />

          <StatesSection />

          <SpecsSection />

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
