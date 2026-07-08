import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";

const livePages = [
  {
    description:
      "Reusable component documentation structure, visual approval patterns, and shared system navigation.",
    href: "/design-system/components/ai-composer",
    label: "AI Composer",
    section: "Core Experience"
  },
  {
    description:
      "Approved diagnosis card anatomy, icon usage, responsive behaviour, and accessibility notes.",
    href: "/design-system/core-experience/diagnosis-card",
    label: "Diagnosis Card",
    section: "Core Experience"
  },
  {
    description:
      "Diagnosis card collections, responsive grid behaviour, and product preview states.",
    href: "/design-system/core-experience/diagnosis-grid",
    label: "Diagnosis Grid",
    section: "Core Experience"
  },
  {
    description:
      "The analysing state between diagnosis and recommendations, including its loading sequence.",
    href: "/design-system/core-experience/recommendation-loading",
    label: "Recommendation Loading",
    section: "Core Experience"
  },
  {
    description:
      "Activity card structure, visual states, and usage guidance for workshop recommendations.",
    href: "/design-system/core-experience/activity-card",
    label: "Activity Card",
    section: "Core Experience"
  },
  {
    description:
      "Product operating model, architecture references, and library ownership for PlayBooky.",
    href: "/design-system/product-system",
    label: "Product System Overview",
    section: "Product System"
  }
];

const pendingAreas = [
  "Foundations",
  "Colours",
  "Typography",
  "Layout",
  "Components",
  "Patterns",
  "Motion",
  "Rules",
  "Icons",
  "Illustrations",
  "Activity Illustrations"
];

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system" />

        <section className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <header className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                Source of truth
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
                PlayBooky Design Portal
              </h2>
              <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                One shared portal shell for the design system, product system,
                and core experience documentation. Built pages are linked in the
                sidebar; planned pages remain visible without sending people to
                unfinished routes.
              </p>
            </header>

            <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section aria-labelledby="available-pages-heading">
                <h3
                  className="text-2xl font-semibold tracking-normal"
                  id="available-pages-heading"
                >
                  Available pages
                </h3>
                <div className="mt-7 divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
                  {livePages.map((page) => (
                    <a
                      className="group grid gap-3 py-6 transition hover:bg-white/45 sm:grid-cols-[180px_minmax(0,1fr)] sm:px-4"
                      href={page.href}
                      key={page.href}
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                          {page.section}
                        </p>
                        <h4 className="mt-2 text-lg font-semibold text-[color:var(--foreground)] group-hover:text-[#7D5330]">
                          {page.label}
                        </h4>
                      </div>
                      <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
                        {page.description}
                      </p>
                    </a>
                  ))}
                </div>
              </section>

              <aside aria-labelledby="pending-areas-heading">
                <h3
                  className="text-2xl font-semibold tracking-normal"
                  id="pending-areas-heading"
                >
                  Not yet implemented
                </h3>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                  These areas are present in the navigation structure but remain
                  disabled until their portal pages are ready.
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {pendingAreas.map((area) => (
                    <li
                      className="rounded-full border border-[color:var(--line)] bg-white/45 px-3 py-1.5 text-xs font-semibold text-[#8F8578]"
                      key={area}
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
