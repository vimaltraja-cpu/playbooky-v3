"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentPageShell,
  type ComponentAccessibilityItem,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { SiteHeader, type SiteHeaderVariant } from "@/components/ui/SiteHeader";

type ViewportId =
  | "mobile"
  | "tablet-portrait"
  | "tablet-landscape"
  | "desktop"
  | "large-desktop"
  | "xl-desktop";

type ViewportConfig = {
  height: number;
  id: ViewportId;
  label: string;
  width: number;
};

const componentMetadata = {
  category: "Core Experience",
  confidence: "3 Implementation ready",
  lastUpdated: "2026-07-28",
  owner: "Design System",
  status: "Documented",
  title: "Header Navigation"
};

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "viewports", label: "Viewports" },
  { id: "states", label: "States" },
  { id: "specs", label: "Specs" },
  { id: "accessibility", label: "Accessibility" }
];

const overviewCopy = {
  statusNote:
    "Header Navigation is documented as one shared SiteHeader component with a landing or inner variant prop.",
  summary:
    "Header Navigation provides responsive navigation for PlayBooky landing pages and inner product pages.",
  whatItIs:
    "A shared semantic header with a compact mobile and tablet layout, plus variant-specific desktop behaviour.",
  whenNotToUse:
    "Do not create separate landing and inner-page header components for the same responsive shell.",
  whenToUse:
    "Use it for PlayBooky landing pages and inner product pages that need consistent logo positioning and navigation rules.",
  whereItAppears:
    "Landing pages use the landing variant. Inner product pages use the inner variant while preserving the same logo position.",
  whyItExists:
    "To keep the PlayBooky logo, primary navigation, menu trigger, and login action aligned across breakpoints from a single component API."
};

const viewports: ViewportConfig[] = [
  { height: 852, id: "mobile", label: "Mobile", width: 394 },
  {
    height: 1024,
    id: "tablet-portrait",
    label: "Tablet portrait",
    width: 768
  },
  {
    height: 768,
    id: "tablet-landscape",
    label: "Tablet landscape",
    width: 1024
  },
  { height: 900, id: "desktop", label: "Desktop", width: 1440 },
  {
    height: 1117,
    id: "large-desktop",
    label: "Large desktop",
    width: 1728
  },
  { height: 1080, id: "xl-desktop", label: "XL desktop", width: 1920 }
];

const specs = [
  ["Component API", '<SiteHeader variant="landing" /> / <SiteHeader variant="inner" />'],
  ["Breakpoint", "Desktop variant behaviour begins at 1200px"],
  ["Compact header", "72px height, 32px outer left padding"],
  ["Compact logo", "142px x 35.35px, effective left position 48px"],
  ["Compact menu", "40px x 40px, 8px padding, 8px radius, 24px icon"],
  ["Compact container padding", "0 12px 0 16px"],
  ["Desktop header", "80px height, 48px outer left padding"],
  ["Desktop container", "44px height, 32px horizontal padding"],
  ["Desktop logo", "142px x 35.35px, effective left position 80px"],
  ["Desktop navigation", "Geist 14px / 20px, 400, #062E27"],
  ["Desktop gaps", "32px logo-to-navigation gap, 20px item gap"],
  ["Resources chevron", "20px x 20px downward chevron"],
  ["Login action", "83px x 44px, 10px 18px, 8px radius, Geist 16px / 24px, 600"],
  ["Logo colours", "#083C33, #0A5E4E / #094D40, #7D5330 to #D99C56"],
  ["Preview surface", "Light product-page background inside a single scaled viewport frame"]
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Navigation text, menu icon, and the gradient login label are reviewed against the light product-page header surface.",
      title: "Light surface contrast"
    },
    {
      description:
        "Active states must include more than colour when product routes mark a current page.",
      title: "Active state"
    }
  ],
  focusBehaviour: [
    {
      description:
        "Logo, navigation links, login, and the hamburger button expose visible focus outlines.",
      title: "Visible focus"
    },
    {
      description:
        "Interactive targets remain at least 40px by 40px across compact and desktop breakpoints.",
      title: "Target size"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "The logo and desktop navigation are standard links. The compact menu trigger is a real button.",
      title: "Native controls"
    },
    {
      description:
        "The header keeps a fluid width and avoids horizontal overflow at browser zoom.",
      title: "Zoom resilience"
    }
  ],
  reducedMotion: [
    {
      description:
        "The header does not require motion for the documented states. Any future menu transition should respect reduced-motion preferences.",
      title: "Menu transition"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The component uses a semantic header element and desktop navigation is labelled as primary navigation.",
      title: "Landmarks"
    },
    {
      description:
        "The logo links to the homepage and has an accessible name.",
      title: "Logo link"
    },
    {
      description:
        "The hamburger exposes aria-label, aria-expanded, and aria-controls.",
      title: "Menu trigger"
    },
    {
      description:
        'Current page links can receive aria-current="page" through the shared component.',
      title: "Current page"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "The documentation page reviews the trigger contract. The future opened mobile menu panel is still owned by product navigation behaviour.",
      title: "Mobile panel"
    }
  ]
};

