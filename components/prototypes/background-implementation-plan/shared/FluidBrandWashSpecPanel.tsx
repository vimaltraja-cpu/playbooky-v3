import type { fluidBrandWashMeta } from "./FluidBrandWashBackground";

function SpecTable({
  specs
}: {
  specs: (typeof fluidBrandWashMeta)["motionSpec"];
}) {
  return (
    <table className="w-full border-collapse text-left text-xs">
      <thead>
        <tr className="border-b border-[#ded6ca] text-[#7d5330]">
          <th className="py-1.5 pr-3 font-semibold">Property</th>
          <th className="py-1.5 pr-3 font-semibold">Duration</th>
          <th className="py-1.5 pr-3 font-semibold">Easing</th>
          <th className="py-1.5 font-semibold">Note</th>
        </tr>
      </thead>
      <tbody>
        {specs.map((row) => (
          <tr
            className="border-b border-[#efe9df] align-top"
            key={row.property}
          >
            <td className="py-1.5 pr-3 font-semibold text-[#094d40]">
              {row.property}
            </td>
            <td className="py-1.5 pr-3 font-mono text-[#094d40]">
              {row.duration}
            </td>
            <td className="py-1.5 pr-3 font-mono text-[#094d40]">
              {row.easing}
            </td>
            <td className="py-1.5 text-[#5e5a53]">{row.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function FluidBrandWashSpecPanel({
  meta
}: {
  meta: typeof fluidBrandWashMeta;
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7d5330]">
        {meta.tagline}
      </p>
      <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-[#5e5a53]">
        {meta.principle}
      </p>

      <h3 className="mb-2 mt-6 text-sm font-semibold text-[#094d40]">
        Motion specification
      </h3>
      <SpecTable specs={meta.motionSpec} />
    </section>
  );
}
