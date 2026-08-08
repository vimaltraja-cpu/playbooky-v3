export const journeyChallengeStorageKey = "playbooky.journey.challenge";
export const journeyDiagnosisStorageKey = "playbooky.journey.diagnosisAnswers";

export type JourneyDiagnosisAnswers = Record<string, string[]>;

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function readJourneyChallenge(): string {
  if (!canUseSessionStorage()) {
    return "";
  }

  try {
    return window.sessionStorage.getItem(journeyChallengeStorageKey)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function writeJourneyChallenge(challenge: string) {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    const trimmedChallenge = challenge.trim();

    if (!trimmedChallenge) {
      window.sessionStorage.removeItem(journeyChallengeStorageKey);
      return;
    }

    window.sessionStorage.setItem(journeyChallengeStorageKey, trimmedChallenge);
  } catch {
    // Journey navigation can continue without durable storage.
  }
}

export function clearJourneyChallenge() {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(journeyChallengeStorageKey);
  } catch {
    // Ignore storage failures.
  }
}

export function readJourneyDiagnosisAnswers(): JourneyDiagnosisAnswers {
  if (!canUseSessionStorage()) {
    return {};
  }

  try {
    const raw = window.sessionStorage.getItem(journeyDiagnosisStorageKey);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as JourneyDiagnosisAnswers;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string[]] =>
          Array.isArray(entry[1]) &&
          entry[1].every((value) => typeof value === "string")
      )
    );
  } catch {
    return {};
  }
}

export function writeJourneyDiagnosisAnswers(answers: JourneyDiagnosisAnswers) {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.setItem(
      journeyDiagnosisStorageKey,
      JSON.stringify(answers)
    );
  } catch {
    // Journey navigation can continue without durable storage.
  }
}
