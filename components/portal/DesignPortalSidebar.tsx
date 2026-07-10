"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  portalNavigation,
  type PortalNavGroup,
  type PortalNavItem,
  type PortalNavSection
} from "@/lib/design-system/portal-navigation";

const SIDEBAR_EXPANDED_WIDTH = "304px";
const SIDEBAR_COLLAPSED_WIDTH = "76px";
const SIDEBAR_STORAGE_KEY = "playbooky.portal.sidebar.collapsed";

function itemIsActive(item: PortalNavItem, activeHref: string) {
  return item.href === activeHref;
}

function groupHasActiveChild(group: PortalNavGroup, activeHref: string) {
  return group.children.some((child) => itemIsActive(child, activeHref));
}

function sectionHasActiveChild(section: PortalNavSection, activeHref: string) {
  return Boolean(
    section.children?.some((child) => itemIsActive(child, activeHref)) ||
    section.groups?.some((group) => groupHasActiveChild(group, activeHref))
  );
}

function getActiveExpansion(activeHref: string): Record<string, boolean> {
  return Object.fromEntries(
    portalNavigation.flatMap((section) => [
      [section.id, sectionHasActiveChild(section, activeHref)],
      ...(section.groups?.map((group) => [
        group.id,
        groupHasActiveChild(group, activeHref)
      ]) ?? [])
    ])
  ) as Record<string, boolean>;
}

function IconBadge({ children }: { children: string }) {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/[0.06] text-[11px] font-semibold text-zinc-200 ring-1 ring-white/[0.06]">
      {children}
    </span>
  );
}

function SidebarLink({
  active,
  collapsed,
  item
}: {
  active?: boolean;
  collapsed: boolean;
  item: PortalNavItem;
}) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex min-h-8 items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium leading-5 transition-colors",
        active
          ? "bg-white/[0.08] text-white before:absolute before:left-0 before:top-1.5 before:h-5 before:w-px before:bg-sky-300"
          : "text-zinc-400 hover:bg-white/[0.055] hover:text-zinc-100",
        collapsed ? "justify-center px-1" : ""
      ].join(" ")}
      href={item.href}
      title={collapsed ? item.label : undefined}
    >
      {collapsed ? <IconBadge>{item.icon}</IconBadge> : null}
      <span className={collapsed ? "sr-only" : "truncate"}>{item.label}</span>
    </a>
  );
}

function CollapseChevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "text-zinc-500 transition-transform duration-200",
        open ? "rotate-90" : "rotate-0"
      ].join(" ")}
    >
      &gt;
    </span>
  );
}

