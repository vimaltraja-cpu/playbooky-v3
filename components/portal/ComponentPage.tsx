"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ViewportReviewLayout } from "@/components/portal/ViewportReviewLayout";

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
  { id: "viewports", label: "Viewport" },
  { id: "states", label: "States" },
  { id: "specs", label: "Specs" },
  { id: "tokens", label: "Tokens" },
  { id: "accessibility", label: "Accessibility" }
];

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
      className="sticky top-0 z-20 -mx-5 mt-8 flex justify-center border-y border-[color:var(--line)] bg-[color:var(--background)]/88 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
    >
      <div className="relative mx-auto inline-flex max-w-full gap-2 overflow-x-auto rounded-full border border-[color:var(--line)] bg-white/60 p-1 shadow-[0_12px_34px_rgba(36,31,24,0.06)]">
        <span
          aria-hidden="true"
          className="absolute bottom-1 top-1 rounded-full bg-[#7D5330] shadow-[0_12px_28px_rgba(125,83,48,0.24)] transition-[transform,width] duration-[320ms] ease-[cubic-bezier(0.2,0,0,1)] will-change-[transform,width] motion-reduce:transition-none"
          style={{
            transform: `translateX(${indicator.left - 4}px)`,
            width: indicator.width
          }}
        />
        {items.map((item) => {
          const isActive = activeSection === item.id;
          const href = item.id === "overview" ? "#" : `#${item.id}`;

          return (
            <a
              aria-current={isActive ? "location" : undefined}
              className={[
                "relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-[320ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                isActive
                  ? "!text-[#FCFBF9]"
                  : "!text-[#171614] hover:bg-[#EFE3D2]/60"
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
              {item.label}
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
    <section className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
            {metadata.category}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
            {metadata.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            {description}
          </p>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Status", metadata.status],
              ["Confidence", metadata.confidence],
              ["Owner", metadata.owner],
              ["Last updated", metadata.lastUpdated]
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                  {term}
                </dt>
                <dd className="mt-1 font-medium text-[color:var(--foreground)]">
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
    <section id="overview" className="scroll-mt-40 py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h3 className="text-3xl font-semibold">Overview</h3>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[color:var(--muted)]">
            {summary}
          </p>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            {overviewItems.map(([term, description]) => (
              <div key={term}>
                <dt className="text-sm font-semibold text-[color:var(--foreground)]">
                  {term}
                </dt>
                <dd className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  {description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {statusNote ? (
          <aside className="h-fit border-l-4 border-[#D99C56] py-2 pl-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
              Status
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
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
  renderPreview,
  title = "Viewport",
  viewports
}: {
  description: string;
  renderPreview: (viewport: Viewport) => ReactNode;
  title?: string;
  viewports: Array<ViewportShowroomItem<Viewport>>;
}) {
  return (
    <ViewportReviewLayout
      description={description}
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
    <section id="states" className="scroll-mt-40 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            {description}
          </p>
        </div>
        {autoplayEnabled ? (
          <p
            aria-live="polite"
            className="text-sm font-medium text-[color:var(--muted)]"
          >
            {autoplay ? "Auto-playing showroom" : "Autoplay paused"}
          </p>
        ) : (
          <p className="text-sm font-medium text-[color:var(--muted)]">
            Manual review
          </p>
        )}
      </div>

      <div
        aria-label="Component states"
        className="mt-6 flex w-fit max-w-full rounded-full border border-[color:var(--line)] bg-white/65 p-1"
        role="tablist"
      >
        {states.map((state) => (
          <button
            aria-controls={`state-panel-${state.id}`}
            aria-selected={activeState === state.id}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
              activeState === state.id
                ? "bg-[#7D5330] !text-[#FCFBF9] shadow-[0_10px_24px_rgba(125,83,48,0.18)]"
                : "!text-[#171614] hover:bg-[#EFE3D2]/60"
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

      <div className="mt-6 grid gap-5 min-[1500px]:grid-cols-[minmax(820px,1fr)_320px]">
        <div
          aria-labelledby={`state-tab-${activeItem.id}`}
          className="flex min-h-[430px] min-w-0 items-center justify-center rounded-[28px] border border-[color:var(--line)] bg-[#F4F0EA] p-6 transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
          id={`state-panel-${activeItem.id}`}
          key={activeItem.id}
          role="tabpanel"
        >
          <div className="max-w-full overflow-x-auto py-8">
            {renderPreview(activeItem.id, prefersReducedMotion)}
          </div>
        </div>
        <div className="rounded-[24px] border border-[color:var(--line)] bg-white/55 p-5">
          <h4 className="text-sm font-semibold">{activeItem.label} notes</h4>
          <dl className="mt-5 space-y-4">
            {activeItem.notes.map(([term, description]) => (
              <div key={term}>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                  {term}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
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
    <section id="tokens" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Tokens</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
        {description}
      </p>
      <div className="mt-5 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white/55">
        {tokens.map((token) => (
          <div
            className="grid gap-3 border-b border-[color:var(--line)] p-4 last:border-b-0 lg:grid-cols-[180px_150px_minmax(0,1fr)_minmax(0,1fr)]"
            key={`${token.label}-${token.implementationValue}`}
          >
            <div>
              <p className="text-sm font-semibold text-[color:var(--foreground)]">
                {token.label}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--gold)]">
                {tokenStatusLabels[token.status]}
              </p>
            </div>
            <p className="font-mono text-sm text-[color:var(--muted)]">
              {token.implementationValue}
            </p>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              {token.futureToken ?? "Token name pending approval."}
            </p>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
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
    <section id="accessibility" className="scroll-mt-40 py-10">
      <h3 className="text-2xl font-semibold">Accessibility</h3>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {groups.map(([groupTitle, items]) => (
          <div key={groupTitle}>
            <h4 className="text-sm font-semibold text-[color:var(--foreground)]">
              {groupTitle}
            </h4>
            <dl className="mt-3 space-y-4">
              {items.map((item) => (
                <div key={item.title}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                    {item.title}
                  </dt>
                  <dd className="mt-1 text-sm leading-7 text-[color:var(--muted)]">
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
