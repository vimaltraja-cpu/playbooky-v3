"use client";

import type { CSSProperties } from "react";

import {
  ActivityCard,
  type ActivityCardData,
  type ActivityCardSize
} from "@/components/ui/ActivityCard";

export type RecommendationCardRevealViewport =
  "mobile" | "tablet-portrait" | "tablet-landscape" | "desktop";

export type RecommendationCardRevealPhase =
  | "pending"
  | "centre"
  | "revealing"
  | "complete";
export type RecommendationCardRevealPlayback = "normal" | "slow";
export type RecommendationCardRevealMotion = "paired" | "reduced";

export type RecommendationRevealCardId =
  | "problem-framing"
  | "pain-point-identification"
  | "roadmap-sequencing"
  | "commitment-check"
  | "priority-mapping"
  | "reflection-learning"
  | "final-card";

export type RecommendationRevealCard = {
  activity: ActivityCardData;
  id: RecommendationRevealCardId;
  pair: number;
  rotate: number;
  x: number;
  y: number;
  zIndex: number;
};

export type RecommendationRevealActivityCard = ActivityCardData;

const RECOMMENDATION_CARD_WIDTH = 256;
const pairedFanGeometry = {
  centre: {
    rotate: 0,
    x: 607.69,
    y: 1.63
  },
  right1: {
    rotate: 8,
    x: 708.52,
    y: 0
  },
  right2: {
    rotate: 16,
    x: 812.98,
    y: 19.14
  },
  right3: {
    rotate: 24,
    x: 896.84,
    y: 52.85
  }
};

const pairedFanOffsets = {
  right1: pairedFanGeometry.right1.x - pairedFanGeometry.centre.x,
  right2: pairedFanGeometry.right2.x - pairedFanGeometry.centre.x,
  right3: pairedFanGeometry.right3.x - pairedFanGeometry.centre.x
};

const pairedFanLeftX = {
  left1: pairedFanGeometry.centre.x - pairedFanOffsets.right1,
  left2: pairedFanGeometry.centre.x - pairedFanOffsets.right2,
  left3: pairedFanGeometry.centre.x - pairedFanOffsets.right3
};

export const recommendationRevealComposition = {
  height: 560,
  sourceHeight: 560,
  sourceWidth:
    (pairedFanGeometry.centre.x + RECOMMENDATION_CARD_WIDTH / 2) * 2,
  width: (pairedFanGeometry.centre.x + RECOMMENDATION_CARD_WIDTH / 2) * 2
};

export const recommendationRevealCards: RecommendationRevealCard[] = [
  {
    activity: {
      description:
        "Define the challenge clearly enough for the group to make progress.",
      duration: "15 mins",
      illustration: "/assets/activities/Problem Framing.png",
      title: "Problem Framing",
      workshopType: "Frame"
    },
    id: "problem-framing",
    pair: 3,
    rotate: -24,
    x: pairedFanLeftX.left3,
    y: 69.39,
    zIndex: 1
  },
  {
    activity: {
      description:
        "Identify the moments of friction that are holding users or teams back.",
      duration: "20 mins",
      illustration: "/assets/activities/Pain Point Identification.png",
      title: "Pain Point Identification",
      workshopType: "Understand"
    },
    id: "pain-point-identification",
    pair: 2,
    rotate: -16,
    x: pairedFanLeftX.left2,
    y: 25.34,
    zIndex: 2
  },
  {
    activity: {
      description:
        "Put decisions and delivery steps into a sequence the team can follow.",
      duration: "20 mins",
      illustration: "/assets/activities/Roadmap Sequencing.png",
      title: "Roadmap Sequencing",
      workshopType: "Plan"
    },
    id: "roadmap-sequencing",
    pair: 1,
    rotate: -8,
    x: pairedFanLeftX.left1,
    y: 2.58,
    zIndex: 4
  },
  {
    activity: {
      description:
        "Confirm the decisions, owners and follow-up needed to make the work real.",
      duration: "10 mins",
      illustration: "/assets/activities/Commitment Check.png",
      title: "Commitment Check",
      workshopType: "Decide"
    },
    id: "commitment-check",
    pair: 0,
    rotate: pairedFanGeometry.centre.rotate,
    x: pairedFanGeometry.centre.x,
    y: pairedFanGeometry.centre.y,
    zIndex: 7
  },
  {
    activity: {
      description:
        "Sort choices by what matters most so the team can choose deliberately.",
      duration: "15 mins",
      illustration: "/assets/activities/Priority Mapping.png",
      title: "Priority Mapping",
      workshopType: "Evaluate"
    },
    id: "priority-mapping",
    pair: 1,
    rotate: pairedFanGeometry.right1.rotate,
    x: pairedFanGeometry.right1.x,
    y: pairedFanGeometry.right1.y,
    zIndex: 4
  },
  {
    activity: {
      description:
        "Capture what the team has learned and what should change next time.",
      duration: "15 mins",
      illustration: "/assets/activities/Reflection & Learning.png",
      title: "Reflection & Learning",
      workshopType: "Reflect"
    },
    id: "reflection-learning",
    pair: 2,
    rotate: pairedFanGeometry.right2.rotate,
    x: pairedFanGeometry.right2.x,
    y: pairedFanGeometry.right2.y,
    zIndex: 2
  },
  {
    activity: {
      description:
        "Turn the agreed recommendation into clear next actions and ownership.",
      duration: "15 mins",
      illustration: "/assets/activities/Action Planning.png",
      title: "Action Planning",
      workshopType: "Act"
    },
    id: "final-card",
    pair: 3,
    rotate: pairedFanGeometry.right3.rotate,
    x: pairedFanGeometry.right3.x,
    y: pairedFanGeometry.right3.y,
    zIndex: 1
  }
];