function SidebarSection({
  activeHref,
  collapsed,
  expanded,
  expandedGroups,
  onGroupToggle,
  onToggle,
  section
}: {
  activeHref: string;
  collapsed: boolean;
  expanded: boolean;
  expandedGroups: Record<string, boolean>;
  onGroupToggle: (id: string) => void;
  onToggle: () => void;
  section: PortalNavSection;
}) {
  const active = sectionHasActiveChild(section, activeHref);

  if (collapsed) {
    return (
      <a
        aria-label={section.label}
        className={[
          "group relative mx-auto grid h-10 w-10 place-items-center rounded-lg text-sm font-semibold transition-colors",
          active
            ? "bg-white/[0.1] text-white"
            : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
        ].join(" ")}
        href={
          section.children?.find((item) => item.href)?.href ?? "/design-system"
        }
        title={section.label}
      >
        {section.icon}
        {active ? (
          <span className="absolute left-0 top-2 h-6 w-px bg-sky-300" />
        ) : null}
      </a>
    );
  }

  return (
    <section>
      <button
        aria-expanded={expanded}
        className={[
          "flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
          active
            ? "text-zinc-100"
            : "text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-300"
        ].join(" ")}
        onClick={onToggle}
        type="button"
      >
        <span>{section.label}</span>
        <CollapseChevron open={expanded} />
      </button>

      <div
        className={[
          "grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="mt-1 space-y-1 pl-1">
            {section.children?.map((item) => (
              <SidebarLink
                active={itemIsActive(item, activeHref)}
                collapsed={collapsed}
                item={item}
                key={item.href}
              />
            ))}

            {section.groups?.map((group) => {
              const groupOpen = expandedGroups[group.id];
              const groupActive = groupHasActiveChild(group, activeHref);

              return (
                <div className="pt-1" key={group.id}>
                  <button
                    aria-expanded={groupOpen}
                    className={[
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12px] font-medium transition-colors",
                      groupActive
                        ? "text-zinc-100"
                        : "text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-300"
                    ].join(" ")}
                    onClick={() => onGroupToggle(group.id)}
                    type="button"
                  >
                    <span>{group.label}</span>
                    <CollapseChevron open={groupOpen} />
                  </button>
                  <div
                    className={[
                      "grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none",
                      groupOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-3 space-y-1 border-l border-white/[0.07] py-1 pl-2">
                        {group.children.map((item) => (
                          <SidebarLink
                            active={itemIsActive(item, activeHref)}
                            collapsed={collapsed}
                            item={item}
                            key={item.href}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DesignPortalSidebar({ activeHref }: { activeHref?: string }) {
  const pathname = usePathname();
  const currentHref = activeHref ?? pathname;
  const [collapsed, setCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >(() => getActiveExpansion(currentHref));

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);

    if (stored) {
      setCollapsed(stored === "true");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
    document.documentElement.style.setProperty(
      "--portal-sidebar-width",
      collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH
    );
  }, [collapsed]);

  useEffect(() => {
    const activeExpansion = getActiveExpansion(currentHref);

    setExpandedFolders((current) => ({
      ...current,
      ...Object.fromEntries(
        Object.entries(activeExpansion).filter(([, isActive]) => isActive)
      )
    }));
  }, [currentHref]);

  const activeSection = useMemo(
    () =>
      portalNavigation.find((section) =>
        sectionHasActiveChild(section, currentHref)
      ),
    [currentHref]
  );

  return (
    <>
      <style>{`:root{--portal-sidebar-width:${SIDEBAR_EXPANDED_WIDTH};}`}</style>
      <aside
        className={[
          "portal-sidebar-scrollbar z-30 border-b border-white/[0.08] bg-[#111214] text-zinc-100 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r",
          collapsed ? "lg:w-[76px]" : "lg:w-[304px]"
        ].join(" ")}
      >
        <div className="flex min-h-full flex-col px-3 py-4">
          <div
            className={[
              "flex items-center gap-3",
              collapsed ? "justify-center" : "justify-between"
            ].join(" ")}
          >
            <a
              className={[
                "min-w-0 rounded-md text-left transition-colors hover:text-white",
                collapsed
                  ? "grid h-10 w-10 place-items-center bg-white/[0.06]"
                  : ""
              ].join(" ")}
              href="/design-system"
              title="PlayBooky Design Portal"
            >
              {collapsed ? (
                <span className="text-sm font-semibold">PB</span>
              ) : (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    PlayBooky
                  </p>
                  <h1 className="mt-1 truncate text-[15px] font-semibold text-zinc-100">
                    Design Portal
                  </h1>
                </>
              )}
            </a>
            <button
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-100"
              onClick={() => setCollapsed((current) => !current)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={[
                  "transition-transform duration-200",
                  collapsed ? "rotate-180" : ""
                ].join(" ")}
              >
                &lt;
              </span>
            </button>
          </div>

          {collapsed && activeSection ? (
            <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
              {activeSection.icon}
            </p>
          ) : null}

          <nav
            aria-label="Design Portal navigation"
            className={[
              "mt-6 flex-1",
              collapsed ? "space-y-2" : "space-y-4"
            ].join(" ")}
          >
            {portalNavigation.map((section) => (
              <SidebarSection
                activeHref={currentHref}
                collapsed={collapsed}
                expanded={expandedFolders[section.id]}
                expandedGroups={expandedFolders}
                key={section.id}
                onGroupToggle={(id) =>
                  setExpandedFolders((current) => ({
                    ...current,
                    [id]: !current[id]
                  }))
                }
                onToggle={() =>
                  setExpandedFolders((current) => ({
                    ...current,
                    [section.id]: !current[section.id]
                  }))
                }
                section={section}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
