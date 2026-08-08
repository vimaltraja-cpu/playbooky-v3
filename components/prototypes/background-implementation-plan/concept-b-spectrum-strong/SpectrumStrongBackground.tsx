import { MeshWashEngine, SPECTRUM_PRESETS } from "../shared/MeshWashEngine";
import type {
  BackgroundConceptMeta,
  BackgroundConceptProps
} from "../shared/types";

export const spectrumStrongMeta: BackgroundConceptMeta = {
  id: "spectrum-strong",
  name: "2. Strong",
  principle:
    "One step down from maximum: still saturated colour with a visible (smaller) core, but more blur and lower peak opacity, so the four regions read as clearly present without dominating the composer. The dashed path and grain are dialled back to match.",
  recommendedUse:
    "A reasonable candidate if 'maximum' feels like too much but 'medium' feels like it's disappearing again — the middle-upper option.",
  risks: [
    "Still saturated colour, so the same readability question as maximum applies, just to a lesser degree.",
    "Because it sits between two other tabs, it's the easiest one to skip past — worth deliberately comparing it against both neighbours."
  ],
  strengths: [
    "Keeps the colour presence and the illustrated feel while giving the composer more breathing room than maximum.",
    "Directly comparable to maximum and medium since it's the same engine, only the intensity numbers change."
  ],
  tagline: "Clearly present, one notch down from maximum"
};

export function SpectrumStrongBackground(props: BackgroundConceptProps) {
  return <MeshWashEngine {...props} config={SPECTRUM_PRESETS.strong} />;
}
