import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  buildingBlocks,
  buildingBlockSteps,
  workshopOsFixtureSource
} from "@/lib/workshop-os/fixtures";

function getBlockName(blockId: string) {
  return buildingBlocks.find((block) => block.id === blockId)?.name ?? blockId;
}

export default function BuildingBlockStepsPage() {
  const parentBlockIds = Array.from(
    new Set(buildingBlockSteps.map((step) => step.parentBlockId))
  );

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/product-system/libraries/building-block-steps" />

        <section className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-7xl">
            <header className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                Product System / Workshop OS
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
                Building Block Steps
              </h2>
              <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                Building Block Steps are the executable instructions that turn
                reusable blocks into workshop-ready flows. Phase 1 includes a
                representative step set for the deterministic generator stub.
              </p>
              <div className="mt-6 rounded-2xl border border-[#E5D2B6] bg-[#FFF8EB] px-4 py-3">
                <p className="text-sm font-semibold text-[#7D5330]">
                  Source specification
                </p>
                <code className="mt-1 block break-words text-sm text-[#2C2924]">
                  {workshopOsFixtureSource.buildingBlockSteps}
                </code>
              </div>
            </header>

            <section className="mt-10 space-y-8">
              {parentBlockIds.map((parentBlockId) => {
                const steps = buildingBlockSteps
                  .filter((step) => step.parentBlockId === parentBlockId)
                  .sort((first, second) => first.order - second.order);

                return (
                  <article
                    className="overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-white/55 shadow-[0_18px_44px_rgba(36,31,24,0.05)]"
                    key={parentBlockId}
                  >
                    <header className="border-b border-[color:var(--line)] bg-[#FFFCF7]/72 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                        Parent block
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold">
                        {getBlockName(parentBlockId)}
                      </h3>
                      <p className="mt-2 text-sm text-[color:var(--muted)]">
                        {steps.length} executable steps ·{" "}
                        {steps.reduce(
                          (total, step) => total + step.durationMinutes,
                          0
                        )}{" "}
                        minutes
                      </p>
                    </header>

                    <div className="divide-y divide-[color:var(--line)]">
                      {steps.map((step) => (
                        <div
                          className="grid gap-4 p-5 lg:grid-cols-[90px_minmax(0,1fr)_120px]"
                          key={step.id}
                        >
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                              Step
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-[#7D5330]">
                              {step.order}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-[#171614]">
                              {step.name}
                            </h4>
                            <p className="mt-2 text-sm leading-6 text-[#2C2924]">
                              {step.purpose}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                              {step.instructions}
                            </p>
                            {step.techniqueUsed ? (
                              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                                Technique: {step.techniqueUsed}
                              </p>
                            ) : null}
                          </div>
                          <div className="rounded-2xl border border-[#E4D8C8] bg-[#FFFCF7] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                              Duration
                            </p>
                            <p className="mt-1 text-xl font-semibold">
                              {step.durationMinutes} min
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
