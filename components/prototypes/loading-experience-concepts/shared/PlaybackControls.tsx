"use client";

import type { PlaybackSpeed } from "./types";

export function PlaybackControls({
  onReplay,
  onSpeedChange,
  onTogglePaused,
  paused,
  speed
}: {
  onReplay: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onTogglePaused: () => void;
  paused: boolean;
  speed: PlaybackSpeed;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button
        className="rounded-[10px] bg-[#324236] px-3 py-1.5 font-semibold text-[#FCFBFA] transition"
        onClick={onReplay}
        type="button"
      >
        ↺ Replay
      </button>

      <button
        className="rounded-[10px] border border-[#d8cbb8] bg-[#FCFBFA]/70 px-3 py-1.5 font-semibold text-[#324236] transition hover:bg-white"
        onClick={onTogglePaused}
        type="button"
      >
        {paused ? "▶ Play" : "⏸ Pause"}
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
            key={option}
            onClick={() => onSpeedChange(option)}
            type="button"
          >
            {option === "normal" ? "1x" : "0.25x slow-mo"}
          </button>
        ))}
      </div>
    </div>
  );
}
