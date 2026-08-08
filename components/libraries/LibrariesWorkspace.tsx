"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import type {
  BuildingBlockRecord,
  BuildingBlockStepRecord,
  LibraryDataset,
  LibraryItem,
  WorkshopRuleRecord
} from "@/lib/product-system/library-read-model";

type LibrariesMode = "overview" | "blocks" | "steps" | "activities" | "active";
type ViewMode = "cards" | "table";
type StepGrouping = "parent" | "phase" | "status" | "order";

type LibrariesWorkspaceProps = {
  activeHref: string;
  dataset: LibraryDataset;
  mode: LibrariesMode;
};

type GenerationCandidate = {
  block?: BuildingBlockRecord;
  duration: number;
  excludedReason?: string;
  orderReason: string;
  origin: "diagnosis-adapter" | "fallback" | "what-next";
  rule: WorkshopRuleRecord;
  steps: BuildingBlockStepRecord[];
};

type GeneratedLibraryWorkshop = {
  candidates: GenerationCandidate[];
  excluded: GenerationCandidate[];
  fallbackUsed: boolean;
  matchedRules: WorkshopRuleRecord[];
  selected: GenerationCandidate[];
  totalDuration: number;
  trace: Array<{
    mappedRuleIds: string[];
    optionId: string;
    optionLabel: string;
    questionId: string;
    questionLabel: string;
    status: "mapped" | "unmapped";
  }>;
  warnings: string[];
};

const iconPath = "/assets/icons/system Icons";
const librarySelectedContainer =
  "library-selected-gradient";
const libraryCardGridClassName =
  "grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4";

const ruleAdapter: Record<string, string[]> = {
  "actionable-plan": ["need-actions-and-ownership"],
  "align-a-team": ["no-clear-goal", "need-alignment-on-options"],
  "alignment-issues": ["no-clear-goal", "need-alignment-on-options"],
  "better-decisions": ["need-clear-priorities", "need-alignment-on-options"],
  "clear-alignment": ["no-clear-goal", "need-alignment-on-options"],
  "context-not-sure": ["problem-not-clearly-defined"],
  "create-an-action-plan": ["need-actions-and-ownership"],
  "focus-priorities": ["need-clear-priorities"],
  "lack-of-ownership": ["need-actions-and-ownership"],
  "make-decisions": ["need-clear-priorities", "need-alignment-on-options"],
  "new-ideas": ["need-more-ideas"],
  "outcome-focus-priorities": ["need-clear-priorities"],
  "outcome-not-sure-yet": ["problem-not-clearly-defined"],
  "performance-issues": ["root-cause-unknown", "need-team-reflection"],
  "slow-decision-making": ["need-clear-priorities", "need-alignment-on-options"],
  "too-many-ideas": ["too-many-opportunities"],
  "unclear-priorities": ["need-clear-priorities"],
  "understand-a-problem": ["root-cause-unknown", "problem-not-clearly-defined"]
};

const modeCopy = {
  active: {
    eyebrow: "Product System / Libraries",
    subtitle: "Test how diagnosis signals shape the generated workshop.",
    title: "Active Library"
  },
  activities: {
    eyebrow: "Product System / Libraries",
    subtitle:
      "Search and inspect the canonical Activity Library CSV that feeds workshop recommendation source material.",
    title: "Activity Library"
  },
  blocks: {
    eyebrow: "Product System / Libraries",
    subtitle:
      "Search, compare and inspect the reusable Workshop OS units selected by design logic.",
    title: "Building Blocks Library"
  },
  overview: {
    eyebrow: "Libraries",
    subtitle:
      "Explore the activities, building blocks, steps and relationships that power generated workshops.",
    title: "LIBRARIES"
  },
  steps: {
    eyebrow: "Product System / Libraries",
    subtitle:
      "Understand the executable steps that turn building blocks into workshop-ready flows.",
    title: "Building Block Steps"
  }
} satisfies Record<LibrariesMode, { eyebrow: string; subtitle: string; title: string }>;

function SystemIcon({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="block h-[16px] w-[16px] shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:16px_16px]"
      style={{
        WebkitMaskImage: `url("${iconPath}/${name}.svg")`,
        maskImage: `url("${iconPath}/${name}.svg")`
      }}
    />
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function splitQuery(query: string) {
  return normalize(query).split(/\s+/).filter(Boolean);
}

function scoreItem(item: LibraryItem, query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return 1;
  }

  const title = normalize(item.title);
  if (title === normalizedQuery) {
    return 100;
  }

  if (title.includes(normalizedQuery)) {
    return 80;
  }

  const terms = splitQuery(query);
  if (terms.every((term) => item.searchText.includes(term))) {
    return 40;
  }

  return 0;
}

function unique(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) =>
    a.localeCompare(b)
  );
}

function minutes(value?: number) {
  return typeof value === "number" ? `${value} min` : "Missing";
}

function typeLabel(type: LibraryItem["itemType"]) {
  if (type === "building-block") {
    return "Building block";
  }

  return type[0].toUpperCase() + type.slice(1);
}

function StatusPill({ status }: { status: LibraryItem["status"] }) {
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.035] px-2 text-[11px] font-medium leading-none text-[#d4d4d4]">
      <span
        aria-hidden="true"
        className={[
          "h-1.5 w-1.5 rounded-full",
          status === "active" ? "bg-emerald-300" : "bg-amber-300"
        ].join(" ")}
      />
      {status === "active" ? "Active" : "Incomplete"}
    </span>
  );
}

function SearchField({
  onChange,
  placeholder,
  value
}: {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="relative block min-w-0 flex-1" htmlFor="library-search">
      <span className="sr-only">Search libraries</span>
      <span className="pointer-events-none absolute left-4 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center text-[#737373]">
        <SystemIcon name="search" />
      </span>
      <input
        className="h-11 w-full rounded-lg border border-white/[0.14] bg-[#0a0a0a] pl-11 pr-4 text-sm font-medium text-[#ededed] outline-none transition-[border-color,background-color] placeholder:text-[#737373] hover:border-white/[0.22] focus:border-white/[0.3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/70"
        id="library-search"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  );
}

