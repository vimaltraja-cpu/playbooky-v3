import Image from "next/image";

export type ActivityCardVariant = "builder" | "library";

export type ActivityCardState = "default" | "hover" | "dragging";

export type ActivityCardData = {
  description: string;
  duration: string;
  illustration: string;
  title: string;
  workshopType: string;
};

type ActivityCardProps = {
  activity: ActivityCardData;
  state?: ActivityCardState;
  variant?: ActivityCardVariant;
};

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
  state = "default",
  variant = "library"
}: ActivityCardProps) {
  const [titleLineOne, titleLineTwo] = splitTitleIntoTwoLines(activity.title);
  const isBuilder = variant === "builder";
  const isHover = state === "hover";
  const isDragging = state === "dragging";
  return (
    <article
      aria-label={`Activity card: ${activity.title}`}
      className={[
        "relative box-border flex h-[370px] w-[256px] flex-col items-start gap-[2px] overflow-hidden rounded-[16px] border border-[#E6E2DC] bg-[#FCFBFA] p-[6px] text-left shadow-[0_4px_8px_-2px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.06)] transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
        isHover
          ? "translate-y-[-2px] shadow-[0_8px_18px_-5px_rgba(0,0,0,0.16),0_4px_8px_-4px_rgba(0,0,0,0.10)]"
          : "",
        isDragging
          ? "rotate-[-1deg] scale-[1.02] shadow-[0_12px_24px_-8px_rgba(0,0,0,0.18),0_6px_12px_-6px_rgba(0,0,0,0.12)]"
          : ""
      ].join(" ")}
      data-state={state}
      data-variant={variant}
    >
      <div className="relative h-[230px] w-[244px] shrink-0 overflow-hidden rounded-[10px]">
        {isBuilder ? <DragHandle /> : null}
        <Image
          alt=""
          className="h-full w-full object-cover"
          height={460}
          priority
          src={activity.illustration}
          width={488}
        />
      </div>

      <div className="flex h-[125px] w-[244px] flex-col gap-[4px] pb-[8px] pl-[12px] pr-[12px] pt-[13px]">
        <h3
          className="grid h-[48px] grid-rows-2 overflow-hidden text-[22px] font-semibold leading-[24px] text-[#324236]"
          style={{
            fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
          }}
        >
          <span className="block truncate">{titleLineOne}</span>
          <span className="block truncate">{titleLineTwo}</span>
        </h3>

        <p className="line-clamp-2 max-h-[32px] overflow-hidden text-[10px] font-normal leading-[16px] text-[#1F3E29]">
          {activity.description}
        </p>

        <div className="activity-card__meta">
          <span className="activity-card__metaText">{activity.duration}</span>
          <span className="activity-card__divider" aria-hidden="true" />
          <span className="activity-card__metaText">
            {activity.workshopType}
          </span>
        </div>
      </div>
    </article>
  );
}
