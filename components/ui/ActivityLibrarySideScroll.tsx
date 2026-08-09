"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  ACTIVITY_LIBRARY_STAGE_TABS,
  filterActivityLibraryItems,
  type ActivityLibraryModalItem,
  type ActivityLibraryStageTab
} from "@/lib/design-system/activity-library-modal";

type ActivityLibrarySideScrollProps = {
  activities: ActivityLibraryModalItem[];
  isOpen: boolean;
  onAdd?: (activity: ActivityLibraryModalItem) => void;
  onClose: () => void;
};

const brandGradient = "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)";
const metadataGradient =
  "linear-gradient(63.44deg, #7C5E24 16.72%, #C8A564 83.39%)";

function GradientText({
  children,
  className,
  gradient = brandGradient
}: {
  children: string;
  className?: string;
  gradient?: string;
}) {
  return (
    <span
      className={className}
      style={{
        WebkitBackgroundClip: "text",
        background: gradient,
        backgroundClip: "text",
        color: "transparent"
      }}
    >
      {children}
    </span>
  );
}

function CloseGlyph({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="M6.75 6.75L17.25 17.25M17.25 6.75L6.75 17.25"
        stroke="#062E27"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PlusGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 3.25v9.5M3.25 8h9.5"
        stroke="url(#activity-library-side-scroll-add-gradient)"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <defs>
        <linearGradient
          id="activity-library-side-scroll-add-gradient"
          x1="3"
          x2="13"
          y1="3"
          y2="13"
        >
          <stop stopColor="#7D5330" />
          <stop offset="1" stopColor="#D99C56" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DownConnector() {
  return (
    <span
      aria-hidden="true"
      className="my-2 flex h-12 w-[10px] shrink-0 flex-col items-center"
    >
      <span className="h-[3px] w-[3px] rounded-full bg-[#7D5330]" />
      <span className="w-px flex-1" style={{ background: brandGradient }} />
      <span className="h-[5px] w-[5px] rounded-full bg-[#D99C56]" />
    </span>
  );
}

function splitTitleIntoTwoLines(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return [title, "\u00a0"];
  }

  const splitIndex = Math.ceil(words.length / 2);

  return [
    words.slice(0, splitIndex).join(" "),
    words.slice(splitIndex).join(" ")
  ];
}

function StageTabs({
  activeTab,
  onChange
}: {
  activeTab: ActivityLibraryStageTab;
  onChange: (tab: ActivityLibraryStageTab) => void;
}) {
  return (
    <div
      aria-label="Filter activities by stage"
      className="flex h-10 w-full items-center gap-1 overflow-x-auto"
      role="tablist"
    >
      {ACTIVITY_LIBRARY_STAGE_TABS.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            aria-selected={isActive}
            className={[
              "relative h-10 shrink-0 px-4 text-[15px] font-semibold leading-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]",
              isActive ? "text-[#062E27]" : "text-[#706B62] hover:text-[#324236]"
            ].join(" ")}
            key={tab}
            onClick={() => onChange(tab)}
            role="tab"
            type="button"
          >
            {tab}
            <span
              aria-hidden="true"
              className={[
                "absolute inset-x-3 bottom-0 h-[2px] rounded-full transition-opacity",
                isActive ? "opacity-100" : "opacity-0"
              ].join(" ")}
              style={{ background: brandGradient }}
            />
          </button>
        );
      })}
    </div>
  );
}

