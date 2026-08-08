"use client";

import { Fragment, useEffect, useState } from "react";

import {
  RecommendationCardReveal,
  type RecommendationCardRevealPhase,
  type RecommendationRevealCardId,
  recommendationRevealCards,
  type RecommendationRevealActivityCard
} from "@/components/product/RecommendationCardReveal";
import { DiagnosisPrimaryCTA } from "@/components/product/DiagnosisProgressNavigation";
import {
  RecommendationExperienceShell,
  type RecommendationLoadingViewport
} from "@/components/product/RecommendationLoadingExperience";

export type RecommendedWorkshop = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  metadata: WorkshopMetadata;
  activityCards: RecommendationRevealActivityCard[];
};

export type WorkshopMetadata = {
  duration: string;
  participants: string;
  activities: string;
  outputs: string;
};

type RecommendationMetadataIcon = {
  fallback: string;
  required: string;
};

export const recommendedWorkshop: RecommendedWorkshop = {
  id: "prioritisation",
  eyebrow: "YOUR RECOMMENDATION WORKSHOP",
  title: "Prioritisation Workshop",
  description:
    "Align product, engineering and leadership around what matters most and agree on clear next steps.",
  metadata: {
    duration: "1h 45m",
    participants: "8 Participants",
    activities: "6 Activities",
    outputs: "3 Outputs"
  },
  activityCards: recommendationRevealCards.map((card) => card.activity)
};

function getResponsiveViewport(): RecommendationLoadingViewport {
  if (typeof window === "undefined") {
    return "desktop";
  }

  if (window.innerWidth < 768) {
    return "mobile";
  }

  if (window.innerWidth < 1200) {
    return window.innerWidth > window.innerHeight
      ? "tablet-landscape"
      : "tablet-portrait";
  }

  return "desktop";
}

const SYSTEM_ICON_PATH = "/assets/icons/system Icons";

function SystemIcon({ icon }: { icon: RecommendationMetadataIcon }) {
  return (
    <span
      aria-hidden="true"
      className="recommendation-result-metadata__icon"
      data-fallback-icon={icon.fallback}
      data-required-icon={icon.required}
      style={{ maskImage: `url("${SYSTEM_ICON_PATH}/${icon.fallback}.svg")` }}
    />
  );
}

export function RecommendationMetadata({
  metadata
}: {
  metadata: WorkshopMetadata;
}) {
  const items = [
    {
      icon: {
        fallback: "clock",
        required: "clock"
      },
      label: "Duration",
      value: metadata.duration
    },
    {
      icon: {
        fallback: "users",
        required: "user-03"
      },
      label: "Participants",
      value: metadata.participants
    },
    {
      icon: {
        fallback: "grid",
        required: "dots-grid"
      },
      label: "Activities",
      value: metadata.activities
    },
    {
      icon: {
        fallback: "file",
        required: "file-03"
      },
      label: "Outputs",
      value: metadata.outputs
    }
  ];

  return (
    <dl
      className="recommendation-result-metadata"
      aria-label="Workshop metadata"
    >
      {items.map(({ icon, label, value }, index) => (
        <Fragment key={label}>
          {index > 0 ? (
            <span
              aria-hidden="true"
              className="recommendation-result-metadata__divider"
            />
          ) : null}
          <div className="recommendation-result-metadata__item">
            <dt className="sr-only">{label}</dt>
            <dd>
              <SystemIcon icon={icon} />
              <span>{value}</span>
            </dd>
          </div>
        </Fragment>
      ))}
    </dl>
  );
}

export function RecommendationResultExperience({
  className = "",
  continueDisabled = false,
  forceComplete = false,
  hiddenCardIds = [],
  onContinue,
  recommendation = recommendedWorkshop,
  registerCard,
  viewport
}: {
  className?: string;
  continueDisabled?: boolean;
  forceComplete?: boolean;
  hiddenCardIds?: string[];
  onContinue?: () => void;
  recommendation?: RecommendedWorkshop;
  registerCard?: (
    id: RecommendationRevealCardId,
    element: HTMLDivElement | null
  ) => void;
  viewport?: RecommendationLoadingViewport;
}) {
  const [responsiveViewport, setResponsiveViewport] =
    useState<RecommendationLoadingViewport>("desktop");
  const [revealPhase, setRevealPhase] = useState<RecommendationCardRevealPhase>(
    "pending"
  );
  const effectiveViewport = viewport ?? responsiveViewport;

  useEffect(() => {
    if (viewport) {
      return;
    }

    const updateViewport = () => setResponsiveViewport(getResponsiveViewport());

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, [viewport]);

  useEffect(() => {
    const revealTimeoutId = window.setTimeout(() => {
      setRevealPhase("revealing");
    }, 300);
    const completeTimeoutId = window.setTimeout(() => {
      setRevealPhase("complete");
    }, 2600);

    return () => {
      window.clearTimeout(revealTimeoutId);
      window.clearTimeout(completeTimeoutId);
    };
  }, []);
  const effectiveRevealPhase = forceComplete ? "complete" : revealPhase;
  const metadata =
    effectiveViewport === "mobile" ? undefined : (
      <RecommendationMetadata metadata={recommendation.metadata} />
    );

  return (
    <RecommendationExperienceShell
      ariaLabel="Recommendation result"
      className={["recommendation-result-experience", className].join(" ")}
      copy={recommendation.description}
      eyebrow={recommendation.eyebrow}
      heading={recommendation.title}
      metadata={metadata}
      viewport={effectiveViewport}
      wideContent
    >
      <div className="recommendation-result__card-section">
        <div className="recommendation-result__reveal-region">
          <RecommendationCardReveal
            activityCards={recommendation.activityCards}
            hiddenCardIds={hiddenCardIds}
            interactive={effectiveRevealPhase === "complete"}
            phase={effectiveRevealPhase}
            registerCard={registerCard}
            viewport={effectiveViewport}
          />
        </div>

        <div
          className="recommendation-result__actions"
          data-visible={effectiveRevealPhase === "complete" ? "true" : "false"}
        >
          <DiagnosisPrimaryCTA
            aria-disabled={effectiveRevealPhase !== "complete" || continueDisabled}
            className="recommendation-result-continue"
            disabled={continueDisabled}
            onClick={onContinue}
            tabIndex={effectiveRevealPhase === "complete" ? 0 : -1}
          >
            Continue
          </DiagnosisPrimaryCTA>
        </div>
      </div>
    </RecommendationExperienceShell>
  );
}
