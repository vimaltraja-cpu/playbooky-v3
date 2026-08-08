"use client";

import { useState } from "react";

import type {
  WashConfig,
  WashFieldConfig
} from "@/components/ui/site-background-wash/config";

function FieldRow({
  field,
  index,
  onChange
}: {
  field: WashFieldConfig;
  index: number;
  onChange: (index: number, patch: Partial<WashFieldConfig>) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 border-t border-[#efe9df] py-2.5 first:border-t-0">
      <span className="text-xs font-semibold text-[#094d40]">
        {field.label}
      </span>
      <input
        aria-label={`${field.label} colour`}
        className="h-7 w-10 cursor-pointer rounded border border-[#ded6ca] bg-transparent"
        onChange={(event) => onChange(index, { colorHex: event.target.value })}
        type="color"
        value={field.colorHex}
      />
      <label className="col-span-2 flex items-center gap-2 text-[11px] text-[#5e5a53]">
        Opacity
        <input
          className="w-full accent-[#365c55]"
          max={0.6}
          min={0}
          onChange={(event) =>
            onChange(index, { peakOpacity: Number(event.target.value) })
          }
          step={0.01}
          type="range"
          value={field.peakOpacity}
        />
        <span className="w-9 text-right font-mono">
          {field.peakOpacity.toFixed(2)}
        </span>
      </label>
    </div>
  );
}

function Dial({
  label,
  max,
  min,
  onChange,
  step,
  value
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-[#5e5a53]">
      <span className="w-24 shrink-0 font-semibold text-[#094d40]">
        {label}
      </span>
      <input
        className="w-full accent-[#365c55]"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <span className="w-10 text-right font-mono">{value.toFixed(2)}</span>
    </label>
  );
}

export function WashPlaygroundControls({
  config,
  defaultConfig,
  onChange
}: {
  config: WashConfig;
  defaultConfig: WashConfig;
  onChange: (config: WashConfig) => void;
}) {
  const [copied, setCopied] = useState(false);

  function updateField(index: number, patch: Partial<WashFieldConfig>) {
    const fields = config.fields.map((field, fieldIndex) =>
      fieldIndex === index ? { ...field, ...patch } : field
    );
    onChange({ ...config, fields });
  }

  function copyConfig() {
    navigator.clipboard
      .writeText(JSON.stringify(config, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => setCopied(false));
  }

  return (
    <aside className="fixed right-6 top-24 z-40 w-[300px] rounded-[16px] border border-[#ded6ca] bg-[#fcfbf9]/95 p-4 shadow-[0_16px_40px_rgba(36,31,24,0.14)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d5330]">
        Wash playground
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-[#5e5a53]">
        Colours, opacity and speed only — live against the canvas below.
      </p>

      <div className="mt-3">
        {config.fields.map((field, index) => (
          <FieldRow
            field={field}
            index={index}
            key={field.label}
            onChange={updateField}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-[#efe9df] pt-3">
        <Dial
          label="Speed"
          max={3}
          min={0.2}
          onChange={(value) => onChange({ ...config, speed: value })}
          step={0.05}
          value={config.speed}
        />
        <Dial
          label="Cursor pull"
          max={1}
          min={0}
          onChange={(value) => onChange({ ...config, cursorPull: value })}
          step={0.02}
          value={config.cursorPull}
        />
        <Dial
          label="Cursor ease"
          max={0.3}
          min={0.02}
          onChange={(value) => onChange({ ...config, cursorEase: value })}
          step={0.01}
          value={config.cursorEase}
        />
        <Dial
          label="Clearing"
          max={1}
          min={0}
          onChange={(value) => onChange({ ...config, clearingOpacity: value })}
          step={0.02}
          value={config.clearingOpacity}
        />
      </div>

      <div className="mt-3 flex gap-2 border-t border-[#efe9df] pt-3">
        <button
          className="min-h-9 flex-1 rounded-[10px] border border-[#ded6ca] bg-white text-xs font-semibold text-[#094d40] transition hover:bg-[#f6f3ee]"
          onClick={() => onChange(defaultConfig)}
          type="button"
        >
          Reset
        </button>
        <button
          className="min-h-9 flex-1 rounded-[10px] bg-[#094d40] text-xs font-semibold text-white transition hover:bg-[#0b5c4c]"
          onClick={copyConfig}
          type="button"
        >
          {copied ? "Copied!" : "Copy config"}
        </button>
      </div>
    </aside>
  );
}
