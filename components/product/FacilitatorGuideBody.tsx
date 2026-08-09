"use client";

import { useEffect, useMemo, useState } from "react";

import { FacilitatorActivityHero } from "@/components/ui/FacilitatorActivityHero";
import { FacilitatorActivitySteps } from "@/components/ui/FacilitatorActivitySteps";
import { FacilitatorActivityTabs } from "@/components/ui/FacilitatorActivityTabs";
import { facilitatorGuideDemoPresets } from "@/lib/facilitator-guide/demo-presets";
import {
  mapWorkshopToFacilitatorGuide,
  type FacilitatorGuideContent
} from "@/lib/facilitator-guide/map-workshop-to-guide";
import type { LibraryDataset } from "@/lib/product-system/library-read-model";
import { createLibraryWorkshop } from "@/lib/workshop-os/create-library-workshop";

type FacilitatorGuideBodyProps = {
  dataset: LibraryDataset;
};

export function FacilitatorGuideBody({ dataset }: FacilitatorGuideBodyProps) {
  const preset = facilitatorGuideDemoPresets[0];

  const workshop = useMemo(
    () =>
      createLibraryWorkshop(
        dataset,
        preset.selections,
        preset.durationMinutes
      ),
    [dataset, preset]
  );

  const guide: FacilitatorGuideContent = useMemo(
    () => mapWorkshopToFacilitatorGuide(dataset, workshop.selected),
    [dataset, workshop.selected]
  );

  const [activeActivityId, setActiveActivityId] = useState(
    guide.activities[0]?.id ?? ""
  );
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setActiveActivityId(guide.activities[0]?.id ?? "");
  }, [guide.activities]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setRevealed(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const activeIndex = Math.max(
    0,
    guide.activities.findIndex((activity) => activity.id === activeActivityId)
  );
  const activeActivity = guide.activities[activeIndex] ?? guide.activities[0];

  return (
    <>
      {guide.tabs.length > 0 ? (
        <div className="fg-live__tabs">
          <FacilitatorActivityTabs
            activities={guide.tabs}
            onChange={setActiveActivityId}
            value={activeActivityId}
          />
        </div>
      ) : null}

      {activeActivity ? (
        <>
          <FacilitatorActivityHero
            activity={{
              ...activeActivity.hero,
              type: `Activity ${String(activeIndex + 1).padStart(2, "0")}`
            }}
          />
          {activeActivity.steps.length > 0 ? (
            <FacilitatorActivitySteps
              activityKey={activeActivity.id}
              reveal={revealed}
              steps={activeActivity.steps}
            />
          ) : (
            <p className="fg-live__empty">
              No facilitation steps are authored yet for{" "}
              <strong>{activeActivity.title}</strong>.
            </p>
          )}
        </>
      ) : (
        <p className="fg-live__empty">
          No activities were packed for this workshop.
        </p>
      )}
    </>
  );
}
