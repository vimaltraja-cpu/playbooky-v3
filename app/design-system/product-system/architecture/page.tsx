import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";

type PipelineNode = {
  description: string;
  href?: string;
  label: string;
};

const pipelineNodes: PipelineNode[] = [
  {
    description: "The real organisational problem the user is trying to solve.",
    label: "Challenge"
  },
  {
    description: "Collect structured information about the user's challenge.",
    label: "Diagnosis Questions"
  },
  {
    description: "Transform user responses into diagnostic signals.",
    label: "Diagnosis Engine"
  },
  {
    description: "Evaluate diagnostic signals against recommendation logic.",
    label: "Decision Engine"
  },
  {
    description: "Provide structured workshop frameworks.",
    label: "Framework Library"
  },
  {
    description: "Define the overall workshop structure.",
    label: "Workshop Types"
  },
  {
    description: "Provide reusable facilitation activities.",
    href: "/design-system/product-system/libraries",
    label: "Activity Library"
  },
  {
    description: "Provide AI prompts and facilitator guidance.",
    label: "Prompt Library"
  },
  {
    description: "Combine activities, prompts, and structure into a workshop.",
    label: "Workshop Builder"
  },
  {
    description: "Transform a workshop into a facilitator-ready experience.",
    label: "Facilitator Guide"
  },
  {
    description: "Support the live delivery of the workshop.",
    label: "PlayBooky Live"
  }
];

export default function ProductArchitecturePage() {
  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/product-system/architecture" />

        <section className="min-w-0 bg-black px-5 py-7 pb-16 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <header className="border-b border-white/[0.1] pb-7">
              <p className="text-[12px] font-medium leading-5 text-[#737373]">
                Product System
              </p>
              <h2 className="mt-2 text-[22px] font-semibold leading-8 text-[#f5f5f5]">
                Product Architecture
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a1a1a1]">
                PlayBooky progressively enriches information from a raw
                challenge into a facilitator-ready live workshop. Each product
                system owns one clear transformation in that pipeline.
              </p>
            </header>

            <section className="mt-8 rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-4 sm:p-5">
              <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                {pipelineNodes.map((node, index) => {
                  const branchesFromDecision = node.label === "Decision Engine";
                  const mergesBeforeActivity =
                    node.label === "Activity Library";

                  return (
                    <div
                      className={[
                        "relative",
                        node.label === "Framework Library" ||
                        node.label === "Workshop Types"
                          ? ""
                          : "xl:col-span-2"
                      ].join(" ")}
                      key={node.label}
                    >
                      {node.href ? (
                        <a
                          className="group block rounded-[10px] border border-white/[0.14] bg-white/[0.03] p-4 transition-[background-color,border-color,transform] hover:-translate-y-px hover:border-white/[0.24] hover:bg-white/[0.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300/70 motion-reduce:hover:translate-y-0"
                          href={node.href}
                        >
                          <div className="flex items-start gap-4">
                            <span className="grid h-7 w-7 flex-none place-items-center rounded border border-white/[0.1] bg-white/[0.04] text-[12px] font-medium text-[#d4d4d4]">
                              {index + 1}
                            </span>
                            <div>
                              <h3 className="text-[15px] font-semibold leading-5 text-[#f5f5f5]">
                                {node.label}
                              </h3>
                              <p className="mt-2 text-sm leading-6 text-[#a1a1a1]">
                                {node.description}
                              </p>
                            </div>
                          </div>
                        </a>
                      ) : (
                        <article className="block rounded-[10px] border border-white/[0.1] bg-white/[0.025] p-4 text-[#737373]">
                          <div className="flex items-start gap-4">
                            <span className="grid h-7 w-7 flex-none place-items-center rounded border border-white/[0.08] bg-white/[0.03] text-[12px] font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <h3 className="text-[15px] font-semibold leading-5">
                                {node.label}
                              </h3>
                              <p className="mt-2 text-sm leading-6">
                                {node.description}
                              </p>
                              <p className="mt-4 text-[12px] font-medium leading-5">
                                Coming soon
                              </p>
                            </div>
                          </div>
                        </article>
                      )}

                      {index < pipelineNodes.length - 1 ? (
                        <div
                          aria-hidden="true"
                          className={[
                            "mx-auto my-2 h-7 w-px bg-white/[0.16]",
                            branchesFromDecision || mergesBeforeActivity
                              ? "hidden xl:block"
                              : ""
                          ].join(" ")}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-8 grid gap-4 rounded-[10px] border border-white/[0.14] bg-[#0a0a0a] p-5 md:grid-cols-3">
              {[
                ["Principle", "Diagnose before recommending."],
                ["Ownership", "Every system owns one transformation."],
                ["Knowledge", "Product knowledge lives in canonical data."]
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[12px] font-medium leading-5 text-[#737373]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#d4d4d4]">
                    {value}
                  </p>
                </div>
              ))}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
