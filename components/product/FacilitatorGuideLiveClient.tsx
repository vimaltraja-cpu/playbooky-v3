"use client";

import { useEffect, useState } from "react";

import { FacilitatorGuideBody } from "@/components/product/FacilitatorGuideBody";
import { FacilitatorGuideHeader } from "@/components/ui/FacilitatorGuideHeader";
import { WorkshopModeNav } from "@/components/ui/WorkshopModeNav";
import { useGuideExportActions } from "@/lib/facilitator-guide/use-guide-export-actions";
import type { LibraryDataset } from "@/lib/product-system/library-read-model";

type FacilitatorGuideLiveClientProps = {
  dataset: LibraryDataset;
};

/** Full Guide composition for Design Portal embeds (includes chrome). */
export function FacilitatorGuideLiveClient({
  dataset
}: FacilitatorGuideLiveClientProps) {
  const [entered, setEntered] = useState(false);
  const { actionStatus, onDownloadPdf, onShare } = useGuideExportActions();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setEntered(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setEntered(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="fg-live" data-entered={entered ? "true" : "false"}>
      <div className="fg-live__enter fg-live__enter--header">
        <FacilitatorGuideHeader
          actionStatus={actionStatus}
          onDownloadPdf={onDownloadPdf}
          onShare={onShare}
        />
      </div>

      <div className="fg-live__mode-nav fg-live__enter fg-live__enter--nav">
        <WorkshopModeNav value="guide" />
      </div>

      <div className="fg-live__enter fg-live__enter--tabs">
        <FacilitatorGuideBody dataset={dataset} />
      </div>
    </div>
  );
}
