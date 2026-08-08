"use client";

type AIComposerState =
  | "empty"
  | "focused"
  | "typing"
  | "disabled"
  | "error"
  | "loading";

type AIComposerViewport = "desktop" | "mobile";

type AIComposerProps = {
  isSubmitting?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: ((value: string) => void) | (() => void);
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
      fill="none"
      height="16"
      stroke="#171614"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
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
      fill="none"
      height="20"
      stroke="#E2E8F0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.25"
      viewBox="0 0 24 24"
      width="20"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

export function AIComposer({
  isSubmitting = false,
  onChange,
  onSubmit,
  placeholder,
  state = "empty",
  value,
  viewport = "desktop"
}: AIComposerProps) {
  const isInteractive = typeof onChange === "function";
  const isMobile = viewport === "mobile";
  const resolvedState: AIComposerState = isSubmitting ? "loading" : state;
  const isDisabled = resolvedState === "disabled";
  const isLoading = resolvedState === "loading";
  const resolvedPlaceholder =
    placeholder ?? (isMobile ? mobilePlaceholder : desktopPlaceholder);
  const staticText =
    isMobile &&
    resolvedState !== "typing" &&
    resolvedState !== "error" &&
    resolvedState !== "loading"
      ? mobilePlaceholder
      : stateCopy[resolvedState];
  const canSubmit =
    !isDisabled &&
    !isLoading &&
    (isInteractive ? Boolean(value?.trim()) : true);

  const submit = () => {
    if (!canSubmit || !onSubmit) {
      return;
    }

    if (onSubmit.length > 0) {
      (onSubmit as (nextValue: string) => void)(value ?? "");
      return;
    }

    (onSubmit as () => void)();
  };

  return (
    <div
      aria-disabled={isDisabled}
      aria-label="AI Composer"
      data-state={resolvedState}
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
            aria-label="Challenge prompt"
            disabled={isDisabled || isLoading}
            onChange={(event) => onChange?.(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder={resolvedPlaceholder}
            style={{
              background: "transparent",
              border: 0,
              color: "#5E5A53",
              fontFamily:
                "Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: 400,
              height: "56px",
              lineHeight: isMobile ? "20px" : "24px",
              margin: 0,
              outline: "none",
              resize: "none",
              width: "100%"
            }}
            value={value ?? ""}
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
            {staticText}
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
            disabled={!canSubmit}
            onClick={submit}
            style={{
              alignItems: "center",
              background: "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)",
              border: 0,
              borderRadius: "20px",
              display: "inline-flex",
              height: "40px",
              justifyContent: "center",
              opacity: canSubmit ? 1 : 0.45,
              padding: 0,
              width: "40px"
            }}
            type="button"
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
