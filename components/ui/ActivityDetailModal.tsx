"use client";

import Image from "next/image";

import type { BuildingBlock } from "@/lib/workshop-os/types";

export type BuilderFlowStage = {
  iconAlt: string;
  iconSrc: string;
  label: string;
};

export type ActivityDetailModalData = {
  activityName: string;
  builderFlowStages: BuilderFlowStage[];
  description: string;
  duration: string;
  illustration: {
    alt: string;
    modalSrc?: string;
    src: string;
  };
  rationale: string;
  stage: string;
  sourceBlock?: Pick<
    BuildingBlock,
    "id" | "name" | "purpose" | "typicalDurationMinutes" | "type"
  >;
};

type ActivityDetailModalProps = {
  activity: ActivityDetailModalData;
  contentOnly?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onRemove?: () => void;
  onReplace?: () => void;
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

function CloseGlyph() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
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

function RefreshIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 20 20"
    >
      <defs>
        <linearGradient
          id="activity-detail-modal-refresh-gradient"
          x1="3"
          x2="17"
          y1="3"
          y2="17"
        >
          <stop stopColor="#7D5330" />
          <stop offset="1" stopColor="#D99C56" />
        </linearGradient>
      </defs>
      <path
        d="M15.7 7.1A6.25 6.25 0 1 0 16 12"
        stroke="url(#activity-detail-modal-refresh-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M15.8 3.8v3.4h-3.4"
        stroke="url(#activity-detail-modal-refresh-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="M4.25 6.1h11.5M8 6.1V4.45h4V6.1M6.1 6.1l.55 9.2c.05.8.7 1.45 1.5 1.45h3.7c.8 0 1.45-.65 1.5-1.45l.55-9.2M8.55 8.75v5.2M11.45 8.75v5.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.55"
      />
    </svg>
  );
}

function ActivityModalIllustration({
  illustration
}: {
  illustration: ActivityDetailModalData["illustration"];
}) {
  const illustrationSrc = illustration.modalSrc ?? illustration.src;

  return (
    <section className="relative -mx-[2px] h-[230px] w-[calc(100%+4px)] shrink-0 overflow-hidden">
      <Image
        alt={illustration.alt}
        className="object-cover object-center"
        fill
        priority
        sizes="1368px"
        src={illustrationSrc}
      />
    </section>
  );
}

function ActivityModalHeading({
  activity
}: {
  activity: ActivityDetailModalData;
}) {
  return (
    <header className="flex h-[104px] w-[1364px] flex-col items-center pb-2 text-center">
      <p className="flex h-6 items-center justify-center text-[16px] uppercase leading-6">
        <GradientText className="font-light" gradient={metadataGradient}>
          {activity.duration}
        </GradientText>
        <span aria-hidden="true" className="px-1 font-light text-[#C8A564]">
          •
        </span>
        <GradientText className="font-semibold" gradient={metadataGradient}>
          {activity.stage}
        </GradientText>
      </p>
      <h1
        className="mt-1 h-[44px] text-center text-[44px] font-bold leading-[44px] text-[#062E27]"
        style={{
          fontFamily: "Newsreader, Georgia, 'Times New Roman', serif"
        }}
      >
        {activity.activityName}
      </h1>
      <p className="mt-2 h-4 text-center text-[19px] font-light leading-4 text-[#1F3E29]">
        {activity.description}
      </p>
    </header>
  );
}

function BuilderFlowConnector() {
  return (
    <span
      aria-hidden="true"
      className="-mx-3 mt-[38px] flex h-[10px] w-[66px] shrink-0 items-center"
    >
      <span className="h-[3px] w-[3px] rounded-full bg-[#7D5330]" />
      <span className="h-px w-[58px]" style={{ background: brandGradient }} />
      <span className="h-[5px] w-[5px] rounded-full bg-[#D99C56]" />
    </span>
  );
}

