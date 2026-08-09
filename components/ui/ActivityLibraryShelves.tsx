"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent
} from "react";
import { createPortal } from "react-dom";

import {
  groupActivityLibraryShelves,
  type ActivityLibraryModalItem
} from "@/lib/design-system/activity-library-modal";

type ActivityLibraryShelvesProps = {
  activities: ActivityLibraryModalItem[];
  isOpen: boolean;
  onAdd?: (activity: ActivityLibraryModalItem) => void;
  onClose: () => void;
  suggestedIds?: string[];
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

function BackGlyph() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
    >
      <path
        d="M12.5 4.75 7.25 10l5.25 5.25"
        stroke="#062E27"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        stroke="url(#activity-library-shelves-add-gradient)"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <defs>
        <linearGradient
          id="activity-library-shelves-add-gradient"
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

function ShelfCard({
  activity,
  isFocused,
  onFocus,
  onOpen
}: {
  activity: ActivityLibraryModalItem;
  isFocused: boolean;
  onFocus: () => void;
  onOpen: () => void;
}) {
  return (
    <button
      aria-label={`${activity.title}. ${activity.durationDisplay}. ${activity.stageDisplay}`}
      className={[
        "group relative w-[220px] shrink-0 overflow-hidden rounded-[16px] border-[2px] bg-[#FCFBFA] text-left shadow-[0_4px_8px_-2px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.06)] transition-[transform,box-shadow,border-color,width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]",
        isFocused
          ? "z-10 w-[280px] border-[#7D5330] shadow-[0_16px_32px_-12px_rgba(0,0,0,0.22)]"
          : "border-[#B77B32] hover:z-10 hover:translate-y-[-4px] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.18)]"
      ].join(" ")}
      onClick={onOpen}
      onFocus={onFocus}
      onMouseEnter={onFocus}
      type="button"
    >
      <span
        className={[
          "relative block w-full overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          isFocused ? "h-[200px]" : "h-[160px]"
        ].join(" ")}
      >
        <Image
          alt=""
          className="object-cover object-center"
          fill
          sizes="280px"
          src={activity.illustration.src}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-b from-transparent to-[#FCFBFA]/55"
        />
      </span>

      <span className="flex flex-col gap-2 px-3 pb-3 pt-3">
        <span
          className="line-clamp-2 min-h-[44px] text-[18px] font-semibold leading-[22px] text-[#324236]"
          style={{
            fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
          }}
        >
          {activity.title}
        </span>

        <span className="flex items-center gap-1.5 text-[11px] uppercase leading-4">
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

        <span
          className={[
            "overflow-hidden text-[12px] font-normal leading-4 text-[#1F3E29] transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            isFocused
              ? "max-h-16 opacity-100"
              : "max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100"
          ].join(" ")}
        >
          {activity.outcome || "Open to inspect this activity."}
        </span>
      </span>
    </button>
  );
}

function ShelfRow({
  focusedId,
  label,
  items,
  onFocusCard,
  onOpenCard
}: {
  focusedId: string | null;
  label: string;
  items: ActivityLibraryModalItem[];
  onFocusCard: (id: string) => void;
  onOpenCard: (id: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  function scrollBy(direction: -1 | 1) {
    scrollerRef.current?.scrollBy({
      behavior: "smooth",
      left: direction * 320
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4 px-1">
        <h2
          className="text-[22px] font-bold leading-7 text-[#062E27]"
          style={{
            fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
          }}
        >
          {label}
        </h2>
        <div className="flex items-center gap-2">
          <button
            aria-label={`Scroll ${label} shelf left`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E4D8C8] bg-white text-[#062E27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99C56]"
            onClick={() => scrollBy(-1)}
            type="button"
          >
            <BackGlyph />
          </button>
          <button
            aria-label={`Scroll ${label} shelf right`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E4D8C8] bg-white text-[#062E27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D99C56]"
            onClick={() => scrollBy(1)}
            type="button"
          >
            <span className="rotate-180">
              <BackGlyph />
            </span>
          </button>
        </div>
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-3 pt-2 [scrollbar-width:thin]"
        ref={scrollerRef}
      >
        {items.map((activity) => (
          <ShelfCard
            activity={activity}
            isFocused={focusedId === activity.id}
            key={activity.id}
            onFocus={() => onFocusCard(activity.id)}
            onOpen={() => onOpenCard(activity.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ImmersiveInspect({
  activity,
  onAdd,
  onBack
}: {
  activity: ActivityLibraryModalItem;
  onAdd?: (activity: ActivityLibraryModalItem) => void;
  onBack: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activity.id]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E4D8C8] bg-[#FCFBFA]/95 px-6 py-4 backdrop-blur">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-[#E4D8C8] bg-white px-3 py-2 text-[13px] font-semibold text-[#062E27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
          onClick={onBack}
          type="button"
        >
          <BackGlyph />
          Back to shelves
        </button>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em]">
          <GradientText>ACTIVITY LIBRARY</GradientText>
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="relative h-[220px] w-full overflow-hidden sm:h-[280px]">
          <Image
            alt={activity.illustration.alt}
            className="object-cover object-center"
            fill
            priority
            sizes="1440px"
            src={activity.illustration.src}
          />
        </div>

        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center px-6 pb-10 pt-8 text-center">
          <p className="flex h-6 items-center justify-center gap-1 text-[16px] uppercase leading-6">
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

          <h1
            className="mt-2 text-[44px] font-bold leading-[48px] text-[#062E27]"
            style={{
              fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
            }}
          >
            {activity.title}
          </h1>

          {activity.outcome ? (
            <p className="mt-4 max-w-[540px] text-[17px] font-light leading-6 text-[#1F3E29]">
              {activity.outcome}
            </p>
          ) : null}

          <ol className="mt-12 flex w-full flex-col items-center">
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

      <div className="shrink-0 border-t border-[#E4D8C8] bg-[#FCFBFA] px-6 py-5">
        <div className="mx-auto flex w-full max-w-[480px] justify-center">
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-[#E4D8C8] bg-white text-[15px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
            onClick={() => onAdd?.(activity)}
            type="button"
          >
            <PlusGlyph />
            <GradientText>Add to workshop</GradientText>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ActivityLibraryShelves({
  activities,
  isOpen,
  onAdd,
  onClose,
  suggestedIds = []
}: ActivityLibraryShelvesProps) {
  const [mounted, setMounted] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [inspectId, setInspectId] = useState<string | null>(null);
  const browseScrollRef = useRef<HTMLDivElement | null>(null);
  const browseScrollTopRef = useRef(0);

  const shelves = useMemo(
    () => groupActivityLibraryShelves(activities, suggestedIds),
    [activities, suggestedIds]
  );

  const inspecting = useMemo(
    () => activities.find((activity) => activity.id === inspectId) ?? null,
    [activities, inspectId]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFocusedId(null);
      setInspectId(null);
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (inspectId) {
          setInspectId(null);
          return;
        }
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
  }, [inspectId, isOpen, onClose]);

  useEffect(() => {
    if (!inspecting && browseScrollRef.current) {
      browseScrollRef.current.scrollTop = browseScrollTopRef.current;
    }
  }, [inspecting]);

  function openInspect(id: string) {
    if (browseScrollRef.current) {
      browseScrollTopRef.current = browseScrollRef.current.scrollTop;
    }
    setInspectId(id);
  }

  function handlePanelKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
    }
  }

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="presentation">
      <button
        aria-label="Dismiss activity library"
        className="absolute inset-0 bg-[#062E27]/30 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />

      <div
        aria-label="Activity library"
        aria-modal="true"
        className="absolute inset-0 flex flex-col bg-[#F7F2EA] sm:inset-y-0 sm:right-0 sm:left-auto sm:w-full sm:max-w-[1440px] sm:shadow-[-28px_0_90px_rgba(38,31,24,0.28)]"
        onKeyDown={handlePanelKeyDown}
        role="dialog"
      >
        {inspecting ? (
          <ImmersiveInspect
            activity={inspecting}
            onAdd={onAdd}
            onBack={() => setInspectId(null)}
          />
        ) : (
          <>
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#E4D8C8] bg-[#FCFBFA]/92 px-6 py-5 backdrop-blur sm:px-8">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em]">
                  <GradientText>ACTIVITY LIBRARY</GradientText>
                </p>
                <p className="mt-1 text-[15px] leading-5 text-[#706B62]">
                  Browse by stage, peek on focus, then inspect before you add.
                </p>
              </div>
              <button
                aria-label="Close activity library"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4D8C8] bg-white text-[#062E27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
                onClick={onClose}
                type="button"
              >
                <CloseGlyph />
              </button>
            </header>

            <div
              className="min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-8"
              ref={browseScrollRef}
            >
              <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10">
                {shelves.map((shelf) => (
                  <ShelfRow
                    focusedId={focusedId}
                    items={shelf.items}
                    key={shelf.id}
                    label={shelf.label}
                    onFocusCard={setFocusedId}
                    onOpenCard={openInspect}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
