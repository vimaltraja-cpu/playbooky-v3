"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--background)] px-6 text-[color:var(--foreground)]">
      <section className="max-w-lg rounded-[24px] border border-[color:var(--line)] bg-[color:var(--panel)] p-8 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.32)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
          PlayBooky
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          The page hit an unexpected error. Try refreshing this view.
        </p>
        {error.digest ? (
          <p className="mt-4 text-xs text-[color:var(--muted)]">
            Error reference: {error.digest}
          </p>
        ) : null}
        <button
          className="mt-6 rounded-full bg-[#7D5330] px-5 py-2.5 text-sm font-semibold text-[#FCFBF9]"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
