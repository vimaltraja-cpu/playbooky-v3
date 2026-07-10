import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { getImplementedPortalPages } from "@/lib/design-system/portal-navigation";

const featuredPages = getImplementedPortalPages().filter(
  (page) => page.href !== "/design-system"
);

function PortalPreview({ label }: { label: string }) {
  return (
    <div className="relative h-56 overflow-hidden border-b border-white/[0.08] bg-[#15171c]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(125,211,252,0.18),transparent_32%),radial-gradient(circle_at_78%_8%,rgba(255,255,255,0.08),transparent_24%)]" />
      <div className="absolute inset-x-6 top-6 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-400/60" />
        <span className="h-2 w-2 rounded-full bg-yellow-300/60" />
        <span className="h-2 w-2 rounded-full bg-green-400/60" />
      </div>
      <div className="absolute inset-x-6 bottom-6 grid gap-3">
        <div className="h-3 w-24 rounded-full bg-white/20" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 rounded-md bg-white/[0.12]" />
          <div className="h-24 rounded-md bg-white/[0.08]" />
          <div className="h-24 rounded-md bg-white/[0.1]" />
        </div>
      </div>
      <div className="absolute right-6 top-6 rounded-md border border-white/[0.1] bg-black/20 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur">
        {label}
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-[#0b0c0f] text-zinc-100">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system" />

        <section className="min-w-0 px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-7xl">
            <header className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300/75">
                PlayBooky Design Portal
              </p>
              <h2 className="mt-5 text-5xl font-semibold tracking-normal text-white sm:text-6xl">
                A curated workspace for product and design-system review.
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
                Browse the implemented PlayBooky surfaces, component references,
                and product-system pages in a dedicated dark documentation
                environment.
              </p>
            </header>

            <section aria-labelledby="portal-gallery-heading" className="mt-14">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h3
                    className="text-2xl font-semibold text-white"
                    id="portal-gallery-heading"
                  >
                    Available experiences
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    Only implemented routes are shown here.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                {featuredPages.map((page) => (
                  <a
                    className="group overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035] transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
                    href={page.href}
                    key={page.href}
                  >
                    <PortalPreview label={page.icon} />
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300/70">
                        {page.category}
                      </p>
                      <h4 className="mt-3 text-xl font-semibold text-white">
                        {page.label}
                      </h4>
                      {page.description ? (
                        <p className="mt-3 text-sm leading-6 text-zinc-400">
                          {page.description}
                        </p>
                      ) : null}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
