"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ViewportReviewLayout } from "@/components/portal/ViewportReviewLayout";

const SYSTEM_ICON_PATH = "/assets/icons/system Icons";

export type ComponentSectionId =
  "overview" | "viewports" | "states" | "specs" | "tokens" | "accessibility";

export type ComponentSectionNavItem = {
  id: ComponentSectionId | string;
  label: string;
};

export type ComponentPageMetadata = {
  category: string;
  confidence: string;
  lastUpdated: string;
  owner: string;
  status: string;
  title: string;
};

const defaultSectionItems: ComponentSectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "specs", label: "Specs" },
  { id: "viewports", label: "Viewports" },
  { id: "states", label: "States" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" }
];

const sectionIcons: Record<string, string> = {
  accessibility: "shield",
  overview: "book-open",
  specs: "file-text",
  states: "sliders",
  tokens: "tag",
  viewports: "monitor"
};

function SystemIcon({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="block h-4 w-4 shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:16px_16px]"
      style={{
        WebkitMaskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`,
        maskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`
      }}
    />
  );
}

function SectionHeading({
  children,
  description,
  title
}: {
  children?: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <h3 className="text-[15px] font-semibold leading-6 text-[#ededed]">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

const panelClassName =
  "rounded-[10px] border border-white/[0.14] bg-[#0a0a0a]";

const previewPanelClassName =
  "rounded-[10px] border border-white/[0.14] bg-[#111214]";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

function getSectionElement(id: string) {
  return document.getElementById(id);
}

function scrollToSection(id: string, prefersReducedMotion: boolean) {
  const element = getSectionElement(id);

  if (!element) {
    return;
  }

  element.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start"
  });
}

