import { MeshWashEngine, SPECTRUM_PRESETS } from "../shared/MeshWashEngine";
import type {
  BackgroundConceptMeta,
  BackgroundConceptProps
} from "../shared/types";

export const spectrumMaxMeta: BackgroundConceptMeta = {
  id: "spectrum-max",
  name: "1. Maximum",
  principle:
    "The top end of the spectrum: saturated gold, sage, blue and plum, each with a denser inner core, less blur so the colour reads as distinct regions rather than a haze, and a visible dashed path line and grain. This is deliberately close to the density of your reference image's colour, not a restrained version of it — the point of this tab is to show what 'a lot' looks like before dialling back.",
  recommendedUse:
    "Reference point for the top of the range, not necessarily the shipped version — use it to judge how far toward this you actually want to go.",
  risks: [
    "At this density the colour will compete with the composer's gold border and the body copy — likely needs a readability scrim or a lighter treatment directly behind the composer itself.",
    "Four saturated hues at once is a strong statement — worth confirming it still feels 'inspiring workshop' rather than 'busy.'"
  ],
  strengths: [
    "Immediately reads as intentional, illustrated colour rather than an incidental effect.",
    "Closest of the five to the richness of the reference image's colour presence.",
    "Makes the top of the spectrum concrete instead of theoretical."
  ],
  tagline: "The top of the range — bold, saturated, clearly present"
};

export function SpectrumMaxBackground(props: BackgroundConceptProps) {
  return <MeshWashEngine {...props} config={SPECTRUM_PRESETS.max} />;
}