function SelectControl({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  if (!options.length) {
    return null;
  }

  return (
    <label className="min-w-0">
      <span className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
        {label}
      </span>
      <span className="relative mt-1 block">
        <select
          className="h-10 w-full appearance-none rounded-md border border-white/[0.14] bg-[#0a0a0a] py-0 pl-3 pr-10 text-[13px] font-medium text-[#ededed] outline-none transition hover:border-white/[0.22] focus:border-white/[0.3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/70"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          <option value="">All</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 grid h-4 w-4 -translate-y-1/2 place-items-center text-[#8f8f8f]">
          <SystemIcon name="chevron-down" />
        </span>
      </span>
    </label>
  );
}

function SegmentedControl<T extends string>({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: T) => void;
  options: Array<{ icon?: string; label: string; value: T }>;
  value: T;
}) {
  return (
    <div>
      <p className="sr-only">{label}</p>
      <div
        aria-label={label}
        className="inline-flex rounded-lg border border-white/[0.12] bg-white/[0.035] p-1"
        role="tablist"
      >
        {options.map((option) => (
          <button
            aria-selected={value === option.value}
            className={[
              "inline-flex h-8 items-center gap-2 rounded-md px-3 text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/70",
              value === option.value
                ? "bg-white/[0.12] text-[#f5f5f5]"
                : "text-[#8f8f8f] hover:text-[#d4d4d4]"
            ].join(" ")}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="tab"
            type="button"
          >
            {option.icon ? <SystemIcon name={option.icon} /> : null}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  action,
  title
}: {
  action?: () => void;
  title: string;
}) {
  return (
    <div className="flex min-h-[180px] items-center rounded-[10px] border border-dashed border-white/[0.18] bg-[#0a0a0a] p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/[0.1] bg-white/[0.03] text-[#737373]">
          <SystemIcon name="search" />
        </span>
        <div>
          <p className="text-sm font-medium leading-5 text-[#ededed]">{title}</p>
          <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">
            Try another search, remove filters, or inspect the source data for
            missing relationships.
          </p>
          {action ? (
            <button
              className="mt-4 rounded-md border border-white/[0.14] bg-white/[0.04] px-3 py-2 text-[13px] font-medium text-[#d4d4d4] transition hover:border-white/[0.24] hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
              onClick={action}
              type="button"
            >
              Clear all
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  detail,
  label,
  value
}: {
  detail?: string;
  label: string;
  value: number | string;
}) {
  return (
    <article className="rounded-[10px] border border-white/[0.12] bg-[#0a0a0a] p-5">
      <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">{label}</p>
      <p className="mt-2 text-[28px] font-semibold leading-9 text-[#f5f5f5]">
        {value}
      </p>
      {detail ? <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">{detail}</p> : null}
    </article>
  );
}

function ItemCard({
  item,
  onSelect,
  selected
}: {
  item: LibraryItem;
  onSelect: (item: LibraryItem) => void;
  selected: boolean;
}) {
  return (
    <button
      aria-pressed={selected}
      data-library-item-id={item.id}
      className={[
        "group flex min-h-[210px] flex-col rounded-[10px] border-2 p-5 text-left transition-[background-color,border-color,transform] hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70 motion-reduce:hover:translate-y-0",
        selected
          ? librarySelectedContainer
          : "border-white/[0.12] bg-[#0a0a0a] hover:border-white/[0.24] hover:bg-[#0e0e0e]"
      ].join(" ")}
      onClick={() => onSelect(item)}
      type="button"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.035] text-[#8f8f8f]">
          <SystemIcon
            name={
              item.itemType === "building-block"
                ? "package"
                : item.itemType === "step"
                  ? "list"
                  : "activity"
            }
          />
        </span>
        <StatusPill status={item.status} />
      </span>
      <span className="mt-4 text-[15px] font-semibold leading-5 text-[#f5f5f5]">
        {item.title}
      </span>
      <span className="mt-2 line-clamp-3 text-sm leading-6 text-[#a1a1a1]">
        {item.description || "No description in the canonical source."}
      </span>
      <span className="mt-auto grid gap-3 pt-5 text-[12px] leading-5 text-[#8f8f8f] sm:grid-cols-2">
        <span>
          <span className="block text-[#626262]">Type</span>
          {typeLabel(item.itemType)}
        </span>
        <span>
          <span className="block text-[#626262]">Duration</span>
          {minutes(item.durationMinutes)}
        </span>
        <span>
          <span className="block text-[#626262]">Phase</span>
          {item.phase || "Missing"}
        </span>
        <span>
          <span className="block text-[#626262]">Links</span>
          {item.relatedItemIds.length}
        </span>
      </span>
    </button>
  );
}

function ItemsTable({
  items,
  onSelect,
  selectedId
}: {
  items: LibraryItem[];
  onSelect: (item: LibraryItem) => void;
  selectedId?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-white/[0.12] bg-[#0a0a0a]">
      <table className="min-w-[780px] w-full border-collapse text-left">
        <thead className="border-b border-white/[0.1] text-[12px] font-medium text-[#8f8f8f]">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Phase</th>
            <th className="px-4 py-3 font-medium">Duration</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.08] text-sm">
          {items.map((item) => (
            <tr
              data-selected={selectedId === item.id ? "true" : "false"}
              className={[
                "group cursor-pointer transition-colors hover:bg-white/[0.04]",
                selectedId === item.id ? "bg-white/[0.035]" : ""
              ].join(" ")}
              key={item.id}
              onClick={() => onSelect(item)}
            >
              <th className="relative max-w-[280px] px-4 py-3 font-medium text-[#ededed] before:absolute before:inset-y-2 before:left-0 before:hidden before:w-0.5 before:rounded-full before:bg-[linear-gradient(180deg,var(--playbooky-gradient-800),var(--playbooky-gradient-600))] group-data-[selected=true]:before:block">
                <button
                  data-library-item-id={item.id}
                  className="text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
                  onClick={() => onSelect(item)}
                  type="button"
                >
                  {item.title}
                </button>
              </th>
              <td className="px-4 py-3 text-[#a1a1a1]">{typeLabel(item.itemType)}</td>
              <td className="px-4 py-3 text-[#a1a1a1]">{item.phase || "Missing"}</td>
              <td className="px-4 py-3 text-[#a1a1a1]">{minutes(item.durationMinutes)}</td>
              <td className="px-4 py-3">
                <StatusPill status={item.status} />
              </td>
              <td className="max-w-[220px] truncate px-4 py-3 text-[#737373]">
                {item.source}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const drawerFocusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

function LibraryItemDrawer({
  dataset,
  item,
  onClose
}: {
  dataset: LibraryDataset;
  item?: LibraryItem;
  onClose: () => void;
}) {
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [entered, setEntered] = useState(false);
  const isPersistent = usePersistentInspector();
  const isOpen = Boolean(item);

  const closeAndRestoreFocus = useCallback(() => {
    const itemId = item?.id;
    const scrollY = window.scrollY;
    onClose();

    window.requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
      window.requestAnimationFrame(() => window.scrollTo(0, scrollY));

      if (!itemId) {
        return;
      }

      const trigger = document.querySelector<HTMLElement>(
        `[data-library-item-id="${CSS.escape(itemId)}"]`
      );
      trigger?.focus({ preventScroll: true });
    });
  }, [item?.id, onClose]);

  useEffect(() => {
    if (!isOpen || isPersistent) {
      return undefined;
    }

    const scrollY = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, isPersistent]);

  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!item) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAndRestoreFocus();
        return;
      }

      if (isPersistent || event.key !== "Tab") {
        return;
      }

      const drawer = drawerRef.current;
      if (!drawer) {
        return;
      }

      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(drawerFocusableSelector)
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") &&
          element.getAttribute("aria-hidden") !== "true" &&
          element.offsetParent !== null
      );

      if (!focusable.length) {
        event.preventDefault();
        drawer.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeAndRestoreFocus, isPersistent, item]);

  useEffect(() => {
    if (!isOpen || isPersistent) {
      return;
    }

    closeButtonRef.current?.focus({ preventScroll: true });
  }, [isOpen, isPersistent]);

  if (!item) {
    return null;
  }

  const block = dataset.buildingBlocks.find((candidate) => candidate.id === item.id);
  const step = dataset.steps.find((candidate) => candidate.id === item.id);
  const activity = dataset.activities.find((candidate) => candidate.id === item.id);
  const relatedSteps = block
    ? dataset.steps
        .filter((candidate) => candidate.parentId === block.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];
  const rules = block
    ? dataset.workshopRules.filter((rule) => rule.recommendedBlockId === block.id)
    : [];

  return (
    <>
      <button
        aria-label="Close item drawer"
        className={[
          "fixed inset-0 z-40 cursor-default bg-black/45 transition-opacity duration-200 motion-reduce:transition-none xl:hidden",
          entered ? "opacity-100" : "opacity-0"
        ].join(" ")}
        onClick={closeAndRestoreFocus}
        type="button"
      />
      <aside
        aria-labelledby="library-item-drawer-title"
        aria-modal={isPersistent ? undefined : true}
        className="fixed inset-y-0 right-0 z-50 flex min-h-0 w-full max-w-full flex-col border-l border-white/[0.14] bg-[#0a0a0a] shadow-[-24px_0_80px_rgba(0,0,0,0.48)] transition-transform duration-200 ease-out focus:outline-none motion-reduce:transition-none sm:w-[78vw] md:w-[72vw] lg:w-[480px] xl:sticky xl:top-5 xl:z-auto xl:h-[calc(100svh-100px)] xl:w-[480px] xl:translate-x-0 xl:rounded-[10px] xl:border xl:border-white/[0.12] xl:shadow-none 2xl:w-[520px]"
        ref={drawerRef}
        role={isPersistent ? "complementary" : "dialog"}
        style={{ transform: isPersistent || entered ? "translateX(0)" : "translateX(100%)" }}
        tabIndex={-1}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.1] bg-[#0a0a0a] p-5">
          <div className="min-w-0">
            <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
              Inspector / {typeLabel(item.itemType)}
            </p>
            <h3
              className="mt-2 text-[20px] font-semibold leading-7 text-[#f5f5f5]"
              id="library-item-drawer-title"
            >
              {item.title}
            </h3>
            <div className="mt-3">
              <StatusPill status={item.status} />
            </div>
          </div>
          <button
            aria-label="Close inspector"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/[0.12] bg-white/[0.035] text-[#8f8f8f] transition hover:text-[#ededed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
            onClick={closeAndRestoreFocus}
            ref={closeButtonRef}
            type="button"
          >
            <SystemIcon name="x" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          <section className="rounded-md border border-white/[0.09] bg-white/[0.025] p-4">
            <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
              Overview
            </p>
            <p className="mt-2 text-sm leading-6 text-[#d4d4d4]">
              {item.description || "No overview is present in the canonical data."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusPill status={item.status} />
              {item.category ? (
                <span className="rounded-full border border-white/[0.1] bg-white/[0.035] px-2 py-1 text-[11px] font-medium text-[#a1a1a1]">
                  {item.category}
                </span>
              ) : null}
              {item.phase ? (
                <span className="rounded-full border border-white/[0.1] bg-white/[0.035] px-2 py-1 text-[11px] font-medium text-[#a1a1a1]">
                  {item.phase}
                </span>
              ) : null}
            </div>
          </section>

          {block ? (
            <>
              <DetailList
                items={[
                  ["Inputs", block.inputs.join(", ")],
                  ["Outputs", block.outputs.join(", ")],
                  ["Outcomes", block.outcomes.join(", ")],
                  ["Energy", block.energyLevel],
                  ["Preparation", block.preparationNeeded],
                  ["Facilitator notes", block.facilitatorNotes]
                ]}
                title="Canonical Fields"
              />
              <section className="rounded-md border border-white/[0.09] bg-white/[0.025] p-4">
                <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
                  Steps
                </p>
                {relatedSteps.length ? (
                  <ol className="mt-3 space-y-2">
                    {relatedSteps.map((candidate) => (
                      <li
                        className="rounded-md border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-sm text-[#d4d4d4]"
                        key={candidate.id}
                      >
                        <span className="text-[#737373]">{candidate.order}.</span>{" "}
                        {candidate.title}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">
                    No step relationships are present for this building block.
                  </p>
                )}
              </section>
              <section className="rounded-md border border-white/[0.09] bg-white/[0.025] p-4">
                <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
                  Generation rules
                </p>
                {rules.length ? (
                  <div className="mt-3 space-y-3">
                    {rules.map((rule) => (
                      <div
                        className="rounded-md border border-white/[0.08] bg-[#0a0a0a] p-3"
                        key={rule.id}
                      >
                        <p className="text-sm font-medium text-[#ededed]">
                          {rule.rule}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">
                          {rule.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">
                    No Workshop Design Logic rule currently recommends this block.
                  </p>
                )}
              </section>
            </>
          ) : null}

          {step ? (
            <DetailList
              items={[
                ["Parent building block", step.parentTitle],
                ["Sequence", step.order ? String(step.order) : undefined],
                ["Duration", minutes(step.durationMinutes)],
                ["Purpose", step.purpose],
                ["Instructions", step.instructions],
                ["Facilitator notes", step.facilitatorNotes],
                ["Technique", step.techniqueUsed]
              ]}
              title="Step Detail"
            />
          ) : null}

          {activity ? (
            <DetailList
              items={[
                ["Best used when", activity.bestUsedWhen],
                ["Inputs", activity.inputs.join(", ")],
                ["Outputs", activity.outputs.join(", ")],
                ["Layout", activity.raw["Layout Type"]],
                ["Remote friendly", activity.remoteFriendly],
                ["Instructions", activity.instructions],
                ["Facilitator notes", activity.facilitatorNotes]
              ]}
              title="Activity Detail"
            />
          ) : null}

          <section className="rounded-md border border-white/[0.09] bg-white/[0.025] p-4">
            <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
              Source
            </p>
            <p className="mt-2 break-words font-mono text-[12px] leading-5 text-[#a1a1a1]">
              {item.source}
            </p>
          </section>
        </div>
      </aside>
    </>
  );
}

function DetailList({
  items,
  title
}: {
  items: Array<[string, string | undefined]>;
  title: string;
}) {
  const visibleItems = items.filter(([, value]) => value && value !== "Missing");

  if (!visibleItems.length) {
    return null;
  }

  return (
    <section className="rounded-md border border-white/[0.09] bg-white/[0.025] p-4">
      <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">{title}</p>
      <dl className="mt-3 space-y-3">
        {visibleItems.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[12px] font-medium leading-5 text-[#626262]">
              {label}
            </dt>
            <dd className="mt-1 whitespace-pre-line text-sm leading-6 text-[#d4d4d4]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function useSessionState(key: string, initialValue: string) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(key);
    if (stored !== null) {
      setValue(stored);
    }
  }, [key]);

  useEffect(() => {
    window.sessionStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

function usePersistentInspector() {
  const [isPersistent, setIsPersistent] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const update = () => setIsPersistent(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isPersistent;
}

function filterItems(
  items: LibraryItem[],
  query: string,
  filters: Record<string, string>
) {
  return items
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter(({ item, score }) => {
      if (score === 0) {
        return false;
      }

      return Object.entries(filters).every(([field, value]) => {
        if (!value) {
          return true;
        }

        if (field === "category") {
          return item.category === value;
        }

        if (field === "phase") {
          return item.phase === value;
        }

        if (field === "status") {
          return item.status === value;
        }

        if (field === "duration") {
          const duration = item.durationMinutes ?? 0;
          if (value === "0-15") return duration <= 15;
          if (value === "16-45") return duration >= 16 && duration <= 45;
          if (value === "46+") return duration >= 46;
        }

        return item.tags.includes(value) || item.formats.includes(value);
      });
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .map(({ item }) => item);
}

function LibraryControls({
  categoryOptions,
  filters,
  onClear,
  onFilterChange,
  onQueryChange,
  onViewChange,
  phaseOptions,
  query,
  resultCount,
  statusOptions,
  view
}: {
  categoryOptions: string[];
  filters: Record<string, string>;
  onClear: () => void;
  onFilterChange: (field: string, value: string) => void;
  onQueryChange: (value: string) => void;
  onViewChange: (value: ViewMode) => void;
  phaseOptions: string[];
  query: string;
  resultCount: number;
  statusOptions: string[];
  view: ViewMode;
}) {
  return (
    <section className="rounded-[10px] border border-white/[0.12] bg-[#0a0a0a] p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <SearchField
          onChange={onQueryChange}
          placeholder="Search activities, building blocks, steps, outcomes or tags"
          value={query}
        />
        <div className="flex shrink-0 items-center justify-between gap-3">
          <p className="text-[13px] font-medium text-[#8f8f8f]">
            {resultCount} results
          </p>
          <SegmentedControl
            label="View"
            onChange={onViewChange}
            options={[
              { icon: "grid", label: "Cards", value: "cards" },
              { icon: "list", label: "Table", value: "table" }
            ]}
            value={view}
          />
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SelectControl
          label="Category"
          onChange={(value) => onFilterChange("category", value)}
          options={categoryOptions}
          value={filters.category ?? ""}
        />
        <SelectControl
          label="Phase"
          onChange={(value) => onFilterChange("phase", value)}
          options={phaseOptions}
          value={filters.phase ?? ""}
        />
        <SelectControl
          label="Status"
          onChange={(value) => onFilterChange("status", value)}
          options={statusOptions}
          value={filters.status ?? ""}
        />
        <SelectControl
          label="Duration"
          onChange={(value) => onFilterChange("duration", value)}
          options={["0-15", "16-45", "46+"]}
          value={filters.duration ?? ""}
        />
      </div>
      <button
        className="mt-4 inline-flex h-8 items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.035] px-3 text-[12px] font-medium text-[#a1a1a1] transition hover:text-[#ededed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
        onClick={onClear}
        type="button"
      >
        <SystemIcon name="x-circle" />
        Clear all
      </button>
    </section>
  );
}

function Overview({ dataset, query }: { dataset: LibraryDataset; query: string }) {
  const filtered = filterItems(dataset.items, query, {});
  const incomplete = dataset.items.filter((item) => item.status === "incomplete");
  const categories = unique(dataset.items.map((item) => item.category));
  const active = dataset.items.filter((item) => item.status === "active");

  const flow = [
    {
      body: `${dataset.diagnosisQuestions.length} diagnosis categories define the selectable answer values used by the product journey.`,
      href: "/design-system/core-experience/diagnosis-grid",
      label: "Diagnosis",
      source: "lib/design-system/diagnosis-options.ts"
    },
    {
      body: `${dataset.workshopRules.length} Workshop Design Logic rules map situations to recommended building blocks.`,
      href: "/design-system/product-system/libraries/active-library",
      label: "Selection rules",
      source: dataset.sources.generationFixture
    },
    {
      body: `${dataset.buildingBlocks.length} reusable units carry purpose, inputs, outputs, outcomes and steps.`,
      href: "/design-system/product-system/libraries/building-block-library",
      label: "Building blocks",
      source: dataset.sources.buildingBlocks
    },
    {
      body: `${dataset.steps.length} executable steps are linked back to parent building blocks.`,
      href: "/design-system/product-system/libraries/building-block-steps",
      label: "Activity steps",
      source: dataset.sources.steps
    },
    {
      body: "The Active Library sandbox exposes what the deterministic local generator can currently test.",
      href: "/design-system/product-system/libraries/active-library",
      label: "Active library",
      source: dataset.sources.generatedWorkshop
    },
    {
      body: `${dataset.workshopTypes.length} workshop types exist as canonical recommendation destinations.`,
      href: "/design-system/product-system/workshop/generated-flow",
      label: "Generated workshop",
      source: dataset.sources.workshopTypes
    }
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Activities" value={dataset.activities.length} />
        <SummaryCard label="Building blocks" value={dataset.buildingBlocks.length} />
        <SummaryCard label="Steps" value={dataset.steps.length} />
        <SummaryCard label="Active items" value={active.length} />
        <SummaryCard label="Incomplete items" value={incomplete.length} />
        <SummaryCard label="Categories" value={categories.length} />
        <SummaryCard label="Workshop templates" value={dataset.workshopTypes.length} />
        <SummaryCard label="Selection rules" value={dataset.workshopRules.length} />
      </section>

      <section className="rounded-[10px] border border-white/[0.12] bg-[#0a0a0a] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
              System relationship
            </p>
            <h2 className="mt-1 text-[15px] font-semibold leading-6 text-[#ededed]">
              Diagnosis to generated workshop
            </h2>
          </div>
          <p className="text-[13px] font-medium text-[#737373]">
            Canonical sources only
          </p>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-6">
          {flow.map((stage, index) => (
            <a
              className="group rounded-md border border-white/[0.1] bg-white/[0.025] p-4 transition hover:border-white/[0.22] hover:bg-white/[0.045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
              href={stage.href}
              key={stage.label}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-7 w-7 place-items-center rounded border border-white/[0.1] bg-white/[0.04] text-[12px] font-medium text-[#d4d4d4]">
                  {index + 1}
                </span>
                {index < flow.length - 1 ? (
                  <span className="hidden text-[#626262] lg:block">→</span>
                ) : null}
              </div>
              <h3 className="mt-4 text-sm font-semibold leading-5 text-[#f5f5f5]">
                {stage.label}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">{stage.body}</p>
              <p className="mt-4 break-words font-mono text-[11px] leading-4 text-[#626262]">
                {stage.source}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[15px] font-semibold leading-6 text-[#ededed]">
            Quick access
          </h2>
          <p className="text-[13px] font-medium text-[#8f8f8f]">
            {filtered.length} matching items
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["/design-system/product-system/libraries/building-block-library", "Building Blocks Library", `${dataset.buildingBlocks.length} blocks`],
            ["/design-system/product-system/libraries/building-block-steps", "Building Block Steps", `${dataset.steps.length} steps`],
            ["/design-system/product-system/libraries/activity-library", "Activity Library", `${dataset.activities.length} activities`],
            ["/design-system/product-system/libraries/active-library", "Generation Sandbox", `${dataset.workshopRules.length} rules`]
          ].map(([href, title, detail]) => (
            <a
              className="group rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-5 transition hover:-translate-y-px hover:border-white/[0.24] hover:bg-[#0e0e0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70 motion-reduce:hover:translate-y-0"
              href={href}
              key={href}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-[15px] font-semibold leading-5 text-[#f5f5f5]">
                  {title}
                </span>
                <SystemIcon name="arrow-up-right" />
              </span>
              <p className="mt-3 text-sm leading-6 text-[#a1a1a1]">{detail}</p>
            </a>
          ))}
        </div>
      </section>

      {query ? (
        <section>
          <h2 className="text-[15px] font-semibold leading-6 text-[#ededed]">
            Search matches
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, 9).map((item) => (
              <ItemCard item={item} key={item.id} onSelect={() => undefined} selected={false} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function BuildingBlocksView({ dataset }: { dataset: LibraryDataset }) {
  return <CatalogView dataset={dataset} sourceItems={dataset.buildingBlocks} storageKey="blocks" />;
}

function ActivitiesView({ dataset }: { dataset: LibraryDataset }) {
  return <CatalogView dataset={dataset} sourceItems={dataset.activities} storageKey="activities" />;
}

function CatalogView({
  dataset,
  sourceItems,
  storageKey
}: {
  dataset: LibraryDataset;
  sourceItems: LibraryItem[];
  storageKey: string;
}) {
  const [query, setQuery] = useSessionState(`playbooky.libraries.${storageKey}.query`, "");
  const [view, setView] = useSessionState(`playbooky.libraries.${storageKey}.view`, "cards");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () => filterItems(sourceItems, query, filters),
    [filters, query, sourceItems]
  );
  const selected = sourceItems.find((item) => item.id === selectedId);

  return (
    <div
      className={[
        "grid min-w-0 gap-6",
        selected ? "xl:grid-cols-[minmax(0,1fr)_480px] 2xl:grid-cols-[minmax(0,1fr)_520px]" : ""
      ].join(" ")}
    >
      <div className="min-w-0 space-y-6">
        <LibraryControls
          categoryOptions={unique(sourceItems.map((item) => item.category))}
          filters={filters}
          onClear={() => {
            setQuery("");
            setFilters({});
          }}
          onFilterChange={(field, value) =>
            setFilters((current) => ({ ...current, [field]: value }))
          }
          onQueryChange={setQuery}
          onViewChange={setView}
          phaseOptions={unique(sourceItems.map((item) => item.phase))}
          query={query}
          resultCount={filtered.length}
          statusOptions={["active", "incomplete"]}
          view={view as ViewMode}
        />

        <section className="min-w-0">
          {filtered.length ? (
            view === "table" ? (
              <ItemsTable
                items={filtered}
                onSelect={(item) => setSelectedId(item.id)}
                selectedId={selected?.id}
              />
            ) : (
              <div className={libraryCardGridClassName}>
                {filtered.map((item) => (
                  <ItemCard
                    item={item}
                    key={item.id}
                    onSelect={(candidate) => setSelectedId(candidate.id)}
                    selected={selected?.id === item.id}
                  />
                ))}
              </div>
            )
          ) : (
            <EmptyState
              action={() => {
                setQuery("");
                setFilters({});
              }}
              title="No library items match these controls"
            />
          )}
        </section>
      </div>
      <LibraryItemDrawer
        dataset={dataset}
        item={selected}
        onClose={() => setSelectedId(undefined)}
      />
    </div>
  );
}

function StepsView({ dataset }: { dataset: LibraryDataset }) {
  const [query, setQuery] = useSessionState("playbooky.libraries.steps.query", "");
  const [view, setView] = useSessionState("playbooky.libraries.steps.view", "cards");
  const [grouping, setGrouping] = useState<StepGrouping>("parent");
  const [selectedBlockId, setSelectedBlockId] = useState(dataset.buildingBlocks[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const filtered = useMemo(
    () => filterItems(dataset.steps, query, filters) as BuildingBlockStepRecord[],
    [dataset.steps, filters, query]
  );
  const selected = dataset.steps.find((step) => step.id === selectedId);
  const sequenceSteps = dataset.steps
    .filter((step) => step.parentId === selectedBlockId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const groups = useMemo(() => {
    return filtered.reduce<Record<string, BuildingBlockStepRecord[]>>((acc, step) => {
      const key =
        grouping === "parent"
          ? step.parentTitle || "Missing parent"
          : grouping === "phase"
            ? step.phase || "Missing phase"
            : grouping === "status"
              ? step.status
              : `Order ${step.order ?? "missing"}`;
      acc[key] = [...(acc[key] ?? []), step];
      return acc;
    }, {});
  }, [filtered, grouping]);

  return (
    <div
      className={[
        "grid min-w-0 gap-6",
        selected ? "xl:grid-cols-[minmax(0,1fr)_480px] 2xl:grid-cols-[minmax(0,1fr)_520px]" : ""
      ].join(" ")}
    >
      <div className="min-w-0 space-y-6">
        <LibraryControls
          categoryOptions={unique(dataset.steps.map((item) => item.category))}
          filters={filters}
          onClear={() => {
            setQuery("");
            setFilters({});
          }}
          onFilterChange={(field, value) =>
            setFilters((current) => ({ ...current, [field]: value }))
          }
          onQueryChange={setQuery}
          onViewChange={setView}
          phaseOptions={unique(dataset.steps.map((item) => item.phase))}
          query={query}
          resultCount={filtered.length}
          statusOptions={["active", "incomplete"]}
          view={view as ViewMode}
        />

        <section className="rounded-[10px] border border-white/[0.12] bg-[#0a0a0a] p-4">
          <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
            <SelectControl
              label="Sequence view"
              onChange={setSelectedBlockId}
              options={dataset.buildingBlocks.map((block) => block.id)}
              value={selectedBlockId}
            />
            <div className="overflow-x-auto">
              {sequenceSteps.length ? (
                <ol className="flex min-w-max gap-3">
                  {sequenceSteps.map((step) => (
                    <li
                      className="w-[190px] rounded-md border border-white/[0.1] bg-white/[0.025] p-3"
                      key={step.id}
                    >
                      <p className="text-[12px] font-medium text-[#737373]">
                        Step {step.order} · {minutes(step.durationMinutes)}
                      </p>
                      <p className="mt-2 text-sm font-medium leading-5 text-[#ededed]">
                        {step.title}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm leading-6 text-[#a1a1a1]">
                  This building block has no linked steps in the canonical step export.
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <SegmentedControl
            label="Group steps"
            onChange={setGrouping}
            options={[
              { label: "Parent", value: "parent" },
              { label: "Phase", value: "phase" },
              { label: "Status", value: "status" },
              { label: "Order", value: "order" }
            ]}
            value={grouping}
          />
        </div>

        <section className="min-w-0 space-y-5">
          {filtered.length ? (
            view === "table" ? (
              <ItemsTable
                items={filtered}
                onSelect={(item) => setSelectedId(item.id)}
                selectedId={selected?.id}
              />
            ) : (
              Object.entries(groups).map(([group, steps]) => (
                <section
                  className="rounded-[10px] border border-white/[0.12] bg-[#0a0a0a] p-4"
                  key={group}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-[15px] font-semibold leading-6 text-[#ededed]">
                      {group}
                    </h2>
                    <p className="text-[13px] font-medium text-[#8f8f8f]">
                      {steps.length} steps
                    </p>
                  </div>
                  <div className={libraryCardGridClassName}>
                    {steps.map((step) => (
                      <ItemCard
                        item={step}
                        key={step.id}
                        onSelect={(candidate) => setSelectedId(candidate.id)}
                        selected={selected?.id === step.id}
                      />
                    ))}
                  </div>
                </section>
              ))
            )
          ) : (
            <EmptyState
              action={() => {
                setQuery("");
                setFilters({});
              }}
              title="No steps match these controls"
            />
          )}
        </section>
      </div>
      <LibraryItemDrawer
        dataset={dataset}
        item={selected}
        onClose={() => setSelectedId(undefined)}
      />
    </div>
  );
}

function getBlockDuration(block: BuildingBlockRecord, steps: BuildingBlockStepRecord[]) {
  return (
    steps.reduce((total, step) => total + (step.durationMinutes ?? 0), 0) ||
    block.durationMinutes ||
    0
  );
}

function createGenerationCandidate(
  dataset: LibraryDataset,
  rule: WorkshopRuleRecord,
  origin: GenerationCandidate["origin"],
  orderReason: string
): GenerationCandidate {
  const block = dataset.buildingBlocks.find(
    (candidate) => candidate.id === rule.recommendedBlockId
  );
  const steps = block
    ? dataset.steps
        .filter((step) => step.parentId === block.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return {
    block,
    duration: block ? getBlockDuration(block, steps) : 0,
    orderReason,
    origin,
    rule,
    steps
  };
}

function createWorkshop(
  dataset: LibraryDataset,
  selectedOptionIds: Record<string, string>,
  durationLimit: number
): GeneratedLibraryWorkshop {
  const trace = dataset.diagnosisQuestions.map((question) => {
    const optionId = selectedOptionIds[question.id] ?? "";
    const option = question.options.find((candidate) => candidate.id === optionId);
    const mappedRuleIds = ruleAdapter[optionId] ?? [];

    return {
      mappedRuleIds,
      optionId,
      optionLabel: option?.label ?? optionId,
      questionId: question.id,
      questionLabel: question.label,
      status: mappedRuleIds.length ? ("mapped" as const) : ("unmapped" as const)
    };
  });
  const matchedRuleIds = Array.from(
    new Set(trace.flatMap((entry) => entry.mappedRuleIds))
  );
  const matchedRules = matchedRuleIds
    .map((id) => dataset.workshopRules.find((rule) => rule.id === id))
    .filter(Boolean) as WorkshopRuleRecord[];
  const fallbackUsed = matchedRules.length === 0;
  const seedRules = fallbackUsed
    ? dataset.workshopRules.filter((rule) =>
        ["root-cause-unknown", "problem-not-clearly-defined"].includes(rule.id)
      )
    : matchedRules;

  const candidateMap = new Map<string, GenerationCandidate>();

  seedRules.forEach((rule) => {
    candidateMap.set(
      rule.recommendedBlockId,
      createGenerationCandidate(
        dataset,
        rule,
        fallbackUsed ? "fallback" : "diagnosis-adapter",
        fallbackUsed
          ? "Fallback deterministic Workshop OS path."
          : `Direct match from mapped diagnosis answer to ${rule.rule}.`
      )
    );
  });

  seedRules.forEach((rule) => {
    rule.nextBlockIds.forEach((nextBlockId) => {
      if (candidateMap.has(nextBlockId)) {
        return;
      }

      const nextRule = dataset.workshopRules.find(
        (candidate) => candidate.recommendedBlockId === nextBlockId
      );

      if (!nextRule) {
        return;
      }

      candidateMap.set(
        nextBlockId,
        createGenerationCandidate(
          dataset,
          nextRule,
          "what-next",
          `Included because ${rule.rule} lists ${nextRule.rule} in What Next.`
        )
      );
    });
  });

  let usedDuration = 0;
  const selected: GenerationCandidate[] = [];
  const excluded: GenerationCandidate[] = [];

  Array.from(candidateMap.values()).forEach((candidate) => {
    if (!candidate.block) {
      excluded.push({
        ...candidate,
        excludedReason: "This rule matched, but it has no canonical activity relationship."
      });
      return;
    }

    if (usedDuration + candidate.duration <= durationLimit || selected.length === 0) {
      usedDuration += candidate.duration;
      selected.push(candidate);
      return;
    }

    excluded.push({
      ...candidate,
      excludedReason: `Adding ${candidate.block.title} would exceed the requested ${durationLimit}-minute workshop duration.`
    });
  });

  const warnings: string[] = [];
  if (!selected.length) {
    warnings.push("No compatible activities were found for this diagnosis.");
  }

  if (selected.length === 1) {
    warnings.push(
      "Only one compatible activity was found. The current canonical mappings do not contain enough linked activities to construct a full workshop."
    );
  }

  if (usedDuration < durationLimit && selected.length > 0) {
    warnings.push(
      "The generated sequence does not yet fill the requested workshop duration."
    );
  }

  return {
    candidates: Array.from(candidateMap.values()),
    excluded,
    fallbackUsed,
    matchedRules,
    selected,
    totalDuration: usedDuration,
    trace,
    warnings
  };
}

function diffWorkshop(
  previous: ReturnType<typeof createWorkshop> | undefined,
  current: ReturnType<typeof createWorkshop>
) {
  const previousIds = previous?.selected.flatMap((item) =>
    item.block ? [item.block.id] : []
  ) ?? [];
  const currentIds = current.selected.flatMap((item) =>
    item.block ? [item.block.id] : []
  );
  const added = current.selected.filter((item) =>
    item.block ? !previousIds.includes(item.block.id) : false
  );
  const removed = previous?.selected.filter((item) =>
    item.block ? !currentIds.includes(item.block.id) : false
  ) ?? [];
  const unchanged = current.selected.filter((item) =>
    item.block ? previousIds.includes(item.block.id) : false
  );
  const reordered = current.selected.filter(
    (item, index) =>
      item.block &&
      previousIds.includes(item.block.id) &&
      previousIds.indexOf(item.block.id) !== index
  );

  return {
    added,
    durationDelta: current.totalDuration - (previous?.totalDuration ?? current.totalDuration),
    removed,
    reordered,
    unchanged
  };
}

function ActiveLibraryView({ dataset }: { dataset: LibraryDataset }) {
  const initialSelections = Object.fromEntries(
    dataset.diagnosisQuestions.map((question) => [question.id, question.options[0]?.id ?? ""])
  );
  const [selections, setSelections] = useState<Record<string, string>>(initialSelections);
  const [durationLimit, setDurationLimit] = useState(90);
  const [previousWorkshop, setPreviousWorkshop] = useState<ReturnType<typeof createWorkshop>>();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [traceOpen, setTraceOpen] = useState(true);
  const workshop = useMemo(
    () => createWorkshop(dataset, selections, durationLimit),
    [dataset, durationLimit, selections]
  );
  const diff = useMemo(() => diffWorkshop(previousWorkshop, workshop), [previousWorkshop, workshop]);
  const selectedItem = dataset.buildingBlocks.find((block) => block.id === selectedId);
  const durationDelta = durationLimit - workshop.totalDuration;
  const durationStateLabel =
    durationDelta > 0
      ? "Unallocated time"
      : durationDelta < 0
        ? "Over capacity"
        : "Duration filled";

  function updateSelection(questionId: string, value: string) {
    setPreviousWorkshop(workshop);
    setSelections((current) => ({ ...current, [questionId]: value }));
  }

  return (
    <div
      aria-live="polite"
      className={[
        "grid min-w-0 gap-6",
        selectedItem ? "xl:grid-cols-[minmax(0,1fr)_480px] 2xl:grid-cols-[minmax(0,1fr)_520px]" : ""
      ].join(" ")}
    >
      <div className="min-w-0 space-y-6">
      <section className="rounded-[10px] border border-amber-300/20 bg-amber-300/[0.045] p-4">
        <p className="text-sm font-medium leading-6 text-[#e8d7b0]">
          Test layer: diagnosis controls map to existing Workshop Design Logic
          rules through a thin adapter in this UI. Inclusion reasons use the
          canonical rule text; no new workshop strategy is invented here.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-[10px] border border-white/[0.12] bg-[#0a0a0a] p-5">
          <div>
            <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
              Diagnosis controls
            </p>
            <h2 className="mt-1 text-[15px] font-semibold leading-6 text-[#ededed]">
              Compact internal inputs
            </h2>
          </div>
          {dataset.diagnosisQuestions.map((question) => (
            <fieldset
              className="rounded-md border border-white/[0.09] bg-white/[0.025] p-3"
              key={question.id}
            >
              <legend className="px-1 text-[12px] font-medium leading-5 text-[#8f8f8f]">
                {question.label}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {question.options.map((option) => (
                  <button
                    aria-pressed={selections[question.id] === option.id}
                    className={[
                      "rounded-full border-2 px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/70",
                      selections[question.id] === option.id
                        ? `${librarySelectedContainer} text-[#ededed]`
                        : "border-white/[0.12] bg-white/[0.035] text-[#a1a1a1] hover:text-[#ededed]"
                    ].join(" ")}
                    key={option.id}
                    onClick={() => updateSelection(question.id, option.id)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <label className="block rounded-md border border-white/[0.09] bg-white/[0.025] p-3">
            <span className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
              Workshop duration
            </span>
            <span className="mt-2 flex items-center gap-3">
              <input
                className="h-2 flex-1 accent-[#d99c56]"
                max="180"
                min="30"
                onChange={(event) => {
                  setPreviousWorkshop(workshop);
                  setDurationLimit(Number(event.target.value));
                }}
                step="15"
                type="range"
                value={durationLimit}
              />
              <span className="w-16 text-right text-sm font-medium text-[#ededed]">
                {durationLimit} min
              </span>
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <section className="rounded-[10px] border border-white/[0.12] bg-[#0a0a0a] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
                  Generated workshop
                </p>
                <h2 className="mt-1 text-[20px] font-semibold leading-7 text-[#f5f5f5]">
                  Active library sequence
                </h2>
              </div>
              <div className="grid gap-1 text-sm font-medium text-[#a1a1a1] sm:text-right">
                <p>Requested duration: {durationLimit} minutes</p>
                <p>Scheduled duration: {workshop.totalDuration} minutes</p>
                <p>
                  {durationStateLabel}: {Math.abs(durationDelta)} minutes
                </p>
              </div>
            </div>
            {workshop.selected.length === 1 ? (
              <div className="mt-5 rounded-md border border-amber-300/20 bg-amber-300/[0.045] p-4">
                <p className="text-sm font-medium leading-6 text-[#e8d7b0]">
                  Only one compatible activity was found. This is shown as a
                  recommended activity, not a complete {durationLimit}-minute
                  workshop.
                </p>
              </div>
            ) : null}
            {workshop.selected.length ? (
              <ol className="mt-5 space-y-3">
                {workshop.selected.map((item, index) => (
                  <li
                    className={[
                      "rounded-md border-2 p-4 transition-colors",
                      selectedId === item.block?.id
                        ? librarySelectedContainer
                        : "border-white/[0.1] bg-white/[0.025]"
                    ].join(" ")}
                    key={item.block?.id ?? item.rule.id}
                  >
                    <button
                      data-library-item-id={item.block?.id}
                      className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
                      onClick={() => setSelectedId(item.block?.id)}
                      type="button"
                    >
                      <span className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <span>
                          <span className="text-[12px] font-medium text-[#737373]">
                            {index + 1}. {item.block?.phase || "Missing phase"} ·{" "}
                            {item.block?.type || item.block?.category || "Unresolved"}
                          </span>
                          <span className="mt-1 block text-[15px] font-semibold text-[#ededed]">
                            {item.block?.title ?? item.rule.rule}
                          </span>
                        </span>
                        <span className="text-sm font-medium text-[#a1a1a1]">
                          {item.duration} min
                        </span>
                      </span>
                      <span className="mt-3 block text-sm leading-6 text-[#a1a1a1]">
                        {item.rule.reason} {item.orderReason}
                      </span>
                      <span className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/[0.1] bg-white/[0.035] px-2 py-1 text-[11px] font-medium text-[#8f8f8f]">
                          Rule: {item.rule.rule}
                        </span>
                        <span className="rounded-full border border-white/[0.1] bg-white/[0.035] px-2 py-1 text-[11px] font-medium text-[#8f8f8f]">
                          {item.steps.length} steps · {item.origin}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState title="Generation returned no valid workshop" />
            )}
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <DecisionPanel title="Generation changes">
              <ChangeLine label="Added" values={diff.added.flatMap((item) => item.block ? [item.block.title] : [])} />
              <ChangeLine label="Removed" values={diff.removed.flatMap((item) => item.block ? [item.block.title] : [])} />
              <ChangeLine label="Unchanged" values={diff.unchanged.flatMap((item) => item.block ? [item.block.title] : [])} />
              <ChangeLine label="Reordered" values={diff.reordered.flatMap((item) => item.block ? [item.block.title] : [])} />
              <p className="mt-3 text-sm leading-6 text-[#a1a1a1]">
                Total-duration difference: {diff.durationDelta > 0 ? "+" : ""}
                {diff.durationDelta} min
              </p>
            </DecisionPanel>
            <DecisionPanel title="Removed or unresolved">
              {workshop.excluded.length ? (
                workshop.excluded.map((item) => (
                  <p className="text-sm leading-6 text-[#a1a1a1]" key={`${item.rule.id}-${item.block?.id ?? "missing"}`}>
                    <span className="font-medium text-[#ededed]">
                      Removed: {item.block?.title ?? item.rule.rule}.
                    </span>{" "}
                    Reason: {item.excludedReason}
                  </p>
                ))
              ) : (
                <p className="text-sm leading-6 text-[#a1a1a1]">
                  No selected rule was excluded by the current duration limit.
                </p>
              )}
              {workshop.warnings.map((warning) => (
                <p className="mt-2 text-sm leading-6 text-amber-200" key={warning}>
                  {warning}
                </p>
              ))}
            </DecisionPanel>
          </section>
        </div>
      </section>

      <section className="min-w-0 space-y-4">
        <DecisionPanel title="Rule matches">
          {workshop.selected.map((item) => (
            <div
              className="rounded-md border border-white/[0.08] bg-[#0a0a0a] p-3"
              key={`${item.rule.id}-${item.block?.id ?? "missing"}`}
            >
              <p className="text-sm font-medium text-[#ededed]">{item.rule.rule}</p>
              <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">
                {item.rule.situation}
              </p>
            </div>
          ))}
        </DecisionPanel>
        <section className="rounded-[10px] border border-white/[0.12] bg-[#0a0a0a] p-5">
          <button
            aria-expanded={traceOpen}
            className="flex w-full items-center justify-between gap-3 text-left text-[15px] font-semibold leading-6 text-[#ededed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
            onClick={() => setTraceOpen((current) => !current)}
            type="button"
          >
            Generation trace
            <span
              className={[
                "transition-transform",
                traceOpen ? "rotate-180" : "rotate-0"
              ].join(" ")}
            >
              <SystemIcon name="chevron-down" />
            </span>
          </button>
          {traceOpen ? <GenerationTrace dataset={dataset} workshop={workshop} /> : null}
        </section>
      </section>
      </div>
      <LibraryItemDrawer
        dataset={dataset}
        item={selectedItem}
        onClose={() => setSelectedId(undefined)}
      />
    </div>
  );
}

function DecisionPanel({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-[10px] border border-white/[0.12] bg-[#0a0a0a] p-5">
      <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
        {title}
      </h3>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function ChangeLine({ label, values }: { label: string; values: string[] }) {
  return (
    <p className="text-sm leading-6 text-[#a1a1a1]">
      <span className="font-medium text-[#ededed]">{label}:</span>{" "}
      {values.length ? values.join(", ") : "None"}
    </p>
  );
}

function GenerationTrace({
  dataset,
  workshop
}: {
  dataset: LibraryDataset;
  workshop: GeneratedLibraryWorkshop;
}) {
  const decisionSignals = unique(
    dataset.decisionRows.map((row) => row["Problem Signal"] || row.Signal || row.Problem)
  );
  const traceRows = workshop.trace.filter((entry) => entry.optionId);
  const unresolvedQuestions = workshop.trace.filter(
    (entry) => entry.optionId && entry.status === "unmapped"
  );

  return (
    <div className="mt-5 space-y-4">
      <section className="rounded-md border border-white/[0.09] bg-white/[0.025] p-4">
        <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
          Diagnosis answer mapping
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[680px] w-full border-collapse text-left text-sm">
            <thead className="border-b border-white/[0.08] text-[12px] font-medium text-[#8f8f8f]">
              <tr>
                <th className="py-2 pr-4 font-medium">Question</th>
                <th className="py-2 pr-4 font-medium">Selected answer</th>
                <th className="py-2 pr-4 font-medium">Mapped rules</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {traceRows.map((entry) => (
                <tr key={entry.questionId}>
                  <td className="py-3 pr-4 text-[#d4d4d4]">{entry.questionLabel}</td>
                  <td className="py-3 pr-4 text-[#a1a1a1]">{entry.optionLabel}</td>
                  <td className="py-3 pr-4 font-mono text-[12px] text-[#8f8f8f]">
                    {entry.mappedRuleIds.length ? entry.mappedRuleIds.join(", ") : "None"}
                  </td>
                  <td className="py-3 text-[#a1a1a1]">
                    {entry.status === "mapped" ? "Mapped" : "No canonical adapter row"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-md border border-white/[0.09] bg-white/[0.025] p-4">
        <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
          Candidate sequence
        </p>
        <div className="mt-3 space-y-3">
          {workshop.candidates.length ? (
            workshop.candidates.map((candidate) => (
              <div
                className="rounded-md border border-white/[0.08] bg-[#0a0a0a] p-3"
                key={`${candidate.rule.id}-${candidate.block?.id ?? "missing"}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-sm font-medium leading-5 text-[#ededed]">
                    {candidate.block?.title ?? candidate.rule.rule}
                  </p>
                  <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#737373]">
                    {candidate.origin}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">
                  {candidate.rule.reason}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#8f8f8f]">
                  {candidate.orderReason}
                </p>
                <p className="mt-2 text-[12px] leading-5 text-[#737373]">
                  {candidate.duration} minutes · {candidate.steps.length} linked steps
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm leading-6 text-[#a1a1a1]">
              No candidate rules were produced for the current diagnosis state.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-md border border-white/[0.09] bg-white/[0.025] p-4">
        <p className="text-[12px] font-medium leading-5 text-[#8f8f8f]">
          Canonical relationship gaps
        </p>
        <div className="mt-3 space-y-2 text-sm leading-6 text-[#a1a1a1]">
          {unresolvedQuestions.length ? (
            <p>
              {unresolvedQuestions.length} selected diagnosis answer
              {unresolvedQuestions.length === 1 ? " is" : "s are"} not mapped by
              the current sandbox adapter.
            </p>
          ) : (
            <p>All selected diagnosis answers currently have adapter mappings.</p>
          )}
          <p>
            The Decision Engine export contains {dataset.decisionRows.length} rows
            and {decisionSignals.length} problem signals, but those rows are not
            yet wired to diagnosis option IDs in the canonical read model.
          </p>
          <p>
            {dataset.workshopTypes.length} workshop types exist as recommendation
            destinations. The sandbox does not yet have a canonical workshop-type
            to building-block sequence relationship.
          </p>
          <p>
            Activity Library records are searchable alongside the blocks, but there
            is no explicit activity-to-building-block ID relationship in the current
            source data.
          </p>
        </div>
      </section>
    </div>
  );
}

export function LibrariesWorkspace({
  activeHref,
  dataset,
  mode
}: LibrariesWorkspaceProps) {
  const copy = modeCopy[mode];
  const [globalQuery, setGlobalQuery] = useSessionState(
    "playbooky.libraries.globalQuery",
    ""
  );

  return (
    <section className="min-w-0 bg-black">
      <header className="flex h-[60px] items-center justify-between border-b border-white/[0.14] px-5 sm:px-8">
        <h1 className="text-sm font-medium leading-5 text-[#ededed]">
          Design Portal
        </h1>
        <nav aria-label="Libraries pages" className="hidden gap-4 lg:flex">
          {[
            ["/design-system/product-system/libraries", "Overview"],
            ["/design-system/product-system/libraries/building-block-library", "Blocks"],
            ["/design-system/product-system/libraries/building-block-steps", "Steps"],
            ["/design-system/product-system/libraries/active-library", "Active Library"]
          ].map(([href, label]) => (
            <a
              aria-current={activeHref === href ? "page" : undefined}
              className={[
                "text-[13px] font-medium leading-5 transition-colors hover:text-[#ededed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70",
                activeHref === href ? "text-[#ededed]" : "text-[#737373]"
              ].join(" ")}
              href={href}
              key={href}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <div className="px-5 py-7 pb-16 sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <header className="border-b border-white/[0.1] pb-7">
            <p className="text-[12px] font-medium leading-5 uppercase tracking-[0.14em] text-[#737373]">
              {copy.eyebrow}
            </p>
            <div className="mt-3 grid gap-5 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-end">
              <div>
                <h2 className="text-[28px] font-semibold leading-9 text-[#f5f5f5] sm:text-[34px] sm:leading-10">
                  {copy.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#a1a1a1] sm:text-[15px]">
                  {copy.subtitle}
                </p>
              </div>
              <SearchField
                onChange={setGlobalQuery}
                placeholder="Search activities, building blocks, steps, outcomes or tags"
                value={globalQuery}
              />
            </div>
          </header>

          <div className="mt-7">
            {mode === "overview" ? <Overview dataset={dataset} query={globalQuery} /> : null}
            {mode === "blocks" ? <BuildingBlocksView dataset={dataset} /> : null}
            {mode === "steps" ? <StepsView dataset={dataset} /> : null}
            {mode === "activities" ? <ActivitiesView dataset={dataset} /> : null}
            {mode === "active" ? <ActiveLibraryView dataset={dataset} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
