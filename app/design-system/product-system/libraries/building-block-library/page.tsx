import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import {
  buildingBlocks,
  workshopOsFixtureSource
} from "@/lib/workshop-os/fixtures";

export default function BuildingBlockLibraryPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/product-system/libraries/building-block-library" />

        <section className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-7xl">
            <header className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                Product System / Workshop OS
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
                Building Block Library
              </h2>
              <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                Building Blocks are the reusable Workshop OS units selected by
                design logic and expanded into executable steps. This review
                page uses source-derived fixture data from the Notion export.
              </p>
              <div className="mt-6 rounded-2xl border border-[#E5D2B6] bg-[#FFF8EB] px-4 py-3">
                <p className="text-sm font-semibold text-[#7D5330]">
                  Source specification
                </p>
                <code className="mt-1 block break-words text-sm text-[#2C2924]">
                  {workshopOsFixtureSource.buildingBlockLibrary}
                </code>
              </div>
            </header>

            <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {buildingBlocks.map((block) => (
                <article
                  className="rounded-[24px] border border-[color:var(--line)] bg-white/55 p-5 shadow-[0_18px_44px_rgba(36,31,24,0.05)]"
                  key={block.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
                        {block.type}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-[#171614]">
                        {block.name}
                      </h3>
                    </div>
                    <span className="rounded-full border border-[#E4D8C8] bg-[#FFFCF7] px-3 py-1 text-xs font-semibold text-[#7D5330]">
                      {block.typicalDurationMinutes} min
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                    {block.purpose}
                  </p>

                  <dl className="mt-5 space-y-4">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                        Stages
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {block.stages.map((stage) => (
                          <span
                            className="rounded-full bg-[#F4EEE5] px-2.5 py-1 text-xs font-semibold text-[#2C2924]"
                            key={stage}
                          >
                            {stage}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                        Outputs
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-[#2C2924]">
                        {block.outputs.join(", ")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--gold)]">
                        Inputs
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-[#2C2924]">
                        {block.inputs.join(", ")}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
