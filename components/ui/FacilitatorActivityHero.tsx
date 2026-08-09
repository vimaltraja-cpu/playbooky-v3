"use client";

/**
 * FacilitatorActivityHero — title block for the selected Facilitator Guide activity.
 *
 * Copy and illustration come from the active workshop activity record
 * (type/stage, title, description, illustration).
 */

import Image from "next/image";
import type { ReactElement } from "react";

export type FacilitatorActivityHeroData = {
  description: string;
  illustration: {
    alt?: string;
    src: string;
  };
  title: string;
  type: string;
};

export type FacilitatorActivityHeroProps = {
  activity: FacilitatorActivityHeroData;
  className?: string;
};

export function activityHeroFromWorkshopActivity(activity: {
  description: string;
  illustration: string | { alt?: string; src: string };
  title: string;
  workshopType?: string;
  stage?: string;
}): FacilitatorActivityHeroData {
  const illustration =
    typeof activity.illustration === "string"
      ? { alt: `${activity.title} illustration`, src: activity.illustration }
      : {
          alt: activity.illustration.alt ?? `${activity.title} illustration`,
          src: activity.illustration.src
        };

  return {
    description: activity.description,
    illustration,
    title: activity.title,
    type: activity.workshopType ?? activity.stage ?? ""
  };
}

export function FacilitatorActivityHero({
  activity,
  className
}: FacilitatorActivityHeroProps): ReactElement {
  return (
    <section
      className={["fg-activity-hero-section", className]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${activity.title} overview`}
    >
      <div className="fg-activity-hero">
        <div className="fg-activity-hero__copy">
          <p className="fg-activity-hero__type">{activity.type}</p>

          <div className="fg-activity-hero__body">
            <h1 className="fg-activity-hero__title">{activity.title}</h1>
            <p className="fg-activity-hero__description">
              {activity.description}
            </p>
          </div>
        </div>

        <div className="fg-activity-hero__media">
          <div className="fg-activity-hero__media-frame">
            <Image
              alt={activity.illustration.alt ?? ""}
              className="fg-activity-hero__image"
              fill
              sizes="(max-width: 960px) 100vw, 70vw"
              src={activity.illustration.src}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
