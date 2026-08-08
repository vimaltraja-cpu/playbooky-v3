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
import { HomepageComposerLayout } from "@/components/product/HomepageTextLayout";

const sectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "viewports", label: "Viewports" },
  { id: "states", label: "States" },
  { id: "specs", label: "Specifications" },
  { id: "accessibility", label: "Accessibility" }
];

const metadata = {
  category: "Core Experience",
  confidence: "3 Implementation ready",
  lastUpdated: "2026-07-28",
  owner: "Design System",
  status: "Documented",
  title: "Homepage Composer Layout"
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
    "The page reuses the production header, logo asset, hero text, and AI Composer. The documentation frame only scales the real layout for inspection.",
  summary:
    "Homepage Composer Layout defines the responsive placement of the guidance block and AI Composer within the PlayBooky homepage opening screen.",
  whatItIs:
    "A product layout wrapper for reviewing the homepage composer area across supported viewport sizes.",
  whenNotToUse:
    "Do not use it for standalone AI Composer component states or artificial documentation-only spacing.",
  whenToUse:
    "Use it when approving the guidance-to-composer stack and its relationship to the homepage hero.",
  whereItAppears:
    "Documentation lives at /design-system/core-experience/homepage-composer-layout. The clean preview lives at /preview/homepage-composer-layout.",
  whyItExists:
    "To review the complete composer composition at real viewport ratios without rebuilding the existing AI Composer."
};

const specs = [
  ["Product header", "Reuses <SiteHeader variant=\"landing\" />"],
  ["Hero", "Reuses the homepage logo and heading from Homepage Text Layout"],
  ["Composer", "Reuses <AIComposer /> with responsive placement"],
  ["Diagnosis link", "Uses the existing /design-system/core-experience/diagnosis-grid route"],
  ["Mobile viewport", "394 x 852"],
  ["Mobile composer region", "284px high, 32px bottom padding"],
  ["Mobile guidance", "14px / 20px, 40px total height"],
  ["Mobile composer width", "370px with 12px side margins"],
  ["Tablet portrait viewport", "768 x 1024"],
  ["Tablet composer region", "Follows the compact vertical flow below 1200px"],
  ["Tablet guidance", "14px / 20px in compact mode"],
  ["Tablet composer width", "736px"],
  ["Tablet landscape", "Same composer measurements as tablet portrait"],
  ["Desktop stack", "330 hero, 32 gap, 48 guidance, 32 gap, 141 composer"],
  ["Desktop composer", "736 x 141"],
  ["Large desktop and XL", "Same internal sizing as desktop"]
];

const accessibilityNotes: Record<string, ComponentAccessibilityItem[]> = {
  contrastNotes: [
    {
      description:
        "Guidance text uses muted product copy colour; the link receives the approved brown-to-gold text gradient.",
      title: "Guidance contrast"
    }
  ],
  focusBehaviour: [
    {
      description:
        "Guide me instead is a real link with visible focus. Composer controls inherit their existing focus behaviour.",
      title: "Interactive guidance"
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
        "The review viewport uses the same controlled resize transition as Homepage Text Layout, while reduced motion switches to an immediate change with only a short fade.",
      title: "Viewport motion"
    }
  ],
  screenReaderNotes: [
    {
      description:
        "The composer area is a labelled section, and the guidance action is exposed as a normal link.",
      title: "Composer semantics"
    }
  ],
  unresolvedIssues: [
    {
      description:
        "The product /diagnosis route does not currently exist in the app; the guidance link points to the existing diagnosis grid review route.",
      title: "Diagnosis destination"
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
      <HomepageComposerLayout framed viewport={viewport} />
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
        ariaLabel="Homepage composer layout viewport"
        onSelectViewport={setActiveViewportId}
        previewHref="/preview/homepage-composer-layout"
        renderPreview={renderPreview}
        tabIdPrefix="homepage-composer-layout"
        viewports={viewports}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Full-size preview">
          The open action goes to /preview/homepage-composer-layout. The clean
          route responds to the actual browser width without portal chrome.
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
        description="Implementation values for the responsive homepage composer layout."
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

function StatesSection() {
  return (
    <section className="scroll-mt-28 py-8" id="states">
      <SectionHeading
        description="Homepage Composer Layout has two approved structural states: compact below 1200px and desktop at 1200px and above."
        title="States"
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <InfoPanel title="Mobile">
          Below 768px, the compact header, compact hero, helper copy, and
          mobile-width composer move together in one vertical flow.
        </InfoPanel>
        <InfoPanel title="Tablet compact">
          From 768px to 1199px, the header remains compact and the hero and
          composer retain the compact page rhythm without desktop anchoring.
        </InfoPanel>
        <InfoPanel title="Desktop">
          At 1200px and above, the desktop header, approved hero sizing,
          guidance spacing, and composer placement return together.
        </InfoPanel>
      </div>
    </section>
  );
}

export default function HomepageComposerLayoutPage() {
  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/core-experience/homepage-composer-layout" />

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
                guidance block and AI Composer.
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
          </div>
        </section>
      </div>
    </main>
  );
}
