/**
 * Client-side export actions for Facilitator Guide.
 * Share prefers the Web Share API; falls back to clipboard.
 * Download PDF currently uses Print → Save as PDF.
 */

export type ShareGuideResult =
  | { method: "clipboard" | "share"; ok: true }
  | { ok: false; reason: string };

export type ShareGuidePageOptions = {
  text?: string;
  title: string;
  url: string;
};

function copyWithExecCommand(text: string): boolean {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "0";
  field.style.left = "0";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.focus();
  field.select();
  field.setSelectionRange(0, text.length);

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(field);
  }
}

async function copyLinkToClipboard(url: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      // Fall through to execCommand.
    }
  }

  return copyWithExecCommand(url);
}

export async function shareGuidePage({
  text,
  title,
  url
}: ShareGuidePageOptions): Promise<ShareGuideResult> {
  if (typeof window === "undefined") {
    return { ok: false, reason: "Share is only available in the browser." };
  }

  const payload = {
    text: text ?? title,
    title,
    url
  };

  // Prefer native share only when the UA can share URLs (typical mobile).
  const canShareUrl =
    typeof navigator.share === "function" &&
    (typeof navigator.canShare !== "function" || navigator.canShare(payload));

  if (canShareUrl) {
    try {
      await navigator.share(payload);
      return { method: "share", ok: true };
    } catch (error) {
      // User dismissed the sheet — not an error to surface loudly.
      if (error instanceof DOMException && error.name === "AbortError") {
        return { method: "share", ok: true };
      }
      // Fall through to clipboard.
    }
  }

  if (await copyLinkToClipboard(url)) {
    return { method: "clipboard", ok: true };
  }

  // Last resort: selectable prompt (works when clipboard permission is denied).
  window.prompt("Copy this Facilitator Guide link:", url);
  return { method: "clipboard", ok: true };
}

export function printGuideAsPdf(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.print();
}
