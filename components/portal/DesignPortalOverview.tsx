"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PortalPageEntry } from "@/lib/design-system/portal-navigation";

const SYSTEM_ICON_PATH = "/assets/icons/system Icons";

const dashboardSections = [
  {
    id: "core-experience",
    title: "Core Experience"
  },
  {
    id: "components",
    title: "Components"
  },
  {
    id: "product-system",
    title: "Product System"
  },
  {
    id: "ai-tools",
    title: "AI & Tools"
  },
  {
    id: "documentation",
    title: "Documentation"
  }
] as const;

function SystemIcon({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="block h-[18px] w-[18px] shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:18px_18px]"
      style={{
        WebkitMaskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`,
        maskImage: `url("${SYSTEM_ICON_PATH}/${name}.svg")`
      }}
    />
  );
}

function matchesSearch(page: PortalPageEntry, query: string) {
  if (!query) {
    return true;
  }

  const searchableText = [
    page.title,
    page.category,
    page.description,
    getDashboardSectionId(page),
    ...(page.keywords ?? [])
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
}

function getDashboardSectionId(page: PortalPageEntry) {
  if (page.href === "/design-system") {
    return "documentation";
  }

  if (
    page.href === "/design-system/components/ai-composer" ||
    page.href === "/design-system/product-system/workshop/generated-flow"
  ) {
    return "ai-tools";
  }

  if (page.category === "Components") {
    return "components";
  }

  if (page.category === "Product System") {
    return "product-system";
  }

  return "core-experience";
}

function groupPagesByDashboardSection(pages: PortalPageEntry[]) {
  return pages.reduce<Record<string, PortalPageEntry[]>>((groups, page) => {
    const sectionId = getDashboardSectionId(page);
    groups[sectionId] = [...(groups[sectionId] ?? []), page];
    return groups;
  }, {});
}

export function DesignPortalOverview({
  pages
}: {
  pages: PortalPageEntry[];
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => {
      const inputValue = searchInputRef.current?.value ?? "";
      setSearchQuery((currentValue) =>
        currentValue === inputValue ? currentValue : inputValue
      );
    }, 150);

    return () => window.clearInterval(interval);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPages = useMemo(
    () => pages.filter((page) => matchesSearch(page, normalizedQuery)),
    [normalizedQuery, pages]
  );
  const groupedPagesBySection = useMemo(
    () => groupPagesByDashboardSection(filteredPages),
    [filteredPages]
  );
  const visibleSections = useMemo(
    () => dashboardSections.filter((section) => groupedPagesBySection[section.id]?.length),
    [groupedPagesBySection]
  );

  return (
    <div className="w-full">
      <label className="relative block" htmlFor="portal-page-search">
        <span className="pointer-events-none absolute left-4 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center text-[#737373]">
          <SystemIcon name="search" />
        </span>
        <input
          className="h-11 w-full rounded-lg border border-white/[0.14] bg-[#0a0a0a] pl-11 pr-4 text-sm font-medium text-[#ededed] outline-none transition-[background-color,border-color] placeholder:text-[#737373] hover:border-white/[0.22] focus:border-white/[0.3]"
          id="portal-page-search"
          onChange={(event) => setSearchQuery(event.target.value)}
          onInput={(event) =>
            setSearchQuery((event.target as HTMLInputElement).value)
          }
          placeholder="Search pages"
          ref={searchInputRef}
          type="search"
          value={searchQuery}
        />
      </label>

      <section aria-labelledby="available-pages-heading" className="mt-8">
        <h2
          className="text-sm font-medium leading-5 text-[#ededed]"
          id="available-pages-heading"
        >
          Available pages
        </h2>

        {filteredPages.length ? (
          <div className="mt-6 space-y-10">
            {visibleSections.map((section) => (
              <section
                aria-labelledby={`portal-section-${section.id}`}
                key={section.id}
              >
                <h3
                  className="text-[13px] font-medium leading-5 text-[#d4d4d4]"
                  id={`portal-section-${section.id}`}
                >
                  {section.title}
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:gap-6 2xl:grid-cols-3">
                  {groupedPagesBySection[section.id].map((page) => (
                    <a
                      className="group flex min-h-[180px] flex-col rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-5 text-[#ededed] transition-[background-color,border-color,transform] hover:-translate-y-px hover:border-white/[0.24] hover:bg-[#0e0e0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
                      href={page.href}
                      key={page.href}
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/[0.1] bg-white/[0.03] text-[#8f8f8f] transition-colors group-hover:text-[#d4d4d4]">
                            <SystemIcon name={page.icon} />
                          </span>
                          <span className="truncate text-[15px] font-semibold leading-5 text-[#f5f5f5]">
                            {page.title}
                          </span>
                        </span>
                        <span className="grid h-5 w-5 shrink-0 place-items-center text-[#626262] transition-colors group-hover:text-[#a1a1a1]">
                          <SystemIcon name="arrow-up-right" />
                        </span>
                      </span>

                      <span className="mt-5 inline-flex h-[22px] w-fit items-center rounded-full border border-white/[0.09] bg-white/[0.025] px-2 text-[11px] font-medium leading-none text-[#858585]">
                        {page.category}
                      </span>

                      <p className="mt-4 max-w-[58ch] overflow-hidden text-sm leading-6 text-[#a1a1a1] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                        {page.description}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex min-h-[172px] items-center rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/[0.1] bg-white/[0.03] text-[#737373]">
                <SystemIcon name="search" />
              </span>
              <div>
                <p className="text-sm font-medium leading-5 text-[#ededed]">
                  No pages found
                </p>
                <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">
                  Try searching for another page, component or pattern.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
