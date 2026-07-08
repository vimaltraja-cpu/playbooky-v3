const navigationItems = [
  "Foundations",
  "Layout",
  "Components",
  "Inputs",
  "AI Composer",
  "Patterns",
  "Motion",
  "Assets",
  "Rules"
];

const sections = [
  {
    title: "Foundations",
    description:
      "Color, type, spacing, radius, elevation, accessibility, and tone will live here."
  },
  {
    title: "Layout",
    description:
      "Responsive grids, page shells, navigation structures, and content rhythm will be defined here."
  },
  {
    title: "Components",
    description:
      "Approved component statuses, anatomy, variants, and usage guidance will be cataloged here."
  },
  {
    title: "Inputs",
    description:
      "Text Input, Textarea, and Search Input previews are ready for design review.",
    href: "/design-system/components/inputs"
  },
  {
    title: "AI Composer",
    description:
      "A prompt composer prototype is ready for visual approval before tokenization.",
    href: "/design-system/components/ai-composer"
  },
  {
    title: "Patterns",
    description:
      "Reusable interaction and workflow patterns will be documented before product screens are built."
  },
  {
    title: "Motion",
    description:
      "Timing, easing, transitions, loading behavior, and reduced-motion rules will be collected here."
  },
  {
    title: "Assets",
    description:
      "Logos, icons, illustrations, and motion assets will be governed here once approved."
  },
  {
    title: "Rules",
    description:
      "AI build rules, source-of-truth constraints, and product usage requirements will be maintained here."
  }
];

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen px-4 py-4 text-[color:var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl grid-cols-1 overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-[color:var(--panel)] shadow-[0_30px_90px_rgba(36,31,24,0.12)] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[color:var(--line)] bg-[color:var(--panel-soft)]/70 p-5 lg:border-b-0 lg:border-r lg:p-7">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                PlayBooky V3
              </p>
              <h1 className="mt-2 text-xl font-semibold tracking-normal">
                Design Portal
              </h1>
            </div>
            <div className="rounded-full border border-[color:var(--line)] px-3 py-1 text-xs font-medium text-[color:var(--muted)] lg:mt-6 lg:inline-block">
              Foundation
            </div>
          </div>

          <nav
            className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:flex-col lg:overflow-visible lg:pb-0"
            aria-label="Design system sections"
          >
            {navigationItems.map((item) => (
              <a
                key={item}
                href={
                  item === "Inputs" || item === "AI Composer"
                    ? item === "Inputs"
                      ? "/design-system/components/inputs"
                      : "/design-system/components/ai-composer"
                    : `#${item.toLowerCase()}`
                }
                className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-[color:var(--muted)] transition hover:bg-[color:var(--panel)] hover:text-[color:var(--foreground)] lg:rounded-xl"
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <section className="p-6 sm:p-8 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
              Source of truth
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
              PlayBooky Design Portal
            </h2>
            <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
              A calm, structured home for the foundations, rules, and approved
              system decisions that will shape every future PlayBooky product
              surface.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <article
                key={section.title}
                id={section.title.toLowerCase()}
                className="min-h-48 rounded-2xl border border-[color:var(--line)] bg-white/55 p-6 shadow-[0_18px_45px_rgba(36,31,24,0.06)]"
              >
                <div className="mb-8 h-1.5 w-12 rounded-full bg-[color:var(--accent)]" />
                <h3 className="text-xl font-semibold tracking-normal">
                  {section.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                  {section.description}
                </p>
                {"href" in section && (
                  <a
                    href={section.href}
                    className="mt-6 inline-flex rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--panel)]"
                  >
                    {"title" in section && section.title === "Inputs"
                      ? "Review inputs"
                      : "Review component"}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
