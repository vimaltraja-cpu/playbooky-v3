import {
  diagnosisQuestions,
  type DiagnosisQuestionId
} from "@/lib/design-system/diagnosis-options";

export const journeyChallengeStorageKey = "playbooky.journey.challenge";
export const journeyDiagnosisInterpretationStorageKey =
  "playbooky.journey.diagnosisInterpretation";
export const journeyDiagnosisAnswersStorageKey =
  "playbooky.journey.diagnosisAnswers";

export type DiagnosisIntelligenceSource = "composer" | "diagnosis";
export type DiagnosisDimensionStatus = "resolved" | "unresolved";

export type DiagnosisDimension = {
  id: DiagnosisQuestionId;
  questionId: DiagnosisQuestionId;
  purpose: string;
};

export type DiagnosisDimensionResolution = {
  confidence: number;
  optionIds: string[];
  questionId: DiagnosisQuestionId;
  rationale: string[];
  source?: DiagnosisIntelligenceSource;
  status: DiagnosisDimensionStatus;
};

export type DiagnosisAnswerProvenance = {
  optionIds: string[];
  questionId: DiagnosisQuestionId;
  source: DiagnosisIntelligenceSource;
};

export type ComposerDiagnosisInterpretation = {
  challenge: string;
  dimensions: Record<DiagnosisQuestionId, DiagnosisDimensionResolution>;
  resolvedAnswers: Partial<Record<DiagnosisQuestionId, DiagnosisAnswerProvenance>>;
};

export type DiagnosisAnswersByQuestion = Partial<Record<DiagnosisQuestionId, string[]>>;

type OptionSignal = {
  confidence: number;
  optionId: string;
  patterns: RegExp[];
  rationale: string;
};

const RESOLUTION_THRESHOLD = 0.84;

export const diagnosisDimensions: DiagnosisDimension[] = [
  {
    id: "goals",
    purpose:
      "Identifies the primary job the workshop needs to do for the group.",
    questionId: "goals"
  },
  {
    id: "challenges",
    purpose:
      "Identifies what is currently blocking progress or making the situation hard.",
    questionId: "challenges"
  },
  {
    id: "context",
    purpose:
      "Identifies situational signals that should shape the workshop design.",
    questionId: "context"
  },
  {
    id: "participants",
    purpose:
      "Identifies which participant group needs to be involved in the workshop.",
    questionId: "participants"
  },
  {
    id: "outcome",
    purpose:
      "Identifies the concrete change or output the workshop should create.",
    questionId: "outcome"
  }
];

