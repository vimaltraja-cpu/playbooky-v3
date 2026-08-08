"use client";

import { useCallback, useState, type ReactNode } from "react";

import {
  ComponentAccessibilitySection,
  ComponentOverviewSection,
  ComponentSectionNav,
  type ComponentAccessibilityItem,
  type ComponentSectionNavItem
} from "@/components/portal/ComponentPage";
import {
  AnimatedViewportReview,
  type AnimatedViewportConfig,
  type AnimatedViewportId
} from "@/components/portal/AnimatedViewportReview";
import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { HomepageTextLayout } from "@/components/product/HomepageTextLayout";

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "viewports", label: "Viewports" },
  { id: "specs", label: "Specifications" },
  { id: "accessibility", label: "Accessibility" }
];

const metadata = {
  category: "Core Experience",
  confidence: "3 Implementation ready",
  lastUpdated: "2026-07-28",
  owner: "Design System",
  status: "Documented",
  title: "Homepage Text Layout"
};

const viewports: AnimatedViewportConfig[] = [
  {
    height: 852,
    id: "mobile",
    label: "Mobile",
    layoutViewport: "mobile",
    width: 394
  },
  {
    height: 1024,
    id: "tablet-portrait",
    label: "Tablet portrait",
    layoutViewport: "tablet-portrait",
    width: 768
  },
  {
    height: 768,
    id: "tablet-landscape",
    label: "Tablet landscape",
    layoutViewport: "tablet-landscape",
    width: 1024
  },
  {
    height: 900,
    id: "desktop",
    label: "Desktop",
    layoutViewport: "desktop",
    width: 1440
  },
  {
    height: 1117,
    id: "large-desktop",
    label: "Large desktop",
    layoutViewport: "desktop",
    width: 1728
  },
  {
    height: 1080,
    id: "xl-desktop",
    label: "XL desktop",
    layoutViewport: "desktop",
    width: 1920
  }
];

const overviewCopy = {
  statusNote:
    "The page reuses the production header, logo asset, and AI Composer. The documentation frame only scales the real layout for inspection.",
  summary:
    "Homepage Text Layout defines the responsive first-screen composition for the PlayBooky homepage: header, logo, headline, guidance text, and AI Composer.",
  whatItIs:
    "A product layout wrapper and hero text component for the homepage opening screen.",
  whenNotToUse:
    "Do not use it for documentation examples that need artificial spacing, stacked viewport screenshots, or a separate header/composer implementation.",
  whenToUse:
    "Use it when reviewing or implementing the real responsive homepage opening composition.",
  whereItAppears:
    "Documentation lives at /design-system/core-experience/homepage-text-layout. The clean preview lives at /preview/homepage-text-layout.",
  whyItExists:
    "To make breakpoint approval possible from one full-screen preview without changing the responsive layout to fit the documentation shell."
};

const specs = [
  ["Product header", "Reuses <SiteHeader variant=\"landing\" />"],
  ["Logo asset", "/assets/navigation-icons/logo-Icon.svg"],
  ["Composer", "Reuses <AIComposer /> with responsive placement"],
  ["Mobile viewport", "394 x 852"],
  ["Mobile vertical structure", "72 header, 32 gap, 464 hero region, 284 composer region"],
  ["Tablet portrait viewport", "768 x 1024"],
  ["Tablet portrait structure", "72 header, 32 gap, 611 hero region, 64 gap, 245 composer region"],
  ["Tablet landscape viewport", "1024 x 768"],
  ["Tablet landscape structure", "72 header, 32 gap, flexible hero region, 64 gap, 245 composer region"],
  ["Desktop viewport", "1440 x 900"],
  ["Desktop stack", "330 hero, 32 gap, 48 guidance, 32 gap, 141 composer"],
  ["Desktop positioning", "583px stack centred inside the 820px area below the 80px header"]
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Heading and guidance text use approved dark green and muted text on the light product surface.",
      title: "Product surface contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "Header links and composer controls keep their existing focus behaviour because the production components are reused.",
      title: "Inherited focus"
    }
  ],
  keyboardBehaviour: [
    {
      description:
        "Viewport tabs are buttons in a tablist. The full-size action is a standard link to the clean preview route.",
      title: "Documentation controls"
    }
  ],
  reducedMotion: [
    {
      description:
        "The review viewport uses a controlled resize transition, while reduced motion switches to an immediate change with only a short fade.",
      title: "Viewport motion"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The hero uses one semantic h1 with two controlled visual lines.",
      title: "Single heading"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "Guidance copy is implemented as stable product text and should receive final content approval before release.",
      title: "Guidance copy"
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

function InfoPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-4">
      <h4 className="text-[13px] font-medium leading-5 text-[#ededed]">
        {title}
      </h4>
      <div className="mt-3 text-sm leading-6 text-[#a1a1a1]">{children}</div>
    </div>
  );
}

