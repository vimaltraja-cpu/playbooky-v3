"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SidebarItem = {
  href: string;
  label: string;
};

type SidebarGroup = {
  children: SidebarItem[];
  id: string;
  label: string;
};

type SidebarFolder = {
  children?: SidebarItem[];
  groups?: SidebarGroup[];
  id: string;
  label: string;
};

const sidebarFolders: SidebarFolder[] = [
  {
    children: [
      { href: "#", label: "Overview" },
      { href: "#", label: "Primitive tokens" },
      { href: "#", label: "Semantic tokens" }
    ],
    id: "foundations",
    label: "Foundations"
  },
  {
    children: [
      { href: "#", label: "Colour tokens" },
      { href: "#", label: "Accessibility" },
      { href: "#", label: "Usage" }
    ],
    id: "colours",
    label: "Colours"
  },
  {
    children: [
      { href: "#", label: "Type scale" },
      { href: "#", label: "Weights" },
      { href: "#", label: "Line height" }
    ],
    id: "typography",
    label: "Typography"
  },
  {
    groups: [
      {
        children: [
          {
            href: "/design-system/components/ai-composer",
            label: "AI Composer"
          },
          {
            href: "/design-system/core-experience/diagnosis-card",
            label: "Diagnosis Card"
          },
          {
            href: "/design-system/core-experience/diagnosis-grid",
            label: "Diagnosis Grid"
          },
          {
            href: "/design-system/core-experience/recommendation-deck",
            label: "Recommendation Deck"
          },
          {
            href: "/design-system/core-experience/recommendation-loading",
            label: "Recommendation Loading"
          },
          {
            href: "/design-system/core-experience/activity-card",
            label: "Activity Card"
          },
          {
            href: "/design-system/core-experience/activity-modal",
            label: "Activity Modal"
          }
        ],
        id: "core-experience",
        label: "Core Experience"
      },
      {
        children: [
          {
            href: "/design-system/workspace/builder-grid",
            label: "Builder Grid"
          },
          {
            href: "/design-system/workspace/drag-handle",
            label: "Drag Handle"
          },
          { href: "/design-system/workspace/drop-zone", label: "Drop Zone" },
          { href: "/design-system/workspace/toolbar", label: "Toolbar" },
          { href: "/design-system/workspace/selection", label: "Selection" }
        ],
        id: "workspace",
        label: "Workspace"
      },
      {
        children: [
          { href: "/design-system/navigation/header", label: "Header" },
          { href: "/design-system/navigation/sidebar", label: "Sidebar" },
          { href: "/design-system/navigation/tabs", label: "Tabs" },
          {
            href: "/design-system/navigation/breadcrumbs",
            label: "Breadcrumbs"
          },
          { href: "/design-system/navigation/menu", label: "Menu" }
        ],
        id: "navigation",
        label: "Navigation"
      },
      {
        children: [
          { href: "/design-system/feedback/loading", label: "Loading" },
          { href: "/design-system/feedback/progress", label: "Progress" },
          { href: "/design-system/feedback/empty-state", label: "Empty State" },
          { href: "/design-system/feedback/alert", label: "Alert" },
          { href: "/design-system/feedback/toast", label: "Toast" }
        ],
        id: "feedback",
        label: "Feedback"
      },
      {
        children: [
          { href: "/design-system/overlays/modal", label: "Modal" },
          { href: "/design-system/overlays/drawer", label: "Drawer" },
          { href: "/design-system/overlays/popover", label: "Popover" },
          { href: "/design-system/overlays/tooltip", label: "Tooltip" },
          {
            href: "/design-system/overlays/bottom-sheet",
            label: "Bottom Sheet"
          }
        ],
        id: "overlays",
        label: "Overlays"
      },
      {
        children: [
          { href: "/design-system/components/inputs", label: "Search Input" },
          { href: "/design-system/components/inputs", label: "Text Input" },
          { href: "/design-system/components/inputs", label: "Textarea" },
          { href: "/design-system/utilities/select", label: "Select" },
          { href: "/design-system/utilities/checkbox", label: "Checkbox" },
          { href: "/design-system/utilities/radio", label: "Radio" },
          { href: "/design-system/utilities/switch", label: "Switch" }
        ],
        id: "utilities",
        label: "Utilities"
      }
    ],
    id: "components",
    label: "Components"
  },
  {
    children: [
      { href: "#", label: "Recommendation" },
      { href: "#", label: "Diagnosis" },
      { href: "#", label: "Builder" }
    ],
    id: "patterns",
    label: "Patterns"
  },
  {
    children: [
      { href: "#", label: "Icons" },
      { href: "#", label: "Illustrations" },
      { href: "#", label: "Logos" }
    ],
    id: "assets",
    label: "Assets"
  }
];

function itemIsActive(item: SidebarItem, activeHref: string) {
  return item.href === activeHref;
}

function sidebarGroupHasActiveChild(group: SidebarGroup, activeHref: string) {
  return group.children.some((child) => itemIsActive(child, activeHref));
}

function sidebarFolderHasActiveChild(
  folder: SidebarFolder,
  activeHref: string
) {
  return Boolean(
    folder.children?.some((child) => itemIsActive(child, activeHref)) ||
    folder.groups?.some((group) =>
      sidebarGroupHasActiveChild(group, activeHref)
    )
  );
}

function SidebarLink({
  active,
  href = "#",
  label
}: {
  active?: boolean;
  href?: string;
  label: string;
}) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={[
        "relative block rounded-[18px] px-3 py-[5px] text-[13px] font-medium leading-5 transition",
        active
          ? "bg-white/45 pl-3.5 font-semibold text-[#7D5330] shadow-[inset_2px_0_0_#7D5330]"
          : "text-[#686156] hover:bg-white/65 hover:text-[#171614]"
      ].join(" ")}
      href={href}
    >
      {label}
    </a>
  );
}