export function ComponentSectionNav({
  items = defaultSectionItems
}: {
  items?: ComponentSectionNavItem[];
}) {
  const orderedItems = [...items].sort((a, b) => {
    const order: Record<string, number> = {
      accessibility: 5,
      overview: 0,
      specs: 1,
      states: 3,
      tokens: 4,
      viewports: 2
    };
    const aIndex = items.findIndex((item) => item.id === a.id);
    const bIndex = items.findIndex((item) => item.id === b.id);
    return (
      (order[a.id] ?? 2.5 + aIndex / 100) -
      (order[b.id] ?? 2.5 + bIndex / 100)
    );
  });
  const [activeSection, setActiveSection] = useState(
    items[0]?.id ?? "overview"
  );
  const [indicator, setIndicator] = useState({ left: 4, width: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const updateIndicator = () => {
      const activeElement = itemRefs.current[activeSection];

      if (!activeElement) {
        return;
      }

      setIndicator({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeSection]);

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash && items.some((item) => item.id === hash)) {
        setActiveSection(hash);
        return;
      }

      setActiveSection(items[0]?.id ?? "overview");
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, [items]);

  useEffect(() => {
    const observedItems = items
      .map((item) => getSectionElement(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (observedItems.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-34% 0px -58% 0px",
        threshold: [0.1, 0.25, 0.5]
      }
    );

    observedItems.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [items]);

  return (
    <nav
      aria-label="Component page sections"
      className="sticky top-0 z-20 -mx-5 mt-7 border-y border-white/[0.1] bg-black/90 px-5 backdrop-blur sm:-mx-8 sm:px-8"
    >
      <div className="relative flex max-w-full gap-1 overflow-x-auto">
        <span
          aria-hidden="true"
          className="absolute bottom-0 h-px bg-sky-300 transition-[transform,width] duration-[280ms] ease-[cubic-bezier(0.2,0,0,1)] will-change-[transform,width] motion-reduce:transition-none"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width
          }}
        />
        {orderedItems.map((item) => {
          const isActive = activeSection === item.id;
          const href = item.id === "overview" ? "#" : `#${item.id}`;
          const label = item.id === "viewports" ? "Viewports" : item.label;

          return (
            <a
              aria-current={isActive ? "location" : undefined}
              className={[
                "relative z-10 inline-flex h-11 items-center gap-2 whitespace-nowrap px-3 text-[13px] font-medium leading-5 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                isActive
                  ? "text-[#ededed]"
                  : "text-[#8f8f8f] hover:text-[#d4d4d4] focus-visible:text-[#d4d4d4]"
              ].join(" ")}
              href={href}
              key={item.id}
              onClick={(event) => {
                event.preventDefault();
                setActiveSection(item.id);

                if (item.id === "overview") {
                  history.replaceState(null, "", window.location.pathname);
                } else {
                  history.pushState(null, "", `#${item.id}`);
                }

                scrollToSection(item.id, prefersReducedMotion);
              }}
              ref={(element) => {
                itemRefs.current[item.id] = element;
              }}
            >
              <SystemIcon name={sectionIcons[item.id] ?? "circle"} />
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export function ComponentPageShell({
  children,
  description,
  metadata,
  sections = defaultSectionItems
}: {
  children: ReactNode;
  description: string;
  metadata: ComponentPageMetadata;
  sections?: ComponentSectionNavItem[];
}) {
  return (
    <section
      className="min-w-0 bg-black px-5 py-7 pb-16 text-[#ededed] [--accent:#8ec5ff] [--accent-strong:#bae6fd] [--background:#000] [--foreground:#ededed] [--gold:#8f8f8f] [--line:rgba(255,255,255,0.14)] [--muted:#a1a1a1] [--panel:#0a0a0a] [--panel-soft:#111214] [--rose:#fda4af] sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-white/[0.1] pb-7">
          <p className="text-[12px] font-medium leading-5 text-[#737373]">
            {metadata.category}
          </p>
          <h2 className="mt-2 text-[22px] font-semibold leading-8 text-[#f5f5f5]">
            {metadata.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
            {description}
          </p>
          <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] leading-5">
            {[
              ["Status", metadata.status],
              ["Confidence", metadata.confidence],
              ["Owner", metadata.owner],
              ["Last updated", metadata.lastUpdated]
            ].map(([term, detail]) => (
              <div className="flex items-center gap-2" key={term}>
                <dt className="font-medium text-[#737373]">
                  {term}:
                </dt>
                <dd className="font-medium text-[#d4d4d4]">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <ComponentSectionNav items={sections} />

        {children}
      </div>
    </section>
  );
}

export function ComponentOverviewSection({
  statusNote,
  summary,
  whatItIs,
  whenNotToUse,
  whenToUse,
  whereItAppears,
  whyItExists
}: {
  statusNote?: string;
  summary: string;
  whatItIs: string;
  whenNotToUse: string;
  whenToUse: string;
  whereItAppears: string;
  whyItExists: string;
}) {
  const overviewItems = [
    ["What it is", whatItIs],
    ["Where it appears", whereItAppears],
    ["Why it exists", whyItExists],
    ["When to use it", whenToUse],
    ["When not to use it", whenNotToUse]
  ];

  return (
    <section id="overview" className="scroll-mt-28 py-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <SectionHeading title="Overview" />
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
            {summary}
          </p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {overviewItems.map(([term, description]) => (
              <div className={`${panelClassName} p-4`} key={term}>
                <dt className="text-[13px] font-medium leading-5 text-[#ededed]">
                  {term}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-[#a1a1a1]">
                  {description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {statusNote ? (
          <aside className={`${panelClassName} h-fit p-4`}>
            <p className="text-[12px] font-medium leading-5 text-[#737373]">
              Status
            </p>
            <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">
              {statusNote}
            </p>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

export type ViewportShowroomItem<Viewport extends string> = {
  id: Viewport;
  label: string;
  notes: Array<[string, string]>;
};

export function ComponentViewportShowroom<Viewport extends string>({
  description,
  preservePanelOnViewportChange,
  renderPreview,
  title = "Viewport",
  viewports
}: {
  description: string;
  preservePanelOnViewportChange?: boolean;
  renderPreview: (viewport: Viewport) => ReactNode;
  title?: string;
  viewports: Array<ViewportShowroomItem<Viewport>>;
}) {
  return (
    <ViewportReviewLayout
      description={description}
      preservePanelOnViewportChange={preservePanelOnViewportChange}
      renderPreview={renderPreview}
      title={title}
      viewports={viewports}
    />
  );
}

export type ComponentShowroomState<State extends string> = {
  durationMs?: number;
  id: State;
  label: string;
  notes: Array<[string, string]>;
  reducedMotionDurationMs?: number;
};

export function ComponentStateShowroom<State extends string>({
  autoplayEnabled = true,
  description,
  renderPreview,
  states,
  title = "States"
}: {
  autoplayEnabled?: boolean;
  description: string;
  renderPreview: (state: State, isReducedMotion: boolean) => ReactNode;
  states: Array<ComponentShowroomState<State>>;
  title?: string;
}) {
  const [activeState, setActiveState] = useState(states[0].id);
  const [autoplay, setAutoplay] = useState(autoplayEnabled);
  const resumeTimeout = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeItem =
    states.find((state) => state.id === activeState) ?? states[0];

  useEffect(() => {
    if (!autoplayEnabled || !autoplay) {
      return;
    }

    const currentIndex = states.findIndex((state) => state.id === activeState);
    const nextState = states[(currentIndex + 1) % states.length].id;
    const duration = prefersReducedMotion
      ? (activeItem.reducedMotionDurationMs ?? activeItem.durationMs ?? 2200)
      : (activeItem.durationMs ?? 2200);

    const timeoutId = window.setTimeout(() => {
      setActiveState(nextState);
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    activeItem,
    activeState,
    autoplay,
    autoplayEnabled,
    prefersReducedMotion,
    states
  ]);

  useEffect(() => {
    return () => {
      if (resumeTimeout.current) {
        window.clearTimeout(resumeTimeout.current);
      }
    };
  }, []);

  const selectState = (state: State) => {
    if (autoplayEnabled) {
      setAutoplay(false);
    }
    setActiveState(state);

    if (resumeTimeout.current) {
      window.clearTimeout(resumeTimeout.current);
    }

    if (autoplayEnabled) {
      resumeTimeout.current = window.setTimeout(() => {
        setAutoplay(true);
      }, 12000);
    }
  };

  return (
    <section id="states" className="scroll-mt-28 py-8">
      <SectionHeading description={description} title={title}>
        {autoplayEnabled ? (
          <p
            aria-live="polite"
            className="text-[12px] font-medium leading-5 text-[#737373]"
          >
            {autoplay ? "Auto-playing showroom" : "Autoplay paused"}
          </p>
        ) : (
          <p className="text-[12px] font-medium leading-5 text-[#737373]">
            Manual review
          </p>
        )}
      </SectionHeading>

      <div
        aria-label="Component states"
        className="mt-5 flex w-fit max-w-full overflow-x-auto rounded-md border border-white/[0.14] bg-[#0a0a0a] p-1"
        role="tablist"
      >
        {states.map((state) => (
          <button
            aria-controls={`state-panel-${state.id}`}
            aria-selected={activeState === state.id}
            className={[
              "rounded px-3 py-1.5 text-[13px] font-medium leading-5 transition-colors duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
              activeState === state.id
                ? "bg-white/[0.08] text-[#ededed]"
                : "text-[#8f8f8f] hover:bg-white/[0.055] hover:text-[#d4d4d4]"
            ].join(" ")}
            id={`state-tab-${state.id}`}
            key={state.id}
            onClick={() => selectState(state.id)}
            role="tab"
            type="button"
          >
            {state.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 min-[1500px]:grid-cols-[minmax(820px,1fr)_320px]">
        <div
          aria-labelledby={`state-tab-${activeItem.id}`}
          className={`${previewPanelClassName} flex min-h-[430px] min-w-0 items-center justify-center p-5 transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none`}
          id={`state-panel-${activeItem.id}`}
          key={activeItem.id}
          role="tabpanel"
        >
          <div className="max-w-full overflow-x-auto py-8">
            {renderPreview(activeItem.id, prefersReducedMotion)}
          </div>
        </div>
        <div className={`${panelClassName} p-4`}>
          <h4 className="text-[13px] font-medium leading-5 text-[#ededed]">
            {activeItem.label} notes
          </h4>
          <dl className="mt-4 space-y-4">
            {activeItem.notes.map(([term, description]) => (
              <div key={term}>
                <dt className="text-[12px] font-medium leading-5 text-[#737373]">
                  {term}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-[#a1a1a1]">
                  {description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export type ComponentTokenRow = {
  futureToken?: string;
  implementationValue: string;
  label: string;
  status: "approved" | "hardcoded" | "todo" | "pending";
};

const tokenStatusLabels: Record<ComponentTokenRow["status"], string> = {
  approved: "Approved token",
  hardcoded: "Prototype value",
  pending: "Pending approval",
  todo: "Token TODO"
};

export function ComponentTokensSection({
  description,
  tokens
}: {
  description: string;
  tokens: ComponentTokenRow[];
}) {
  return (
    <section id="tokens" className="scroll-mt-28 py-8">
      <SectionHeading description={description} title="Tokens" />
      <div className={`${panelClassName} mt-5 overflow-hidden`}>
        {tokens.map((token) => (
          <div
            className="grid gap-3 border-b border-white/[0.1] p-4 last:border-b-0 lg:grid-cols-[180px_150px_minmax(0,1fr)_minmax(0,1fr)]"
            key={`${token.label}-${token.implementationValue}`}
          >
            <div>
              <p className="text-[13px] font-medium leading-5 text-[#ededed]">
                {token.label}
              </p>
              <p className="mt-1 text-[12px] font-medium leading-5 text-[#737373]">
                {tokenStatusLabels[token.status]}
              </p>
            </div>
            <p className="font-mono text-[13px] leading-6 text-[#a1a1a1]">
              {token.implementationValue}
            </p>
            <p className="text-sm leading-6 text-[#a1a1a1]">
              {token.futureToken ?? "Token name pending approval."}
            </p>
            <p className="text-sm leading-6 text-[#a1a1a1]">
              {token.status === "approved"
                ? "Ready for implementation use."
                : "Map this implementation value to an approved token before product use."}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export type ComponentAccessibilityItem = {
  description: string;
  title: string;
};

export function ComponentAccessibilitySection({
  contrastNotes,
  focusBehaviour,
  keyboardBehaviour,
  reducedMotion,
  screenReaderNotes,
  unresolvedIssues
}: {
  contrastNotes: ComponentAccessibilityItem[];
  focusBehaviour: ComponentAccessibilityItem[];
  keyboardBehaviour: ComponentAccessibilityItem[];
  reducedMotion: ComponentAccessibilityItem[];
  screenReaderNotes: ComponentAccessibilityItem[];
  unresolvedIssues: ComponentAccessibilityItem[];
}) {
  const groups = [
    ["Keyboard behaviour", keyboardBehaviour],
    ["Focus behaviour", focusBehaviour],
    ["Screen reader notes", screenReaderNotes],
    ["Reduced motion", reducedMotion],
    ["Contrast notes", contrastNotes],
    ["Unresolved accessibility issues", unresolvedIssues]
  ] as const;

  return (
    <section id="accessibility" className="scroll-mt-28 py-8">
      <SectionHeading title="Accessibility" />
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {groups.map(([groupTitle, items]) => (
          <div className={`${panelClassName} p-4`} key={groupTitle}>
            <h4 className="text-[13px] font-medium leading-5 text-[#ededed]">
              {groupTitle}
            </h4>
            <dl className="mt-3 space-y-4">
              {items.map((item) => (
                <div key={item.title}>
                  <dt className="text-[12px] font-medium leading-5 text-[#737373]">
                    {item.title}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-[#a1a1a1]">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

export {
  defaultSectionItems as componentPageDefaultSections,
  usePrefersReducedMotion
};
