"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
  ActivityCard,
  type ActivityCardData
} from "@/components/ui/ActivityCard";
import type { ActivityDetailModalData } from "@/components/ui/ActivityDetailModal";
import {
  ActivityModalShellTransition,
  initialActivityModalDebugState,
  type ActivityModalShellCard,
  type DebugOptions,
  type DebugState,
  type ShellPhase,
  type ShellState
} from "@/components/motion/activity-modal/ActivityModalShellTransition";
import {
  DEFAULT_VARIANT_ID,
  SHELL_VARIANTS,
  type ShellMotionVariant
} from "@/components/motion/activity-modal/activity-modal-motion-config";
import type { Rect } from "@/components/motion/activity-modal/activity-modal-motion-utils";

type ActivityModalShellPrototypeCard = ActivityModalShellCard & {
  activity: ActivityCardData;
  modalData: ActivityDetailModalData;
};

function toActivityCardData(activity: ActivityModalShellPrototypeCard["activity"]) {
  return activity;
}

function VariantSwitcher({
  activeVariant,
  onChange
}: {
  activeVariant: ShellMotionVariant;
  onChange: (variant: ShellMotionVariant) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {SHELL_VARIANTS.map((variant) => {
        const isActive = variant.id === activeVariant.id;

        return (
          <button
            className={[
              "rounded-[12px] px-4 py-2 text-sm font-semibold transition",
              isActive
                ? "bg-[#324236] text-[#FCFBFA] shadow-[0_10px_24px_rgba(36,31,24,0.16)]"
                : "border border-[#d8cbb8] bg-[#FCFBFA]/70 text-[#324236] hover:bg-white"
            ].join(" ")}
            key={variant.id}
            onClick={() => onChange(variant)}
            type="button"
          >
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}

function DebugPanel({
  activeVariant,
  debugOptions,
  debugState,
  onOptionsChange,
  onResume,
  phase,
  shell
}: {
  activeVariant: ShellMotionVariant;
  debugOptions: Required<DebugOptions> & {
    showDestinationBounds: boolean;
    showStartBounds: boolean;
  };
  debugState: DebugState;
  onOptionsChange: (
    nextOptions: Required<DebugOptions> & {
      showDestinationBounds: boolean;
      showStartBounds: boolean;
    }
  ) => void;
  onResume: () => void;
  phase: ShellPhase;
  shell: ShellState | null;
}) {
  return (
    <details className="mx-auto w-full max-w-[860px] rounded-[12px] border border-[#dfd4c5] bg-[#FCFBFA]/72 p-3 text-[#324236] shadow-[0_10px_28px_rgba(36,31,24,0.08)]">
      <summary className="cursor-pointer text-sm font-semibold">
        Debug controls
      </summary>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-2 text-sm">
          {[
            ["showStartBounds", "Show start bounds"],
            ["showDestinationBounds", "Show destination bounds"],
            ["pauseAtPeak", "Pause at frost peak"],
            ["slowMotion", "Slow motion 0.25x"]
          ].map(([key, label]) => (
            <label className="flex items-center gap-2" key={key}>
              <input
                checked={debugOptions[key as keyof typeof debugOptions]}
                onChange={(event) =>
                  onOptionsChange({
                    ...debugOptions,
                    [key]: event.target.checked
                  })
                }
                type="checkbox"
              />
              <span>{label}</span>
            </label>
          ))}

          {phase === "paused" ? (
            <button
              className="mt-2 rounded-[10px] bg-[#324236] px-3 py-2 text-sm font-semibold text-white"
              onClick={onResume}
              type="button"
            >
              Resume from frost peak
            </button>
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-x-5 gap-y-1 font-mono text-xs">
          <dt>Variant</dt>
          <dd>{activeVariant.id}</dd>
          <dt>Phase</dt>
          <dd>{phase}</dd>
          <dt>Progress</dt>
          <dd>{debugState.progress.toFixed(3)}</dd>
          <dt>Frost</dt>
          <dd>{debugState.frostStrength.toFixed(3)}</dd>
          <dt>Blur</dt>
          <dd>{debugState.backdropBlur.toFixed(1)}px</dd>
          <dt>Opacity</dt>
          <dd>{debugState.frostOpacity.toFixed(2)}</dd>
          <dt>Content</dt>
          <dd>{debugState.contentOpacity.toFixed(2)}</dd>
          <dt>Activity</dt>
          <dd>{shell?.card.label ?? "-"}</dd>
          <dt>Frame</dt>
          <dd>{debugState.frameMs.toFixed(1)}ms</dd>
          <dt>Start</dt>
          <dd>
            {shell
              ? `${Math.round(shell.startRect.left)}, ${Math.round(shell.startRect.top)}`
              : "-"}
          </dd>
          <dt>Destination</dt>
          <dd>
            {shell
              ? `${Math.round(shell.destinationRect.width)} x ${Math.round(shell.destinationRect.height)}`
              : "-"}
          </dd>
        </dl>
      </div>
    </details>
  );
}

function BoundsOverlay({
  destinationRect,
  showDestinationBounds,
  showStartBounds,
  startRect
}: {
  destinationRect: Rect | null;
  showDestinationBounds: boolean;
  showStartBounds: boolean;
  startRect: Rect | null;
}) {
  if (!showDestinationBounds && !showStartBounds) {
    return null;
  }

  return createPortal(
    <>
      {showStartBounds && startRect ? (
        <div
          className="pointer-events-none fixed z-[70] border-2 border-dashed border-[#D99C56]"
          style={{
            height: startRect.height,
            left: startRect.left,
            top: startRect.top,
            width: startRect.width
          }}
        />
      ) : null}

      {showDestinationBounds && destinationRect ? (
        <div
          className="pointer-events-none fixed z-[70] border-2 border-dashed border-[#324236]"
          style={{
            height: destinationRect.height,
            left: destinationRect.left,
            top: destinationRect.top,
            width: destinationRect.width
          }}
        />
      ) : null}
    </>,
    document.body
  );
}

export function ActivityModalShellPrototypeV2({
  cards
}: {
  cards: ActivityModalShellPrototypeCard[];
}) {
  const [activeVariantId, setActiveVariantId] = useState(DEFAULT_VARIANT_ID);
  const [debugOptions, setDebugOptions] = useState({
    pauseAtPeak: false,
    showDestinationBounds: false,
    showStartBounds: false,
    slowMotion: false
  });
  const [debugState, setDebugState] = useState<DebugState>(
    initialActivityModalDebugState
  );
  const [phase, setPhase] = useState<ShellPhase>("idle");
  const [shell, setShell] = useState<ShellState | null>(null);
  const activeVariant = useMemo(
    () =>
      SHELL_VARIANTS.find((variant) => variant.id === activeVariantId) ??
      SHELL_VARIANTS[0],
    [activeVariantId]
  );

  return (
    <ActivityModalShellTransition
      debugOptions={debugOptions}
      onDebugStateChange={setDebugState}
      onPhaseChange={setPhase}
      onShellChange={setShell}
      variant={activeVariant}
    >
      {({
        destinationRef,
        isInteractionLocked,
        openCard,
        preloadCard,
        registerCard,
        resumeFromPeak
      }) => (
        <main className="min-h-screen overflow-x-hidden bg-[#F3EEE7] px-6 py-7 text-[#324236]">
          <Link
            className="fixed left-6 top-6 z-40 inline-flex min-h-11 items-center rounded-[12px] border border-[#d8cbb8] bg-[#FCFBFA]/85 px-4 text-sm font-semibold text-[#324236] shadow-[0_10px_28px_rgba(36,31,24,0.08)] backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#aa7d3a]/50"
            href="/design-system/core-experience/activity-modal-motion"
          >
            ← Back to Design Portal
          </Link>

          <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1480px] flex-col justify-center gap-5">
            <header className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7D5330]">
                Activity Modal Motion V2
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                Isolated Shell Prototype
              </h1>
            </header>

            <VariantSwitcher
              activeVariant={activeVariant}
              onChange={(variant) => {
                if (!isInteractionLocked) {
                  setActiveVariantId(variant.id);
                }
              }}
            />

            <section
              aria-label="Activity shell motion prototype"
              className="mx-auto grid"
              ref={destinationRef}
              style={{
                gap: 24,
                gridTemplateColumns: "repeat(5, 256px)"
              }}
            >
              {cards.map((card) => (
                <button
                  aria-label={`Open V2 shell from ${card.label}`}
                  className="rounded-[16px] text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d3a]/50"
                  disabled={isInteractionLocked}
                  key={card.id}
                  onClick={() => {
                    void openCard(card);
                  }}
                  onFocus={() => preloadCard(card)}
                  onMouseEnter={() => preloadCard(card)}
                  ref={(element) => {
                    registerCard(card.id, element);
                  }}
                  type="button"
                >
                  <ActivityCard
                    activity={toActivityCardData(card.activity)}
                    variant="builder"
                  />
                </button>
              ))}
            </section>

            <DebugPanel
              activeVariant={activeVariant}
              debugOptions={debugOptions}
              debugState={debugState}
              onOptionsChange={setDebugOptions}
              onResume={resumeFromPeak}
              phase={phase}
              shell={shell}
            />
          </div>

          <BoundsOverlay
            destinationRect={shell?.destinationRect ?? null}
            showDestinationBounds={debugOptions.showDestinationBounds}
            showStartBounds={debugOptions.showStartBounds}
            startRect={shell?.startRect ?? null}
          />
        </main>
      )}
    </ActivityModalShellTransition>
  );
}
