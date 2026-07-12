import Image from "next/image";

export type ActivityCardVariant = "builder" | "library";

export type ActivityCardState = "default" | "hover" | "dragging";

export type ActivityCardSize = "desktop" | "mobile";

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
  size?: ActivityCardSize;
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
  size = "desktop",
  state = "default",
  variant = "library"
}: ActivityCardProps) {
  const [titleLineOne, titleLineTwo] = splitTitleIntoTwoLines(activity.title);
  const isBuilder = variant === "builder";
  const isMobile = size === "mobile";
  const isHover = state === "hover";
  const isDragging = state === "dragging";

  return (
    <article
      aria-label={`Activity card: ${activity.title}`}
      className={[
        "relative flex flex-col rounded-[16px] border-[2px] border-[#B77B32] bg-[#FCFBFA] text-left shadow-[0_4px_8px_-2px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.06)] transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
        isMobile
          ? "box-border h-[190px] w-[333px] gap-[8px] px-[6px] py-[2px]"
          : "h-[370px] w-[256px] gap-[2px] p-[6px]",
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
      <div
        className={[
          "relative shrink-0 overflow-hidden",
          isMobile
            ? "h-[77px] w-[321px] rounded-[10px]"
            : "-ml-[6px] -mt-[6px] h-[231px] w-[252px] rounded-[12px]"
        ].join(" ")}
      >
        {isBuilder ? <DragHandle /> : null}
        <Image
          alt=""
          className="h-full w-full object-cover object-center"
          height={460}
          priority
          src={activity.illustration}
          width={488}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[16px] bg-gradient-to-b from-transparent to-[#FCFBFA]/45"
        />
      </div>

      <div
        className={[
          "flex flex-col gap-[4px]",
          isMobile
            ? "h-[101px] w-[321px]"
            : "h-[125px] w-[244px] pb-[8px] pt-[13px]"
        ].join(" ")}
      >
        <h3
          className="grid h-[48px] grid-rows-2 overflow-hidden pl-[12px] pr-[12px] text-[22px] font-semibold leading-[24px] text-[#324236]"
          style={{
            fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
          }}
        >
          <span className="block truncate">{titleLineOne}</span>
          <span className="block truncate">{titleLineTwo}</span>
        </h3>

        <p className="line-clamp-2 max-h-[32px] overflow-hidden pl-[12px] pr-[12px] text-[10px] font-normal leading-[16px] text-[#1F3E29]">
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
