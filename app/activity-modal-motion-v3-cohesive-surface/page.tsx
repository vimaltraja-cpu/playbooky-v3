import Link from "next/link";

import {
  cohesiveSurfaceMeta,
  CohesiveSurfaceConcept
} from "@/components/prototypes/activity-modal-motion-v3/concept-1-cohesive-surface/CohesiveSurfaceConcept";
import { getV3PrototypeCards } from "@/components/prototypes/activity-modal-motion-v3/shared/prototype-cards";

export default function ActivityModalMotionV3CohesiveSurfacePage() {
  const cards = getV3PrototypeCards();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F3EEE7] px-6 py-7 text-[#324236]">
      <Link
        className="fixed left-6 top-6 z-40 inline-flex min-h-11 items-center rounded-[12px] border border-[#d8cbb8] bg-[#FCFBFA]/85 px-4 text-sm font-semibold text-[#324236] shadow-[0_10px_28px_rgba(36,31,24,0.08)] backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#aa7d3a]/50"
        href="/design-system/core-experience/activity-modal-motion-v3"
      >
        ← Back to Design Portal
      </Link>

      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1480px] flex-col justify-center gap-5">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7D5330]">
            {cohesiveSurfaceMeta.tagline}
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            {cohesiveSurfaceMeta.name}
          </h1>
          <p className="mx-auto mt-2 max-w-[70ch] text-sm leading-relaxed text-[#4b5c4c]">
            {cohesiveSurfaceMeta.principle}
          </p>
        </header>

        <CohesiveSurfaceConcept cards={cards} />
      </div>
    </main>
  );
}
