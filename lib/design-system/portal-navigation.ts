export type PortalNavItem = {
  category: string;
  description?: string;
  href: string;
  icon: string;
  keywords?: string[];
  label: string;
};

export type PortalNavGroup = {
  children: PortalNavItem[];
  icon: string;
  id: string;
  label: string;
};

export type PortalNavSection = {
  children?: PortalNavItem[];
  groups?: PortalNavGroup[];
  icon: string;
  id: string;
  label: string;
};

export type PortalPageEntry = {
  category: string;
  description: string;
  href: string;
  icon: string;
  keywords?: string[];
  title: string;
};

export const portalNavigation: PortalNavSection[] = [
  {
    children: [
      {
        category: "Design System",
        description:
          "Curated entry point for the PlayBooky design-system and product-system documentation.",
        href: "/design-system",
        icon: "home",
        keywords: ["overview", "landing", "source of truth", "portal"],
        label: "Portal Home"
      },
      {
        category: "Components",
        description:
          "Input component examples and implementation states for the portal component library.",
        href: "/design-system/components/inputs",
        icon: "toggle-left",
        keywords: ["components", "forms", "controls", "fields"],
        label: "Inputs"
      }
    ],
    icon: "layout",
    id: "design-system",
    label: "Design System"
  },
  {
    children: [
      {
        category: "Product System",
        description:
          "Product operating model, ownership references, and system-level documentation.",
        href: "/design-system/product-system",
        icon: "compass",
        keywords: ["product system", "ownership", "operating model"],
        label: "Overview"
      },
      {
        category: "Product System",
        description:
          "Architecture references for PlayBooky diagnosis, recommendation, and workshop generation.",
        href: "/design-system/product-system/architecture",
        icon: "git-branch",
        keywords: ["architecture", "diagnosis", "recommendations", "workshop generation"],
        label: "Product Architecture"
      }
    ],
    groups: [
      {
        children: [
          {
            category: "Product System",
            description:
              "Overview of the activities, building blocks, steps and rules that power generated workshops.",
            href: "/design-system/product-system/libraries",
            icon: "folder",
            keywords: ["libraries", "overview", "workshop os", "relationships"],
            label: "Libraries Overview"
          },
          {
            category: "Product System",
            description:
              "The reusable building-block catalogue that powers generated workshop flows.",
            href: "/design-system/product-system/libraries/building-block-library",
            icon: "package",
            keywords: ["library", "catalogue", "workshop blocks", "building blocks"],
            label: "Building Block Library"
          },
          {
            category: "Product System",
            description:
              "Reusable facilitation step patterns and sequencing references.",
            href: "/design-system/product-system/libraries/building-block-steps",
            icon: "list",
            keywords: ["steps", "sequencing", "facilitation", "patterns"],
            label: "Building Block Steps"
          },
          {
            category: "Product System",
            description:
              "Activity data, filtering behaviour, and workshop recommendation source material.",
            href: "/design-system/product-system/libraries/activity-library",
            icon: "grid",
            keywords: ["activities", "filters", "recommendations", "source data"],
            label: "Activity Library"
          },
          {
            category: "Product System",
            description:
              "Internal sandbox for testing how diagnosis signals change the active generated workshop.",
            href: "/design-system/product-system/libraries/active-library",
            icon: "sliders",
            keywords: ["active library", "generation", "sandbox", "diagnosis", "rules"],
            label: "Active Library"
          }
        ],
        icon: "folder",
        id: "product-libraries",
        label: "Libraries"
      },
      {
        children: [
          {
            category: "Product System",
            description:
              "A generated workshop flow example from diagnosis through facilitation-ready output.",
            href: "/design-system/product-system/workshop/generated-flow",
            icon: "git-merge",
            keywords: ["workshop", "generated flow", "facilitation", "sequence"],
            label: "Generated Workshop Flow"
          }
        ],
        icon: "users",
        id: "product-workshop",
        label: "Workshop"
      }
    ],
    icon: "3-layers",
    id: "product-system",
    label: "Product System"
  },
  {
    children: [
      {
        category: "Core Experience",
        description:
          "The Composer surface for shaping workshop prompts and structured AI input.",
        href: "/design-system/components/ai-composer",
        icon: "zap",
        keywords: ["ai", "composer", "prompt", "input"],
        label: "AI Composer"
      },
      {
        category: "Core Experience",
        description:
          "Diagnosis option card anatomy, content, icon usage, and interaction states.",
        href: "/design-system/core-experience/diagnosis-card",
        icon: "clipboard",
        keywords: ["diagnosis", "card", "states", "accessibility"],
        label: "Diagnosis Card"
      },
      {
        category: "Core Experience",
        description:
          "Desktop diagnosis grid layout using real diagnosis card content.",
        href: "/design-system/core-experience/diagnosis-grid",
        icon: "columns",
        keywords: ["diagnosis", "grid", "layout", "responsive"],
        label: "Diagnosis Grid"
      },
      {
        category: "Core Experience",
        description:
          "The analysing state between diagnosis and recommendations, including its loading sequence.",
        href: "/design-system/core-experience/recommendation-loading",
        icon: "target",
        keywords: ["recommendations", "loading", "analysis", "sequence"],
        label: "Recommendation Loading Experience"
      },
      {
        category: "Core Experience",
        description:
          "The post-loading recommendation deck reveal that fans activity cards out from Commitment Check.",
        href: "/design-system/core-experience/recommendation-card-reveal",
        icon: "3-layers",
        keywords: [
          "recommendations",
          "card reveal",
          "deck reveal",
          "fan",
          "deal"
        ],
        label: "Recommendation Card Reveal"
      },
      {
        category: "Core Experience",
        description:
          "A user-triggered motion study where the recommendation card fan transforms into the workshop grid.",
        href: "/design-system/core-experience/recommendation-reveal-to-grid",
        icon: "layout",
        keywords: [
          "recommendations",
          "workshop grid",
          "transition",
          "motion",
          "cards"
        ],
        label: "Recommendation Reveal -> Workshop Grid Transition"
      },
      {
        category: "Core Experience",
        description:
          "Activity card structure, visual states, and usage guidance for workshop recommendations.",
        href: "/design-system/core-experience/activity-card",
        icon: "activity",
        keywords: ["activity", "card", "recommendations", "states"],
        label: "Activity Card"
      },
      {
        category: "Core Experience",
        description:
          "Activity grid layout, density, and responsive behaviour for recommendation surfaces.",
        href: "/design-system/core-experience/activity-grid",
        icon: "layout",
        keywords: ["activity", "grid", "density", "responsive"],
        label: "Activity Grid"
      },
      {
        category: "Core Experience",
        description:
          "Responsive landing and inner-page header navigation for PlayBooky pages.",
        href: "/design-system/core-experience/header-navigation",
        icon: "navigation",
        keywords: ["header", "navigation", "landing", "inner page", "responsive"],
        label: "Header Navigation"
      },
      {
        category: "Core Experience",
        description:
          "Responsive homepage opening layout for the logo, headline, guidance text, and AI Composer.",
        href: "/design-system/core-experience/homepage-text-layout",
        icon: "monitor",
        keywords: ["homepage", "hero", "text layout", "composer", "responsive"],
        label: "Homepage Text Layout"
      },
      {
        category: "Core Experience",
        description:
          "Responsive homepage composer area layout for the guidance link and AI Composer.",
        href: "/design-system/core-experience/homepage-composer-layout",
        icon: "message-circle",
        keywords: ["homepage", "composer", "guidance", "responsive"],
        label: "Homepage Composer Layout"
      },
      {
        category: "Core Experience",
        description:
          "Static desktop review for the Builder Activity Detail Modal.",
        href: "/design-system/core-experience/activity-detail-modal",
        icon: "maximize-2",
        keywords: ["activity", "modal", "detail", "builder"],
        label: "Activity Detail Modal"
      },
      {
        category: "Core Experience",
        description:
          "Motion explorations for the Workshop Ready contextual navigation active state and icon.",
        href: "/design-system/core-experience/workshop-navigation-motion",
        icon: "navigation",
        keywords: [
          "navigation",
          "workshop ready",
          "facilitator guide",
          "figjam",
          "playbooky live",
          "motion"
        ],
        label: "Workshop Navigation Motion"
      }
    ],
    icon: "monitor",
    id: "core-experience",
    label: "Core Experience"
  }
];

export function getImplementedPortalPages() {
  return portalNavigation.flatMap((section) => [
    ...(section.children ?? []),
    ...(section.groups?.flatMap((group) => group.children) ?? [])
  ]);
}

export function getPortalPageEntries(): PortalPageEntry[] {
  return getImplementedPortalPages().map((page) => ({
    category: page.category,
    description: page.description ?? "",
    href: page.href,
    icon: page.icon,
    keywords: page.keywords,
    title: page.label
  }));
}
