"use client";

import {
  type Dispatch,
  type MutableRefObject,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";

import {
  ActivityDetailModal,
  type ActivityDetailModalData
} from "@/components/ui/ActivityDetailModal";

import {
  APPROVED_PRODUCT_VARIANT,
  type ShellMotionVariant
} from "./activity-modal-motion-config";
import {
  getFrostState,
  getGeometryProgress,
  interpolateRect,
  mix,
  range,
  rectFromElement,
  type Rect
} from "./activity-modal-motion-utils";

export type ActivityModalShellCard = {
  id: string;
  label: string;
  modalData?: ActivityDetailModalData;
};

export type ShellPhase = "idle" | "opening" | "open" | "closing" | "paused";

export type ShellState = {
  card: ActivityModalShellCard;
  currentRect: Rect;
  destinationRect: Rect;
  phase: Exclude<ShellPhase, "idle">;
  progress: number;
  startRect: Rect;
};

export type DebugState = {
  backdropBlur: number;
  contentOpacity: number;
  currentRect: Rect | null;
  frameMs: number;
  frostOpacity: number;
  frostStrength: number;
  progress: number;
};

export type DebugOptions = {
  pauseAtPeak?: boolean;
  slowMotion?: boolean;
};

type ActivityModalShellTransitionOptions = {
  debugOptions?: DebugOptions;
  onDebugStateChange?: Dispatch<SetStateAction<DebugState>>;
  onPhaseChange?: (phase: ShellPhase) => void;
  onRemoveActivity?: (card: ActivityModalShellCard) => void;
  onReplaceActivity?: (card: ActivityModalShellCard) => void;
  onShellChange?: (shell: ShellState | null) => void;
  renderContent?: (context: {
    card: ActivityModalShellCard;
    closeShell: () => void;
    phase: Exclude<ShellPhase, "idle">;
  }) => ReactNode;
  variant?: ShellMotionVariant;
};

type ActivityModalShellTransitionApi = {
  closeShell: () => void;
  debugState: DebugState;
  destinationRef: MutableRefObject<HTMLDivElement | null>;
  isInteractionLocked: boolean;
  openCard: (card: ActivityModalShellCard) => Promise<void>;
  phase: ShellPhase;
  preloadCard: (card: ActivityModalShellCard) => void;
  registerCard: (cardId: string, element: HTMLButtonElement | null) => void;
  resumeFromPeak: () => void;
  shell: ShellState | null;
  transitionLayer: ReactNode;
};

const START_RADIUS = 16;
const END_RADIUS = 16;
const imagePromiseCache = new Map<string, Promise<void>>();

export const initialActivityModalDebugState: DebugState = {
  backdropBlur: 0,
  contentOpacity: 0,
  currentRect: null,
  frameMs: 0,
  frostOpacity: 0,
  frostStrength: 0,
  progress: 0
};

function getModalIllustrationSrc(
  illustration: ActivityDetailModalData["illustration"]
) {
  return illustration.modalSrc ?? illustration.src;
}

function getImagePreloadSources(src: string) {
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return [src];
  }

  if (!src.startsWith("/")) {
    return [src];
  }

  const encodedSrc = encodeURIComponent(src);

  return [
    src,
    `/_next/image?url=${encodedSrc}&w=1920&q=75`,
    `/_next/image?url=${encodedSrc}&w=2048&q=75`,
    `/_next/image?url=${encodedSrc}&w=3840&q=75`
  ];
}

function preloadImage(src: string): Promise<void> {
  const cached = imagePromiseCache.get(src);

  if (cached) {
    return cached;
  }

  const promise = new Promise<void>((resolve) => {
    const image = new window.Image();
    const resolveDecoded = () => {
      if (image.decode) {
        image.decode().then(resolve).catch(resolve);
        return;
      }

      resolve();
    };

    image.onload = resolveDecoded;
    image.onerror = () => resolve();
    image.decoding = "async";
    image.src = src;

    if (image.complete) {
      resolveDecoded();
    }
  });

  imagePromiseCache.set(src, promise);

  return promise;
}

export function preloadModalIllustration(
  illustration: ActivityDetailModalData["illustration"]
) {
  const src = getModalIllustrationSrc(illustration);

  return Promise.all(getImagePreloadSources(src).map(preloadImage)).then(
    () => undefined
  );
}

