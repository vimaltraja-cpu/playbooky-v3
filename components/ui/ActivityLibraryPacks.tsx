"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent
} from "react";
import { createPortal } from "react-dom";

import {
  groupActivityLibraryPacks,
  type ActivityLibraryModalItem,
  type ActivityLibraryPack
} from "@/lib/design-system/activity-library-modal";

type ActivityLibraryPacksProps = {
  activities: ActivityLibraryModalItem[];
  isOpen: boolean;
  onAdd?: (activity: ActivityLibraryModalItem) => void;
  onClose: () => void;
  onRemove?: (activity: ActivityLibraryModalItem) => void;
  suggestedIds?: string[];
  /** Activity ids and/or slugs currently on the workshop grid */
  workshopActivityIds?: string[];
};

function activityMatchesWorkshopId(
  activity: ActivityLibraryModalItem,
  workshopId: string
) {
  return (
    activity.id === workshopId ||
    activity.slug === workshopId ||
    activity.id === `activity-${workshopId}` ||
    `activity-${activity.slug}` === workshopId
  );
}

function isActivityInWorkshop(
  activity: ActivityLibraryModalItem,
  workshopActivityIds: string[]
) {
  return workshopActivityIds.some((id) =>
    activityMatchesWorkshopId(activity, id)
  );
}

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
        stroke="url(#activity-library-packs-add-gradient)"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <defs>
        <linearGradient
          id="activity-library-packs-add-gradient"
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

function MinusGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="M3.25 8h9.5"
        stroke="#062E27"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function DownConnector() {
  return (
    <span
      aria-hidden="true"
      className="ml-[18px] my-0.5 flex h-4 w-[8px] shrink-0 flex-col items-center"
    >
      <span className="h-[2px] w-[2px] rounded-full bg-[#7D5330]" />
      <span className="w-px flex-1" style={{ background: brandGradient }} />
      <span className="h-[4px] w-[4px] rounded-full bg-[#D99C56]" />
    </span>
  );
}

function PackTile({
  onOpen,
  pack
}: {
  onOpen: () => void;
  pack: ActivityLibraryPack;
}) {
  return (
    <button
      aria-label={`${pack.label}. ${pack.blurb}. ${pack.items.length} activities`}
      className="group relative aspect-[4/5] overflow-hidden rounded-[18px] border border-[#E4D8C8] bg-[#1A2E24] text-left shadow-[0_10px_28px_-14px_rgba(6,46,39,0.45)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-1 hover:border-[#D99C56] hover:shadow-[0_18px_36px_-16px_rgba(6,46,39,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56] motion-reduce:transition-none"
      onClick={onOpen}
      type="button"
    >
      <Image
        alt=""
        className="object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04]"
        fill
        sizes="280px"
        src={pack.illustration.src}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#062E27]/92 via-[#062E27]/45 to-[#062E27]/10"
      />
      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D99C56]">
          {pack.items.length}{" "}
          {pack.items.length === 1 ? "activity" : "activities"}
        </span>
        <span
          className="text-[22px] font-semibold leading-7 text-[#FCFBF9]"
          style={{
            fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
          }}
        >
          {pack.label}
        </span>
        <span className="line-clamp-2 text-[13px] font-medium leading-5 text-[#E8E0D4]">
          {pack.blurb}
        </span>
      </span>
    </button>
  );
}

function InventoryTile({
  activity,
  inWorkshop,
  isSelected,
  onSelect
}: {
  activity: ActivityLibraryModalItem;
  inWorkshop: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-current={isSelected ? "true" : undefined}
      aria-label={`${activity.title}. ${activity.durationDisplay}${
        inWorkshop ? ". Already in workshop" : ""
      }`}
      className={[
        "group relative aspect-[3/4] overflow-hidden rounded-[14px] border-[2px] text-left transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56] motion-reduce:transition-none",
        isSelected
          ? "z-10 border-[#7D5330] shadow-[0_0_0_3px_rgba(217,156,86,0.4),0_12px_24px_-12px_rgba(6,46,39,0.3)]"
          : "border-transparent hover:z-10 hover:border-[#C8A564] hover:shadow-[0_12px_22px_-14px_rgba(6,46,39,0.4)]"
      ].join(" ")}
      onClick={onSelect}
      type="button"
    >
      <Image
        alt=""
        className={[
          "object-cover object-center transition-[transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          isSelected
            ? "brightness-[1.08] saturate-[0.92]"
            : "group-hover:scale-[1.05]"
        ].join(" ")}
        fill
        sizes="160px"
        src={activity.illustration.src}
      />

      <span
        aria-hidden="true"
        className={[
          "absolute inset-0 transition-colors duration-200",
          isSelected
            ? "bg-gradient-to-t from-[#F6F1E8]/55 via-[#F6F1E8]/08 to-transparent"
            : "bg-gradient-to-t from-[#062E27]/90 via-[#062E27]/30 to-transparent"
        ].join(" ")}
      />

      {inWorkshop ? (
        <span className="absolute left-2 top-2 z-10 rounded-full border border-[#E4D8C8] bg-[#FCFBFA]/95 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#062E27] shadow-sm backdrop-blur-sm">
          In workshop
        </span>
      ) : null}

      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-2.5">
        <span
          className={[
            "line-clamp-2 text-[13px] font-semibold leading-4",
            isSelected ? "text-[#062E27]" : "text-[#FCFBF9]"
          ].join(" ")}
        >
          {activity.title}
        </span>
        <span
          className={[
            "text-[10px] font-semibold uppercase tracking-[0.08em]",
            isSelected ? "text-[#7D5330]" : "text-[#E4C48A]"
          ].join(" ")}
        >
          {activity.durationDisplay}
        </span>
      </span>
    </button>
  );
}

