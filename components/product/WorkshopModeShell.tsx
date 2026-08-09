"use client";

/**
 * Shared workshop chrome (header + mode nav).
 * Persists across /facilitator-guide, /figjam-board, and /playbooky-live
 * so enter motion only runs on first land — not on every mode switch.
 * Content below the nav remounts and can animate independently.
 */

import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  type ReactElement,
  type ReactNode
} from "react";

import { FacilitatorGuideHeader } from "@/components/ui/FacilitatorGuideHeader";
import {
  WorkshopModeNav,
  type WorkshopModeId
} from "@/components/ui/WorkshopModeNav";
import { useGuideExportActions } from "@/lib/facilitator-guide/use-guide-export-actions";

const modeRoutes: Record<WorkshopModeId, string> = {
  figjam: "/figjam-board",
  guide: "/facilitator-guide",
  live: "/playbooky-live"
};

function modeFromPath(pathname: string): WorkshopModeId {
  if (pathname.startsWith("/figjam-board")) {
    return "figjam";
  }
  if (pathname.startsWith("/playbooky-live")) {
    return "live";
  }
  return "guide";
}

type WorkshopModeShellProps = {
  children: ReactNode;
};

export function WorkshopModeShell({
  children
}: WorkshopModeShellProps): ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const mode = modeFromPath(pathname);
  const { actionStatus, onDownloadPdf, onShare } = useGuideExportActions();

  const [shellEntered, setShellEntered] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShellEntered(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setShellEntered(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleModeChange = (next: WorkshopModeId) => {
    if (next === mode) {
      return;
    }
    router.push(modeRoutes[next]);
  };

  const surface =
    mode === "figjam" || mode === "live" ? "waitlist" : "guide";

  return (
    <div
      className="fg-live"
      data-entered={shellEntered ? "true" : "false"}
    >
      <div className="fg-live__enter fg-live__enter--header">
        <FacilitatorGuideHeader
          actionStatus={actionStatus}
          onDownloadPdf={onDownloadPdf}
          onShare={onShare}
        />
      </div>

      <div className="fg-live__mode-nav fg-live__enter fg-live__enter--nav">
        <WorkshopModeNav onChange={handleModeChange} value={mode} />
      </div>

      <div
        className="fg-live__content fg-live__content-enter"
        data-surface={surface}
        key={pathname}
      >
        {children}
      </div>
    </div>
  );
}
