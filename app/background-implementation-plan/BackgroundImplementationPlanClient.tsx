"use client";

import Link from "next/link";
import { useState } from "react";

import { FluidBrandWashSpecPanel } from "@/components/prototypes/background-implementation-plan/shared/FluidBrandWashSpecPanel";
import { TexturedWashPlaygroundControls } from "@/components/prototypes/background-implementation-plan/shared/TexturedWashPlaygroundControls";
import { HomepageComposerLayout } from "@/components/product/HomepageTextLayout";
import { TexturedWatercolorWashEngine } from "@/components/ui/site-background-wash/TexturedWatercolorWashEngine";
import {
  DEFAULT_TEXTURED_WASH_CONFIG,
  type TexturedWashConfig
} from "@/components/ui/site-background-wash/texturedConfig";

import "@/components/prototypes/background-implementation-plan/shared/background-implementation-plan.css";

const texturedWashMeta = {
  motionSpec: [
    {
      duration: "corner blooms, drift amount configurable per field",
      easing: "sinusoidal, continuous",
      note: "Three cellular blooms (each a cluster of 4-30 small overlapping colour blobs) anchored to the corners, in brand colours only. Reads as a textured, granulated stain rather than a smooth gradient — closer to the reference illustration's blotchy corner washes.",
      property: "Corner blooms"
    },
    {
      duration: "n/a (static)",
      easing: "n/a",
      note: "A tiled speckle pattern laid over the whole canvas at low opacity, mimicking watercolor paper's tooth.",
      property: "Paper grain"
    },
    {
      duration: "n/a (static filter, adjustable)",
      easing: "n/a",
      note: "Same feTurbulence + feDisplacementMap + feGaussianBlur technique as the Watercolor Bleed loading transition, now with the turbulence scale and blur exposed as dials.",
      property: "Watercolor edge texture"
    },
    {
      duration: "continuous, speed-adjustable twinkle",
      easing: "sinusoidal opacity pulse",
      note: "Small flecks scattered inside each bloom that brighten and dim on their own loop, echoing the gold specks and highlight dots in the reference.",
      property: "Shimmer"
    },
    {
      duration: "n/a (static positions, opacity flickers gently)",
      easing: "n/a",
      note: "Faint connected-dot lines near the top of the canvas, echoing the constellation lines in the reference image.",
      property: "Constellation linework"
    },
    {
      duration: "continuous while the cursor moves, eased not snapped",
      easing: "lerp toward pointer position",
      note: "The whole scene leans toward the cursor. Falls back to pure ambient drift on touch devices, which never fire mousemove.",
      property: "Cursor influence"
    },
    {
      duration: "single dial, 0.2x-8x",
      easing: "n/a",
      note: "One multiplier drives every field, shimmer twinkle and drift rate together, so the whole wash can be pushed from near-still up to a hyper-motion, energetic pace without retuning each piece separately.",
      property: "Speed / hyper motion"
    },
    {
      duration: "n/a (static)",
      easing: "n/a",
      note: "A soft radial lightening centred on the composer area, so the wash never reduces text or the composer border below a safe contrast.",
      property: "Readability clearing"
    }
  ],
  principle:
    "Corner-anchored, cellular watercolor blooms built from clusters of small overlapping colour blobs rather than single smooth gradients, so the texture reads as granulated paper rather than a clean radial fade. Only --gold, --accent teal, --rose and the brand-gradient amber are used — the reference image's blue and purple are read as texture and composition cues, not literal colours to copy. A tiled paper-grain speckle sits over everything, shimmer flecks twinkle inside the blooms, and faint constellation linework echoes the reference's connected-dot line details near the top of the frame. A single speed dial scales the whole system from a barely-there drift up to a hyper-motion pace, and every colour, opacity, texture and timing value is exposed live in the panel on the right so changes can be judged in motion before anything is locked in.",
  tagline:
    "Textured, corner-anchored watercolor bloom with paper grain, shimmer and linework"
};

export function BackgroundImplementationPlanClient() {
  const [config, setConfig] = useState<TexturedWashConfig>(
    DEFAULT_TEXTURED_WASH_CONFIG
  );

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#fcfbf9]">
      <Link
        className="fixed left-6 top-6 z-40 inline-flex min-h-11 items-center rounded-[12px] border border-[#ded6ca] bg-[#fcfbf9]/90 px-4 text-sm font-semibold text-[#094d40] shadow-[0_10px_28px_rgba(36,31,24,0.08)] backdrop-blur transition hover:bg-white"
        href="/design-system/core-experience/homepage-composer-layout"
      >
        ← Back to homepage composer layout
      </Link>

      <TexturedWashPlaygroundControls
        config={config}
        defaultConfig={DEFAULT_TEXTURED_WASH_CONFIG}
        onChange={setConfig}
      />

      <div className="background-implementation-plan-stage">
        <div
          aria-hidden="true"
          className="background-implementation-plan-stage__bg"
        >
          <TexturedWatercolorWashEngine config={config} />
        </div>

        <HomepageComposerLayout />
      </div>

      <FluidBrandWashSpecPanel meta={texturedWashMeta} />
    </main>
  );
}
