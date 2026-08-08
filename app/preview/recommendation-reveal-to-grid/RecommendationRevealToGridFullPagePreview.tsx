/**
 * Preview temporarily disabled until ActivityGridVisualLayer and
 * RecommendationRevealToGridTransition are pushed from the Mac workspace.
 */
export function RecommendationRevealToGridFullPagePreview() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F6F1E8] px-6 text-[#171614]">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#7D5330]">
          Preview
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">
          Reveal to grid
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#5E5A53]">
          Supporting grid transition files are still local-only on the Mac.
          The green-lit journey path is Composer → Diagnosis → Loading at
          /internal/journey.
        </p>
      </div>
    </main>
  );
}
