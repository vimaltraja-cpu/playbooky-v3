import Image from "next/image";

import {
  createActivitySlug,
  type Activity
} from "@/lib/data/activities";

export type ActivityCardState =
  | "default"
  | "hover"
  | "selected"
  | "dragging"
  | "locked";

export type ActivityCardVariant =
  | "library"
  | "builder"
  | "recommendation"
  | "live";

type ActivityCardProps = {
  activity: Activity;
  hasIllustration?: boolean;
  state?: ActivityCardState;
  variant?: ActivityCardVariant;
};

function getValue(activity: Activity, field: string, fallback = "Missing") {
  return activity[field]?.trim() || fallback;
}

function MissingIllustration({ slug }: { slug: string }) {
  return (
    <div className="flex h-full min-h-[150px] flex-col items-center justify-center rounded-[22px] border border-dashed border-[#D8C08A] bg-[#FFF8EB] px-5 text-center">
      <p className="text-sm font-semibold text-[#7D5330]">
        Illustration missing
      </p>
      <p className="mt-2 max-w-[240px] text-xs leading-5 text-[#6E6253]">
        Expected `/public/assets/activities/{slug}/illustration.png`.
      </p>
    </div>
  );
}

function ControlButton({
  children,
  emphasis = "secondary"
}: {
  children: string;
  emphasis?: "primary" | "secondary";
}) {
  return (
    <span
      className={[
        "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
        emphasis === "primary"
          ? "bg-[#7D5330] text-[#FCFBF9] shadow-[0_10px_24px_rgba(125,83,48,0.16)]"
          : "border border-[#E2D5C2] bg-white/70 text-[#2C2924]"
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function ActivityCardControls({
  state,
  variant
}: {
  state: ActivityCardState;
  variant: ActivityCardVariant;
}) {
  const isLocked = state === "locked";

  if (variant === "builder") {
    return (
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[#E2D5C2] bg-white/60 px-3 py-2">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#E2D5C2] text-base font-semibold text-[#7D5330]"
          >
            ::
          </span>
          <span className="text-sm font-medium text-[#45413C]">
            Builder controls pending provided CSS
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <ControlButton>Move up</ControlButton>
          <ControlButton>Move down</ControlButton>
          <ControlButton emphasis="primary">
            {state === "selected" ? "Selected" : "Select"}
          </ControlButton>
        </div>
      </div>
    );
  }

  if (variant === "recommendation") {
    return (
      <div className="grid gap-3">
        <div className="rounded-[18px] border border-[#E5D2B6] bg-[#FFF8EB] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B28B4B]">
            Confidence
          </p>
          <p className="mt-1 text-sm font-semibold text-[#2C2924]">
            Placeholder confidence only
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ControlButton>Why this activity?</ControlButton>
          <ControlButton emphasis="primary">Accept</ControlButton>
          <ControlButton>Replace</ControlButton>
        </div>
      </div>
    );
  }

  if (variant === "live") {
    return (
      <div className="grid gap-3">
        <div className="grid gap-2 sm:grid-cols-3">
          {["Timer", "Progress", "Instructions"].map((label) => (
            <div
              className="rounded-[18px] border border-dashed border-[#D8C08A] bg-[#FFF8EB]/70 px-3 py-3 text-sm font-semibold text-[#7D5330]"
              key={label}
            >
              {label}
            </div>
          ))}
        </div>
        <p className="text-xs leading-5 text-[#6E6253]">
          Live delivery controls are placeholders only.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <ControlButton>Preview</ControlButton>
      <ControlButton emphasis="primary">
        {isLocked ? "Unavailable" : "Add Activity"}
      </ControlButton>
    </div>
  );
}

export function ActivityCard({
  activity,
  hasIllustration = false,
  state = "default",
  variant = "library"
}: ActivityCardProps) {
  const activityName = getValue(activity, "Activity Name", "Untitled activity");
  const slug = createActivitySlug(activityName);
  const isInteractive = state === "hover" || state === "selected";
  const isDragging = state === "dragging";
  const isLocked = state === "locked";
  const isSelected = state === "selected";

  return (
    <article
      aria-label={`Activity card: ${activityName}`}
      data-variant={variant}
      className={[
        "relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-[28px] border bg-[#FCFBF9] text-left transition duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
        isSelected
          ? "border-[#7D5330] shadow-[0_22px_54px_rgba(125,83,48,0.16)]"
          : isInteractive
            ? "border-[#D8C08A] shadow-[0_18px_44px_rgba(36,31,24,0.1)]"
            : "border-[#E6E2DC] shadow-none",
        isDragging ? "rotate-[-1deg] scale-[1.02] opacity-90 shadow-[0_28px_70px_rgba(36,31,24,0.18)]" : "",
        isLocked ? "cursor-not-allowed opacity-60 grayscale-[0.15]" : ""
      ].join(" ")}
    >
      {isSelected ? (
        <div className="absolute right-4 top-4 z-10 rounded-full bg-[#7D5330] px-3 py-1 text-xs font-semibold text-[#FCFBF9]">
          Added
        </div>
      ) : null}

      <div className="bg-[#F4EFE6] p-4">
        {hasIllustration ? (
          <Image
            alt=""
            className="h-[150px] w-full rounded-[22px] object-cover"
            height={300}
            src={`/assets/activities/${slug}/illustration.png`}
            width={700}
          />
        ) : (
          <MissingIllustration slug={slug} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#EFE3D2] px-3 py-1 text-xs font-semibold text-[#7D5330]">
              {getValue(activity, "Stage")}
            </span>
            <span className="rounded-full border border-[#E4D8C8] px-3 py-1 text-xs font-semibold text-[#45413C]">
              {getValue(activity, "Duration")}
            </span>
            <span className="rounded-full border border-[#E4D8C8] px-3 py-1 text-xs font-semibold text-[#45413C]">
              {getValue(activity, "Remote Friendly", "Remote unknown")}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-semibold leading-tight text-[#062E27]">
            {activityName}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#45413C]">
            {getValue(activity, "Purpose", "No purpose provided.")}
          </p>
        </div>

        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B28B4B]">
              Best used when
            </dt>
            <dd className="mt-1 line-clamp-2 leading-6 text-[#45413C]">
              {getValue(activity, "Best Used When")}
            </dd>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B28B4B]">
                Inputs
              </dt>
              <dd className="mt-1 line-clamp-2 text-[#45413C]">
                {getValue(activity, "Inputs Required")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B28B4B]">
                Outputs
              </dt>
              <dd className="mt-1 line-clamp-2 text-[#45413C]">
                {getValue(activity, "Outputs Produced")}
              </dd>
            </div>
          </div>
        </dl>

        {isLocked ? (
          <p className="rounded-2xl border border-[#E5D2B6] bg-[#FFF8EB] px-3 py-2 text-xs font-semibold text-[#7D5330]">
            Locked until this activity is available for the selected workshop.
          </p>
        ) : null}

        <div className="min-h-[96px] border-t border-[#EEE4D7] pt-5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none">
          <ActivityCardControls state={state} variant={variant} />
        </div>
      </div>
    </article>
  );
}
