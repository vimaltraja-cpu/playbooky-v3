import { readFile } from "node:fs/promises";
import path from "node:path";

import { DesignPortalSidebar } from "@/components/portal/DesignPortalSidebar";
import { parseCsv } from "@/lib/data/csv";

import { ActivityExplorer } from "./ActivityExplorer";

const canonicalSource = "data/canonical/activity-library.csv";

async function getActivities() {
  const csvPath = path.join(process.cwd(), canonicalSource);
  const csv = await readFile(csvPath, "utf8");
  const activities = parseCsv(csv);
  const fields = Object.keys(activities[0] ?? {});

  return { activities, fields };
}

export default async function ActivityLibraryExplorerPage() {
  const { activities, fields } = await getActivities();

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        <DesignPortalSidebar activeHref="/design-system/product-system/libraries/activity-library" />

        <section className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-7xl">
            <header className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
                Product System / Libraries
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
                Activity Library Explorer
              </h2>
              <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                A Design Portal review tool for reading, searching, filtering,
                and inspecting the canonical Activity Library CSV. This proves
                the data model can be displayed without inventing or duplicating
                activity knowledge in code.
              </p>
              <div className="mt-6 rounded-2xl border border-[#E5D2B6] bg-[#FFF8EB] px-4 py-3">
                <p className="text-sm font-semibold text-[#7D5330]">
                  Canonical source
                </p>
                <code className="mt-1 block text-sm text-[#2C2924]">
                  {canonicalSource}
                </code>
              </div>
            </header>

            <section className="mt-10">
              <ActivityExplorer activities={activities} fields={fields} />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
