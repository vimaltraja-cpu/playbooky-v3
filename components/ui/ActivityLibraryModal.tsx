"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ACTIVITY_LIBRARY_STAGE_TABS,
  filterActivityLibraryItems,
  type ActivityLibraryModalItem,
  type ActivityLibraryStageTab
} from "@/lib/design-system/activity-library-modal";

type ActivityLibraryModalProps = {
  activities: ActivityLibraryModalItem[];
  contentOnly?: boolean;
  isOpen?: boolean;
  onAdd?: (activity: ActivityLibraryModalItem) => void;
  onClose?: () => void;
};

const brandGradient = "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)";
const metadataGradient =
  "linear-gradient(63.44deg, #7C5E24 16.72%, #C8A564 83.39%)";
const RAIL_WIDTH = "min(340px, 36%)";

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

function CloseGlyph({ size = 20 }: { size?: number }) {
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
        stroke="url(#activity-library-add-gradient)"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <defs>
        <linearGradient
          id="activity-library-add-gradient"
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
      className="my-1 flex h-10 w-[10px] shrink-0 flex-col items-center"
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
      className="flex h-9 w-full shrink-0 items-center gap-0.5 overflow-x-auto"
      role="tablist"
    >
      {ACTIVITY_LIBRARY_STAGE_TABS.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            aria-selected={isActive}
            className={[
              "relative h-9 shrink-0 px-3 text-[14px] font-semibold leading-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]",
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
                "absolute inset-x-2 bottom-0 h-[2px] rounded-full transition-opacity",
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
        "relative z-0 flex h-full w-full flex-col rounded-[14px] border-[2px] bg-[#FCFBFA] p-[5px] text-left shadow-[0_4px_8px_-2px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.06)] transition-[box-shadow,transform,border-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]",
        isSelected
          ? "z-10 border-[#7D5330] shadow-[0_8px_18px_-5px_rgba(0,0,0,0.16),0_4px_8px_-4px_rgba(0,0,0,0.10)]"
          : "border-[#B77B32] hover:z-10 hover:translate-y-[-2px] hover:shadow-[0_8px_18px_-5px_rgba(0,0,0,0.16),0_4px_8px_-4px_rgba(0,0,0,0.10)]"
      ].join(" ")}
      onClick={onSelect}
      type="button"
    >
      <span className="relative -mx-[5px] -mt-[5px] mb-0 block aspect-[252/160] w-[calc(100%+10px)] overflow-hidden rounded-[11px]">
        <Image
          alt=""
          className="object-cover object-center"
          fill
          sizes="280px"
          src={activity.illustration.src}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-transparent to-[#FCFBFA]/45"
        />
      </span>

      <span className="flex min-h-0 flex-1 flex-col px-2.5 pb-2 pt-2.5">
        <span
          className="grid h-[40px] grid-rows-2 overflow-hidden text-[17px] font-semibold leading-[20px] text-[#324236]"
          style={{
            fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
          }}
        >
          <span className="block truncate">{titleLineOne}</span>
          <span className="block truncate">{titleLineTwo}</span>
        </span>

        <span className="mt-auto flex items-center gap-1.5 pt-2 text-[11px] uppercase leading-4">
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

function ActivitySideRail({
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
      className="relative flex h-full w-full flex-col overflow-hidden border-l border-[#E4D8C8] bg-[rgba(252,251,250,0.98)]"
    >
      <div className="min-h-0 flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="relative h-[60px] w-full shrink-0 overflow-hidden">
          <Image
            alt={activity.illustration.alt}
            className="object-cover object-center"
            fill
            priority
            sizes="340px"
            src={activity.illustration.src}
          />
          <button
            aria-label="Close activity preview"
            className="absolute right-3 top-3 z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/85 text-[#062E27] shadow-sm backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99C56]"
            onClick={onClose}
            type="button"
          >
            <CloseGlyph size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center px-5 pb-5 pt-4 text-center">
          <p className="flex h-5 items-center justify-center gap-1 text-[13px] uppercase leading-5">
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
            className="mt-1 text-[28px] font-bold leading-8 text-[#062E27]"
            style={{
              fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
            }}
          >
            {activity.title}
          </h2>

          <ol className="mt-8 flex w-full flex-col items-center">
            {activity.steps.map((step, index) => (
              <li
                className="flex w-full flex-col items-center"
                key={`${activity.id}-${step.label}`}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="relative flex h-[72px] w-[72px] items-center justify-center">
                    <Image
                      alt={step.iconAlt}
                      className="h-14 w-14 object-contain"
                      height={56}
                      src={step.iconSrc}
                      width={56}
                    />
                  </span>
                  <span
                    className="text-[16px] font-semibold leading-5 text-[#171614]"
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

      <div className="shrink-0 border-t border-[#E4D8C8] px-5 py-4">
        <button
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[#E4D8C8] bg-white text-[14px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
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

export function ActivityLibraryModal({
  activities,
  contentOnly = false,
  isOpen = true,
  onAdd,
  onClose
}: ActivityLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<ActivityLibraryStageTab>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const railOpen = Boolean(selectedActivity);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[14px] bg-[rgba(252,251,250,0.92)]">
      <header className="relative z-20 flex shrink-0 flex-col gap-1 bg-[rgba(252,251,250,0.96)] px-5 pb-1 pt-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em]">
            <GradientText>ACTIVITY LIBRARY</GradientText>
          </p>
          {!contentOnly ? (
            <button
              aria-label="Close activity library"
              className="flex h-6 w-6 items-center justify-center text-[#062E27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
              onClick={onClose}
              type="button"
            >
              <CloseGlyph />
            </button>
          ) : null}
        </div>
        <StageTabs
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            setSelectedId(null);
          }}
        />
      </header>

      <div className="relative z-0 mt-1 min-h-0 flex-1 overflow-hidden">
        <div
          className={[
            "h-full overflow-y-auto overflow-x-visible px-5 pb-5 pt-4 transition-[padding] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            railOpen ? "pr-[min(360px,calc(36%+20px))]" : "pr-5"
          ].join(" ")}
        >
          {filteredActivities.length === 0 ? (
            <p className="py-8 text-[15px] leading-6 text-[#706B62]">
              No activities in this stage yet.
            </p>
          ) : (
            <ul
              className={[
                "grid gap-5",
                railOpen ? "grid-cols-2" : "grid-cols-4"
              ].join(" ")}
            >
              {filteredActivities.map((activity) => (
                <li className="min-h-[240px]" key={activity.id}>
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
          aria-hidden={!railOpen}
          className={[
            "absolute inset-y-0 right-0 z-10 overflow-hidden transition-[width,opacity,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            railOpen
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-6 opacity-0"
          ].join(" ")}
          style={{ width: railOpen ? RAIL_WIDTH : 0 }}
        >
          {selectedActivity ? (
            <ActivitySideRail
              activity={selectedActivity}
              onAdd={onAdd}
              onClose={() => setSelectedId(null)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  if (contentOnly) {
    return (
      <article
        aria-label="Activity library content"
        className="relative box-border flex h-[758px] w-[1364px] flex-col overflow-hidden"
      >
        {modalContent}
      </article>
    );
  }

  return (
    <article
      aria-label="Activity library"
      aria-modal="true"
      className="relative isolate box-border flex h-[762px] w-[1368px] flex-col overflow-hidden rounded-[16px] p-[2px] shadow-[0_4px_8px_-2px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.06)]"
      role="dialog"
      style={{ background: brandGradient }}
    >
      {modalContent}
    </article>
  );
}