function getShellShadow(progress: number) {
  const shadowOpacity = mix(0.08, 0.18, progress);
  const shadowBlur = mix(8, 50, progress);

  return `0 18px ${shadowBlur}px rgba(36, 31, 24, ${shadowOpacity})`;
}

function getModalContentOpacity(progress: number) {
  if (progress <= 0.2) {
    return 0;
  }

  if (progress <= 0.45) {
    return range(progress, 0.2, 0.45, 0, 0.15);
  }

  if (progress <= 0.6) {
    return range(progress, 0.45, 0.6, 0.15, 0.4);
  }

  if (progress <= 0.85) {
    return range(progress, 0.6, 0.85, 0.4, 0.9);
  }

  return range(progress, 0.85, 1, 0.9, 1);
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  return prefersReducedMotion;
}

export function useActivityModalShellTransition({
  debugOptions,
  onDebugStateChange,
  onPhaseChange,
  onRemoveActivity,
  onReplaceActivity,
  onShellChange,
  renderContent,
  variant = APPROVED_PRODUCT_VARIANT
}: ActivityModalShellTransitionOptions = {}): ActivityModalShellTransitionApi {
  const [debugState, setDebugState] = useState(initialActivityModalDebugState);
  const [phase, setPhaseState] = useState<ShellPhase>("idle");
  const [shell, setShellState] = useState<ShellState | null>(null);
  const animationRef = useRef<number | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const contentCanvasRef = useRef<HTMLDivElement | null>(null);
  const debugLastUpdateRef = useRef(0);
  const destinationRef = useRef<HTMLDivElement | null>(null);
  const frostRef = useRef<HTMLDivElement | null>(null);
  const openingLockRef = useRef(false);
  const originCardRef = useRef<HTMLButtonElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const shellStateRef = useRef<ShellState | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const setPhase = (nextPhase: ShellPhase) => {
    setPhaseState(nextPhase);
    onPhaseChange?.(nextPhase);
  };

  const setShell: Dispatch<SetStateAction<ShellState | null>> = (nextShell) => {
    setShellState((currentShell) => {
      const resolvedShell =
        typeof nextShell === "function" ? nextShell(currentShell) : nextShell;

      shellStateRef.current = resolvedShell;
      onShellChange?.(resolvedShell);

      return resolvedShell;
    });
  };

  const updateDebugState: Dispatch<SetStateAction<DebugState>> = (nextState) => {
    setDebugState((currentState) => {
      const resolvedState =
        typeof nextState === "function" ? nextState(currentState) : nextState;

      onDebugStateChange?.(resolvedState);

      return resolvedState;
    });
  };

  useEffect(() => {
    shellStateRef.current = shell;
    onShellChange?.(shell);
  }, [onShellChange, shell]);

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "open") {
      return;
    }

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeShell();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // The Escape listener should only attach while the shell is open; closeShell
    // reads the current refs/state and should not cause listener churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function registerCard(cardId: string, element: HTMLButtonElement | null) {
    cardRefs.current[cardId] = element;
  }

  function preloadCard(card: ActivityModalShellCard) {
    if (card.modalData?.illustration) {
      void preloadModalIllustration(card.modalData.illustration);
    }
  }

  function restoreOriginFocus() {
    window.setTimeout(() => {
      originCardRef.current?.focus();
    }, 80);
  }

  function writeFrame(
    progress: number,
    startRect: Rect,
    destinationRect: Rect,
    forceDebug = false
  ) {
    const geometryProgress = getGeometryProgress(progress, variant);
    const rect = interpolateRect(startRect, destinationRect, geometryProgress);
    const frost = getFrostState(progress, variant);
    const contentOpacity = getModalContentOpacity(progress);
    const radius = mix(START_RADIUS, END_RADIUS, geometryProgress);
    const contentCanvas = contentCanvasRef.current;
    const shellElement = shellRef.current;
    const frostLayer = frostRef.current;

    if (shellElement) {
      Object.assign(shellElement.style, {
        borderRadius: `${radius}px`,
        boxShadow: getShellShadow(geometryProgress),
        height: `${rect.height}px`,
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`
      });
    }

    if (contentCanvas) {
      Object.assign(contentCanvas.style, {
        opacity: `${contentOpacity}`
      });
    }

    if (frostLayer) {
      Object.assign(frostLayer.style, {
        backgroundColor: `rgba(252, 251, 250, ${frost.frostOpacity})`,
        backdropFilter: `blur(${frost.backdropBlur}px) saturate(${frost.saturation})`,
        WebkitBackdropFilter: `blur(${frost.backdropBlur}px) saturate(${frost.saturation})`
      });
    }

    const now = window.performance.now();

    if (forceDebug || now - debugLastUpdateRef.current > 90) {
      debugLastUpdateRef.current = now;
      updateDebugState((current) => ({
        ...current,
        backdropBlur: frost.backdropBlur,
        contentOpacity,
        currentRect: rect,
        frostOpacity: frost.frostOpacity,
        frostStrength: frost.frostStrength,
        progress
      }));
    }

    return rect;
  }

  function animateShell({
    destinationRect,
    duration,
    from,
    onComplete,
    onPauseAtPeak,
    startRect,
    to
  }: {
    destinationRect: Rect;
    duration: number;
    from: number;
    onComplete: () => void;
    onPauseAtPeak?: () => void;
    startRect: Rect;
    to: number;
  }) {
    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
    }

    const startedAt = window.performance.now();
    let lastFrameAt = startedAt;
    let paused = false;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const localProgress = Math.min(1, elapsed / duration);
      const progress = from + (to - from) * localProgress;
      const currentRect = writeFrame(progress, startRect, destinationRect);

      updateDebugState((current) => ({
        ...current,
        frameMs: now - lastFrameAt
      }));
      lastFrameAt = now;

      if (
        onPauseAtPeak &&
        !paused &&
        from < to &&
        progress >= variant.frostPeak
      ) {
        paused = true;
        animationRef.current = null;
        onPauseAtPeak();
        setShell((current) =>
          current
            ? {
                ...current,
                currentRect,
                phase: "paused",
                progress
              }
            : current
        );
        setPhase("paused");
        return;
      }

      if (localProgress < 1) {
        animationRef.current = window.requestAnimationFrame(tick);
      } else {
        animationRef.current = null;
        writeFrame(to, startRect, destinationRect, true);
        onComplete();
      }
    };

    animationRef.current = window.requestAnimationFrame(tick);
  }

  async function openCard(card: ActivityModalShellCard) {
    if (openingLockRef.current || phase !== "idle") {
      return;
    }

    openingLockRef.current = true;

    if (card.modalData?.illustration) {
      await preloadModalIllustration(card.modalData.illustration);
    }

    const cardElement = cardRefs.current[card.id];
    const destinationElement = destinationRef.current;

    if (!cardElement || !destinationElement || phase !== "idle") {
      openingLockRef.current = false;
      return;
    }

    originCardRef.current = cardElement;

    const startRect = rectFromElement(cardElement);
    const destinationRect = rectFromElement(destinationElement);
    const initialShell: ShellState = {
      card,
      currentRect: startRect,
      destinationRect,
      phase: "opening",
      progress: 0,
      startRect
    };

    setShell(initialShell);
    setPhase("opening");
    updateDebugState({
      ...initialActivityModalDebugState,
      currentRect: startRect
    });

    requestAnimationFrame(() => {
      writeFrame(0, startRect, destinationRect, true);

      if (prefersReducedMotion) {
        writeFrame(1, startRect, destinationRect, true);
        setShell({
          ...initialShell,
          currentRect: destinationRect,
          phase: "open",
          progress: 1
        });
        setPhase("open");
        openingLockRef.current = false;
        return;
      }

      animateShell({
        destinationRect,
        duration:
          variant.openDuration * (debugOptions?.slowMotion ? 4 : 1),
        from: 0,
        onComplete: () => {
          setShell({
            ...initialShell,
            currentRect: destinationRect,
            phase: "open",
            progress: 1
          });
          setPhase("open");
        },
        onPauseAtPeak: debugOptions?.pauseAtPeak ? () => undefined : undefined,
        startRect,
        to: 1
      });

      openingLockRef.current = false;
    });
  }

  function resumeFromPeak() {
    const currentShell = shellStateRef.current;

    if (!currentShell || phase !== "paused") {
      return;
    }

    setShell({
      ...currentShell,
      phase: "opening"
    });
    setPhase("opening");
    animateShell({
      destinationRect: currentShell.destinationRect,
      duration:
        variant.openDuration *
        (1 - currentShell.progress) *
        (debugOptions?.slowMotion ? 4 : 1),
      from: currentShell.progress,
      onComplete: () => {
        setShell({
          ...currentShell,
          currentRect: currentShell.destinationRect,
          phase: "open",
          progress: 1
        });
        setPhase("open");
      },
      startRect: currentShell.startRect,
      to: 1
    });
  }

  function closeShell() {
    const currentShell = shellStateRef.current;

    if (!currentShell || phase !== "open") {
      return;
    }

    const cardElement = cardRefs.current[currentShell.card.id];

    if (!cardElement) {
      setShell(null);
      setPhase("idle");
      restoreOriginFocus();
      return;
    }

    const startRect = rectFromElement(cardElement);
    const closingShell = {
      ...currentShell,
      phase: "closing" as const,
      startRect
    };

    setShell(closingShell);
    setPhase("closing");

    if (prefersReducedMotion) {
      writeFrame(0, startRect, currentShell.destinationRect, true);
      setShell(null);
      setPhase("idle");
      restoreOriginFocus();
      return;
    }

    animateShell({
      destinationRect: currentShell.destinationRect,
      duration: variant.closeDuration * (debugOptions?.slowMotion ? 4 : 1),
      from: 1,
      onComplete: () => {
        writeFrame(0, startRect, currentShell.destinationRect, true);
        setShell(null);
        setPhase("idle");
        restoreOriginFocus();
      },
      startRect,
      to: 0
    });
  }

  const transitionLayer = shell
    ? createPortal(
      <div
        aria-label={
          renderContent
            ? shell.card.label
            : `${shell.card.label} activity details`
        }
        aria-modal={phase === "open" ? true : undefined}
        className="pointer-events-none fixed z-50 overflow-hidden border-[2px] border-[#B77B32] bg-[#FCFBFA]/[0.18] will-change-[top,left,width,height,border-radius,backdrop-filter]"
        ref={shellRef}
        role="dialog"
        style={{
          boxSizing: "border-box",
          height: shell.currentRect.height,
          left: shell.currentRect.left,
          top: shell.currentRect.top,
          width: shell.currentRect.width
        }}
      >
        <div
          className={[
            "absolute overflow-hidden [&>article]:h-full [&>article]:w-full",
            phase === "open" ? "pointer-events-auto" : "pointer-events-none"
          ].join(" ")}
          data-activity-modal-v2-content="true"
          ref={contentCanvasRef}
          style={{
            inset: 0
          }}
        >
          {renderContent ? (
            renderContent({
              card: shell.card,
              closeShell,
              phase: shell.phase
            })
          ) : shell.card.modalData ? (
            <ActivityDetailModal
              activity={shell.card.modalData}
              contentOnly
              isOpen
              onRemove={() => onRemoveActivity?.(shell.card)}
              onReplace={() => onReplaceActivity?.(shell.card)}
            />
          ) : null}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          data-activity-modal-v2-frost="true"
          ref={frostRef}
        />

        {phase === "open" ? (
          <button
            aria-label={
              renderContent ? "Close activity library" : "Close activity details"
            }
            className="pointer-events-auto absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/80 text-2xl leading-none text-[#324236] shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#aa7d3a]/50"
            onClick={closeShell}
            ref={closeButtonRef}
            type="button"
          >
            <span aria-hidden="true">x</span>
          </button>
        ) : null}
      </div>,
      document.body
    )
    : null;

  return {
    closeShell,
    debugState,
    destinationRef,
    isInteractionLocked: phase !== "idle",
    openCard,
    phase,
    preloadCard,
    registerCard,
    resumeFromPeak,
    shell,
    transitionLayer
  };
}

export function ActivityModalShellTransition({
  children,
  ...options
}: ActivityModalShellTransitionOptions & {
  children: (api: ActivityModalShellTransitionApi) => ReactNode;
}) {
  const api = useActivityModalShellTransition(options);

  return (
    <>
      {children(api)}
      {api.transitionLayer}
    </>
  );
}

export type ActivityModalShellDestinationRef = MutableRefObject<HTMLDivElement | null>;