function SectionHeading({
  description,
  title
}: {
  description?: string;
  title: string;
}) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function InfoPanel({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-4">
      <h4 className="text-[13px] font-medium leading-5 text-[#ededed]">
        {title}
      </h4>
      <div className="mt-3 text-sm leading-6 text-[#a1a1a1]">
        {children}
      </div>
    </div>
  );
}

function useFitScale(width: number, height: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateScale = () => {
      const safeWidth = Math.max(0, element.clientWidth - 32);
      const safeHeight = Math.max(0, element.clientHeight - 32);
      setScale(Math.min(1, safeWidth / width, safeHeight / height));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [height, width]);

  return { ref, scale };
}

function ProductPagePreview({
  variant,
  viewport
}: {
  variant: SiteHeaderVariant;
  viewport: ViewportConfig;
}) {
  return (
    <div
      className="overflow-hidden bg-[#F6F3EE] text-[#181714]"
      style={{ height: viewport.height, width: viewport.width }}
    >
      <SiteHeader variant={variant} />
      <div className="px-12 py-12 min-[1200px]:px-20 min-[1200px]:py-16">
        <div className="h-2 w-24 rounded-full bg-[#D99C56]" />
        <div className="mt-8 max-w-[640px] space-y-4">
          <div className="h-10 rounded-md bg-[#E7DED1]" />
          <div className="h-4 rounded-md bg-[#DED6CA]" />
          <div className="h-4 w-3/4 rounded-md bg-[#DED6CA]" />
        </div>
      </div>
    </div>
  );
}

function ViewportFrame({
  variant = "landing",
  viewport
}: {
  variant?: SiteHeaderVariant;
  viewport: ViewportConfig;
}) {
  const { ref, scale } = useFitScale(viewport.width, viewport.height);

  return (
    <div
      className="viewport-stage min-w-0 max-w-full overflow-hidden"
      ref={ref}
    >
      <div
        className="viewport-frame mx-auto overflow-hidden rounded-[10px] border border-white/[0.18] bg-[#F6F3EE] shadow-[0_24px_80px_rgba(0,0,0,0.36)]"
        style={{
          height: viewport.height * scale,
          width: viewport.width * scale
        }}
      >
        <div
          className="viewport-content"
          style={{
            height: viewport.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: viewport.width
          }}
        >
          <ProductPagePreview variant={variant} viewport={viewport} />
        </div>
      </div>
    </div>
  );
}