const desktopCentreCard = recommendationRevealCards.find(
  (card) => card.pair === 0
)!;
const mobileRotations = [-24, -16, -8, 0, 8, 16, 24];

export const CENTRE_CARD_ENTER_MS = 1100;
export const CARD_FAN_MS = 1500;
export const REVEAL_PRELOAD_LAG_MS = 220;

function getCardDelay(
  card: RecommendationRevealCard,
  motion: RecommendationCardRevealMotion
) {
  if (card.pair === 0 || motion === "reduced") {
    return 0;
  }

  return 80 + (card.pair - 1) * 160;
}

export function preloadRecommendationRevealAssets(
  activityCards?: RecommendationRevealActivityCard[]
) {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  const sources = recommendationRevealCards.map(
    (card, index) => activityCards?.[index]?.illustration ?? card.activity.illustration
  );

  return Promise.all(
    sources.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
        })
    )
  ).then(() => undefined);
}

export function RecommendationCardReveal({
  activityCards,
  className = "",
  hiddenCardIds = [],
  interactive,
  motion = "paired",
  phase = "revealing",
  playback = "normal",
  registerCard,
  viewport = "desktop"
}: {
  activityCards?: RecommendationRevealActivityCard[];
  className?: string;
  hiddenCardIds?: string[];
  interactive?: boolean;
  motion?: RecommendationCardRevealMotion;
  phase?: RecommendationCardRevealPhase;
  playback?: RecommendationCardRevealPlayback;
  registerCard?: (
    id: RecommendationRevealCardId,
    element: HTMLDivElement | null
  ) => void;
  viewport?: RecommendationCardRevealViewport;
}) {
  const isInteractive = interactive ?? phase === "complete";
  const hiddenCards = new Set(hiddenCardIds);
  const cards = recommendationRevealCards.map((card, index) => ({
    ...card,
    activity: activityCards?.[index] ?? card.activity
  }));
  const centreCardId = cards.find((card) => card.pair === 0)?.id ?? "commitment-check";
  // The card shown in the reveal deck must be the same real size as the
  // card it lands on in the activity grid for that breakpoint -- if the
  // shapes don't match, the reveal-to-grid transition has to stretch a
  // portrait card into a landscape one (or vice versa) mid-flight, which
  // looks like the card is being squashed. Matching the shape here means
  // the transition only ever moves/scales uniformly.
  const cardSize: ActivityCardSize = viewport === "mobile" ? "mobile" : "desktop";

  return (
    <div
      aria-label="Recommended activity deck"
      className={["recommendation-reveal-stage", className].join(" ")}
      data-interactive={isInteractive ? "true" : "false"}
      data-motion={motion}
      data-phase={phase}
      data-playback={playback}
      data-viewport={viewport}
      role="group"
    >
      <div className="recommendation-reveal-fan">
        {cards.map((card, index) => (
          <div
            className={[
              "recommendation-reveal-card",
              card.id === centreCardId
                ? "recommendation-reveal-card-centre"
                : "recommendation-reveal-card-side",
              card.pair === 1 ? "recommendation-reveal-card-inner" : "",
              card.pair === 2 ? "recommendation-reveal-card-middle" : "",
              card.pair === 3 ? "recommendation-reveal-card-outer" : ""
            ].join(" ")}
            data-card-id={card.id}
            data-transition-hidden={hiddenCards.has(card.id) ? "true" : "false"}
            key={card.id}
            ref={(element) => registerCard?.(card.id, element)}
            style={
              {
                "--card-delay": `${card.pair === 0 ? 0 : 460 + card.pair * 100}ms`,
                "--card-motion-delay": `${getCardDelay(card, motion)}ms`,
                "--card-final-rotation": `${card.rotate}deg`,
                "--card-final-x": `${card.x}px`,
                "--card-final-y": `${card.y}px`,
                "--card-mobile-rotation": `${mobileRotations[index]}deg`,
                "--card-start-x": `${desktopCentreCard.x}px`,
                "--card-start-y": `${desktopCentreCard.y}px`,
                zIndex: card.zIndex
              } as CSSProperties
            }
          >
            <ActivityCard activity={card.activity} size={cardSize} variant="library" />
          </div>
        ))}
      </div>
    </div>
  );
}
