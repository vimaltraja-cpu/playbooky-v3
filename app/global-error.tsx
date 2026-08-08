"use client";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({
  error,
  reset
}: GlobalErrorPageProps) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            alignItems: "center",
            background: "#f6f3ee",
            color: "#181714",
            display: "flex",
            fontFamily:
              "Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "24px"
          }}
        >
          <section
            style={{
              background: "#fffcf7",
              border: "1px solid #ded6ca",
              borderRadius: "24px",
              maxWidth: "512px",
              padding: "32px"
            }}
          >
            <p
              style={{
                color: "#b28b4b",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase"
              }}
            >
              PlayBooky
            </p>
            <h1 style={{ fontSize: "32px", margin: "12px 0 0" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#706b62", lineHeight: 1.7 }}>
              The app shell hit an unexpected error. Try refreshing this view.
            </p>
            {error.digest ? (
              <p style={{ color: "#706b62", fontSize: "12px" }}>
                Error reference: {error.digest}
              </p>
            ) : null}
            <button
              onClick={reset}
              style={{
                background: "#7D5330",
                border: 0,
                borderRadius: "999px",
                color: "#FCFBF9",
                cursor: "pointer",
                fontWeight: 700,
                marginTop: "16px",
                padding: "10px 20px"
              }}
              type="button"
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
