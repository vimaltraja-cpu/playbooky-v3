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
const SIDEBAR_TRANSITION = "duration-300 ease-[cubic-bezier(0.2,0,0,1)]";
const SYSTEM_ICON_PATH = "/assets/icons/system Icons";
const NAVIGATION_LOGO_PATH = "/assets/navigation-icons";

type OpenSection = "design-system" | "product-system" | "core-experience" | null;

const logoIconSrc = `${NAVIGATION_LOGO_PATH}/logo-Icon.svg`;
const logoWordmarkSrc = `${NAVIGATION_LOGO_PATH}/logo-word.svg`;

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

function getActiveSection(activeHref: string): OpenSection {
  const activeSection = portalNavigation.find((section) =>
    sectionHasActiveChild(section, activeHref)
  );

  return (activeSection?.id as OpenSection | undefined) ?? null;
}

function getActiveGroupExpansion(activeHref: string): Record<string, boolean> {
  return Object.fromEntries(
    portalNavigation.flatMap(
      (section) =>
        section.groups?.map((group) => [
          group.id,
          groupHasActiveChild(group, activeHref)
        ]) ?? []
    )
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

function SidebarToggleIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d={
          direction === "right"
            ? "M7.25 4.75 12.5 10l-5.25 5.25"
            : "M12.75 4.75 7.5 10l5.25 5.25"
        }
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
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
      className={collapsed ? "h-9 w-9" : "h-14 w-auto"}
      height={70}
      src={collapsed ? logoIconSrc : logoWordmarkSrc}
      width={72}
    />
  );
}

function Wordmark() {
  return (
    <div
      aria-label="PlayBooky Design Portal"
      className="grid min-w-0 place-items-start"
    >
      <LogoMark collapsed={false} />
    </div>
  );
}

function SidebarEdgeHandle({
  collapsed,
  onToggle
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <SidebarTooltip label={collapsed ? "Open sidebar" : "Close sidebar"}>
      <button
        aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
        className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.1] bg-[#17191d] text-zinc-300 shadow-[0_12px_28px_rgba(0,0,0,0.34)] transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] hover:border-white/[0.18] hover:bg-[#202328] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70 motion-reduce:transition-none"
        onClick={onToggle}
        type="button"
      >
        <SidebarToggleIcon direction={collapsed ? "right" : "left"} />
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
      <span className="grid w-5 shrink-0 place-items-center text-zinc-500 transition-colors group-hover:text-zinc-300 group-aria-[current=page]:text-zinc-200">
        <SystemIcon name={item.icon} />
      </span>
      <span className="truncate">{item.label}</span>
    </a>
  );
}

