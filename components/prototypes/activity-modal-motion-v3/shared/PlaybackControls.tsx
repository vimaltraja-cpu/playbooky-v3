"use client";

import type { PlaybackSpeed } from "./types";

export function PlaybackControls({
  disabled,
  onReplay,
  onSpeedChange,
  onToggleReducedMotionPreview,
  reducedMotionPreview,
  speed
}: {
  disabled: boolean;
  onReplay: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onToggleReducedMotionPreview: () => void;
  reducedMotionPreview: boolean;
  speed: PlaybackSpeed;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button
        className="rounded-[10px] bg-[#324236] px-3 py-1.5 font-semibold text-[#FCFBFA] transition disabled:cursor-not-allowed disabled:opacity-40"
        disabled={disabled}
        onClick={onReplay}
        type="button"
      >
        ↺ Replay
      </button>

      <div className="flex items-center gap-1 rounded-[10px] border border-[#d8cbb8] bg-[#FCFBFA]/70 p-1">
        {(["normal", "slow"] as const).map((option) => (
          <button
            className={[
              "rounded-[8px] px-2.5 py-1 font-semibold transition",
              speed === option
                ? "bg-[#324236] text-[#FCFBFA]"
                : "text-[#324236] hover:bg-white"
            ].join(" ")}
            disabled={disabled}
            key={option}
            onClick={() => onSpeedChange(option)}
            type="button"
          >
            {option === "normal" ? "1x" : "0.25x slow-mo"}
          </button>
        ))}
      </div>

      <button
        aria-pressed={reducedMotionPreview}
        className={[
          "rounded-[10px] border px-3 py-1.5 font-semibold transition",
          reducedMotionPreview
            ? "border-[#7D5330] bg-[#7D5330] text-[#FCFBFA]"
            : "border-[#d8cbb8] bg-[#FCFBFA]/70 text-[#324236] hover:bg-white"
        ].join(" ")}
        disabled={disabled}
        onClick={onToggleReducedMotionPreview}
        type="button"
      >
        {reducedMotionPreview ? "Reduced motion: on" : "Preview reduced motion"}
      </button>
    </div>
  );
}
