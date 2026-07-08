import Image from "next/image";

import type { Activity } from "@/lib/data/activities";

export type ActivityCardState = "default" | "hover" | "dragging";

export type ActivityCardVariant = "library" | "builder";

type ActivityCardProps = {
  activity: Activity;
  illustrationSrc?: string | null;
  state?: ActivityCardState;
  variant?: ActivityCardVariant;
};

function getValue(activity: Activity, field: string, fallback = "") {
  return activity[field]?.trim() || fallback;
}

function getWorkshopType(activity: Activity) {
  return (
    getValue(activity, "Workshop Type") ||
    getValue(activity, "Related Workshop") ||
    getValue(activity, "Layout Type")
  );
}

function DragHandle() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-[9px] z-10 grid h-[28px] w-[40px] -translate-x-1/2 grid-cols-3 gap-x-[3px] rounded-[7px] bg-[#FCFBFA]/92 px-[8px] py-[7px] shadow-[0_4px_12px_rgba(50,66,54,0.12)]"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <span
          className="h-[5px] w-[5px] rounded-full bg-[#B77B32]"
          key={index}
        />
      ))}
    </span>
  );
}

function MissingIllustration() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#F7F1E6]">
      <div className="h-[112px] w-[112px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(50,66,54,0.14),rgba(183,123,50,0.08)_54%,transparent_56%)]" />
    </div>
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

  return (
    <article
      aria-label={`Activity card: ${activityName}`}
      className={[
        "relative h-[370px] w-[256px] overflow-hidden rounded-[16px] bg-[#FCFBFA] p-[6px] text-left shadow-[0_12px_28px_rgba(37,31,24,0.18)] transition duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
        isBuilder ? "ring-[3px] ring-[#B77B32]" : "",
        isHover ? "translate-y-[-2px] shadow-[0_16px_34px_rgba(37,31,24,0.22)]" : "",
        isDragging
          ? "rotate-[-1deg] scale-[1.02] shadow-[0_20px_42px_rgba(37,31,24,0.26)]"
          : ""
      ].join(" ")}
      data-state={state}
      data-variant={variant}
    >
      <div className="relative h-[230px] w-[244px] overflow-hidden rounded-t-[11px] bg-[#F7F1E6]">
        {isBuilder ? <DragHandle /> : null}
        {illustrationSrc ? (
          <Image
            alt=""
            className="h-full w-full object-cover"
            height={460}
            src={illustrationSrc}
            width={488}
          />
        ) : (
          <MissingIllustration />
        )}
      </div>

      <div className="flex h-[125px] w-[244px] flex-col px-[29px] pb-[20px] pt-[20px]">
        <h3
          className="line-clamp-2 text-[22px] font-semibold leading-[24px] text-[#324236]"
          style={{
            fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
          }}
        >
          {activityName}
        </h3>
        <p className="mt-[6px] line-clamp-2 text-[10px] font-normal leading-[16px] text-[#1F3E29]">
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
