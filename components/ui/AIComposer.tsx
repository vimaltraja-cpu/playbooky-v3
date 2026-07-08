type AIComposerState =
  | "empty"
  | "focused"
  | "typing"
  | "disabled"
  | "error"
  | "loading";

type AIComposerViewport = "desktop" | "mobile";

type AIComposerProps = {
  state?: AIComposerState;
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
  state = "empty",
  viewport = "desktop"
}: AIComposerProps) {
  const isMobile = viewport === "mobile";
  const isDisabled = state === "disabled";
  const isLoading = state === "loading";
  const text =
    isMobile && state !== "typing" && state !== "error" && state !== "loading"
      ? mobilePlaceholder
      : stateCopy[state];

  return (
    <div
      aria-disabled={isDisabled}
      aria-label="AI Composer"
      data-state={state}
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
            disabled={isDisabled || isLoading}
            style={{
              alignItems: "center",
              background: "linear-gradient(45deg, #7D5330 0%, #D99C56 100%)",
              border: 0,
              borderRadius: "20px",
              display: "inline-flex",
              height: "40px",
              justifyContent: "center",
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
