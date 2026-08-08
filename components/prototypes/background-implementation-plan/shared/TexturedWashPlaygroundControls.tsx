"use client";

import { useState } from "react";

import type {
  TexturedField,
  TexturedWashConfig
} from "@/components/ui/site-background-wash/texturedConfig";

function Dial({
  hint,
  label,
  max,
  min,
  onChange,
  step,
  value
}: {
  hint?: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}) {
  return (
    <label className="block text-[11px] text-[#5e5a53]">
      <span className="flex items-center justify-between font-semibold text-[#094d40]">
        {label}
        <span className="font-mono font-normal text-[#5e5a53]">
          {value.toFixed(2)}
        </span>
      </span>
      <input
        className="mt-1 w-full accent-[#365c55]"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
      {hint ? <span className="mt-0.5 block leading-snug">{hint}</span> : null}
    </label>
  );
}

function Toggle({
  checked,
  hint,
  label,
  onChange
}: {
  checked: boolean;
  hint?: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2 text-[11px] text-[#5e5a53]">
      <input
        checked={checked}
        className="mt-0.5 accent-[#365c55]"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span>
        <span className="block font-semibold text-[#094d40]">{label}</span>
        {hint ? <span className="block leading-snug">{hint}</span> : null}
      </span>
    </label>
  );
}

function Section({
  children,
  defaultOpen,
  title
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  title: string;
}) {
  return (
    <details
      className="border-t border-[#efe9df] py-2.5 first:border-t-0"
      open={defaultOpen}
    >
      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.08em] text-[#7d5330]">
        {title}
      </summary>
      <div className="mt-2 flex flex-col gap-2.5">{children}</div>
    </details>
  );
}

function FieldControls({
  field,
  onChange
}: {
  field: TexturedField;
  onChange: (patch: Partial<TexturedField>) => void;
}) {
  return (
    <div className="rounded-[10px] border border-[#efe9df] p-2.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#094d40]">
          {field.label}
        </span>
        <input
          aria-label={`${field.label} colour`}
          className="h-6 w-9 cursor-pointer rounded border border-[#ded6ca] bg-transparent"
          onChange={(event) => onChange({ colorHex: event.target.value })}
          type="color"
          value={field.colorHex}
        />
      </div>
      <Dial
        hint="How strong the bloom's ink is at its core."
        label="Opacity"
        max={0.6}
        min={0}
        onChange={(value) => onChange({ opacity: value })}
        step={0.01}
        value={field.opacity}
      />
      <Dial
        hint="How much of the corner the bloom's footprint covers."
        label="Spread"
        max={0.7}
        min={0.15}
        onChange={(value) => onChange({ spread: value })}
        step={0.01}
        value={field.spread}
      />
      <Dial
        hint="Number of small sub-blobs that make up the cellular texture — higher reads as more granulated paper bloom, lower as a smoother cloud."
        label="Cluster count"
        max={30}
        min={4}
        onChange={(value) => onChange({ clusterCount: Math.round(value) })}
        step={1}
        value={field.clusterCount}
      />
      <Dial
        hint="How far the sub-blobs scatter from the bloom's centre — higher looks more broken-up and organic."
        label="Cellularity"
        max={1}
        min={0.1}
        onChange={(value) => onChange({ cellularity: value })}
        step={0.02}
        value={field.cellularity}
      />
      <Dial
        hint="How far the whole bloom wanders from its corner as it drifts."
        label="Drift amount"
        max={0.25}
        min={0}
        onChange={(value) => onChange({ driftAmount: value })}
        step={0.01}
        value={field.driftAmount}
      />
    </div>
  );
}

export function TexturedWashPlaygroundControls({
  config,
  defaultConfig,
  onChange
}: {
  config: TexturedWashConfig;
  defaultConfig: TexturedWashConfig;
  onChange: (config: TexturedWashConfig) => void;
}) {
  const [copied, setCopied] = useState(false);

  function updateField(index: number, patch: Partial<TexturedField>) {
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
    <aside className="fixed right-3 top-24 z-40 max-h-[calc(100vh-7rem)] w-[min(320px,calc(100vw-1.5rem))] overflow-y-auto rounded-[16px] border border-[#ded6ca] bg-[#fcfbf9]/95 p-4 shadow-[0_16px_40px_rgba(36,31,24,0.14)] backdrop-blur sm:right-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d5330]">
        Textured watercolor playground
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-[#5e5a53]">
        Corner-anchored, cellular blooms with paper grain, shimmer and faint
        linework. Every dial below is live against the canvas — nothing here is
        locked in yet.
      </p>

      <Section defaultOpen title="Blooms">
        <p className="text-[11px] leading-snug text-[#5e5a53]">
          Each bloom is a cluster of small overlapping colour blobs anchored to
          a corner, so it reads as a textured, cellular stain rather than a
          smooth gradient — the same technique as the reference image, in brand
          colours only.
        </p>
        {config.fields.map((field, index) => (
          <FieldControls
            field={field}
            key={field.id}
            onChange={(patch) => updateField(index, patch)}
          />
        ))}
      </Section>

      <Section title="Texture">
        <Dial
          hint="Opacity of the fine paper-grain speckle laid over everything. 0 turns it off."
          label="Grain"
          max={0.25}
          min={0}
          onChange={(value) =>
            onChange({
              ...config,
              texture: { ...config.texture, grain: value }
            })
          }
          step={0.01}
          value={config.texture.grain}
        />
        <Dial
          hint="How far the watercolor edge filter warps the bloom outlines — higher looks more bled and irregular, lower looks cleaner."
          label="Edge turbulence"
          max={140}
          min={10}
          onChange={(value) =>
            onChange({
              ...config,
              texture: { ...config.texture, edgeTurbulenceScale: value }
            })
          }
          step={2}
          value={config.texture.edgeTurbulenceScale}
        />
        <Dial
          hint="Softness of the bloom edges after the warp — higher is hazier and more diffuse."
          label="Edge blur"
          max={60}
          min={5}
          onChange={(value) =>
            onChange({
              ...config,
              texture: { ...config.texture, edgeBlur: value }
            })
          }
          step={1}
          value={config.texture.edgeBlur}
        />
      </Section>

      <Section title="Shimmer">
        <Toggle
          checked={config.shimmer.enabled}
          hint="Small twinkling flecks scattered inside each bloom, like the gold specks in the reference."
          label="Enable shimmer"
          onChange={(checked) =>
            onChange({
              ...config,
              shimmer: { ...config.shimmer, enabled: checked }
            })
          }
        />
        <label className="flex items-center gap-2 text-[11px] text-[#5e5a53]">
          <span className="w-16 shrink-0 font-semibold text-[#094d40]">
            Colour
          </span>
          <input
            className="h-6 w-9 cursor-pointer rounded border border-[#ded6ca] bg-transparent"
            onChange={(event) =>
              onChange({
                ...config,
                shimmer: { ...config.shimmer, colorHex: event.target.value }
              })
            }
            type="color"
            value={config.shimmer.colorHex}
          />
        </label>
        <Dial
          hint="How many shimmer flecks appear per bloom."
          label="Density"
          max={24}
          min={0}
          onChange={(value) =>
            onChange({
              ...config,
              shimmer: { ...config.shimmer, density: Math.round(value) }
            })
          }
          step={1}
          value={config.shimmer.density}
        />
        <Dial
          hint="Peak brightness of each fleck at the top of its twinkle."
          label="Intensity"
          max={1}
          min={0}
          onChange={(value) =>
            onChange({
              ...config,
              shimmer: { ...config.shimmer, intensity: value }
            })
          }
          step={0.02}
          value={config.shimmer.intensity}
        />
        <Dial
          hint="How fast the flecks twinkle in and out."
          label="Twinkle speed"
          max={3}
          min={0.1}
          onChange={(value) =>
            onChange({
              ...config,
              shimmer: { ...config.shimmer, speed: value }
            })
          }
          step={0.05}
          value={config.shimmer.speed}
        />
      </Section>

      <Section title="Linework">
        <Toggle
          checked={config.linework.enabled}
          hint="Faint connected-dot lines near the top of the canvas, echoing the constellation lines in the reference."
          label="Enable linework"
          onChange={(checked) =>
            onChange({
              ...config,
              linework: { ...config.linework, enabled: checked }
            })
          }
        />
        <Dial
          hint="Strength of the lines and node dots."
          label="Opacity"
          max={0.3}
          min={0}
          onChange={(value) =>
            onChange({
              ...config,
              linework: { ...config.linework, opacity: value }
            })
          }
          step={0.01}
          value={config.linework.opacity}
        />
        <Dial
          hint="How many separate line clusters are drawn."
          label="Density"
          max={12}
          min={0}
          onChange={(value) =>
            onChange({
              ...config,
              linework: { ...config.linework, density: Math.round(value) }
            })
          }
          step={1}
          value={config.linework.density}
        />
      </Section>

      <Section title="Motion">
        <Dial
          hint="Overall animation speed. Past ~2 this becomes a hyper-motion, energetic wash; near 0.2 it's almost still."
          label="Speed"
          max={8}
          min={0.2}
          onChange={(value) =>
            onChange({ ...config, motion: { ...config.motion, speed: value } })
          }
          step={0.1}
          value={config.motion.speed}
        />
        <Dial
          hint="How far the whole scene leans toward the cursor."
          label="Cursor pull"
          max={1}
          min={0}
          onChange={(value) =>
            onChange({
              ...config,
              motion: { ...config.motion, cursorPull: value }
            })
          }
          step={0.02}
          value={config.motion.cursorPull}
        />
        <Dial
          hint="How quickly the pull catches up to the cursor — higher feels snappier, lower feels more viscous."
          label="Cursor ease"
          max={0.3}
          min={0.02}
          onChange={(value) =>
            onChange({
              ...config,
              motion: { ...config.motion, cursorEase: value }
            })
          }
          step={0.01}
          value={config.motion.cursorEase}
        />
      </Section>

      <Section title="Fade / readability">
        <Dial
          hint="Strength of the light patch kept clear behind the composer so text always stays legible."
          label="Clearing opacity"
          max={1}
          min={0}
          onChange={(value) =>
            onChange({
              ...config,
              fade: { ...config.fade, clearingOpacity: value }
            })
          }
          step={0.02}
          value={config.fade.clearingOpacity}
        />
        <Dial
          hint="Size of that cleared patch, relative to the canvas."
          label="Clearing radius"
          max={0.7}
          min={0.15}
          onChange={(value) =>
            onChange({
              ...config,
              fade: { ...config.fade, clearingRadius: value }
            })
          }
          step={0.01}
          value={config.fade.clearingRadius}
        />
      </Section>

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
