"use client";

import { type FormEvent, type KeyboardEvent } from "react";

type AIComposerState =
  | "empty"
  | "focused"
  | "typing"
  | "disabled"
  | "error"
  | "loading";

type AIComposerViewport = "desktop" | "mobile";

type AIComposerProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void | Promise<void>;
  placeholder?: string;
  state?: AIComposerState;
  value?: string;
  viewport?: AIComposerViewport;
};

const desktopPlaceholder = "Tell PlayBooky about your challenge...";
const mobilePlaceholder = "Tell PlayBooky about your challenge...";

const stateCopy: Record<AIComposerState, string> = {
  empty: desktopPlaceholder,
  focused: desktopPlaceholder,
  typing: "Create a 45-minute workshop for a new leadership team...",
  disabled: "PlayBooky is unavailable right now...",
  error: "Try asking in a little more detail...",
  loading: "Sending..."
};

function MicIcon() {
  return (
    <svg
      aria-hidden="true"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      fill="none"
      stroke="#171614"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      aria-hidden="true"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      fill="none"
      stroke="#E2E8F0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.25"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

export function AIComposer({
  disabled,
  isSubmitting = false,
  onChange,
  onSubmit,
  placeholder,
  state = "empty",
  value,
  viewport = "desktop"
}: AIComposerProps) {
  const isMobile = viewport === "mobile";
  const isInteractive = typeof value === "string" && Boolean(onChange);
  const currentValue = value ?? "";
  const canSubmit = currentValue.trim().length > 0;
  const isDisabled = disabled ?? state === "disabled";
  const isLoading = isSubmitting || state === "loading";
  const displayState = isInteractive
    ? isLoading
      ? "loading"
      : isDisabled
        ? "disabled"
        : canSubmit
          ? "typing"
          : "empty"
    : state;
  const resolvedPlaceholder =
    placeholder ??
    (isMobile ? mobilePlaceholder : desktopPlaceholder);
  const text =
    isMobile && state !== "typing" && state !== "error" && state !== "loading"
      ? mobilePlaceholder
      : stateCopy[state];
  const actionDisabled = isDisabled || isLoading || (isInteractive && !canSubmit);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isInteractive || actionDisabled) {
      return;
    }

    void onSubmit?.(currentValue.trim());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || (!event.metaKey && !event.ctrlKey)) {
      return;
    }

    if (actionDisabled) {
      return;
    }

    event.preventDefault();
    void onSubmit?.(currentValue.trim());
  }

  return (
    <form
      aria-disabled={isDisabled}
      aria-label="AI Composer"
      className="ai-composer"
      data-state={displayState}
      onSubmit={handleSubmit}
      role="group"
      style={{
        background: "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)",
        borderRadius: "32px",
        boxSizing: "border-box",
        height: "141px",
        padding: "2px",
        width: isMobile ? "370px" : "736px"
      }}
    >
      <div
        style={{
          alignItems: "flex-start",
          background: "#FCFBF9",
          borderRadius: "30px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "20px 16px 16px 32px",
          width: "100%"
        }}
      >
        {isInteractive ? (
          <textarea
            aria-label="Describe your workshop challenge"
            className="ai-composer__input"
            disabled={isDisabled || isLoading}
            onChange={(event) => onChange?.(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={resolvedPlaceholder}
            rows={2}
            style={{
              background: "transparent",
              border: 0,
              color: isMobile ? "#45413C" : "#5E5A53",
              flex: "1 1 auto",
              fontFamily:
                "Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: 400,
              lineHeight: isMobile ? "20px" : "24px",
              margin: 0,
              minHeight: isMobile ? "44px" : "52px",
              outline: 0,
              padding: 0,
              resize: "none",
              width: "100%"
            }}
            value={currentValue}
          />
        ) : (
          <p
            style={{
              color: isMobile ? "#45413C" : "#5E5A53",
              fontFamily:
                "Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: 400,
              lineHeight: isMobile ? "20px" : "24px",
              margin: 0
            }}
          >
            {text}
          </p>
        )}

        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            height: "40px",
            justifyContent: "flex-end",
            width: "100%"
          }}
        >
          <MicIcon />
          <button
            aria-label={isLoading ? "Sending" : "Send prompt"}
            disabled={actionDisabled}
            style={{
              alignItems: "center",
              background: "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)",
              border: 0,
              borderRadius: "20px",
              cursor: actionDisabled ? "not-allowed" : "pointer",
              display: "inline-flex",
              height: "40px",
              justifyContent: "center",
              opacity: actionDisabled ? 0.45 : 1,
              padding: 0,
              width: "40px"
            }}
            type="submit"
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>
    </form>
  );
}