function SidebarFolderView({
  activeHref,
  expandedFolders,
  folder,
  isOpen,
  onGroupToggle,
  onToggle
}: {
  activeHref: string;
  expandedFolders: Record<string, boolean>;
  folder: SidebarFolder;
  isOpen: boolean;
  onGroupToggle: (id: string) => void;
  onToggle: () => void;
}) {
  const hasActiveChild = sidebarFolderHasActiveChild(folder, activeHref);

  return (
    <section
      className={[
        "rounded-2xl transition-colors",
        hasActiveChild
          ? "bg-[#FBF6ED] p-1 shadow-[inset_0_0_0_1px_rgba(125,83,48,0.08)]"
          : ""
      ].join(" ")}
    >
      <button
        aria-expanded={isOpen}
        className={[
          "flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-1.5 text-left transition hover:bg-white/55",
          hasActiveChild ? "text-[#7D5330]" : ""
        ].join(" ")}
        onClick={onToggle}
        type="button"
      >
        <span
          className={[
            "text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]",
            hasActiveChild ? "!text-[#7D5330]" : ""
          ].join(" ")}
        >
          {folder.label}
        </span>
        <span
          aria-hidden="true"
          className={[
            "grid h-5 w-5 place-items-center rounded-full text-[#9A9287] transition duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
            isOpen ? "rotate-90 text-[#7D5330]" : "rotate-0"
          ].join(" ")}
        >
          ›
        </span>
      </button>
      <div
        className={[
          "grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div
            className={[
              "mt-1 pb-1.5",
              folder.groups
                ? "ml-2 space-y-1 border-l border-[#E6D8C4] pl-2"
                : "space-y-0.5 pl-2"
            ].join(" ")}
          >
            {folder.children?.map((item) => (
              <SidebarLink
                active={itemIsActive(item, activeHref)}
                href={item.href}
                key={item.label}
                label={item.label}
              />
            ))}
            {folder.groups?.map((group) => {
              const groupIsOpen = expandedFolders[group.id];
              const groupIsActive = sidebarGroupHasActiveChild(
                group,
                activeHref
              );

              return (
                <div key={group.id}>
                  <button
                    aria-expanded={groupIsOpen}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-[5px] text-left text-[13.5px] font-semibold leading-5 transition hover:bg-white/55",
                      groupIsActive
                        ? "bg-white/45 text-[#7D5330]"
                        : "text-[#2C2924]"
                    ].join(" ")}
                    onClick={() => onGroupToggle(group.id)}
                    type="button"
                  >
                    <span>{group.label}</span>
                    <span
                      aria-hidden="true"
                      className={[
                        "grid h-5 w-5 place-items-center rounded-full text-[#9A9287] transition duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                        groupIsOpen ? "rotate-90 text-[#7D5330]" : "rotate-0"
                      ].join(" ")}
                    >
                      ›
                    </span>
                  </button>
                  <div
                    className={[
                      "grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
                      groupIsOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-2 space-y-[2px] border-l border-[#E9DDCB] pb-1 pl-2.5">
                        {group.children.map((item) => (
                          <SidebarLink
                            active={itemIsActive(item, activeHref)}
                            href={item.href}
                            key={item.label}
                            label={item.label}
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

function getActiveExpansion(activeHref: string): Record<string, boolean> {
  return Object.fromEntries(
    sidebarFolders.flatMap((folder) => [
      [folder.id, sidebarFolderHasActiveChild(folder, activeHref)],
      ...(folder.groups?.map((group) => [
        group.id,
        sidebarGroupHasActiveChild(group, activeHref)
      ]) ?? [])
    ])
  ) as Record<string, boolean>;
}

export function DesignPortalSidebar({ activeHref }: { activeHref?: string }) {
  const pathname = usePathname();
  const currentHref = activeHref ?? pathname;
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >(() => getActiveExpansion(currentHref));

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
    <aside className="portal-sidebar-scrollbar z-30 border-b border-[#E4DCCE] bg-[#FFFCF7]/96 px-5 py-5 font-sans backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-6 lg:py-6">
      <a
        href="/design-system"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]"
      >
        PlayBooky V3
      </a>
      <h1 className="mt-2 text-xl font-semibold">Design Portal</h1>

      <nav
        aria-label="Design system component library"
        className="mt-7 flex gap-3 overflow-x-auto pb-2 lg:block lg:space-y-2.5 lg:overflow-visible lg:pb-0"
      >
        {sidebarFolders.map((folder) => (
          <div className="min-w-[220px] lg:min-w-0" key={folder.id}>
            <SidebarFolderView
              activeHref={currentHref}
              expandedFolders={expandedFolders}
              folder={folder}
              isOpen={expandedFolders[folder.id]}
              onGroupToggle={(id) => {
                const group = folder.groups?.find(
                  (candidate) => candidate.id === id
                );

                if (group && sidebarGroupHasActiveChild(group, currentHref)) {
                  return;
                }

                setExpandedFolders((current) => ({
                  ...current,
                  [id]: !current[id]
                }));
              }}
              onToggle={() => {
                if (sidebarFolderHasActiveChild(folder, currentHref)) {
                  return;
                }

                setExpandedFolders((current) => ({
                  ...current,
                  [folder.id]: !current[folder.id]
                }));
              }}
            />
          </div>
        ))}
      </nav>
    </aside>
  );
}
