import type { ReactNode } from "react";

import type { ConceptMeta } from "./types";

function SpecTable({ specs }: { specs: ConceptMeta["specs"] }) {
  return (
    <table className="w-full border-collapse text-left text-xs">
      <thead>
        <tr className="border-b border-[#d8cbb8] text-[#7D5330]">
          <th className="py-1.5 pr-3 font-semibold">Property</th>
          <th className="py-1.5 pr-3 font-semibold">Duration</th>
          <th className="py-1.5 pr-3 font-semibold">Easing</th>
          <th className="py-1.5 font-semibold">Note</th>
        </tr>
      </thead>
      <tbody>
        {specs.map((row) => (
          <tr className="border-b border-[#ece3d5] align-top" key={row.property}>
            <td className="py-1.5 pr-3 font-semibold text-[#324236]">
              {row.property}
            </td>
            <td className="py-1.5 pr-3 font-mono text-[#324236]">
              {row.duration}
            </td>
            <td className="py-1.5 pr-3 font-mono text-[#324236]">
              {row.easing}
            </td>
            <td className="py-1.5 text-[#5b6b5c]">{row.note ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ConceptFrame({
  children,
  controls,
  meta
}: {
  children: ReactNode;
  controls: ReactNode;
  meta: ConceptMeta;
}) {
  return (
    <section
      aria-labelledby={`${meta.id}-heading`}
      className="rounded-[20px] border border-[#d8cbb8] bg-[#FCFBFA]/60 p-5 shadow-[0_10px_28px_rgba(36,31,24,0.06)]"
    >
      <header className="mb-4 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7D5330]">
          {meta.tagline}
        </p>
        <h2 className="text-2xl font-semibold text-[#324236]" id={`${meta.id}-heading`}>
          {meta.name}
        </h2>
        <p className="max-w-[70ch] text-sm leading-relaxed text-[#4b5c4c]">
          {meta.principle}
        </p>
      </header>

      <div className="mb-4">{controls}</div>

      <div className="mb-5 overflow-hidden rounded-[16px] border border-[#ece3d5] bg-[#F3EEE7]">
        {children}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[#324236]">
            Content sequence
          </h3>
          <ol className="list-decimal space-y-1 pl-4 text-xs text-[#4b5c4c]">
            {meta.sequence.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h3 className="mb-2 mt-4 text-sm font-semibold text-[#324236]">
            Motion specification
          </h3>
          <SpecTable specs={meta.specs} />
        </div>

        <div className="grid gap-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#1F6E43]">
              Strengths
            </h3>
            <ul className="list-disc space-y-1 pl-4 text-xs text-[#4b5c4c]">
              {meta.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#B4472E]">
              Risks
            </h3>
            <ul className="list-disc space-y-1 pl-4 text-xs text-[#4b5c4c]">
              {meta.risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#324236]">
              Recommended use case
            </h3>
            <p className="text-xs text-[#4b5c4c]">{meta.recommendedUse}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
