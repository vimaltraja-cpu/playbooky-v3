import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";

const pipeline = [
  "Challenge",
  "Diagnosis Questions",
  "Diagnosis Engine",
  "Decision Engine",
  "Framework Library",
  "Workshop Types",
  "Activity Library",
  "Prompt Library",
  "Workshop Builder",
  "Facilitator Guide",
  "PlayBooky Live"
];

type ProductSystemLink = {
  description: string;
  href?: string;
  label: string;
};

const productSystemLinks: ProductSystemLink[] = [
  {
    description:
      "Defines why PlayBooky exists, the problems it solves, and the long-term direction of the platform.",
    label: "Product Vision"
  },
  {
    description:
      "Defines how the complete PlayBooky product works and how product systems connect.",
    href: "/design-system/product-system/architecture",
    label: "Product Architecture"
  },
  {
    description:
      "Documents the end-to-end customer journey from challenge to completed workshop.",
    label: "User Journey"
  },
  {
    description:
      "Documents how user responses are collected, interpreted, and transformed into diagnostic signals.",
    label: "Diagnosis"
  },
  {
    description:
      "Documents how PlayBooky evaluates diagnostic signals and determines workshop recommendations.",
    label: "Decision Engine"
  },
  {
    description:
      "Documents the reusable knowledge libraries that power workshop generation.",
    href: "/design-system/product-system/libraries/activity-library",
    label: "Libraries"
  },
  {
    description:
      "Documents how workshops are assembled, delivered, and facilitated.",
    label: "Workshop"
  }
];

export default function ProductSystemPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/product-system" />

        <section className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <header className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                Product System
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
                How PlayBooky Works
              </h2>
              <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                The Product System documents how PlayBooky thinks, makes
                decisions, generates workshops, and delivers facilitation
                experiences. It sits beside the Design System so the portal
                explains both how PlayBooky looks and how PlayBooky works.
              </p>
            </header>

            <section className="mt-12 rounded-[28px] border border-[color:var(--line)] bg-white/55 p-5 shadow-[0_18px_50px_rgba(36,31,24,0.06)] sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                    Product Pipeline
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    Challenge to live workshop
                  </h3>
                </div>
                <a
                  className="text-sm font-semibold text-[#7D5330] transition hover:text-[#171614]"
                  href="/design-system/product-system/architecture"
                >
                  View architecture map
                </a>
              </div>

              <ol className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {pipeline.map((step, index) => (
                  <li
                    className="flex items-center gap-3 rounded-2xl border border-[#E8DED0] bg-[#FFFCF7]/78 px-4 py-3"
                    key={step}
                  >
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-[#7D5330] text-sm font-semibold text-[#FCFBF9]">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-[#2C2924]">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                Product System Pages
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {productSystemLinks.map((item) => (
                  item.href ? (
                    <a
                      className="group rounded-[24px] border border-[color:var(--line)] bg-white/52 p-5 transition hover:-translate-y-0.5 hover:bg-[#FFFCF7] hover:shadow-[0_18px_44px_rgba(36,31,24,0.08)] motion-reduce:hover:translate-y-0"
                      href={item.href}
                      key={item.label}
                    >
                      <h3 className="text-lg font-semibold text-[#171614]">
                        {item.label}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                        {item.description}
                      </p>
                      <p className="mt-5 text-sm font-semibold text-[#7D5330]">
                        Open page
                      </p>
                    </a>
                  ) : (
                    <article
                      className="rounded-[24px] border border-[color:var(--line)] bg-white/38 p-5 text-[#8F8578]"
                      key={item.label}
                    >
                      <h3 className="text-lg font-semibold">{item.label}</h3>
                      <p className="mt-3 text-sm leading-6">
                        {item.description}
                      </p>
                      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em]">
                        Coming soon
                      </p>
                    </article>
                  )
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
