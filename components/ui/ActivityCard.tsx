import Image from "next/image";

import type { ActivityCardDemoItem } from "@/lib/data/activity-card-demo-data";

export type ActivityCardVariant = "builder" | "library";
export type ActivityCardState = "default" | "hover" | "dragging";

type ActivityCardProps = {
  activity: ActivityCardDemoItem;
  state?: ActivityCardState;
  variant?: ActivityCardVariant;
};

function splitTitle(title: string) {
  const words = title.trim().split(/\s+/);

  if (words.length < 2) {
    return [title, "\u00a0"];
  }

  const firstLineWordCount = Math.ceil(words.length / 2);

  return [
    words.slice(0, firstLineWordCount).join(" "),
    words.slice(firstLineWordCount).join(" ")
  ];
}

function ActivityDragHandle() {
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
  state = "default",
  variant = "builder"
}: ActivityCardProps) {
  const isBuilder = variant === "builder";
  const isHover = state === "hover";
  const isDragging = state === "dragging";
  const [titleLineOne, titleLineTwo] = splitTitle(activity.title);

  return (
    <article
      aria-label={`Activity card: ${activity.title}`}
      className={[
        "relative flex h-[370px] w-[256px] flex-col gap-[2px] overflow-hidden rounded-[16px] bg-[#FCFBFA] p-[6px] text-left shadow-[0_4px_8px_-2px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.06)] transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
        isHover
          ? "translate-y-[-2px] shadow-[0_6px_12px_-2px_rgba(0,0,0,0.12),0_3px_6px_-2px_rgba(0,0,0,0.08)]"
          : "",
        isDragging
          ? "rotate-[-1deg] scale-[1.02] shadow-[0_8px_16px_-2px_rgba(0,0,0,0.14),0_4px_8px_-2px_rgba(0,0,0,0.10)]"
          : ""
      ].join(" ")}
      data-state={state}
      data-variant={variant}
    >
      <div className="relative h-[230px] w-[244px] shrink-0 overflow-hidden rounded-t-[10px]">
        {isBuilder ? <ActivityDragHandle /> : null}
        <Image
          alt=""
          className="h-[230px] w-[244px] object-cover"
          height={230}
          priority
          src={activity.illustration}
          width={244}
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
          {activity.description}
        </p>
        <p className="mt-auto flex items-center gap-[14px] overflow-hidden text-[10px] font-light leading-[16px] text-transparent [background:linear-gradient(90deg,#B77B32_0%,#D99C56_100%)] bg-clip-text">
          <span className="shrink-0">{activity.duration}</span>
          <span
            aria-hidden="true"
            className="h-[20px] w-px shrink-0 bg-[#D99C56]"
          />
          <span className="truncate">{activity.workshopType}</span>
        </p>
      </div>
    </article>
  );
}
