import type { BackgroundConceptMeta } from "./types";

export function BackgroundConceptMetaPanel({
  meta
}: {
  meta: BackgroundConceptMeta;
}) {
  return (
    <section
      aria-labelledby={`${meta.id}-heading`}
      className="mx-auto max-w-5xl px-6 py-10"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7d5330]">
        {meta.tagline}
      </p>
      <h2
        className="mt-2 text-2xl font-semibold text-[#094d40]"
        id={`${meta.id}-heading`}
      >
        {meta.name}
      </h2>
      <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-[#5e5a53]">
        {meta.principle}
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[#1f6e43]">
            Strengths
          </h3>
          <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-[#5e5a53]">
            {meta.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-[#9c5b61]">Risks</h3>
          <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-[#5e5a53]">
            {meta.risks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-[#094d40]">
            Recommended use
          </h3>
          <p className="text-xs leading-relaxed text-[#5e5a53]">
            {meta.recommendedUse}
          </p>
        </div>
      </div>
    </section>
  );
}
