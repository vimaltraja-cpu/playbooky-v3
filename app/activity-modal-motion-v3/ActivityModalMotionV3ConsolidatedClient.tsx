"use client";

import Link from "next/link";
import { useState } from "react";

import {
  cohesiveSurfaceFramedMeta,
  cohesiveSurfaceFramelessMeta,
  CohesiveSurfaceFramedConcept,
  CohesiveSurfaceFramelessConcept
} from "@/components/prototypes/activity-modal-motion-v3/concept-1-cohesive-surface/CohesiveSurfaceConcept";
import {
  focusFieldMeta,
  FocusFieldConcept
} from "@/components/prototypes/activity-modal-motion-v3/concept-2-focus-field/FocusFieldConcept";
import {
  thresholdUnfoldMeta,
  ThresholdUnfoldConcept
} from "@/components/prototypes/activity-modal-motion-v3/concept-3-threshold-unfold/ThresholdUnfoldConcept";
import {
  V3_CONCEPT_IDS,
  type ConceptMeta,
  type V3ConceptId,
  type V3PrototypeCard
} from "@/components/prototypes/activity-modal-motion-v3/shared/types";

const CONCEPT_META: Record<V3ConceptId, ConceptMeta> = {
  "cohesive-surface-framed": cohesiveSurfaceFramedMeta,
  "cohesive-surface-frameless": cohesiveSurfaceFramelessMeta,
  "focus-field": focusFieldMeta,
  "threshold-unfold": thresholdUnfoldMeta
};

const TAB_LABELS: Record<V3ConceptId, string> = {
  "cohesive-surface-framed": "1a. Framed",
  "cohesive-surface-frameless": "1b. Frameless",
  "focus-field": "2. Focus Field",
  "threshold-unfold": "3. Threshold Unfold"
};

function ConceptTabs({
  activeConceptId,
  disabled,
  onChange
}: {
  activeConceptId: V3ConceptId;
  disabled: boolean;
  onChange: (conceptId: V3ConceptId) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {V3_CONCEPT_IDS.map((conceptId) => {
        const isActive = conceptId === activeConceptId;

        return (
          <button
            className={[
              "rounded-[12px] px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
              isActive
                ? "bg-[#324236] text-[#FCFBFA] shadow-[0_10px_24px_rgba(36,31,24,0.16)]"
                : "border border-[#d8cbb8] bg-[#FCFBFA]/70 text-[#324236] hover:bg-white"
            ].join(" ")}
            disabled={disabled}
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

export function ActivityModalMotionV3ConsolidatedClient({
  cards,
  initialConceptId
}: {
  cards: V3PrototypeCard[];
  initialConceptId?: V3ConceptId;
}) {
  const [activeConceptId, setActiveConceptId] = useState<V3ConceptId>(
    initialConceptId ?? "cohesive-surface-framed"
  );
  const [isLocked, setIsLocked] = useState(false);

  const activeMeta = CONCEPT_META[activeConceptId];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F3EEE7] px-6 py-7 text-[#324236]">
      <Link
        className="fixed left-6 top-6 z-40 inline-flex min-h-11 items-center rounded-[12px] border border-[#d8cbb8] bg-[#FCFBFA]/85 px-4 text-sm font-semibold text-[#324236] shadow-[0_10px_28px_rgba(36,31,24,0.08)] backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#aa7d3a]/50"
        href="/design-system/core-experience/activity-modal-motion-v3"
      >
        ← Back to Design Portal
      </Link>

      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1480px] flex-col justify-center gap-5">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7D5330]">
            Activity Modal Motion V3 — Explorations
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{activeMeta.name}</h1>
          <p className="mx-auto mt-2 max-w-[70ch] text-sm leading-relaxed text-[#4b5c4c]">
            {activeMeta.principle}
          </p>
        </header>

        <ConceptTabs
          activeConceptId={activeConceptId}
          disabled={isLocked}
          onChange={(conceptId) => {
            if (isLocked) return;
            setActiveConceptId(conceptId);
          }}
        />

        {activeConceptId === "cohesive-surface-framed" ? (
          <CohesiveSurfaceFramedConcept cards={cards} onLockChange={setIsLocked} />
        ) : null}

        {activeConceptId === "cohesive-surface-frameless" ? (
          <CohesiveSurfaceFramelessConcept cards={cards} onLockChange={setIsLocked} />
        ) : null}

        {activeConceptId === "focus-field" ? (
          <FocusFieldConcept cards={cards} onLockChange={setIsLocked} />
        ) : null}

        {activeConceptId === "threshold-unfold" ? (
          <ThresholdUnfoldConcept cards={cards} onLockChange={setIsLocked} />
        ) : null}
      </div>
    </main>
  );
}
