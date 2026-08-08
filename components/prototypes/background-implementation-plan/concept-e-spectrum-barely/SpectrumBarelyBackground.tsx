import { MeshWashEngine, SPECTRUM_PRESETS } from "../shared/MeshWashEngine";
import type {
  BackgroundConceptMeta,
  BackgroundConceptProps
} from "../shared/types";

export const spectrumBarelyMeta: BackgroundConceptMeta = {
  id: "spectrum-barely",
  name: "5. Barely there",
  principle:
    "The bottom of the range, included on purpose so the spectrum has a real floor: the same four fields at close to zero — the point where a background stops reading as a design decision at all.",
  recommendedUse:
    "Not a real candidate — this is the 'nothing' end of the spread so the other four tabs have a floor to be judged against.",
  risks: [
    "This is deliberately close to invisible — don't mistake it for a genuine option."
  ],
  strengths: [
    "Gives the range an honest floor instead of every tab clustering in the same narrow band."
  ],
  tagline: "The floor of the range — close to nothing, on purpose"
};

export function SpectrumBarelyBackground(props: BackgroundConceptProps) {
  return <MeshWashEngine {...props} config={SPECTRUM_PRESETS.barely} />;
}
