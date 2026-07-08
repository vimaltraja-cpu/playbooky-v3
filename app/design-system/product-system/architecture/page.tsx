import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";

const pipelineNodes = [
  {
    description: "The real organisational problem the user is trying to solve.",
    href: "/design-system/product-system/user-journey",
    label: "Challenge"
  },
  {
    description: "Collect structured information about the user's challenge.",
    href: "/design-system/product-system/diagnosis/questions",
    label: "Diagnosis Questions"
  },
  {
    description: "Transform user responses into diagnostic signals.",
    href: "/design-system/product-system/diagnosis/engine",
    label: "Diagnosis Engine"
  },
  {
    description: "Evaluate diagnostic signals against recommendation logic.",
    href: "/design-system/product-system/diagnosis/decision-engine",
    label: "Decision Engine"
  },
  {
    description: "Provide structured workshop frameworks.",
    href: "/design-system/product-system/libraries/framework-library",
    label: "Framework Library"
  },
  {
    description: "Define the overall workshop structure.",
    href: "/design-system/product-system/libraries/workshop-types",
    label: "Workshop Types"
  },
  {
    description: "Provide reusable facilitation activities.",
    href: "/design-system/product-system/libraries/activity-library",
    label: "Activity Library"
  },
  {
    description: "Provide AI prompts and facilitator guidance.",
    href: "/design-system/product-system/libraries/prompt-library",
    label: "Prompt Library"
  },
  {
    description: "Combine activities, prompts, and structure into a workshop.",
    href: "/design-system/product-system/workshop/builder",
    label: "Workshop Builder"
  },
  {
    description: "Transform a workshop into a facilitator-ready experience.",
    href: "/design-system/product-system/workshop/facilitator-guide",
    label: "Facilitator Guide"
  },
  {
    description: "Support the live delivery of the workshop.",
    href: "/design-system/product-system/workshop/playbooky-live",
    label: "PlayBooky Live"
  }
];

export default function ProductArchitecturePage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/product-system/architecture" />

        <section className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <header className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                Product System
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
                Product Architecture
              </h2>
              <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                PlayBooky progressively enriches information from a raw
                challenge into a facilitator-ready live workshop. Each product
                system owns one clear transformation in that pipeline.
              </p>
            </header>

            <section className="mt-12 rounded-[30px] border border-[color:var(--line)] bg-[#F8F3EA]/72 p-4 shadow-[0_22px_60px_rgba(36,31,24,0.07)] sm:p-6">
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
                      <a
                        className="group block rounded-[24px] border border-[#E2D7C7] bg-[#FFFCF7]/82 p-5 transition hover:-translate-y-0.5 hover:border-[#D8C08A] hover:bg-[#FFFCF7] hover:shadow-[0_18px_44px_rgba(36,31,24,0.08)] motion-reduce:hover:translate-y-0"
                        href={node.href}
                      >
                        <div className="flex items-start gap-4">
                          <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#7D5330] text-sm font-semibold text-[#FCFBF9]">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="text-lg font-semibold text-[#171614]">
                              {node.label}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                              {node.description}
                            </p>
                          </div>
                        </div>
                      </a>

                      {index < pipelineNodes.length - 1 ? (
                        <div
                          aria-hidden="true"
                          className={[
                            "mx-auto my-2 h-7 w-px bg-[#D8C08A]",
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

            <section className="mt-10 grid gap-4 rounded-[24px] border border-[color:var(--line)] bg-white/48 p-5 md:grid-cols-3">
              {[
                ["Principle", "Diagnose before recommending."],
                ["Ownership", "Every system owns one transformation."],
                ["Knowledge", "Product knowledge lives in canonical data."]
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#2C2924]">
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
