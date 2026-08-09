"use client";

import { useEffect, useRef, useState } from "react";

import {
  printGuideAsPdf,
  shareGuidePage
} from "@/lib/facilitator-guide/guide-export-actions";

const STATUS_CLEAR_MS = 2400;

export function useGuideExportActions(title = "PlayBooky Facilitator Guide") {
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const clearTimerRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) {
        window.clearTimeout(clearTimerRef.current);
      }
    };
  }, []);

  const flashStatus = (message: string) => {
    setActionStatus(message);
    if (clearTimerRef.current) {
      window.clearTimeout(clearTimerRef.current);
    }
    clearTimerRef.current = window.setTimeout(() => {
      setActionStatus(null);
    }, STATUS_CLEAR_MS);
  };

  const onShare = async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : "https://playbooky.com";

    const result = await shareGuidePage({ title, url });

    if (!result.ok) {
      flashStatus(result.reason);
      return;
    }

    if (result.method === "clipboard") {
      flashStatus("Link copied");
    }
  };

  const onDownloadPdf = () => {
    printGuideAsPdf();
  };

  return {
    actionStatus,
    onDownloadPdf,
    onShare
  };
}
