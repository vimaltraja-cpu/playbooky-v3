"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SidebarItem = {
  badge?: string;
  href?: string;
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
      { badge: "Coming soon", label: "Foundations" },
      { badge: "Coming soon", label: "Colours" },
      { badge: "Coming soon", label: "Typography" },
      { badge: "Coming soon", label: "Layout" },
      { badge: "Coming soon", label: "Components" },
      { badge: "Coming soon", label: "Patterns" },
      { badge: "Coming soon", label: "Motion" },
      { badge: "Coming soon", label: "Rules" }
    ],
    groups: [
      {
        children: [
          { badge: "Coming soon", label: "Icons" },
          { badge: "Coming soon", label: "Illustrations" },
          { badge: "Coming soon", label: "Activity Illustrations" }
        ],
        id: "design-assets",
        label: "Assets"
      }
    ],
    id: "design-system",
    label: "Design System"
  },
  {
    children: [
      { href: "/design-system/product-system", label: "Overview" },
      { badge: "Coming soon", label: "Product Vision" },
      {
        href: "/design-system/product-system/architecture",
        label: "Product Architecture"
      },
      { badge: "Coming soon", label: "User Journey" },
      { badge: "Coming soon", label: "Diagnosis" },
      { badge: "Coming soon", label: "Decision" },
      { badge: "Coming soon", label: "Workshop" }
    ],
    groups: [
      {
        children: [
          {
            href: "/design-system/product-system/libraries/activity-library",
            label: "Activity Library"
          }
        ],
        id: "product-libraries",
        label: "Libraries"
      }
    ],
    id: "product-system",
    label: "Product System"
  },
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
        href: "/design-system/core-experience/recommendation-loading",
        label: "Recommendation Loading"
      },
      {
        href: "/design-system/core-experience/activity-card",
        label: "Activity Card"
      },
      { badge: "Coming soon", label: "Activity Grid" }
    ],
    id: "core-experience",
    label: "Core Experience"
  }
];

function itemIsActive(item: SidebarItem, activeHref: string) {
  return Boolean(item.href && item.href === activeHref);
}

function sidebarGroupHasActiveChild(group: SidebarGroup, activeHref: string) {
  return group.children.some((child) => itemIsActive(child, activeHref));
}

function sidebarFolderHasActiveChild(
  folder: SidebarFolder,
  activeHref: string
) {
  return Boolean(
    (folder.id === "design-system" && activeHref === "/design-system") ||
    folder.children?.some((child) => itemIsActive(child, activeHref)) ||
    folder.groups?.some((group) =>
      sidebarGroupHasActiveChild(group, activeHref)
    )
  );
}

function SidebarLink({
  active,
  item
}: {
  active?: boolean;
  item: SidebarItem;
}) {
  const baseClassName =
    "relative block rounded-[18px] px-3 py-[5px] text-[13px] font-medium leading-5 transition";
  const content = (
    <>
      <span>{item.label}</span>
      {item.badge ? (
        <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A89C8C]">
          {item.badge}
        </span>
      ) : null}
    </>
  );

  if (!item.href) {
    return (
      <span
        aria-disabled="true"
        className={`${baseClassName} cursor-not-allowed text-[#A9A094]`}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      aria-current={active ? "page" : undefined}
      className={[
        baseClassName,
        active
          ? "bg-white/45 pl-3.5 font-semibold text-[#7D5330] shadow-[inset_2px_0_0_#7D5330]"
          : "text-[#686156] hover:bg-white/65 hover:text-[#171614]"
      ].join(" ")}
      href={item.href}
    >
      {content}
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
                key={item.label}
                item={item}
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
                            key={item.label}
                            item={item}
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
        aria-label="Design Portal navigation"
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
