"use client";

import Link from "next/link";

import {
  journeyChallengeStorageKey,
  journeyDiagnosisAnswersStorageKey,
  journeyDiagnosisInterpretationStorageKey
} from "@/src/features/recommendation-journey/diagnosisIntelligence";
import { journeySessionStorageKey } from "@/src/features/recommendation-journey/journeySession";

export function GuideMeInsteadLink() {
  function startGuidedDiagnosis() {
    try {
      window.sessionStorage.removeItem(journeyChallengeStorageKey);
      window.sessionStorage.removeItem(journeyDiagnosisAnswersStorageKey);
      window.sessionStorage.removeItem(
        journeyDiagnosisInterpretationStorageKey
      );
      window.sessionStorage.removeItem(journeySessionStorageKey);
    } catch {
      // The guided route still works when browser storage is unavailable.
    }
  }

  return (
    <Link
      className="homepage-composer-guidance__link"
      href="/internal/journey/diagnosis"
      onClick={startGuidedDiagnosis}
    >
      Guide me instead
    </Link>
  );
}
