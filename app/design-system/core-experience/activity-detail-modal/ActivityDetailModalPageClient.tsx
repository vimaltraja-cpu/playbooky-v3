"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentPageShell,
  ComponentTokensSection,
  type ComponentAccessibilityItem,
  type ComponentSectionNavItem,
  type ComponentTokenRow
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { ActivityDetailModal } from "@/components/ui/ActivityDetailModal";
import {
  getActivityDetailModalData,
  okrsActivityDetailModalIconNames,
  okrsActivityDetailModalSource
} from "@/lib/design-system/activity-detail-modal-demo";

import type { CanonicalActivityRecord } from "./page";

const componentMetadata = {
  category: "Core Experience",
  confidence: "2 Prototype review",
  lastUpdated: "2026-07-11",
  owner: "Design System",
  status: "Static and motion review",
  title: "Activity Detail Modal"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "library", label: "Activity Library" },
  { id: "motion-prototype", label: "Motion Prototype" },
  { id: "specs", label: "Specs" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" }
];

const overviewCopy = {
  statusNote:
    "The main preview uses the extracted Activity Modal Motion prototype. The final opened content is the approved shared ActivityDetailModal component.",
  summary:
    "Activity Detail Modal reviews the Builder modal users see after selecting an activity already included in a generated workshop.",
  whatItIs:
    "A 1368px by 762px modal with an illustration, activity summary, Builder flow, PlayBooky rationale, replace/remove actions, and close control.",
  whenNotToUse:
    "Do not use it as an activity library drawer, add-to-workshop flow, facilitator guide, or responsive modal specification.",
  whenToUse:
    "Use it to review an included workshop activity, understand why it was placed, and expose replace/remove controls.",
  whereItAppears:
    "Future Builder flows after workshop generation; this page reviews the motion and the complete modal library.",
  whyItExists:
    "To keep activity detail review separate from Activity Card, Activity Grid, replacement library, and facilitator guide behaviour."
};

const specs = [
  ["Outer modal", "1368px x 762px"],
  ["Gradient stroke", "2px, linear-gradient(45deg, #7D5330 0%, #D99C56 100%)"],
  ["Inner content width", "1364px"],
  ["Illustration", "1364px x 230px visual area"],
  ["Illustration clipping", "Parent inner wrapper clips the top modal corners"],
  ["Heading region", "104px high"],
  ["Heading-to-flow gap", "16px"],
  ["Flow row", "1122px row centred within 1364px"],
  ["Flow stages", "6 x 152px stages with 66px connectors and -12px overlap"],
  ["Flow-to-rationale gap", "34px"],
  ["Rationale", "24px high, centred gradient text"],
  ["Action region", "1364px x 52px"],
  ["Close control", "24px x 24px, 22px from top and right"],
  ["Radii", "16px outer, 14px inner, 8px action bottom"],
  ["Typography", "Metadata Geist 16/24; title Newsreader 44/44; body Geist 19/16"],
  ["Shadow", "0 4px 8px -2px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.06)"],
  ["OKRs data source", okrsActivityDetailModalSource],
  ["Temporary icons", okrsActivityDetailModalIconNames.join(", ")]
];

const tokenRows: ComponentTokenRow[] = [
  { implementationValue: "rgba(252, 251, 250, 0.9)", label: "Modal background", status: "hardcoded" },
  { implementationValue: "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)", label: "Brand gradient", status: "hardcoded" },
  { implementationValue: "linear-gradient(63.44deg, #7C5E24 16.72%, #C8A564 83.39%)", label: "Metadata gradient", status: "hardcoded" },
  { implementationValue: "#062E27 / #1F3E29", label: "Foreground text", status: "hardcoded" },
  { implementationValue: "#E11D48", label: "Destructive action", status: "hardcoded" },
  { implementationValue: "16px / 14px / 8px", label: "Radius", status: "hardcoded" },
  { implementationValue: "2px", label: "Border width", status: "hardcoded" },
  { implementationValue: "0 4px 8px -2px / 0 2px 4px -2px", label: "Shadow", status: "hardcoded" },
  { implementationValue: "32px, 16px, 34px, 52px", label: "Spacing", status: "hardcoded" },
  { implementationValue: "Geist and Newsreader", label: "Typography", status: "hardcoded" },
  { implementationValue: "820ms / 540ms", label: "Motion duration", status: "hardcoded" },
  { implementationValue: "cubic-bezier(0.22, 1, 0.36, 1) / cubic-bezier(0.4, 0, 0.2, 1)", label: "Motion easing", status: "hardcoded" }
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Dark green text, gradient metadata, and destructive action colours are visible against the neutral modal background; formal token contrast audit remains pending.",
      title: "Colour contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "Card triggers, close controls, Replace Activity, Remove, and library controls expose visible focus outlines.",
      title: "Visible focus"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "The motion preview is triggered by keyboard-accessible card buttons. Focus trapping is not implemented and is not claimed for this review page.",
      title: "Motion triggers"
    },
    {
      description:
        "Library previous, next, and selector controls update the single full-size modal preview.",
      title: "Library selection"
    }
  ],
  reducedMotion: [
    {
      description:
        "The extracted motion prototype keeps its current visual behaviour. Product-level reduced-motion skipping remains future work.",
      title: "Reduced motion"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The modal uses dialog semantics and an accessible label based on the activity name.",
      title: "Dialog semantics"
    },
    {
      description:
        "The close button has an accessible name. Connectors are aria-hidden. Action buttons use visible labels.",
      title: "Control names"
    },
    {
      description:
        "Illustrations receive activity-specific alt text; placeholder artwork is labelled as temporary.",
      title: "Illustration alt"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Focus trapping and escape-key close behaviour are product responsibilities not implemented in this static review page.",
      title: "Production modal behaviour"
    }
  ]
};

