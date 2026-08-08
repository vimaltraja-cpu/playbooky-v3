import { MeshWashEngine, SPECTRUM_PRESETS } from "../shared/MeshWashEngine";
import type {
  BackgroundConceptMeta,
  BackgroundConceptProps
} from "../shared/types";

export const spectrumLightMeta: BackgroundConceptMeta = {
  id: "spectrum-light",
  name: "4. Light",
  principle:
    "Close to what the earlier ambient-drift tab landed on: muted colour, low opacity, heavy blur. Present if you look for it, easy to miss if you don't.",
  recommendedUse:
    "Use only if strong and medium both tested as too distracting from real content in front of them.",
  risks: [
    "This is close to the intensity that read as 'nothing on the screen' in earlier rounds — treat it as a deliberate reference point for the lower end, not a recommendation.",
    "Loses most of the illustrated-atmosphere quality the reference image has."
  ],
  strengths: [
    "Safest option for content-heavy screens where the background genuinely must not compete.",
    "Cheap baseline for prefers-reduced-motion or low-power fallback regardless of which tab ships as primary."
  ],
  tagline: "Present if you look for it, easy to miss otherwise"
};

export function SpectrumLightBackground(props: BackgroundConceptProps) {
  return <MeshWashEngine {...props} config={SPECTRUM_PRESETS.light} />;
}
