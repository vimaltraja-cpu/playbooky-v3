export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--background)] px-6 text-[color:var(--foreground)]">
      <section className="max-w-lg rounded-[24px] border border-[color:var(--line)] bg-[color:var(--panel)] p-8 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.32)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">
          PlayBooky
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          This route does not exist yet.
        </p>
        <a
          className="mt-6 inline-flex rounded-full bg-[#7D5330] px-5 py-2.5 text-sm font-semibold text-[#FCFBF9]"
          href="/design-system"
        >
          Go to Design Portal
        </a>
      </section>
    </main>
  );
}
