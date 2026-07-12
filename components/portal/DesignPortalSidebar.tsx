"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
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
const NAVIGATION_ICON_PATH = "/assets/navigation-icons";

const sectionIconSrcById: Record<string, string> = {
  "core-experience": `${NAVIGATION_ICON_PATH}/core-experience.svg`,
  "design-system": `${NAVIGATION_ICON_PATH}/deisgn-system.svg`,
  "product-system": `${NAVIGATION_ICON_PATH}/product-system.svg`
};

const logoIconSrc = `${NAVIGATION_ICON_PATH}/logo-Icon.svg`;
const logoWordmarkSrc = `${NAVIGATION_ICON_PATH}/logo-word.svg`;

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

function SidebarTooltip({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <span className="group relative grid place-items-center">
      {children}
      <span
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/[0.08] bg-[#1d1f23] px-2.5 py-1.5 text-xs font-medium text-zinc-100 opacity-0 shadow-[0_12px_32px_rgba(0,0,0,0.32)] transition-opacity delay-300 duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        role="tooltip"
      >
        {label}
      </span>
    </span>
  );
}

function SectionIcon({ section }: { section: PortalNavSection }) {
  const src = sectionIconSrcById[section.id];

  if (!src) {
    return null;
  }

  return (
    <Image
      alt=""
      aria-hidden="true"
      className="h-6 w-6 shrink-0"
      height={70}
      src={src}
      width={72}
    />
  );
}

function SidebarToggleIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d={
          open
            ? "M7.25 4.75 12.5 10l-5.25 5.25"
            : "M12.75 4.75 7.5 10l5.25 5.25"
        }
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d={open ? "M4.75 4.5v11" : "M15.25 4.5v11"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function LogoMark({ collapsed }: { collapsed: boolean }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={collapsed ? "h-9 w-9" : "h-10 w-10"}
      height={70}
      src={collapsed ? logoIconSrc : logoWordmarkSrc}
      width={72}
    />
  );
}

function LogoLink() {
  return (
    <a
      aria-label="PlayBooky Design Portal"
      className="grid h-10 w-10 place-items-center rounded-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
      href="/design-system"
    >
      <LogoMark collapsed={false} />
    </a>
  );
}

function OpenSidebarButton({ onOpen }: { onOpen: () => void }) {
  return (
    <SidebarTooltip label="Open sidebar">
      <button
        aria-label="Open sidebar"
        className="grid h-11 w-11 place-items-center rounded-lg text-zinc-100 transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
        onClick={onOpen}
        type="button"
      >
        <LogoMark collapsed />
      </button>
    </SidebarTooltip>
  );
}

function CloseSidebarButton({ onClose }: { onClose: () => void }) {
  return (
    <SidebarTooltip label="Close sidebar">
      <button
        aria-label="Close sidebar"
        className="grid h-8 w-8 place-items-center rounded-md text-zinc-500 transition-colors hover:bg-white/[0.055] hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
        onClick={onClose}
        type="button"
      >
        <SidebarToggleIcon open={false} />
      </button>
    </SidebarTooltip>
  );
}

function SidebarLink({
  active,
  item
}: {
  active?: boolean;
  item: PortalNavItem;
}) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex min-h-8 items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium leading-5 transition-colors",
        active
          ? "bg-white/[0.08] text-white before:absolute before:left-0 before:top-1.5 before:h-5 before:w-px before:bg-sky-300"
          : "text-zinc-400 hover:bg-white/[0.055] hover:text-zinc-100"
      ].join(" ")}
      href={item.href}
    >
      <span className="truncate">{item.label}</span>
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
      <SidebarTooltip label={section.label}>
        <a
          aria-label={section.label}
          aria-current={active ? "page" : undefined}
          className={[
            "relative mx-auto grid h-11 w-11 place-items-center rounded-lg transition-colors",
            active
              ? "bg-white/[0.08]"
              : "hover:bg-white/[0.055] focus-visible:bg-white/[0.055]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
          ].join(" ")}
          href={
            section.children?.find((item) => item.href)?.href ??
            "/design-system"
          }
        >
          <SectionIcon section={section} />
          {active ? (
            <span className="absolute left-0 top-2.5 h-6 w-px bg-sky-300" />
          ) : null}
        </a>
      </SidebarTooltip>
    );
  }

  return (
    <section>
      <button
        aria-expanded={expanded}
        className={[
          "flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-[12px] font-medium transition-colors",
          active
            ? "text-zinc-100"
            : "text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-300"
        ].join(" ")}
        onClick={onToggle}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <SectionIcon section={section} />
          <span className="truncate">{section.label}</span>
        </span>
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

  return (
    <>
      <style>{`:root{--portal-sidebar-width:${SIDEBAR_EXPANDED_WIDTH};}`}</style>
      <div aria-hidden="true" className="hidden lg:block" />
      <aside
        className={[
          "portal-sidebar-scrollbar z-30 border-b border-white/[0.08] bg-[#111214] text-zinc-100 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r",
          collapsed ? "lg:w-[76px]" : "lg:w-[304px]"
        ].join(" ")}
      >
        <div className="flex min-h-full flex-col px-3 py-4">
          <div className={collapsed ? "flex justify-center" : "flex items-center justify-between gap-3"}>
            {collapsed ? (
              <OpenSidebarButton onOpen={() => setCollapsed(false)} />
            ) : (
              <>
                <LogoLink />
                <CloseSidebarButton onClose={() => setCollapsed(true)} />
              </>
            )}
          </div>

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
