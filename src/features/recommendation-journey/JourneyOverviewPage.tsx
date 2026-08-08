"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  journeyManifest,
  type JourneyStage,
  type JourneyStatus
} from "@/src/features/recommendation-journey/journeyManifest";

const editableStatuses: JourneyStatus[] = [
  "needs-review",
  "changes-required",
  "approved"
];

type StoredReviewState = {
  handoffStatus?: JourneyStatus;
  notes?: string;
  responsiveStatus?: JourneyStatus;
  sourceStatus?: JourneyStatus;
};

function storageKey(stageId: string) {
  return `playbooky:journey-qa:${stageId}`;
}

function StatusBadge({ status }: { status: JourneyStatus }) {
  const tone =
    status === "approved" || status === "integrated"
      ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-100"
      : status === "changes-required" || status === "not-located"
        ? "border-rose-300/35 bg-rose-300/10 text-rose-100"
        : status === "in-progress"
          ? "border-amber-300/35 bg-amber-300/10 text-amber-100"
          : "border-white/15 bg-white/[0.06] text-[#d8d2c6]";

  return (
    <span
      className={[
        "inline-flex rounded px-2 py-1 text-[12px] font-medium leading-4",
        tone
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string | string[] }) {
  const values = Array.isArray(value) ? value : [value];

  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] text-[#8f887c]">
        {label}
      </dt>
      <dd className="mt-1 flex flex-wrap gap-1.5 text-sm leading-6 text-[#f4efe7]">
        {values.length > 0 ? (
          values.map((item) => (
            <span
              className="rounded border border-white/10 bg-white/[0.045] px-2 py-0.5"
              key={item}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-[#b7afa3]">None</span>
        )}
      </dd>
    </div>
  );
}

function ApprovalSelect({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (status: JourneyStatus) => void;
  value: JourneyStatus;
}) {
  return (
    <label className="grid gap-1 text-[12px] font-medium leading-5 text-[#b7afa3]">
      {label}
      <select
        className="h-9 rounded border border-white/15 bg-[#14110f] px-2 text-sm text-[#f7f0e6] outline-none focus:border-[#d99c56]"
        onChange={(event) => onChange(event.target.value as JourneyStatus)}
        value={value}
      >
        {editableStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}

function AuditPanel({ stage }: { stage: JourneyStage }) {
  const rows: Array<[string, string[] | string]> = [
    ["Full-page route", stage.fullPageRoute],
    ["Page source file", stage.pageSourcePath],
    ["Main component sources", stage.componentSourcePaths],
    ["Supporting component sources", stage.audit.supportingComponentSources],
    ["Candidate older versions", stage.audit.candidateOlderVersions],
    ["Existing prototype route", stage.audit.existingPrototypeRoute],
    ["Recommended production source", stage.audit.recommendedProductionSource],
    ["Reason this is the latest version", stage.audit.reasonThisIsLatestVersion],
    ["Known issues", stage.audit.knownIssues]
  ];

  return (
    <details className="mt-5 rounded border border-white/10 bg-black/15 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-[#f7f0e6]">
        Component and page audit
      </summary>
      <dl className="mt-4 grid gap-4">
        {rows.map(([label, value]) => (
          <Field key={label} label={label} value={value} />
        ))}
      </dl>
    </details>
  );
}

function JourneyStageCard({ stage }: { stage: JourneyStage }) {
  const [storedState, setStoredState] = useState<StoredReviewState>({});
  const sourceStatus = storedState.sourceStatus ?? stage.sourceStatus;
  const responsiveStatus =
    storedState.responsiveStatus ?? stage.responsiveStatus;
  const handoffStatus = storedState.handoffStatus ?? stage.handoffStatus;
  const notes = storedState.notes ?? stage.notes.join("\n");

  useEffect(() => {
    const rawValue = window.localStorage.getItem(storageKey(stage.id));

    if (!rawValue) {
      return;
    }

    try {
      setStoredState(JSON.parse(rawValue) as StoredReviewState);
    } catch {
      setStoredState({});
    }
  }, [stage.id]);

  function updateStoredState(nextState: StoredReviewState) {
    setStoredState(nextState);
    window.localStorage.setItem(storageKey(stage.id), JSON.stringify(nextState));
  }

  function updateField<Key extends keyof StoredReviewState>(
    key: Key,
    value: StoredReviewState[Key]
  ) {
    updateStoredState({
      ...storedState,
      [key]: value
    });
  }

  function markStageApproved() {
    updateStoredState({
      ...storedState,
      handoffStatus: "approved",
      responsiveStatus: "approved",
      sourceStatus: "approved"
    });
  }

  return (
    <article className="relative rounded-[8px] border border-white/12 bg-[#17130f]/90 p-5 shadow-[0_24px_70px_rgba(27,22,16,0.18)]">
      {stage.order < journeyManifest.length ? (
        <span
          aria-hidden="true"
          className="absolute -bottom-9 left-8 h-9 w-px bg-gradient-to-b from-[#d99c56]/70 to-transparent"
        />
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase leading-5 tracking-[0.16em] text-[#c9a86b]">
            Stage {stage.order}
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-8 text-[#fff8ed]">
            {stage.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#c8c0b4]">
            {stage.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            className="inline-flex h-10 items-center justify-center rounded border border-[#d99c56]/35 bg-[#d99c56]/10 px-3 text-sm font-semibold text-[#ffe0a8] transition hover:bg-[#d99c56]/16"
            href={stage.fullPageRoute}
          >
            Open full page
          </Link>
          <button
            className="inline-flex h-10 items-center justify-center rounded border border-emerald-300/35 bg-emerald-300/10 px-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/16"
            onClick={markStageApproved}
            type="button"
          >
            Mark approved
          </button>
        </div>
      </div>

      <dl className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Exact source page file" value={stage.pageSourcePath} />
        <Field label="Main component file or files" value={stage.componentSourcePaths} />
        <Field label="Full-page route" value={stage.fullPageRoute} />
        <Field label="Input received" value={stage.input} />
        <Field label="Output passed" value={stage.output} />
        <div>
          <dt className="text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] text-[#8f887c]">
            Statuses
          </dt>
          <dd className="mt-2 grid gap-2 text-sm text-[#f4efe7]">
            <div className="flex items-center justify-between gap-3">
              <span>Full-page source</span>
              <StatusBadge status={sourceStatus} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Responsive</span>
              <StatusBadge status={responsiveStatus} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Handoff</span>
              <StatusBadge status={handoffStatus} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Integration</span>
              <StatusBadge status={stage.integrationStatus} />
            </div>
          </dd>
        </div>
      </dl>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <ApprovalSelect
          label="Full-page source approval"
          onChange={(status) => updateField("sourceStatus", status)}
          value={sourceStatus}
        />
        <ApprovalSelect
          label="Responsive approval"
          onChange={(status) => updateField("responsiveStatus", status)}
          value={responsiveStatus}
        />
        <ApprovalSelect
          label="Handoff approval"
          onChange={(status) => updateField("handoffStatus", status)}
          value={handoffStatus}
        />
      </div>

      <label className="mt-5 grid gap-2 text-[12px] font-medium leading-5 text-[#b7afa3]">
        Review notes
        <textarea
          className="min-h-28 resize-y rounded border border-white/12 bg-[#100d0b] p-3 text-sm leading-6 text-[#f7f0e6] outline-none focus:border-[#d99c56]"
          onChange={(event) => updateField("notes", event.target.value)}
          value={notes}
        />
      </label>

      <AuditPanel stage={stage} />
    </article>
  );
}

export function JourneyOverviewPage() {
  return (
    <main className="min-h-screen bg-[#0f0d0b] px-4 py-8 text-[#f7f0e6] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-6">
          <p className="text-sm font-semibold uppercase leading-5 tracking-[0.18em] text-[#c9a86b]">
            Internal QA
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#fff8ed]">
            PlayBooky Recommendation Journey
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#c8c0b4]">
            Full-page source approval and handoff map for the recommendation journey.
            This page does not build the end-to-end experience; it links each
            stage to a real full-page implementation of the current source.
          </p>
        </header>

        <section className="mt-8 grid gap-9">
          {journeyManifest.map((stage) => (
            <JourneyStageCard key={stage.id} stage={stage} />
          ))}
        </section>
      </div>
    </main>
  );
}
