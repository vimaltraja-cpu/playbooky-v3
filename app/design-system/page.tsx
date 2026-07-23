import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { DesignPortalOverview } from "@/components/portal/DesignPortalOverview";
import { getPortalPageEntries } from "@/lib/design-system/portal-navigation";

export default function DesignSystemPage() {
  const pages = getPortalPageEntries();

  return (
    <main className="min-h-screen bg-black text-[#ededed]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[var(--portal-sidebar-width)_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system" />

        <section className="min-w-0 bg-black">
          <header className="flex h-[60px] items-center justify-between border-b border-white/[0.14] px-5 sm:px-8">
            <h1 className="text-sm font-medium leading-5 text-[#ededed]">
              Design Portal
            </h1>
            <p className="text-sm font-medium leading-5 text-[#737373]">
              Overview
            </p>
          </header>

          <div className="min-w-0 px-5 py-7 pb-16 sm:px-8">
            <DesignPortalOverview pages={pages} />
          </div>
        </section>
      </div>
    </main>
  );
}