function BuilderFlowStage({ stage }: { stage: BuilderFlowStage }) {
  return (
    <div className="flex h-[114px] w-[152px] shrink-0 flex-col items-center gap-3 text-center">
      <span className="relative flex h-[90px] w-[90px] items-center justify-center">
        <Image
          alt={stage.iconAlt}
          className="h-[70px] w-[70px] object-contain"
          height={70}
          src={stage.iconSrc}
          width={70}
        />
      </span>
      <span
        className="block h-5 w-[152px] whitespace-nowrap text-center text-[16px] font-semibold leading-5 text-[#171614]"
        style={{
          fontFamily: "Newsreader, Georgia, 'Times New Roman', serif",
          letterSpacing: "-0.03em"
        }}
      >
        {stage.label}
      </span>
    </div>
  );
}

function BuilderFlow({ stages }: { stages: BuilderFlowStage[] }) {
  return (
    <section className="flex h-[124px] w-[1364px] items-center justify-center overflow-visible">
      <ol className="flex h-[114px] w-[1122px] items-start justify-center">
        {stages.map((stage, index) => (
          <li className="flex shrink-0" key={stage.label}>
            <BuilderFlowStage stage={stage} />
            {index < stages.length - 1 ? <BuilderFlowConnector /> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

function ActivityRationale({ rationale }: { rationale: string }) {
  return (
    <p className="h-6 text-center text-[19px] font-normal leading-6">
      <GradientText>{rationale}</GradientText>
    </p>
  );
}

function ActivityModalActions({
  onRemove,
  onReplace
}: Pick<ActivityDetailModalProps, "onRemove" | "onReplace">) {
  return (
    <footer className="pointer-events-auto relative z-20 flex h-[52px] w-[1364px] shrink-0 items-center justify-center rounded-b-[8px] px-4 py-3">
      <div className="flex h-5 items-center justify-center gap-8">
        <button
          className="flex h-5 items-center gap-4 text-[12px] font-semibold leading-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D99C56]"
          onClick={onReplace}
          type="button"
        >
          <RefreshIcon />
          <GradientText>Replace Activity</GradientText>
        </button>
        <button
          className="flex h-5 items-center gap-4 text-[12px] font-semibold leading-[14px] text-[#E11D48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E11D48]"
          onClick={onRemove}
          type="button"
        >
          <TrashIcon />
          <span>Remove</span>
        </button>
      </div>
    </footer>
  );
}

export function ActivityDetailModal({
  activity,
  contentOnly = false,
  isOpen = true,
  onClose,
  onRemove,
  onReplace
}: ActivityDetailModalProps) {
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="flex h-full w-full flex-col items-start gap-8 overflow-hidden rounded-[14px] bg-[rgba(252,251,250,0.9)]">
      <ActivityModalIllustration illustration={activity.illustration} />
      <section className="flex h-[408px] w-[1364px] flex-col items-center overflow-visible pt-[53px]">
        <ActivityModalHeading activity={activity} />
        <div className="h-4 shrink-0" />
        <BuilderFlow stages={activity.builderFlowStages} />
        <div className="h-[34px] shrink-0" />
        <ActivityRationale rationale={activity.rationale} />
      </section>
      <ActivityModalActions onRemove={onRemove} onReplace={onReplace} />
    </div>
  );

  if (contentOnly) {
    return (
      <article
        aria-label={`${activity.activityName} activity details content`}
        className="relative box-border flex h-[758px] w-[1364px] flex-col items-start overflow-visible"
      >
        {modalContent}
      </article>
    );
  }

  return (
    <article
      aria-label={`${activity.activityName} activity details`}
      aria-modal="true"
      className="relative isolate box-border flex h-[762px] w-[1368px] flex-col items-start overflow-visible rounded-[16px] p-[2px] shadow-[0_4px_8px_-2px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.06)]"
      role="dialog"
      style={{ background: brandGradient }}
    >
      {modalContent}

      <button
        aria-label="Close activity details"
        className="absolute right-[22px] top-[22px] z-10 flex h-6 w-6 items-center justify-center text-[#062E27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D99C56]"
        onClick={onClose}
        type="button"
      >
        <CloseGlyph />
      </button>
    </article>
  );
}