function ViewportsSection() {
  const [activeViewportId, setActiveViewportId] =
    useState<ViewportId>("mobile");
  const activeViewport =
    viewports.find((viewport) => viewport.id === activeViewportId) ??
    viewports[0];

  return (
    <section className="scroll-mt-28 py-8" id="viewports">
      <SectionHeading
        description="Review the landing header across the six approved reference sizes. The single frame below is the selected viewport."
        title="Viewports"
      />

      <div
        aria-label="Viewport"
        className="mt-5 flex w-fit max-w-full overflow-x-auto rounded-md border border-white/[0.14] bg-[#0a0a0a] p-1"
        role="tablist"
      >
        {viewports.map((viewport) => (
          <button
            aria-controls={`header-viewport-panel-${viewport.id}`}
            aria-selected={activeViewportId === viewport.id}
            className={[
              "rounded px-3 py-1.5 text-[13px] font-medium leading-5 transition-colors duration-200 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/70 motion-reduce:transition-none",
              activeViewportId === viewport.id
                ? "bg-white/[0.08] text-[#ededed]"
                : "text-[#8f8f8f] hover:bg-white/[0.055] hover:text-[#d4d4d4]"
            ].join(" ")}
            id={`header-viewport-tab-${viewport.id}`}
            key={viewport.id}
            onClick={() => setActiveViewportId(viewport.id)}
            role="tab"
            type="button"
          >
            {viewport.label}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`header-viewport-tab-${activeViewport.id}`}
        className="viewport-review-panel mt-5 min-w-0 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#111214]"
        id={`header-viewport-panel-${activeViewport.id}`}
        role="tabpanel"
      >
        <div className="min-h-0 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.1] px-4 py-3">
          <span className="text-[12px] font-medium leading-5 text-[#ededed]">
            {activeViewport.label}
          </span>
          <span className="font-mono text-[12px] leading-5 text-[#a1a1a1]">
            {activeViewport.width} x {activeViewport.height}
          </span>
        </div>
        <ViewportFrame viewport={activeViewport} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Compact behaviour">
          Mobile through tablet landscape uses a 72px header with the logo at
          48px from the left and a 40px menu button 12px from the right.
        </InfoPanel>
        <InfoPanel title="Desktop behaviour">
          Desktop through XL desktop uses an 80px landing header with the logo
          at 80px from the left, natural-width navigation links, and login 32px
          from the right.
        </InfoPanel>
        <InfoPanel title="Responsive rule">
          The implementation is fluid and changes structure once between tablet
          and desktop at the shared 1200px breakpoint.
        </InfoPanel>
      </div>
    </section>
  );
}

function StatesSection() {
  const desktopViewport = viewports.find((viewport) => viewport.id === "desktop")!;

  return (
    <section className="scroll-mt-28 py-8" id="states">
      <SectionHeading
        description="The variant difference only becomes visual at the desktop breakpoint. Mobile and tablet render the same logo plus hamburger layout for both variants."
        title="States"
      />
      <div className="mt-5 grid gap-5">
        {(["landing", "inner"] as const).map((variant) => (
          <div
            className="min-w-0 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#111214] p-4 sm:p-5"
            key={variant}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-[13px] font-medium capitalize leading-5 text-[#ededed]">
                {variant === "inner" ? "Inner page" : "Landing"}
              </h4>
              <p className="font-mono text-[12px] leading-5 text-[#737373]">
                1440 x 900
              </p>
            </div>
            <ViewportFrame variant={variant} viewport={desktopViewport} />
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-4 text-sm leading-6 text-[#a1a1a1]">
        Both desktop states retain the same 48px outer left padding, 32px inner
        left padding, and 80px effective logo position. The inner variant removes
        navigation and login without recentering or shifting the logo.
      </div>
    </section>
  );
}

function SpecsSection() {
  return (
    <section className="scroll-mt-28 py-8" id="specs">
      <SectionHeading
        description="Implementation values for the shared responsive header."
        title="Specs"
      />
      <div className="mt-5 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#0a0a0a]">
        {specs.map(([label, value]) => (
          <div
            className="grid gap-2 border-b border-white/[0.1] p-4 last:border-b-0 sm:grid-cols-[220px_1fr]"
            key={label}
          >
            <div className="text-[13px] font-medium leading-5 text-[#ededed]">
              {label}
            </div>
            <div className="font-mono text-[13px] leading-6 text-[#a1a1a1]">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-4">
        <h4 className="text-[13px] font-medium leading-5 text-[#ededed]">
          Anatomy
        </h4>
        <pre className="mt-3 overflow-x-auto rounded-md bg-[#111214] p-4 font-mono text-[13px] leading-6 text-[#a1a1a1]">
{`Header
└── Container
    ├── Content
    │   ├── Logo
    │   └── Navigation
    ├── Actions
    │   └── Login
    └── Mobile menu trigger`}
        </pre>
        <p className="mt-3 text-sm leading-6 text-[#a1a1a1]">
          Only the relevant elements are visible at each breakpoint and variant.
        </p>
      </div>
    </section>
  );
}

export default function HeaderNavigationPage() {
  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/header-navigation" />

        <ComponentPageShell
          description="Responsive navigation for PlayBooky landing pages and inner product pages, documented as one shared component with landing and inner variants."
          metadata={componentMetadata}
          sections={sectionItems}
        >
          <ComponentOverviewSection {...overviewCopy} />
          <ViewportsSection />
          <StatesSection />
          <SpecsSection />
          <ComponentAccessibilitySection
            contrastNotes={accessibilityNotes.contrastNotes}
            focusBehaviour={accessibilityNotes.focusBehaviour}
            keyboardBehaviour={accessibilityNotes.keyboardBehaviour}
            reducedMotion={accessibilityNotes.reducedMotion}
            screenReaderNotes={accessibilityNotes.screenReaderNotes}
            unresolvedIssues={accessibilityNotes.unresolvedIssues}
          />
        </ComponentPageShell>
      </div>
    </main>
  );
}
