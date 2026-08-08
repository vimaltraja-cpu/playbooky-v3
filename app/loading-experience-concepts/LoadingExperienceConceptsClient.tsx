"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ApertureFlareConcept,
  apertureFlareMeta
} from "@/components/prototypes/loading-experience-concepts/concept-3-aperture-flare/ApertureFlareConcept";
import {
  CenterBloomConcept,
  centerBloomMeta
} from "@/components/prototypes/loading-experience-concepts/concept-1-center-bloom/CenterBloomConcept";
import {
  LiquidTakeoverConcept,
  liquidTakeoverMeta
} from "@/components/prototypes/loading-experience-concepts/concept-2-liquid-takeover/LiquidTakeoverConcept";
import {
  WatercolorBleedConcept,
  watercolorBleedMeta
} from "@/components/prototypes/loading-experience-concepts/concept-0-watercolor-bleed/WatercolorBleedConcept";
import { ConceptFrame } from "@/components/prototypes/loading-experience-concepts/shared/ConceptFrame";
import { PlaybackControls } from "@/components/prototypes/loading-experience-concepts/shared/PlaybackControls";
import {
  LOADING_CONCEPT_IDS,
  type ConceptMeta,
  type LoadingConceptId,
  type PlaybackSpeed
} from "@/components/prototypes/loading-experience-concepts/shared/types";

const CONCEPT_META: Record<LoadingConceptId, ConceptMeta> = {
  "watercolor-bleed": watercolorBleedMeta,
  "center-bloom": centerBloomMeta,
  "liquid-takeover": liquidTakeoverMeta,
  "aperture-flare": apertureFlareMeta
};

const TAB_LABELS: Record<LoadingConceptId, string> = {
  "watercolor-bleed": "1. Watercolor Bleed",
  "center-bloom": "2. Center Bloom (prior round)",
  "liquid-takeover": "3. Liquid Takeover (prior round)",
  "aperture-flare": "4. Aperture Flare (prior round)"
};

function ConceptTabs({
  activeConceptId,
  onChange
}: {
  activeConceptId: LoadingConceptId;
  onChange: (conceptId: LoadingConceptId) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {LOADING_CONCEPT_IDS.map((conceptId) => {
        const isActive = conceptId === activeConceptId;

        return (
          <button
            className={[
              "rounded-[12px] px-4 py-2 text-sm font-semibold transition",
              isActive
                ? "bg-[#324236] text-[#FCFBFA] shadow-[0_10px_24px_rgba(36,31,24,0.16)]"
                : "border border-[#d8cbb8] bg-[#FCFBFA]/70 text-[#324236] hover:bg-white"
            ].join(" ")}
            key={conceptId}
            onClick={() => onChange(conceptId)}
            type="button"
          >
            {TAB_LABELS[conceptId]}
          </button>
        );
      })}
    </div>
  );
}

export function LoadingExperienceConceptsClient({
  initialConceptId
}: {
  initialConceptId?: LoadingConceptId;
}) {
  const [activeConceptId, setActiveConceptId] = useState<LoadingConceptId>(
    initialConceptId ?? "watercolor-bleed"
  );
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>("normal");
  const [resetSignal, setResetSignal] = useState(0);

  const activeMeta = CONCEPT_META[activeConceptId];

  const handleConceptChange = (conceptId: LoadingConceptId) => {
    setActiveConceptId(conceptId);
    setPaused(false);
    setResetSignal((value) => value + 1);
  };

  const controls = (
    <PlaybackControls
      onReplay={() => setResetSignal((value) => value + 1)}
      onSpeedChange={setSpeed}
      onTogglePaused={() => setPaused((value) => !value)}
      paused={paused}
      speed={speed}
    />
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F3EEE7] px-6 py-7 text-[#324236]">
      <Link
        className="fixed left-6 top-6 z-40 inline-flex min-h-11 items-center rounded-[12px] border border-[#d8cbb8] bg-[#FCFBFA]/85 px-4 text-sm font-semibold text-[#324236] shadow-[0_10px_28px_rgba(36,31,24,0.08)] backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#aa7d3a]/50"
        href="/recommendation-loading"
      >
        ← Back to production version
      </Link>

      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1120px] flex-col justify-center gap-5">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7D5330]">
            Recommendation Loading — Transition Explorations
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            Illustration Loading Experience
          </h1>
          <p className="mx-auto mt-2 max-w-[70ch] text-sm leading-relaxed text-[#4b5c4c]">
            Lead concept: the next illustration is born at the centre of the
            current one and spreads outward like watercolor bleeding into wet
            paper — organic, irregular-edged, interwoven with the image it
            replaces. The other three tabs are kept for reference from the
            prior, rejected round.
          </p>
        </header>

        <ConceptTabs
          activeConceptId={activeConceptId}
          onChange={handleConceptChange}
        />

        <ConceptFrame controls={controls} meta={activeMeta}>
          {activeConceptId === "watercolor-bleed" ? (
            <WatercolorBleedConcept
              paused={paused}
              resetSignal={resetSignal}
              speed={speed}
            />
          ) : null}

          {activeConceptId === "center-bloom" ? (
            <CenterBloomConcept
              paused={paused}
              resetSignal={resetSignal}
              speed={speed}
            />
          ) : null}

          {activeConceptId === "liquid-takeover" ? (
            <LiquidTakeoverConcept
              paused={paused}
              resetSignal={resetSignal}
              speed={speed}
            />
          ) : null}

          {activeConceptId === "aperture-flare" ? (
            <ApertureFlareConcept
              paused={paused}
              resetSignal={resetSignal}
              speed={speed}
            />
          ) : null}
        </ConceptFrame>
      </div>
    </main>
  );
}
