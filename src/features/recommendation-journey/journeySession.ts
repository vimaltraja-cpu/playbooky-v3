import type { ActivityCardData } from "@/components/ui/ActivityCard";
import type { DiagnosisQuestionId } from "@/lib/design-system/diagnosis-options";
import type {
  ComposerDiagnosisInterpretation,
  DiagnosisAnswerProvenance
} from "@/src/features/recommendation-journey/diagnosisIntelligence";

export const journeySessionStorageKey = "playbooky.journey.session";

export type JourneyActivityCard = {
  activity: ActivityCardData;
  candidateBlockId?: string;
  id: string;
  label: string;
  source: "generated" | "library" | "fallback";
};

export type JourneyActivityMutation = {
  activityId: string;
  at: string;
  title: string;
  type: "add" | "remove" | "reorder";
};

export type JourneyGeneratedWorkshop = {
  description: string;
  durationMinutes: number;
  id: string;
  reasoning: string[];
  selectedBlockIds: string[];
  title: string;
  totalDuration: number;
  warnings: string[];
};

export type JourneySessionPayload = {
  activityCards?: JourneyActivityCard[];
  activityMutations?: JourneyActivityMutation[];
  activityOrder?: string[];
  brief?: string;
  diagnosisAnswers?: Partial<Record<DiagnosisQuestionId, DiagnosisAnswerProvenance>>;
  generatedWorkshop?: JourneyGeneratedWorkshop;
  interpretation?: ComposerDiagnosisInterpretation;
  recommendationDescription?: string;
  recommendationReasoning?: string[];
  updatedAt: string;
  version: 1;
};

function nowIso() {
  return new Date().toISOString();
}

function canUseSessionStorage() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

export function createJourneySession(
  partial: Partial<JourneySessionPayload> = {}
): JourneySessionPayload {
  return {
    ...partial,
    updatedAt: nowIso(),
    version: 1
  };
}

export function readJourneySession(): JourneySessionPayload | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(journeySessionStorageKey);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as JourneySessionPayload;

    return parsedValue.version === 1 ? parsedValue : null;
  } catch {
    return null;
  }
}

export function writeJourneySession(payload: JourneySessionPayload) {
  if (!canUseSessionStorage()) {
    return payload;
  }

  const nextPayload = {
    ...payload,
    updatedAt: nowIso(),
    version: 1 as const
  };

  try {
    window.sessionStorage.setItem(
      journeySessionStorageKey,
      JSON.stringify(nextPayload)
    );
  } catch {
    // Journey state is progressive enhancement over the existing route flow.
  }

  return nextPayload;
}

export function patchJourneySession(
  patch:
    | Partial<JourneySessionPayload>
    | ((current: JourneySessionPayload | null) => Partial<JourneySessionPayload>)
) {
  const current = readJourneySession();
  const resolvedPatch = typeof patch === "function" ? patch(current) : patch;
  const nextPayload = createJourneySession({
    ...(current ?? {}),
    ...resolvedPatch
  });

  return writeJourneySession(nextPayload);
}