function InPlaceInspector({
  activity,
  inWorkshop,
  onAdd,
  onRemove
}: {
  activity: ActivityLibraryModalItem;
  inWorkshop: boolean;
  onAdd?: (activity: ActivityLibraryModalItem) => void;
  onRemove?: (activity: ActivityLibraryModalItem) => void;
}) {
  const steps = activity.steps.slice(0, 6);

  return (
    <aside className="flex h-full min-h-0 w-full max-w-[320px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[#E4D8C8] bg-[#FCFBFA] shadow-[0_16px_40px_-24px_rgba(6,46,39,0.35)]">
      <div className="relative h-[120px] shrink-0 overflow-hidden">
        <Image
          alt=""
          className="object-cover object-center"
          fill
          sizes="320px"
          src={activity.illustration.src}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#FCFBFA] to-transparent"
        />
        {inWorkshop ? (
          <span className="absolute left-3 top-3 rounded-full border border-[#E4D8C8] bg-[#FCFBFA]/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#062E27] shadow-sm backdrop-blur-sm">
            Already in workshop
          </span>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center gap-3 overflow-hidden px-4 pb-3 pt-0">
        <div className="flex w-full shrink-0 flex-col gap-1.5">
          <p className="flex items-center gap-1.5 text-[10px] uppercase leading-4">
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
          <h3
            className="text-[20px] font-semibold leading-6 text-[#062E27]"
            style={{
              fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
            }}
          >
            {activity.title}
          </h3>
          <p className="line-clamp-2 text-[12px] font-normal leading-4 text-[#324236]">
            {activity.outcome ||
              "A focused activity for this stage of the session."}
          </p>
        </div>

        <ol className="flex min-h-0 w-fit flex-1 flex-col justify-center self-center overflow-hidden py-1">
          {steps.map((step, index) => (
            <li
              className="flex flex-col"
              key={`${activity.id}-${step.label}`}
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <Image
                    alt={step.iconAlt}
                    className="h-9 w-9 object-contain"
                    height={36}
                    src={step.iconSrc}
                    width={36}
                  />
                </span>
                <span
                  className="whitespace-nowrap text-[13px] font-semibold leading-4 text-[#171614]"
                  style={{
                    fontFamily: "Newsreader, Georgia, 'Times New Roman', serif",
                    letterSpacing: "-0.02em"
                  }}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 ? <DownConnector /> : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="shrink-0 border-t border-[#E4D8C8] bg-[#FCFBFA] px-4 py-3">
        {inWorkshop ? (
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E4D8C8] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#062E27] shadow-sm transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
            onClick={() => onRemove?.(activity)}
            type="button"
          >
            <MinusGlyph />
            Remove from workshop
          </button>
        ) : (
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E4D8C8] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#062E27] shadow-sm transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
            onClick={() => onAdd?.(activity)}
            type="button"
          >
            <PlusGlyph />
            <GradientText>Add to workshop</GradientText>
          </button>
        )}
      </div>
    </aside>
  );
}

export function ActivityLibraryPacks({
  activities,
  isOpen,
  onAdd,
  onClose,
  onRemove,
  suggestedIds = [],
  workshopActivityIds = []
}: ActivityLibraryPacksProps) {
  const packs = useMemo(
    () => groupActivityLibraryPacks(activities, suggestedIds),
    [activities, suggestedIds]
  );

  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"packs" | "shortlist">("packs");
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );

  const activePack =
    packs.find((pack) => pack.id === activePackId) ?? packs[0] ?? null;

  const selectedActivity =
    activePack?.items.find((item) => item.id === selectedActivityId) ??
    activePack?.items[0] ??
    null;

  const selectedInWorkshop = selectedActivity
    ? isActivityInWorkshop(selectedActivity, workshopActivityIds)
    : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setView("packs");
      setActivePackId(null);
      setSelectedActivityId(null);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (view === "shortlist") {
          setView("packs");
          setActivePackId(null);
          setSelectedActivityId(null);
          return;
        }
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, view]);

  function openPack(pack: ActivityLibraryPack) {
    setActivePackId(pack.id);
    setSelectedActivityId(pack.items[0]?.id ?? null);
    setView("shortlist");
  }

  function backToPacks() {
    setView("packs");
    setActivePackId(null);
    setSelectedActivityId(null);
  }

  function handlePanelKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      if (view === "shortlist") {
        backToPacks();
        return;
      }
      onClose();
    }
  }

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      aria-labelledby="activity-library-packs-title"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-stretch justify-end"
      onKeyDown={handlePanelKeyDown}
      role="dialog"
    >
      <button
        aria-label="Close activity library"
        className="absolute inset-0 bg-[#062E27]/35 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />

      <div className="relative flex h-full w-[min(1180px,94vw)] flex-col overflow-hidden border-l border-[#E4D8C8] bg-[#F6F1E8] shadow-[-24px_0_64px_-32px_rgba(6,46,39,0.4)]">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E4D8C8] bg-[#FCFBFA]/92 px-6 py-3 backdrop-blur">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase leading-3 tracking-[0.16em]">
              <GradientText>ACTIVITY LIBRARY</GradientText>
            </p>
            {view === "shortlist" && activePack ? (
              <h2
                className="truncate pt-3 text-[20px] font-semibold leading-6 text-[#062E27]"
                id="activity-library-packs-title"
                style={{
                  fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
                }}
              >
                {activePack.label}
              </h2>
            ) : (
              <span className="sr-only" id="activity-library-packs-title">
                Choose a pack
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {view === "shortlist" ? (
              <button
                className="relative pb-0.5 text-[13px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
                onClick={backToPacks}
                type="button"
              >
                <GradientText>All packs</GradientText>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px"
                  style={{ background: brandGradient }}
                />
              </button>
            ) : null}
            <button
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4D8C8] bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
              onClick={onClose}
              type="button"
            >
              <CloseGlyph size={20} />
            </button>
          </div>
        </header>

        <div className="relative min-h-0 flex-1">
          <div
            aria-hidden={view !== "packs"}
            className={[
              "absolute inset-0 overflow-y-auto px-6 py-6 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              view === "packs"
                ? "pointer-events-auto translate-x-0 opacity-100"
                : "pointer-events-none -translate-x-4 opacity-0"
            ].join(" ")}
          >
            <div className="mb-5 max-w-xl">
              <h2
                className="text-[28px] font-semibold leading-8 text-[#062E27]"
                style={{
                  fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
                }}
              >
                Choose a pack
              </h2>
              <p className="mt-2 text-[14px] leading-5 text-[#5E5A53]">
                Curated sets by stage — open one, then pick from the inventory.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-3 xl:grid-cols-4">
              {packs.map((pack) => (
                <PackTile
                  key={pack.id}
                  onOpen={() => openPack(pack)}
                  pack={pack}
                />
              ))}
            </div>
          </div>

          <div
            aria-hidden={view !== "shortlist"}
            className={[
              "absolute inset-0 flex min-h-0 gap-4 overflow-hidden px-6 py-5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              view === "shortlist"
                ? "pointer-events-auto translate-x-0 opacity-100"
                : "pointer-events-none translate-x-4 opacity-0"
            ].join(" ")}
          >
            {activePack && selectedActivity ? (
              <>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
                  <p className="shrink-0 text-[14px] leading-5 text-[#5E5A53]">
                    {activePack.blurb}
                  </p>
                  <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible px-1 pb-2 pt-3">
                    <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
                      {activePack.items.map((activity) => (
                        <InventoryTile
                          activity={activity}
                          inWorkshop={isActivityInWorkshop(
                            activity,
                            workshopActivityIds
                          )}
                          isSelected={selectedActivity.id === activity.id}
                          key={activity.id}
                          onSelect={() => setSelectedActivityId(activity.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <InPlaceInspector
                  activity={selectedActivity}
                  inWorkshop={selectedInWorkshop}
                  onAdd={onAdd}
                  onRemove={onRemove}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
