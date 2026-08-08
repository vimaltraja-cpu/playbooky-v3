import { MeshWashEngine, SPECTRUM_PRESETS } from "../shared/MeshWashEngine";
import type {
  BackgroundConceptMeta,
  BackgroundConceptProps
} from "../shared/types";

export const spectrumMediumMeta: BackgroundConceptMeta = {
  id: "spectrum-medium",
  name: "3. Medium",
  principle:
    "The midpoint: muted rather than saturated colour, no dense inner core, more blur, moderate opacity. Reads as a clear atmosphere behind the page without the colour itself becoming a subject you look at directly.",
  recommendedUse:
    "The centre of the range — a reasonable default to test the composer's readability against before deciding whether to push toward strong or pull back toward light.",
  risks: [
    "Sits in the middle of five options, so on its own it doesn't tell you much about the edges of the range — needs to be judged against maximum and barely-there, not in isolation.",
    "Muted colour reads calmer but also less obviously 'illustrated' than the two stronger tabs."
  ],
  strengths: [
    "Balances presence and readability without needing a readability scrim behind the composer.",
    "Good baseline for comparing the effect of saturation and core density versus the two lighter tabs, which share its muted palette."
  ],
  tagline: "The centre of the range — present but muted"
};

export function SpectrumMediumBackground(props: BackgroundConceptProps) {
  return <MeshWashEngine {...props} config={SPECTRUM_PRESETS.medium} />;
}
