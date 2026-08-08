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
    href: "/design-system/product-system/libraries",
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
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/product-system" />

        <section className="min-w-0 bg-black px-5 py-7 pb-16 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <header className="border-b border-white/[0.1] pb-7">
              <p className="text-[12px] font-medium leading-5 text-[#737373]">
                Product System
              </p>
              <h2 className="mt-2 text-[22px] font-semibold leading-8 text-[#f5f5f5]">
                How PlayBooky Works
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                The Product System documents how PlayBooky thinks, makes
                decisions, generates workshops, and delivers facilitation
                experiences. It sits beside the Design System so the portal
                explains both how PlayBooky looks and how PlayBooky works.
              </p>
            </header>

            <section className="mt-8 rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[12px] font-medium leading-5 text-[#737373]">
                    Product Pipeline
                  </p>
                  <h3 className="mt-1 text-[15px] font-semibold leading-6 text-[#ededed]">
                    Challenge to live workshop
                  </h3>
                </div>
                <a
                  className="text-[13px] font-medium leading-5 text-[#8f8f8f] transition-colors hover:text-[#ededed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70"
                  href="/design-system/product-system/architecture"
                >
                  View architecture map
                </a>
              </div>

              <ol className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {pipeline.map((step, index) => (
                  <li
                    className="flex items-center gap-3 rounded-md border border-white/[0.1] bg-white/[0.03] px-3 py-2.5"
                    key={step}
                  >
                    <span className="grid h-6 w-6 flex-none place-items-center rounded border border-white/[0.1] bg-white/[0.04] text-[12px] font-medium text-[#d4d4d4]">
                      {index + 1}
                    </span>
                    <span className="text-[13px] font-medium leading-5 text-[#d4d4d4]">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-8">
              <p className="text-[15px] font-semibold leading-6 text-[#ededed]">
                Product System Pages
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {productSystemLinks.map((item) =>
                  item.href ? (
                    <a
                      className="group rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-5 transition-[background-color,border-color,transform] hover:-translate-y-px hover:border-white/[0.24] hover:bg-[#0e0e0e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70 motion-reduce:hover:translate-y-0"
                      href={item.href}
                      key={item.label}
                    >
                      <h3 className="text-[15px] font-semibold leading-5 text-[#f5f5f5]">
                        {item.label}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#a1a1a1]">
                        {item.description}
                      </p>
                      <p className="mt-5 text-[13px] font-medium leading-5 text-[#8f8f8f] transition-colors group-hover:text-[#d4d4d4]">
                        Open page
                      </p>
                    </a>
                  ) : (
                    <article
                      className="rounded-[10px] border border-white/[0.1] bg-white/[0.025] p-5 text-[#737373]"
                      key={item.label}
                    >
                      <h3 className="text-[15px] font-semibold leading-5">
                        {item.label}
                      </h3>
                      <p className="mt-3 text-sm leading-6">
                        {item.description}
                      </p>
                      <p className="mt-5 text-[12px] font-medium leading-5">
                        Coming soon
                      </p>
                    </article>
                  )
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