const optionSignals: Record<DiagnosisQuestionId, OptionSignal[]> = {
  challenges: [
    {
      confidence: 0.86,
      optionId: "alignment-issues",
      patterns: [
        /\bmisalign(?:ed|ment)?\b/,
        /\balign(?:ing|ment)?\b[^.?!]{0,48}\bteam\b/,
        /\bnot on the same page\b/,
        /\bpulling in different directions\b/
      ],
      rationale: "The prompt describes alignment friction."
    },
    {
      confidence: 0.84,
      optionId: "unclear-priorities",
      patterns: [
        /\bunclear priorit(?:y|ies)\b/,
        /\bcompeting priorities\b/,
        /\btoo many priorities\b/,
        /\bfocus\b[^.?!]{0,36}\bpriorit/,
        /\bpriorit(?:y|ies)\b[^.?!]{0,36}\b(?:unclear|confusing|competing)\b/
      ],
      rationale: "The prompt says priorities need focus or clarity."
    },
    {
      confidence: 0.84,
      optionId: "too-many-ideas",
      patterns: [
        /\btoo many ideas\b/,
        /\btoo many options\b/,
        /\bnarrow (?:them|things|options|ideas) down\b/,
        /\bchoose between\b[^.?!]{0,36}\boptions\b/
      ],
      rationale: "The prompt describes too many possible directions."
    },
    {
      confidence: 0.84,
      optionId: "slow-decision-making",
      patterns: [
        /\bslow decision/,
        /\bdecisions? (?:are )?(?:taking too long|circling|stuck)\b/,
        /\bcan't decide\b/,
        /\bcan not decide\b/
      ],
      rationale: "The prompt describes decisions not resolving."
    },
    {
      confidence: 0.84,
      optionId: "lack-of-ownership",
      patterns: [
        /\black of ownership\b/,
        /\bunclear ownership\b/,
        /\bno owner\b/,
        /\bowners?\b[^.?!]{0,36}\bunclear\b/
      ],
      rationale: "The prompt says ownership is unclear."
    },
    {
      confidence: 0.88,
      optionId: "performance-issues",
      patterns: [
        /\bconversion\b[^.?!]{0,40}\b(?:drop|dropped|declin|fall|fell)\b/,
        /\b(?:drop|dropped|declin|fall|fell)\b[^.?!]{0,40}\bconversion\b/,
        /\bperformance\b/,
        /\bdelivery\b[^.?!]{0,36}\b(?:issue|problem|slowing|slow)\b/,
        /\bquality\b[^.?!]{0,36}\b(?:issue|problem|drop|declin)\b/
      ],
      rationale: "The prompt names a performance or metric issue."
    }
  ],
  context: [
    {
      confidence: 0.86,
      optionId: "new-team-or-initiative",
      patterns: [
        /\bnew (?:initiative|project|product|team)\b[^.?!]{0,64}\b(?:launch|start|kick ?off|forming|formed)\b/,
        /\b(?:launch|start|kick ?off)\b[^.?!]{0,64}\bnew (?:initiative|project|product|team)\b/,
        /\bfrom the start\b[^.?!]{0,64}\b(?:direction|alignment|priorit|plan)\b/
      ],
      rationale: "The prompt describes a new team, project or initiative."
    },
    {
      confidence: 0.86,
      optionId: "scaling-or-growth",
      patterns: [
        /\bscal(?:e|ing)\b[^.?!]{0,64}\b(?:team|organisation|organization|process|work|delivery|coordination)\b/,
        /\b(?:growth|growing)\b[^.?!]{0,64}\b(?:team|organisation|organization|process|work|delivery|coordination)\b/,
        /\bcoordinate work\b/
      ],
      rationale: "The prompt describes growth or scaling context."
    },
    {
      confidence: 0.88,
      optionId: "change-or-transition",
      patterns: [
        /\bafter\b[^.?!]{0,80}\b(?:changed?|launched|rolled out|introduced)\b/,
        /\bsince\b[^.?!]{0,80}\b(?:changed?|launched|rolled out|introduced)\b/,
        /\b(?:changed?|launched|rolled out|introduced)\b[^.?!]{0,80}\b(?:flow|process|strategy|structure|product|roadmap)\b/,
        /\breorg\b/,
        /\brestructure\b/,
        /\bshift in (?:strategy|structure|product|process)\b/
      ],
      rationale: "The prompt describes a transition or change context."
    },
    {
      confidence: 0.86,
      optionId: "cross-functional-collaboration",
      patterns: [
        /\bcross[ -]?functional\b[^.?!]{0,64}\b(?:work|collaboration|dependencies|alignment|conflict|roadmap)\b/,
        /\bproduct\b[^.?!]{0,64}\bengineering\b[^.?!]{0,64}\b(?:conflicting|different|misaligned|roadmaps?)\b/,
        /\bengineering\b[^.?!]{0,64}\bproduct\b[^.?!]{0,64}\b(?:conflicting|different|misaligned|roadmaps?)\b/,
        /\bacross (?:teams|departments|functions|boundaries)\b[^.?!]{0,64}\b(?:work|ownership|dependencies|alignment|conflict)\b/
      ],
      rationale: "The prompt names cross-functional participation or work."
    },
    {
      confidence: 0.84,
      optionId: "focus-priorities",
      patterns: [
        /\bconflicting priorit(?:y|ies)\b/,
        /\bcompeting priorit(?:y|ies)\b/,
        /\bwhat matters most\b/,
        /\bfocus\b[^.?!]{0,36}\bright now\b[^.?!]{0,36}\bbecause\b/
      ],
      rationale: "The prompt says priorities should shape the work."
    }
  ],
  goals: [
    {
      confidence: 0.86,
      optionId: "align-a-team",
      patterns: [
        /\balign\b/,
        /\balignment\b/,
        /\bshared (?:goal|direction|understanding|view)\b/,
        /\bsame page\b/
      ],
      rationale: "The prompt asks for alignment or shared direction."
    },
    {
      confidence: 0.86,
      optionId: "understand-a-problem",
      patterns: [
        /\bunderstand why\b/,
        /\bunderstand (?:the |our )?(?:problem|issue|cause|causes)\b/,
        /\broot causes?\b/,
        /\bdiagnos(?:e|is)\b/,
        /\bmake sense of\b/
      ],
      rationale: "The prompt asks to understand a problem or cause."
    },
    {
      confidence: 0.84,
      optionId: "make-decisions",
      patterns: [
        /\bagree\b[^.?!]{0,40}\b(?:problem|direction|decision|trade-offs?)\b/,
        /\bdecid(?:e|ing|e on)\b/,
        /\bcommit to a direction\b/,
        /\bchoose\b[^.?!]{0,36}\bdirection\b/
      ],
      rationale: "The prompt asks the group to agree or decide."
    },
    {
      confidence: 0.84,
      optionId: "new-ideas",
      patterns: [
        /\bgenerate (?:ideas|options|possibilities)\b/,
        /\bnew ideas\b/,
        /\bbrainstorm\b/,
        /\bideat(?:e|ion)\b/
      ],
      rationale: "The prompt asks for new ideas."
    },
    {
      confidence: 0.86,
      optionId: "create-an-action-plan",
      patterns: [
        /\baction plan\b/,
        /\bclear actions?\b/,
        /\bnext steps\b/,
        /\bowners? and next steps\b/
      ],
      rationale: "The prompt asks for actions or an action plan."
    }
  ],
  outcome: [
    {
      confidence: 0.86,
      optionId: "clear-alignment",
      patterns: [
        /\bleave\b[^.?!]{0,64}\b(?:aligned|shared understanding|clear alignment)\b/,
        /\bproduce\b[^.?!]{0,64}\b(?:clear alignment|shared understanding)\b/,
        /\bend (?:with|up with)\b[^.?!]{0,64}\b(?:clear alignment|shared understanding)\b/,
        /\bagree\b[^.?!]{0,44}\bmain problem\b/
      ],
      rationale: "The desired end state includes shared understanding or alignment."
    },
    {
      confidence: 0.84,
      optionId: "better-decisions",
      patterns: [
        /\bleave\b[^.?!]{0,64}\b(?:better decisions?|stronger choices|clearer trade-offs?)\b/,
        /\bproduce\b[^.?!]{0,64}\b(?:better decisions?|stronger choices|clearer trade-offs?)\b/,
        /\bend (?:with|up with)\b[^.?!]{0,64}\b(?:better decisions?|stronger choices|clearer trade-offs?)\b/
      ],
      rationale: "The desired end state includes better decisions."
    },
    {
      confidence: 0.9,
      optionId: "actionable-plan",
      patterns: [
        /\bleave\b[^.?!]{0,64}\b(?:action plan|clear actions?|actionable plan|practical actions?|next steps)\b/,
        /\bproduce\b[^.?!]{0,64}\b(?:action plan|clear actions?|actionable plan|practical actions?|next steps)\b/,
        /\bend (?:with|up with)\b[^.?!]{0,64}\b(?:action plan|clear actions?|actionable plan|practical actions?|next steps)\b/,
        /\bwant\b[^.?!]{0,40}\bleave\b[^.?!]{0,64}\b(?:action plan|clear actions?|actionable plan|practical actions?|next steps)\b/,
        /\bneed\b[^.?!]{0,40}\bleave\b[^.?!]{0,64}\b(?:action plan|clear actions?|actionable plan|practical actions?|next steps)\b/
      ],
      rationale: "The desired end state includes concrete actions."
    },
    {
      confidence: 0.84,
      optionId: "stronger-collaboration",
      patterns: [
        /\bleave\b[^.?!]{0,64}\b(?:stronger collaboration|shared ownership|trust)\b/,
        /\bproduce\b[^.?!]{0,64}\b(?:stronger collaboration|shared ownership|trust)\b/,
        /\bend (?:with|up with)\b[^.?!]{0,64}\b(?:stronger collaboration|shared ownership|trust)\b/,
        /\bwork better together\b[^.?!]{0,64}\bby the end\b/
      ],
      rationale: "The desired end state includes stronger collaboration."
    },
    {
      confidence: 0.82,
      optionId: "outcome-focus-priorities",
      patterns: [
        /\bleave\b[^.?!]{0,64}\b(?:focused priorities|top .*priorities|priorities matter most)\b/,
        /\bproduce\b[^.?!]{0,64}\b(?:focused priorities|top .*priorities|priorities matter most)\b/,
        /\bagree\b[^.?!]{0,64}\btop (?:three |3 )?priorit/
      ],
      rationale: "The desired end state includes priority focus."
    }
  ],
  participants: [
    {
      confidence: 0.84,
      optionId: "core-team-members",
      patterns: [
        /\bcore team\b/,
        /\bpeople closest to the work\b/,
        /\bproject team\b/
      ],
      rationale: "The prompt names the core team."
    },
    {
      confidence: 0.86,
      optionId: "team-leads-or-managers",
      patterns: [
        /\bteam leads?\b/,
        /\bmanagers?\b/,
        /\bproduct and engineering leads?\b/,
        /\bleads?\b[^.?!]{0,36}\b(?:product|engineering|design|marketing|sales)\b/
      ],
      rationale: "The prompt names leads or managers."
    },
    {
      confidence: 0.86,
      optionId: "executives-or-sponsors",
      patterns: [
        /\bleadership team\b/,
        /\bexecutives?\b/,
        /\bsenior stakeholders?\b/,
        /\bsponsors?\b/,
        /\bleaders?\b[^.?!]{0,24}\bteam\b/
      ],
      rationale: "The prompt names leaders, executives or sponsors."
    },
    {
      confidence: 0.84,
      optionId: "customers-or-users",
      patterns: [
        /\bcustomers?\b/,
        /\busers?\b/,
        /\buser feedback\b/,
        /\bcustomer feedback\b/
      ],
      rationale: "The prompt names users or customers."
    },
    {
      confidence: 0.82,
      optionId: "other-departments",
      patterns: [
        /\bother departments?\b/,
        /\bacross departments?\b/,
        /\bacross functions?\b/,
        /\bproduct\b[^.?!]{0,48}\bengineering\b/,
        /\bengineering\b[^.?!]{0,48}\bproduct\b/
      ],
      rationale: "The prompt names work crossing teams or departments."
    }
  ]
};

