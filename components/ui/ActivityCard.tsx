import Image from "next/image";

import type { Activity } from "@/lib/data/activities";

export type ActivityCardState = "default" | "hover" | "dragging";

export type ActivityCardVariant = "library" | "builder";

type ActivityCardProps = {
  activity: Activity;
  illustrationSrc: string;
  state?: ActivityCardState;
  variant?: ActivityCardVariant;
};

function getValue(activity: Activity, field: string, fallback = "") {
  return activity[field]?.trim() || fallback;
}

function getWorkshopType(activity: Activity) {
  return (
    getValue(activity, "Workshop Type") ||
    getValue(activity, "Stage") ||
    getValue(activity, "Layout Type")
  );
}

function getTitleLines(title: string) {
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

function DragHandle() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-[112px] top-[6px] z-10 flex h-[24px] w-[32px] flex-col items-center justify-center gap-[4px] rounded-[8px] bg-[#FCFBFA]"
    >
      <span className="h-px w-[14px] rounded-full bg-[#B77B32]" />
      <span className="h-px w-[14px] rounded-full bg-[#B77B32]" />
    </span>
  );
}

export function ActivityCard({
  activity,
  illustrationSrc,
  state = "default",
  variant = "library"
}: ActivityCardProps) {
  const activityName = getValue(activity, "Activity Name", "Untitled activity");
  const description = getValue(activity, "Purpose");
  const duration = getValue(activity, "Duration");
  const workshopType = getWorkshopType(activity);
  const isBuilder = variant === "builder";
  const isHover = state === "hover";
  const isDragging = state === "dragging";
  const [titleLineOne, titleLineTwo] = getTitleLines(activityName);

  return (
    <article
      aria-label={`Activity card: ${activityName}`}
      className={[
        "relative flex h-[370px] w-[256px] flex-col gap-[2px] overflow-hidden rounded-[16px] bg-[#FCFBFA] p-[6px] text-left shadow-[0_4px_8px_-2px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.06)] transition duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
        isHover ? "translate-y-[-2px] shadow-[0_6px_12px_-2px_rgba(0,0,0,0.12),0_3px_6px_-2px_rgba(0,0,0,0.08)]" : "",
        isDragging
          ? "rotate-[-1deg] scale-[1.02] shadow-[0_8px_16px_-2px_rgba(0,0,0,0.14),0_4px_8px_-2px_rgba(0,0,0,0.10)]"
          : ""
      ].join(" ")}
      data-state={state}
      data-variant={variant}
    >
      <div className="relative h-[230px] w-[244px] shrink-0 overflow-hidden rounded-t-[10px] bg-[#F7F1E6]">
        {isBuilder ? <DragHandle /> : null}
        <Image
          alt=""
          className="h-full w-full object-cover"
          height={460}
          src={illustrationSrc}
          width={488}
        />
      </div>

      <div className="flex h-[125px] w-[244px] flex-col gap-[4px] pb-[8px] pl-[12px] pr-[12px] pt-[20px]">
        <h3
          className="grid h-[48px] grid-rows-2 overflow-hidden text-[22px] font-semibold leading-[24px] text-[#324236]"
          style={{
            fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
          }}
        >
          <span className="block truncate">{titleLineOne}</span>
          <span className="block truncate">{titleLineTwo}</span>
        </h3>
        <p className="line-clamp-2 max-h-[32px] text-[10px] font-normal leading-[16px] text-[#1F3E29]">
          {description}
        </p>
        <div className="mt-auto flex items-center gap-[14px] text-[10px] font-light leading-[16px] text-transparent [background:linear-gradient(90deg,#B77B32_0%,#D39A4D_100%)] bg-clip-text">
          <span>{duration}</span>
          {duration && workshopType ? (
            <span className="h-[20px] w-px bg-[#D39A4D]" />
          ) : null}
          <span className="truncate">{workshopType}</span>
        </div>
      </div>
    </article>
  );
}
