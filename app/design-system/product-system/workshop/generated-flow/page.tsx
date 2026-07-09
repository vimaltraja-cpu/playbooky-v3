import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { exampleGeneratedWorkshopFlow } from "@/lib/workshop-os/generate-workshop-flow";
import { workshopOsSchemas } from "@/lib/workshop-os/schemas";

const flow = exampleGeneratedWorkshopFlow;

export default function GeneratedWorkshopFlowPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/product-system/workshop/generated-flow" />

        <section className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-7xl">
            <header className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                Product System / Workshop OS
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
                Generated Workshop Flow
              </h2>
              <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                This page reviews the Phase 1 deterministic local generator
                contract. It does not call prompts, APIs, Supabase, or product
                screens.
              </p>
            </header>

            <section className="mt-10 grid gap-4 lg:grid-cols-4">
              {[
                ["Primary stage", flow.diagnosis.primaryStage],
                ["Secondary stage", flow.diagnosis.secondaryStage],
                ["Confidence", flow.diagnosis.confidence],
                ["Duration", `${flow.durationMinutes} min target`]
              ].map(([label, value]) => (
                <div
                  className="rounded-[22px] border border-[color:var(--line)] bg-white/55 p-5"
                  key={label}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                    {label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold capitalize">
                    {value}
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-8 rounded-[28px] border border-[color:var(--line)] bg-[#FFFCF7]/72 p-6 shadow-[0_18px_44px_rgba(36,31,24,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                Generated workshop
              </p>
              <h3 className="mt-3 text-3xl font-semibold">{flow.title}</h3>
              <p className="mt-4 max-w-4xl text-base leading-8 text-[color:var(--muted)]">
                {flow.objective}
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                    Participants
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {flow.participantCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                    Generated from
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {flow.createdFrom.designLogicRuleIds.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                    Step duration
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {flow.totalStepDurationMinutes} min
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8 space-y-6">
              {flow.agenda.map((block, blockIndex) => (
                <article
                  className="overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-white/55"
                  key={block.blockId}
                >
                  <header className="border-b border-[color:var(--line)] bg-[#F8F3EA]/72 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                          Agenda block {blockIndex + 1}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                          {block.name}
                        </h3>
                      </div>
                      <span className="w-fit rounded-full border border-[#E4D8C8] bg-[#FFFCF7] px-3 py-1 text-xs font-semibold text-[#7D5330]">
                        {block.durationMinutes} min
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                      {block.reason}
                    </p>
                  </header>

                  <ol className="divide-y divide-[color:var(--line)]">
                    {block.steps.map((step) => (
                      <li
                        className="grid gap-4 p-5 lg:grid-cols-[80px_minmax(0,1fr)_110px]"
                        key={step.sourceStepId}
                      >
                        <p className="text-2xl font-semibold text-[#7D5330]">
                          {step.order}
                        </p>
                        <div>
                          <h4 className="text-lg font-semibold">
                            {step.name}
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-[#2C2924]">
                            {step.instructions}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                            {step.facilitatorNotes}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[color:var(--muted)]">
                          {step.durationMinutes} min
                        </p>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </section>

            <section className="mt-10 rounded-[28px] border border-[color:var(--line)] bg-white/55 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                Contract schemas
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {Object.values(workshopOsSchemas).map((schema) => (
                  <article
                    className="rounded-[22px] border border-[#E4D8C8] bg-[#FFFCF7]/72 p-5"
                    key={schema.name}
                  >
                    <h3 className="text-lg font-semibold">{schema.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                      {schema.description}
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                      {Object.keys(schema.fields).length} fields
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