const emptyDimension = (
  questionId: DiagnosisQuestionId
): DiagnosisDimensionResolution => ({
  confidence: 0,
  optionIds: [],
  questionId,
  rationale: [],
  status: "unresolved"
});

function normaliseChallenge(challenge: string) {
  return challenge.trim().toLowerCase().replace(/\s+/g, " ");
}

function scoreDimension(
  questionId: DiagnosisQuestionId,
  normalisedChallenge: string
): DiagnosisDimensionResolution {
  if (!normalisedChallenge) {
    return emptyDimension(questionId);
  }

  const matches = optionSignals[questionId]
    .map((signal) => {
      const matched = signal.patterns.some((pattern) =>
        pattern.test(normalisedChallenge)
      );

      return matched ? signal : null;
    })
    .filter((signal): signal is OptionSignal => Boolean(signal))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 2);

  const confidence = matches[0]?.confidence ?? 0;

  if (confidence < RESOLUTION_THRESHOLD) {
    return emptyDimension(questionId);
  }

  return {
    confidence,
    optionIds: matches.map((match) => match.optionId),
    questionId,
    rationale: matches.map((match) => match.rationale),
    source: "composer",
    status: "resolved"
  };
}

export function interpretComposerChallenge(
  challenge: string
): ComposerDiagnosisInterpretation {
  const normalisedChallenge = normaliseChallenge(challenge);
  const dimensions = diagnosisQuestions.reduce(
    (result, question) => {
      result[question.id] = scoreDimension(question.id, normalisedChallenge);
      return result;
    },
    {} as Record<DiagnosisQuestionId, DiagnosisDimensionResolution>
  );
  const resolvedAnswers = diagnosisQuestions.reduce(
    (result, question) => {
      const resolution = dimensions[question.id];

      if (resolution.status === "resolved" && resolution.optionIds.length > 0) {
        result[question.id] = {
          optionIds: resolution.optionIds,
          questionId: question.id,
          source: "composer"
        };
      }

      return result;
    },
    {} as Partial<Record<DiagnosisQuestionId, DiagnosisAnswerProvenance>>
  );

  return {
    challenge,
    dimensions,
    resolvedAnswers
  };
}

export function getUnresolvedDiagnosisQuestions(
  interpretation: ComposerDiagnosisInterpretation
) {
  return diagnosisQuestions.filter(
    (question) => interpretation.dimensions[question.id].status !== "resolved"
  );
}

export function getResolvedComposerDimensionCount(
  interpretation: ComposerDiagnosisInterpretation
) {
  return diagnosisQuestions.filter(
    (question) => interpretation.dimensions[question.id].status === "resolved"
  ).length;
}

export function mergeDiagnosisAnswers(
  interpretation: ComposerDiagnosisInterpretation,
  diagnosisAnswers: DiagnosisAnswersByQuestion
): Partial<Record<DiagnosisQuestionId, DiagnosisAnswerProvenance>> {
  const merged = { ...interpretation.resolvedAnswers };

  diagnosisQuestions.forEach((question) => {
    const optionIds = diagnosisAnswers[question.id];

    if (Array.isArray(optionIds) && optionIds.length > 0) {
      merged[question.id] = {
        optionIds,
        questionId: question.id,
        source: "diagnosis"
      };
    }
  });

  return merged;
}