function useFitScale(width: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateScale = () => {
      setScale(Math.min(1, element.clientWidth / width));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [width]);

  return { ref, scale };
}

function FitToWidth({
  children,
  height,
  width
}: {
  children: React.ReactNode;
  height: number;
  width: number;
}) {
  const { ref, scale } = useFitScale(width);

  return (
    <div className="w-full overflow-hidden" ref={ref}>
      <div
        className="mx-auto"
        style={{
          height: height * scale,
          width: width * scale
        }}
      >
        <div
          style={{
            height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SpecsSection() {
  return (
    <section className="scroll-mt-40 py-10" id="specs">
      <h3 className="text-2xl font-semibold">Specs</h3>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white/55">
        {specs.map(([label, value]) => (
          <div
            className="grid gap-2 border-b border-[color:var(--line)] p-4 last:border-b-0 sm:grid-cols-[220px_1fr]"
            key={label}
          >
            <div className="text-sm font-semibold">{label}</div>
            <div className="font-mono text-sm text-[color:var(--muted)]">
              {value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LibraryReview({
  activities
}: {
  activities: CanonicalActivityRecord[];
}) {
  const defaultIndex = Math.max(
    0,
    activities.findIndex((activity) => activity.slug === "okrs")
  );
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(defaultIndex);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const selectedActivity = activities[selectedIndex] ?? activities[0];
  const modalData = getActivityDetailModalData(selectedActivity);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectorOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  function selectActivity(index: number) {
    setSelectedIndex(index);
    setActiveOptionIndex(index);
    setSelectorOpen(false);
  }

  function handleSelectorKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectorOpen(true);
      setActiveOptionIndex((current) =>
        Math.min(activities.length - 1, current + 1)
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectorOpen(true);
      setActiveOptionIndex((current) => Math.max(0, current - 1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (selectorOpen) {
        selectActivity(activeOptionIndex);
      } else {
        setSelectorOpen(true);
        setActiveOptionIndex(selectedIndex);
      }
      return;
    }

    if (event.key === "Escape") {
      setSelectorOpen(false);
    }
  }

  return (
    <section className="scroll-mt-40 py-10" id="library">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Activity Detail Modal Library</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
            Select one canonical activity at a time and inspect the complete
            full modal. Missing assets render explicit temporary placeholders.
          </p>
        </div>
        <p className="text-sm font-semibold text-[color:var(--muted)]">
          {selectedIndex + 1} of {activities.length}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="relative min-w-0 lg:min-w-[420px]"
          ref={dropdownRef}
        >
          <button
            aria-controls="activity-detail-modal-library-listbox"
            aria-expanded={selectorOpen}
            aria-haspopup="listbox"
            className="group relative flex min-h-[56px] w-full items-center justify-between gap-4 rounded-[12px] bg-[#FFFCF7]/92 px-4 py-3 text-left font-sans shadow-[0_14px_34px_rgba(36,31,24,0.08)] transition focus-visible:outline-none"
            onClick={() => {
              setSelectorOpen((current) => !current);
              setActiveOptionIndex(selectedIndex);
            }}
            onKeyDown={handleSelectorKeyDown}
            type="button"
          >
            <span
              aria-hidden="true"
              className={[
                "pointer-events-none absolute inset-0 rounded-[12px] p-[2px] opacity-0 transition-opacity",
                selectorOpen
                  ? "opacity-100"
                  : "group-focus-visible:opacity-100"
              ].join(" ")}
              style={{
                background:
                  "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor"
              }}
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[#324236]">
                {selectedActivity.title}
              </span>
              <span className="mt-1 block text-xs font-light uppercase tracking-[0.08em] text-[#7D5330]">
                {selectedActivity.duration} • {selectedActivity.stage}
              </span>
            </span>
            <span
              aria-hidden="true"
              className={[
                "shrink-0 text-lg leading-none text-[#7D5330] transition-transform duration-200",
                selectorOpen ? "rotate-180" : ""
              ].join(" ")}
            >
              v
            </span>
          </button>
          <div
            className={[
              "absolute left-0 right-0 top-[calc(100%+8px)] z-30 origin-top overflow-hidden rounded-[12px] border border-[#E4D8C8] bg-[#FFFCF7]/98 shadow-[0_18px_46px_rgba(36,31,24,0.14)] transition-[opacity,transform,max-height] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
              selectorOpen
                ? "max-h-[320px] translate-y-0 opacity-100"
                : "pointer-events-none max-h-0 -translate-y-1 opacity-0"
            ].join(" ")}
            id="activity-detail-modal-library-listbox"
            role="listbox"
          >
            <div className="max-h-[320px] overflow-y-auto py-1">
              {activities.map((activity, index) => {
                const isSelected = index === selectedIndex;
                const isActive = index === activeOptionIndex;

                return (
                  <button
                    aria-selected={isSelected}
                    className={[
                      "flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-sans transition",
                      isSelected || isActive
                        ? "bg-[#F4E7D3] text-[#062E27]"
                        : "text-[#324236] hover:bg-[#F7F0E6]"
                    ].join(" ")}
                    key={activity.slug}
                    onClick={() => selectActivity(index)}
                    onMouseEnter={() => setActiveOptionIndex(index)}
                    role="option"
                    type="button"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {activity.title}
                      </span>
                      <span className="mt-1 block text-xs font-light uppercase tracking-[0.08em] text-[#7D5330]">
                        {activity.duration} • {activity.stage || "Stage pending"}
                      </span>
                    </span>
                    {isSelected ? (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#B77B32]" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="rounded-full border border-[#D8C08A] bg-[#FCFBF9]/80 px-5 py-2.5 text-sm font-semibold text-[#7D5330] transition disabled:cursor-not-allowed disabled:opacity-45"
            disabled={selectedIndex === 0}
            onClick={() => {
              setSelectedIndex((current) => {
                const nextIndex = Math.max(0, current - 1);
                setActiveOptionIndex(nextIndex);
                return nextIndex;
              });
            }}
            type="button"
          >
            Previous
          </button>
          <button
            className="rounded-full bg-[#7D5330] px-5 py-2.5 text-sm font-semibold text-[#FCFBF9] transition disabled:cursor-not-allowed disabled:opacity-45"
            disabled={selectedIndex === activities.length - 1}
            onClick={() => {
              setSelectedIndex((current) => {
                const nextIndex = Math.min(activities.length - 1, current + 1);
                setActiveOptionIndex(nextIndex);
                return nextIndex;
              });
            }}
            type="button"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-8">
        <FitToWidth height={762} width={1368}>
          <ActivityDetailModal activity={modalData} />
        </FitToWidth>
      </div>
    </section>
  );
}

function MotionPrototypeSection() {
  return (
    <section className="scroll-mt-40 py-10" id="motion-prototype">
      <h3 className="text-2xl font-semibold">Motion Prototype</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
        The standalone V2 prototype remains the review surface for the
        Activity Card to Activity Detail Modal shell transition.
      </p>
      <Link
        className="mt-6 inline-flex rounded-full bg-[#7D5330] px-5 py-2.5 text-sm font-semibold text-[#FCFBF9] transition hover:bg-[#6f4828] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#aa7d3a]/50"
        href="/activity-modal-motion-v2"
        rel="noopener noreferrer"
        target="_blank"
      >
        Open Fullscreen Prototype -&gt;
      </Link>
    </section>
  );
}

export function ActivityDetailModalPageClient({
  activities
}: {
  activities: CanonicalActivityRecord[];
}) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/activity-detail-modal" />

        <ComponentPageShell
          description="The Builder Activity Detail Modal for reviewing selected workshop activities."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />
          <LibraryReview activities={activities} />
          <MotionPrototypeSection />
          <SpecsSection />
          <ComponentTokensSection
            description="Implementation values currently used by the shared ActivityDetailModal and extracted review motion."
            tokens={tokenRows}
          />
          <ComponentAccessibilitySection
            contrastNotes={accessibilityNotes.contrastNotes}
            focusBehaviour={accessibilityNotes.focusBehaviour}
            keyboardBehaviour={accessibilityNotes.keyboardBehaviour}
            reducedMotion={accessibilityNotes.reducedMotion}
            screenReaderNotes={accessibilityNotes.screenReaderNotes}
            unresolvedIssues={accessibilityNotes.unresolvedIssues}
          />
        </ComponentPageShell>
      </div>
    </main>
  );
}
