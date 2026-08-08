export type JourneyStatus =
  | "not-located"
  | "needs-review"
  | "changes-required"
  | "approved"
  | "not-started"
  | "in-progress"
  | "integrated";

export type JourneyStageId =
  | "composer"
  | "diagnosis"
  | "loading"
  | "reveal"
  | "active-grid"
  | "active-modal";

export type JourneyStageAudit = {
  candidateOlderVersions: string[];
  existingPrototypeRoute: string;
  knownIssues: string[];
  reasonThisIsLatestVersion: string;
  recommendedProductionSource: string;
  supportingComponentSources: string[];
};

export type JourneyStage = {
  id: JourneyStageId;
  order: number;
  title: string;
  description: string;
  fullPageRoute: string;
  pageSourcePath: string;
  componentSourcePaths: string[];
  sourceStatus: JourneyStatus;
  responsiveStatus: JourneyStatus;
  handoffStatus: JourneyStatus;
  integrationStatus: JourneyStatus;
  input: string[];
  output: string[];
  notes: string[];
  audit: JourneyStageAudit;
};

export const journeyManifest: JourneyStage[] = [
  {
    id: "composer",
    order: 1,
    title: "Homepage Composer",
    description:
      "The full homepage starting state where the user enters a workshop challenge.",
    fullPageRoute: "/internal/journey/composer",
    pageSourcePath: "app/internal/journey/[stage]/page.tsx",
    componentSourcePaths: [
      "components/product/HomepageTextLayout.tsx",
      "components/ui/AIComposer.tsx",
      "components/ui/SiteHeader.tsx",
      "components/ui/SiteBackgroundWash.tsx",
      "components/ui/site-background-wash/SiteBackgroundWashEngine.tsx",
      "components/ui/site-background-wash/config.ts",
      "components/ui/site-background-wash/site-background-wash.css"
    ],
    sourceStatus: "needs-review",
    responsiveStatus: "needs-review",
    handoffStatus: "needs-review",
    integrationStatus: "not-started",
    input: [],
    output: ["challenge"],
    notes: [
      "The full-page QA route renders HomepageComposerLayout directly with no preview shell.",
      "Background motion: Uses approved implementation from /background-implementation-plan.",
      "The composer currently has no journey wiring to persist challenge into diagnosis."
    ],
    audit: {
      candidateOlderVersions: [
        "HomepageTextLayout is the broader homepage hero-plus-composer variant.",
        "AIComposer alone is component-level and does not include the page header or homepage positioning."
      ],
      existingPrototypeRoute:
        "/design-system/core-experience/homepage-composer-layout",
      knownIssues: [
        "The guidance link still points to the design-system diagnosis grid route.",
        "Challenge handoff is not connected yet."
      ],
      reasonThisIsLatestVersion:
        "HomepageComposerLayout is the current product-level homepage composer composition and is already used by the clean preview route.",
      recommendedProductionSource: "components/product/HomepageTextLayout.tsx",
      supportingComponentSources: [
        "components/ui/AIComposer.tsx",
        "components/ui/SiteHeader.tsx",
        "components/ui/SiteBackgroundWash.tsx",
        "components/ui/site-background-wash/SiteBackgroundWashEngine.tsx",
        "components/ui/site-background-wash/config.ts",
        "components/ui/site-background-wash/site-background-wash.css"
      ]
    }
  },
  {
    id: "diagnosis",
    order: 2,
    title: "Diagnosis Questions",
    description:
      "The full diagnosis question flow with selections, back/forward movement and progress navigation.",
    fullPageRoute: "/internal/journey/diagnosis",
    pageSourcePath: "app/internal/journey/[stage]/page.tsx",
    componentSourcePaths: [
      "components/product/DiagnosisQuestionScreen.tsx",
      "components/product/DiagnosisProgressNavigation.tsx",
      "components/ui/DiagnosisCard.tsx",
      "lib/design-system/diagnosis-options.ts"
    ],
    sourceStatus: "needs-review",
    responsiveStatus: "needs-review",
    handoffStatus: "needs-review",
    integrationStatus: "not-started",
    input: ["challenge"],
    output: ["challenge", "diagnosisAnswers"],
    notes: [
      "The route uses realistic fixture challenge context and the shared diagnosisQuestions data.",
      "The existing screen owns selections and step navigation internally."
    ],
    audit: {
      candidateOlderVersions: [
        "DiagnosisCard is lower-level card documentation.",
        "DiagnosisGridPreviewClient is a preview wrapper rather than the stage source."
      ],
      existingPrototypeRoute: "/design-system/core-experience/diagnosis-grid",
      knownIssues: [
        "There is no final journey route that receives challenge from the composer yet.",
        "Diagnosis answer persistence is not connected to loading."
      ],
      reasonThisIsLatestVersion:
        "DiagnosisQuestionScreen is the current full-screen implementation that composes the question header, option grid and progress controls.",
      recommendedProductionSource:
        "components/product/DiagnosisQuestionScreen.tsx",
      supportingComponentSources: [
        "components/product/DiagnosisProgressNavigation.tsx",
        "components/ui/DiagnosisCard.tsx",
        "lib/design-system/diagnosis-options.ts"
      ]
    }
  },
  {
    id: "loading",
    order: 3,
    title: "Recommendation Loading",
    description:
      "The full-page analysing experience shown while PlayBooky prepares recommendations.",
    fullPageRoute: "/internal/journey/loading",
    pageSourcePath: "app/internal/journey/[stage]/page.tsx",
    componentSourcePaths: [
      "components/product/RecommendationLoadingExperience.tsx"
    ],
    sourceStatus: "needs-review",
    responsiveStatus: "needs-review",
    handoffStatus: "needs-review",
    integrationStatus: "not-started",
    input: ["challenge", "diagnosisAnswers"],
    output: ["recommendations"],
    notes: [
      "The full-page route renders the existing RecommendationLoadingExperience directly.",
      "The route runs the approved loading sequence with its normal page background and layout.",
      "Illustration motion: Approved watercolour Layer 1 / Layer 2 implementation.",
      "Source: Playground Motion Recommendation Loading Watercolours/Showcase.",
      "Cycle: 6350ms."
    ],
    audit: {
      candidateOlderVersions: [
        "components/prototypes/loading-experience-concepts contains earlier loading explorations.",
        "playground/motion/recommendation-loading-watercolor is a motion playground."
      ],
      existingPrototypeRoute:
        "/design-system/core-experience/recommendation-loading",
      knownIssues: [
        "Loading still uses internal fixture behaviour and does not receive real diagnosis payloads.",
        "The transition from loading to reveal is not connected yet."
      ],
      reasonThisIsLatestVersion:
        "RecommendationLoadingExperience is the product-level implementation used by /recommendation-loading and contains the locked watercolor loading sequence.",
      recommendedProductionSource:
        "components/product/RecommendationLoadingExperience.tsx",
      supportingComponentSources: []
    }
  },
  {
    id: "reveal",
    order: 4,
    title: "Recommendation Card Reveal",
    description:
      "The full recommendation result stage where selected activity cards reveal in a fan.",
    fullPageRoute: "/internal/journey/reveal",
    pageSourcePath: "app/internal/journey/[stage]/page.tsx",
    componentSourcePaths: [
      "components/product/RecommendationCardRevealExperience.tsx",
      "components/product/RecommendationCardReveal.tsx",
      "components/product/RecommendationResultExperience.tsx"
    ],
    sourceStatus: "needs-review",
    responsiveStatus: "needs-review",
    handoffStatus: "needs-review",
    integrationStatus: "not-started",
    input: ["recommendations"],
    output: ["orderedActivities"],
    notes: [
      "The route renders RecommendationCardRevealExperience as a full browser page.",
      "Reveal fixture activities must later become the same objects handed into the active grid."
    ],
    audit: {
      candidateOlderVersions: [
        "RecommendationCardReveal is the deck-only component, not the full page.",
        "RecommendationResultExperience includes the Continue CTA used by transition work."
      ],
      existingPrototypeRoute:
        "/design-system/core-experience/recommendation-card-reveal",
      knownIssues: [
        "Recommendation data is still fixture data.",
        "The reveal-to-grid handoff is not connected."
      ],
      reasonThisIsLatestVersion:
        "RecommendationCardRevealExperience is the current focused full-page reveal stage and imports the shared RecommendationCardReveal deck.",
      recommendedProductionSource:
        "components/product/RecommendationCardRevealExperience.tsx",
      supportingComponentSources: [
        "components/product/RecommendationCardReveal.tsx",
        "components/product/RecommendationResultExperience.tsx"
      ]
    }
  },
  {
    id: "active-grid",
    order: 5,
    title: "Active Workshop Grid",
    description:
      "The full active workshop grid page where activity cards can be reordered and opened.",
    fullPageRoute: "/internal/journey/active-grid",
    pageSourcePath: "app/internal/journey/[stage]/page.tsx",
    componentSourcePaths: [
      "components/product/recommendation-reveal-to-grid/ActivityGridInteractiveLayer.tsx",
      "components/product/ActivityGridVisualLayer.tsx"
    ],
    sourceStatus: "needs-review",
    responsiveStatus: "needs-review",
    handoffStatus: "needs-review",
    integrationStatus: "in-progress",
    input: ["orderedActivities"],
    output: ["selectedActivityId"],
    notes: [
      "The active grid is still being completed separately, so this card remains in progress.",
      "The full-page QA route uses the existing interactive grid layer, not the visual-only layer."
    ],
    audit: {
      candidateOlderVersions: [
        "ActivityGridPageClient includes design-system controls and multiple motion variants.",
        "ActivityGridResponsiveVisualLayer is visual-only and does not provide active card movement/opening.",
        "RecommendationRevealToGridTransition is a transition composition, not the standalone active grid page."
      ],
      existingPrototypeRoute: "/design-system/core-experience/activity-grid",
      knownIssues: [
        "The final Claude active-grid implementation may replace this source.",
        "The route uses reveal fixture activities until the real orderedActivities payload exists."
      ],
      reasonThisIsLatestVersion:
        "ActivityGridInteractiveLayer is the current clean interactive layer used by reveal-to-grid work and supports card reordering plus modal opening.",
      recommendedProductionSource:
        "components/product/recommendation-reveal-to-grid/ActivityGridInteractiveLayer.tsx",
      supportingComponentSources: [
        "components/product/ActivityGridVisualLayer.tsx",
        "components/motion/activity-modal/ActivityModalShellTransition.tsx"
      ]
    }
  },
  {
    id: "active-modal",
    order: 6,
    title: "Active Activity Modal",
    description:
      "The active grid page with a selected activity and the real activity modal open.",
    fullPageRoute: "/internal/journey/active-modal",
    pageSourcePath: "app/internal/journey/[stage]/page.tsx",
    componentSourcePaths: [
      "components/product/recommendation-reveal-to-grid/ActivityGridInteractiveLayer.tsx",
      "components/motion/activity-modal/ActivityModalShellTransition.tsx",
      "components/ui/ActivityDetailModal.tsx"
    ],
    sourceStatus: "needs-review",
    responsiveStatus: "changes-required",
    handoffStatus: "needs-review",
    integrationStatus: "not-started",
    input: ["selectedActivityId"],
    output: [],
    notes: [
      "The route loads the active grid and opens the selected activity through the existing grid-to-modal interaction path.",
      "The modal uses realistic placeholder data generated from the selected activity card until canonical modal content exists for these recommendation cards."
    ],
    audit: {
      candidateOlderVersions: [
        "ActivityDetailModalPageClient is a design-system review wrapper.",
        "ActivityModalMotionPrototype and activity-modal-motion-v2/v3 routes are motion explorations."
      ],
      existingPrototypeRoute:
        "/design-system/core-experience/activity-detail-modal",
      knownIssues: [
        "ActivityDetailModal itself still uses fixed desktop modal dimensions.",
        "The selectedActivityId handoff from a real grid state is not integrated."
      ],
      reasonThisIsLatestVersion:
        "The grid uses ActivityModalShellTransition and ActivityDetailModal through the real click/open path, so the QA route can test modal backdrop, positioning and page relationship in context.",
      recommendedProductionSource:
        "components/product/recommendation-reveal-to-grid/ActivityGridInteractiveLayer.tsx",
      supportingComponentSources: [
        "components/motion/activity-modal/ActivityModalShellTransition.tsx",
        "components/ui/ActivityDetailModal.tsx",
        "components/product/recommendation-reveal-to-grid/placeholderActivityModalData.ts"
      ]
    }
  }
];

export const journeyStageIds = journeyManifest.map((stage) => stage.id);

export function getJourneyStage(id: string) {
  return journeyManifest.find((stage) => stage.id === id);
}