function ViewportsSection() {
  const [activeViewportId, setActiveViewportId] =
    useState<AnimatedViewportId>("mobile");
  const activeViewport =
    viewports.find((viewport) => viewport.id === activeViewportId) ??
    viewports[0];
  const renderPreview = useCallback(
    (viewport: AnimatedViewportConfig["layoutViewport"]) => (
      <HomepageTextLayout framed viewport={viewport} />
    ),
    []
  );

  return (
    <section className="scroll-mt-28 py-8" id="viewports">
      <SectionHeading
        description="Select one reference size at a time. The canvas uses the remaining portal area and scales the real page proportionally so the complete screen is visible."
        title="Viewports"
      />

      <AnimatedViewportReview
        activeViewport={activeViewport}
        activeViewportId={activeViewportId}
        ariaLabel="Homepage text layout viewport"
        onSelectViewport={setActiveViewportId}
        previewHref={`/preview/homepage-text-layout?viewport=${activeViewport.id}`}
        renderPreview={renderPreview}
        tabIdPrefix="homepage-text-layout"
        viewports={viewports}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Full-size preview">
          The open action goes to /preview/homepage-text-layout with a viewport
          query so each breakpoint can be reviewed without the portal shell.
        </InfoPanel>
        <InfoPanel title="Canvas behaviour">
          The preview preserves the actual viewport ratio and applies only a
          visual scale to the complete page.
        </InfoPanel>
        <InfoPanel title="Product behaviour">
          The preview route has no sidebar, frame, labels, or documentation
          chrome, and responds naturally to browser resizing.
        </InfoPanel>
      </div>
    </section>
  );
}

function SpecsSection() {
  return (
    <section className="scroll-mt-28 py-8" id="specs">
      <SectionHeading
        description="Implementation values for the responsive homepage text layout."
        title="Specifications"
      />
      <div className="mt-5 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#0a0a0a]">
        {specs.map(([label, value]) => (
          <div
            className="grid gap-2 border-b border-white/[0.1] p-4 last:border-b-0 sm:grid-cols-[240px_1fr]"
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
    </section>
  );
}

export default function HomepageTextLayoutPage() {
  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/homepage-text-layout" />

        <section className="min-w-0 bg-black px-5 py-7 pb-16 text-[#ededed] [--accent:#8ec5ff] [--accent-strong:#bae6fd] [--background:#000] [--foreground:#ededed] [--gold:#8f8f8f] [--line:rgba(255,255,255,0.14)] [--muted:#a1a1a1] [--panel:#0a0a0a] [--panel-soft:#111214] [--rose:#fda4af] sm:px-8">
          <div className="mx-auto max-w-6xl">
            <header className="border-b border-white/[0.1] pb-7">
              <p className="text-[12px] font-medium leading-5 text-[#737373]">
                {metadata.category}
              </p>
              <h2 className="mt-2 text-[22px] font-semibold leading-8 text-[#f5f5f5]">
                {metadata.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                Full-screen responsive composition for the PlayBooky homepage
                text, logo, guidance, and composer.
              </p>
              <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] leading-5">
                {[
                  ["Status", metadata.status],
                  ["Confidence", metadata.confidence],
                  ["Owner", metadata.owner],
                  ["Last updated", metadata.lastUpdated]
                ].map(([term, detail]) => (
                  <div className="flex items-center gap-2" key={term}>
                    <dt className="font-medium text-[#737373]">{term}:</dt>
                    <dd className="font-medium text-[#d4d4d4]">{detail}</dd>
                  </div>
                ))}
              </dl>
            </header>

            <ComponentSectionNav items={sectionItems} />

            <ComponentOverviewSection {...overviewCopy} />
          </div>

          <ViewportsSection />

          <div className="mx-auto max-w-6xl">
            <SpecsSection />
            <ComponentAccessibilitySection
              contrastNotes={accessibilityNotes.contrastNotes}
              focusBehaviour={accessibilityNotes.focusBehaviour}
              keyboardBehaviour={accessibilityNotes.keyboardBehaviour}
              reducedMotion={accessibilityNotes.reducedMotion}
              screenReaderNotes={accessibilityNotes.screenReaderNotes}
              unresolvedIssues={accessibilityNotes.unresolvedIssues}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
