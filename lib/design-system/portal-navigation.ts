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
          "Green-lit analysing state and linked recommendation reveal after diagnosis.",
        href: "/design-system/core-experience/recommendation-loading",
        icon: "target",
        keywords: [
          "recommendations",
          "loading",
          "analysis",
          "sequence",
          "greenlit",
          "reveal"
        ],
        label: "Recommendation Loading"
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
          "Static desktop review for the Builder Activity Detail Modal.",
        href: "/design-system/core-experience/activity-detail-modal",
        icon: "maximize-2",
        keywords: ["activity", "modal", "detail", "builder"],
        label: "Activity Detail Modal"
      },
      {
        category: "Core Experience",
        description:
          "Locked Workshop Mode navigation using Active Elastic Pop (RTL Icon).",
        href: "/design-system/core-experience/workshop-mode-nav",
        icon: "navigation",
        keywords: [
          "workshop",
          "navigation",
          "facilitator guide",
          "figjam",
          "playbooky live",
          "elastic pop",
          "locked"
        ],
        label: "Workshop Mode Nav"
      },
      {
        category: "Core Experience",
        description:
          "Locked Facilitator Guide header with logo, Share, and Download PDF actions.",
        href: "/design-system/core-experience/facilitator-guide-header",
        icon: "layout",
        keywords: [
          "header",
          "facilitator guide",
          "share",
          "download pdf",
          "logo",
          "locked"
        ],
        label: "Facilitator Guide Header"
      },
      {
        category: "Core Experience",
        description:
          "Secondary activity tabs for Facilitator Guide, driven by ordered workshop activities.",
        href: "/design-system/core-experience/facilitator-activity-tabs",
        icon: "list",
        keywords: [
          "facilitator guide",
          "activity tabs",
          "secondary navigation",
          "workshop order",
          "underline tabs"
        ],
        label: "Facilitator Activity Tabs"
      },
      {
        category: "Core Experience",
        description:
          "Facilitator Guide activity hero with type, title, description, and illustration.",
        href: "/design-system/core-experience/facilitator-activity-hero",
        icon: "image",
        keywords: [
          "facilitator guide",
          "activity hero",
          "title",
          "description",
          "illustration"
        ],
        label: "Facilitator Activity Hero"
      },
      {
        category: "Core Experience",
        description:
          "Facilitator Guide activity steps with what to say, discussion prompts, and expected outcomes.",
        href: "/design-system/core-experience/facilitator-activity-steps",
        icon: "list",
        keywords: [
          "facilitator guide",
          "activity steps",
          "what to say",
          "discussion prompt",
          "expected outcome"
        ],
        label: "Facilitator Activity Steps"
      },
      {
        category: "Core Experience",
        description:
          "Live Facilitator Guide model packed from Active Library diagnosis at 120 and 150 minutes.",
        href: "/design-system/core-experience/facilitator-guide-live",
        icon: "play",
        keywords: [
          "facilitator guide",
          "live",
          "diagnosis",
          "active library",
          "workshop packing",
          "canonical gaps"
        ],
        label: "Facilitator Guide Live"
      },
      {
        category: "Core Experience",
        description:
          "Waitlist panel for FigJam Board and PlayBooky Live, with join and submitted variants.",
        href: "/design-system/core-experience/workshop-ready-waitlist",
        icon: "mail",
        keywords: [
          "waitlist",
          "figjam",
          "playbooky live",
          "email",
          "workshop ready",
          "early access"
        ],
        label: "Workshop Ready Waitlist"
      },
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
