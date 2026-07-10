export type PortalNavItem = {
  category: string;
  description?: string;
  href: string;
  icon: string;
  label: string;
};

export type PortalNavGroup = {
  children: PortalNavItem[];
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

export const portalNavigation: PortalNavSection[] = [
  {
    children: [
      {
        category: "Design System",
        description:
          "Curated entry point for the PlayBooky design-system and product-system documentation.",
        href: "/design-system",
        icon: "P",
        label: "Portal Home"
      },
      {
        category: "Components",
        description:
          "Input component examples and implementation states for the portal component library.",
        href: "/design-system/components/inputs",
        icon: "I",
        label: "Inputs"
      }
    ],
    icon: "D",
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
        icon: "O",
        label: "Overview"
      },
      {
        category: "Product System",
        description:
          "Architecture references for PlayBooky diagnosis, recommendation, and workshop generation.",
        href: "/design-system/product-system/architecture",
        icon: "A",
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
            icon: "B",
            label: "Building Block Library"
          },
          {
            category: "Product System",
            description:
              "Reusable facilitation step patterns and sequencing references.",
            href: "/design-system/product-system/libraries/building-block-steps",
            icon: "S",
            label: "Building Block Steps"
          },
          {
            category: "Product System",
            description:
              "Activity data, filtering behaviour, and workshop recommendation source material.",
            href: "/design-system/product-system/libraries/activity-library",
            icon: "L",
            label: "Activity Library"
          }
        ],
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
            icon: "W",
            label: "Generated Workshop Flow"
          }
        ],
        id: "product-workshop",
        label: "Workshop"
      }
    ],
    icon: "P",
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
        icon: "C",
        label: "AI Composer"
      },
      {
        category: "Core Experience",
        description:
          "Diagnosis option card anatomy, content, icon usage, and interaction states.",
        href: "/design-system/core-experience/diagnosis-card",
        icon: "D",
        label: "Diagnosis Card"
      },
      {
        category: "Core Experience",
        description:
          "Desktop diagnosis grid layout using real diagnosis card content.",
        href: "/design-system/core-experience/diagnosis-grid",
        icon: "G",
        label: "Diagnosis Grid"
      },
      {
        category: "Core Experience",
        description:
          "The analysing state between diagnosis and recommendations, including its loading sequence.",
        href: "/design-system/core-experience/recommendation-loading",
        icon: "R",
        label: "Recommendation Loading"
      },
      {
        category: "Core Experience",
        description:
          "Activity card structure, visual states, and usage guidance for workshop recommendations.",
        href: "/design-system/core-experience/activity-card",
        icon: "A",
        label: "Activity Card"
      },
      {
        category: "Core Experience",
        description:
          "Activity grid layout, density, and responsive behaviour for recommendation surfaces.",
        href: "/design-system/core-experience/activity-grid",
        icon: "M",
        label: "Activity Grid"
      }
    ],
    icon: "E",
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
