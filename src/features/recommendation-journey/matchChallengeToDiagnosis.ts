import type {
  DiagnosisOption,
  DiagnosisQuestion
} from "@/lib/design-system/diagnosis-options";

export type DynamicDiagnosisMatch = {
  matchedOptionIds: string[];
  questionId: string;
  score: number;
};

export type DynamicDiagnosisResult = {
  matchedAnswers: Record<string, string[]>;
  matches: DynamicDiagnosisMatch[];
  questionsToAsk: DiagnosisQuestion[];
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "our",
  "the",
  "to",
  "we",
  "with",
  "yet"
]);

const OPTION_ALIASES: Record<string, string[]> = {
  "align-a-team": ["align", "alignment", "aligned", "shared goal", "same page"],
  "understand-a-problem": [
    "understand",
    "root cause",
    "problem space",
    "unclear problem",
    "discovery"
  ],
  "make-decisions": ["decide", "decision", "decisions", "commit", "choose"],
  "new-ideas": ["ideate", "ideation", "brainstorm", "new ideas", "concepts"],
  "create-an-action-plan": [
    "action plan",
    "next steps",
    "ownership",
    "roadmap"
  ],
  "alignment-issues": [
    "misaligned",
    "not aligned",
    "different directions",
    "alignment issues"
  ],
  "unclear-priorities": [
    "priorities",
    "prioritise",
    "prioritize",
    "too many priorities",
    "focus"
  ],
  "too-many-ideas": ["too many ideas", "many options", "narrow down"],
  "slow-decision-making": [
    "slow decisions",
    "decision making",
    "can't decide",
    "circling"
  ],
  "lack-of-ownership": ["ownership", "accountability", "who owns"],
  "performance-issues": ["delivery", "quality", "momentum", "performance"],
  "new-team-or-initiative": ["new team", "new initiative", "new project"],
  "scaling-or-growth": ["scaling", "growth", "growing"],
  "change-or-transition": ["change", "transition", "reorg", "transformation"],
  "cross-functional-collaboration": [
    "cross-functional",
    "cross functional",
    "multiple teams",
    "across teams"
  ],
  "focus-priorities": ["focus", "priorities", "priority"],
  "core-team-members": ["core team", "delivery team"],
  "team-leads-or-managers": ["team leads", "managers", "leads"],
  "executives-or-sponsors": [
    "executives",
    "sponsors",
    "leadership",
    "stakeholders"
  ],
  "customers-or-users": ["customers", "users", "customers or users"],
  "other-departments": ["other departments", "other teams"],
  "clear-alignment": ["shared understanding", "clear alignment", "aligned"],
  "better-decisions": ["better decisions", "trade-offs", "trade offs"],
  "actionable-plan": [
    "actionable plan",
    "next steps",
    "owners",
    "action plan"
  ],
  "stronger-collaboration": ["collaboration", "trust", "ways of working"],
  "outcome-focus-priorities": ["focused priorities", "what matters most"]
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function scoreOption(challenge: string, option: DiagnosisOption) {
  const normalizedChallenge = normalizeText(challenge);
  const challengeTokens = new Set(tokenize(challenge));
  let score = 0;

  const label = normalizeText(option.label);
  if (label && normalizedChallenge.includes(label)) {
    score += 6;
  }

  for (const token of tokenize(option.label)) {
    if (challengeTokens.has(token)) {
      score += 2;
    }
  }

  for (const token of tokenize(option.description)) {
    if (challengeTokens.has(token)) {
      score += 1;
    }
  }

  for (const alias of OPTION_ALIASES[option.id] ?? []) {
    const normalizedAlias = normalizeText(alias);

    if (normalizedAlias && normalizedChallenge.includes(normalizedAlias)) {
      score += normalizedAlias.includes(" ") ? 5 : 3;
    }
  }

  return score;
}

/**
 * Phase 1 Dynamic Diagnosis matcher.
 * Deterministic keyword / phrase matching against diagnosis options.
 * Later phases may replace scoring with AI extraction while keeping this contract.
 */
export function matchChallengeToDiagnosis(
  challenge: string,
  questions: DiagnosisQuestion[]
): DynamicDiagnosisResult {
  const trimmedChallenge = challenge.trim();

  if (!trimmedChallenge) {
    return {
      matchedAnswers: {},
      matches: [],
      questionsToAsk: questions
    };
  }

  const matchedAnswers: Record<string, string[]> = {};
  const matches: DynamicDiagnosisMatch[] = [];

  for (const question of questions) {
    const rankedOptions = question.options
      .map((option) => ({
        option,
        score: scoreOption(trimmedChallenge, option)
      }))
      .filter((entry) => entry.score >= 4)
      .sort((first, second) => second.score - first.score);

    if (rankedOptions.length === 0) {
      continue;
    }

    const selected = rankedOptions
      .slice(0, Math.min(2, rankedOptions.length))
      .filter((entry, index, list) => {
        if (index === 0) {
          return true;
        }

        // Keep a second option only when it is competitively close.
        return entry.score >= list[0].score - 2 && entry.score >= 5;
      })
      .map((entry) => entry.option.id);

    if (selected.length === 0) {
      continue;
    }

    matchedAnswers[question.id] = selected;
    matches.push({
      matchedOptionIds: selected,
      questionId: question.id,
      score: rankedOptions[0].score
    });
  }

  const questionsToAsk = questions.filter(
    (question) => !matchedAnswers[question.id]?.length
  );

  return {
    matchedAnswers,
    matches,
    questionsToAsk
  };
}