function LibraryPickerCard({
  activity,
  isSelected,
  onSelect
}: {
  activity: ActivityLibraryModalItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [titleLineOne, titleLineTwo] = splitTitleIntoTwoLines(activity.title);

  return (
    <button
      aria-pressed={isSelected}
      className={[
        "relative z-0 flex h-full w-full flex-col rounded-[16px] border-[2px] bg-[#FCFBFA] p-[6px] text-left shadow-[0_4px_8px_-2px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.06)] transition-[box-shadow,transform,border-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]",
        isSelected
          ? "z-10 border-[#7D5330] shadow-[0_8px_18px_-5px_rgba(0,0,0,0.16),0_4px_8px_-4px_rgba(0,0,0,0.10)]"
          : "border-[#B77B32] hover:z-10 hover:translate-y-[-2px] hover:shadow-[0_8px_18px_-5px_rgba(0,0,0,0.16),0_4px_8px_-4px_rgba(0,0,0,0.10)]"
      ].join(" ")}
      onClick={onSelect}
      type="button"
    >
      <span className="relative -mx-[6px] -mt-[6px] block aspect-[252/200] w-[calc(100%+12px)] overflow-hidden rounded-[12px]">
        <Image
          alt=""
          className="object-cover object-center"
          fill
          sizes="320px"
          src={activity.illustration.src}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-transparent to-[#FCFBFA]/45"
        />
      </span>

      <span className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-3">
        <span
          className="grid h-[48px] grid-rows-2 overflow-hidden text-[20px] font-semibold leading-[24px] text-[#324236]"
          style={{
            fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
          }}
        >
          <span className="block truncate">{titleLineOne}</span>
          <span className="block truncate">{titleLineTwo}</span>
        </span>

        <span className="mt-auto flex items-center gap-1.5 pt-3 text-[12px] uppercase leading-4">
          <GradientText className="font-light" gradient={metadataGradient}>
            {activity.durationDisplay}
          </GradientText>
          <span aria-hidden="true" className="text-[#C8A564]">
            •
          </span>
          <GradientText className="font-semibold" gradient={metadataGradient}>
            {activity.stageDisplay}
          </GradientText>
        </span>
      </span>
    </button>
  );
}

function PreviewPanel({
  activity,
  onAdd,
  onClose
}: {
  activity: ActivityLibraryModalItem;
  onAdd?: (activity: ActivityLibraryModalItem) => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activity.id]);

  return (
    <aside
      aria-label={`${activity.title} activity preview`}
      className="flex h-full w-full flex-col overflow-hidden border-l border-[#E4D8C8] bg-[#FCFBFA]"
    >
      <div className="min-h-0 flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="relative h-[120px] w-full shrink-0 overflow-hidden">
          <Image
            alt={activity.illustration.alt}
            className="object-cover object-center"
            fill
            priority
            sizes="480px"
            src={activity.illustration.src}
          />
          <button
            aria-label="Close activity preview"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/85 text-[#062E27] shadow-sm backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99C56]"
            onClick={onClose}
            type="button"
          >
            <CloseGlyph size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center px-8 pb-8 pt-6 text-center">
          <p className="flex h-6 items-center justify-center gap-1 text-[15px] uppercase leading-6">
            <GradientText className="font-light" gradient={metadataGradient}>
              {activity.durationDisplay}
            </GradientText>
            <span aria-hidden="true" className="text-[#C8A564]">
              •
            </span>
            <GradientText className="font-semibold" gradient={metadataGradient}>
              {activity.stageDisplay}
            </GradientText>
          </p>

          <h2
            className="mt-2 text-[36px] font-bold leading-10 text-[#062E27]"
            style={{
              fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
            }}
          >
            {activity.title}
          </h2>

          <ol className="mt-10 flex w-full flex-col items-center">
            {activity.steps.map((step, index) => (
              <li
                className="flex w-full flex-col items-center"
                key={`${activity.id}-${step.label}`}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="relative flex h-[90px] w-[90px] items-center justify-center">
                    <Image
                      alt={step.iconAlt}
                      className="h-[70px] w-[70px] object-contain"
                      height={70}
                      src={step.iconSrc}
                      width={70}
                    />
                  </span>
                  <span
                    className="text-[18px] font-semibold leading-5 text-[#171614]"
                    style={{
                      fontFamily:
                        "Newsreader, Georgia, 'Times New Roman', serif",
                      letterSpacing: "-0.03em"
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {index < activity.steps.length - 1 ? <DownConnector /> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#E4D8C8] px-8 py-5">
        <button
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-[#E4D8C8] bg-white text-[15px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
          onClick={() => onAdd?.(activity)}
          type="button"
        >
          <PlusGlyph />
          <GradientText>Add to workshop</GradientText>
        </button>
      </div>
    </aside>
  );
}

export function ActivityLibrarySideScroll({
  activities,
  isOpen,
  onAdd,
  onClose
}: ActivityLibrarySideScrollProps) {
  const [activeTab, setActiveTab] = useState<ActivityLibraryStageTab>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedId(null);
      setActiveTab("All");
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const filteredActivities = useMemo(
    () => filterActivityLibraryItems(activities, activeTab),
    [activeTab, activities]
  );

  const selectedActivity = useMemo(
    () =>
      filteredActivities.find((activity) => activity.id === selectedId) ??
      activities.find((activity) => activity.id === selectedId) ??
      null,
    [activities, filteredActivities, selectedId]
  );

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="presentation">
      <button
        aria-label="Dismiss activity library"
        className="absolute inset-0 bg-[#062E27]/25 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />

      <div
        aria-label="Activity library"
        aria-modal="true"
        className="absolute inset-y-0 right-0 flex w-full max-w-[1440px] flex-col bg-[#F7F2EA] shadow-[-24px_0_80px_rgba(38,31,24,0.28)]"
        role="dialog"
      >
        <header className="flex shrink-0 flex-col gap-2 border-b border-[#E4D8C8] bg-[#FCFBFA]/90 px-8 pb-3 pt-6 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em]">
              <GradientText>ACTIVITY LIBRARY</GradientText>
            </p>
            <button
              aria-label="Close activity library"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4D8C8] bg-white text-[#062E27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
              onClick={onClose}
              type="button"
            >
              <CloseGlyph />
            </button>
          </div>
          <StageTabs
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setSelectedId(null);
            }}
          />
        </header>

        <div className="flex min-h-0 flex-1">
          <div
            className={[
              "min-h-0 flex-1 overflow-y-auto px-8 py-8 transition-[padding] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
              selectedActivity ? "pr-6" : "pr-8"
            ].join(" ")}
          >
            {filteredActivities.length === 0 ? (
              <p className="py-12 text-[16px] leading-6 text-[#706B62]">
                No activities in this stage yet.
              </p>
            ) : (
              <ul
                className={[
                  "mx-auto grid gap-6",
                  selectedActivity
                    ? "max-w-none grid-cols-2 xl:grid-cols-3"
                    : "max-w-[1280px] grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                ].join(" ")}
              >
                {filteredActivities.map((activity) => (
                  <li className="min-h-[300px]" key={activity.id}>
                    <LibraryPickerCard
                      activity={activity}
                      isSelected={selectedActivity?.id === activity.id}
                      onSelect={() => setSelectedId(activity.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            aria-hidden={!selectedActivity}
            className={[
              "shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
              selectedActivity
                ? "w-[min(420px,36vw)] opacity-100"
                : "w-0 opacity-0"
            ].join(" ")}
          >
            {selectedActivity ? (
              <PreviewPanel
                activity={selectedActivity}
                onAdd={onAdd}
                onClose={() => setSelectedId(null)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