function CollapseChevron({ hidden, open }: { hidden?: boolean; open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "text-zinc-500 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
        open ? "rotate-90" : "rotate-0",
        hidden ? "opacity-0" : "opacity-100"
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
  onCollapsedOpen,
  onGroupToggle,
  onToggle,
  section
}: {
  activeHref: string;
  collapsed: boolean;
  expanded: boolean;
  expandedGroups: Record<string, boolean>;
  onCollapsedOpen: (id: OpenSection) => void;
  onGroupToggle: (id: string) => void;
  onToggle: () => void;
  section: PortalNavSection;
}) {
  const active = sectionHasActiveChild(section, activeHref);

  if (collapsed) {
    return (
      <SidebarTooltip label={section.label}>
        <button
          aria-label={section.label}
          aria-expanded={expanded}
          className={[
            "relative mx-auto grid h-11 w-11 place-items-center rounded-lg transition-colors",
            active
              ? "bg-white/[0.08]"
              : "hover:bg-white/[0.055] focus-visible:bg-white/[0.055]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
          ].join(" ")}
          onClick={() => onCollapsedOpen(section.id as OpenSection)}
          type="button"
        >
          <span
            className={[
              "grid h-5 w-5 place-items-center",
              active ? "text-zinc-100" : "text-zinc-400"
            ].join(" ")}
          >
            <SystemIcon name={section.icon} />
          </span>
          {active ? (
            <span className="absolute left-0 top-2.5 h-6 w-px bg-sky-300" />
          ) : null}
        </button>
      </SidebarTooltip>
    );
  }

  const sectionPanelId = `portal-section-${section.id}`;

  return (
    <section>
      <button
        aria-controls={sectionPanelId}
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
          <span className="grid w-5 shrink-0 place-items-center text-zinc-500">
            <SystemIcon name={section.icon} />
          </span>
          <span className="truncate">{section.label}</span>
        </span>
        <CollapseChevron open={expanded} />
      </button>

      <div
        id={sectionPanelId}
        className={[
          "grid transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
          expanded
            ? "translate-y-0 grid-rows-[1fr] opacity-100"
            : "-translate-y-1 grid-rows-[0fr] opacity-0"
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div
            className={[
              "mt-1 space-y-1 pl-1 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
              expanded ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            ].join(" ")}
          >
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
              const groupPanelId = `portal-group-${group.id}`;

              return (
                <div className="pt-1" key={group.id}>
                  <button
                    aria-controls={groupPanelId}
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
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="grid w-5 shrink-0 place-items-center text-zinc-500">
                        <SystemIcon name={group.icon} />
                      </span>
                      <span className="truncate">{group.label}</span>
                    </span>
                    <CollapseChevron open={groupOpen} />
                  </button>
                  <div
                    id={groupPanelId}
                    className={[
                      "grid transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                      groupOpen
                        ? "translate-y-0 grid-rows-[1fr] opacity-100"
                        : "-translate-y-1 grid-rows-[0fr] opacity-0"
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={[
                          "ml-3 space-y-1 border-l border-white/[0.07] py-1 pl-2 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                          groupOpen
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                        ].join(" ")}
                      >
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
  const [openSection, setOpenSection] = useState<OpenSection>(() =>
    getActiveSection(currentHref)
  );
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => getActiveGroupExpansion(currentHref)
  );

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
    const activeSection = getActiveSection(currentHref);
    const activeGroupExpansion = getActiveGroupExpansion(currentHref);

    setOpenSection(activeSection);
    setExpandedGroups((current) => ({
      ...current,
      ...Object.fromEntries(
        Object.entries(activeGroupExpansion).filter(([, isActive]) => isActive)
      )
    }));
  }, [currentHref]);

  return (
    <>
      <style>{`
        :root{--portal-sidebar-width:${SIDEBAR_EXPANDED_WIDTH};}
        @media (min-width:1024px){
          main > div{
            transition:grid-template-columns 280ms cubic-bezier(0.2,0,0,1);
          }
        }
        @media (prefers-reduced-motion:reduce){
          main > div{transition:none;}
        }
      `}</style>
      <div aria-hidden="true" className="hidden lg:block" />
      <aside
        className={[
          "portal-sidebar-scrollbar z-30 border-b border-white/[0.08] bg-[#111214] text-zinc-100 transition-[width] motion-reduce:transition-none lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r",
          SIDEBAR_TRANSITION,
          collapsed ? "lg:w-[76px]" : "lg:w-[304px]"
        ].join(" ")}
      >
        <div className="pointer-events-none fixed left-[var(--portal-sidebar-width)] top-1/2 z-50 hidden -translate-x-1/2 -translate-y-1/2 transition-[left] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none lg:block">
          <div className="pointer-events-auto">
            <SidebarEdgeHandle
              collapsed={collapsed}
              onToggle={() => setCollapsed((current) => !current)}
            />
          </div>
        </div>
        <div className="flex min-h-full flex-col px-3 py-4">
          <div
            className={[
              "grid min-h-14 items-center transition-[grid-template-columns] motion-reduce:transition-none",
              SIDEBAR_TRANSITION,
              collapsed ? "grid-cols-[1fr]" : "grid-cols-[minmax(0,1fr)]"
            ].join(" ")}
          >
            {collapsed ? (
              <div className="grid h-11 w-11 place-items-center">
                <LogoMark collapsed />
              </div>
            ) : (
              <Wordmark />
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
                expanded={openSection === section.id}
                expandedGroups={expandedGroups}
                key={section.id}
                onCollapsedOpen={(id) => {
                  setOpenSection(id);
                  setCollapsed(false);
                }}
                onGroupToggle={(id) =>
                  setExpandedGroups((current) => ({
                    ...current,
                    [id]: !current[id]
                  }))
                }
                onToggle={() =>
                  setOpenSection((current) =>
                    current === section.id ? null : (section.id as OpenSection)
                  )
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
