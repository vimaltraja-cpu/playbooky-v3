/* eslint-disable @typescript-eslint/no-require-imports */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const repositoryRoot = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveRepositoryAlias(
  request,
  parent,
  isMain,
  options
) {
  const resolvedRequest = request.startsWith("@/")
    ? path.join(repositoryRoot, request.slice(2))
    : request;

  return originalResolveFilename.call(
    this,
    resolvedRequest,
    parent,
    isMain,
    options
  );
};

for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = function transpileTypeScript(
    module,
    filename
  ) {
    const source = fs.readFileSync(filename, "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: {
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022
      }
    }).outputText;

    module._compile(output, filename);
  };
}

require.extensions[".css"] = function ignoreCss(module) {
  module.exports = {};
};

const {
  interpretComposerChallenge
} = require("../src/features/recommendation-journey/diagnosisIntelligence.ts");
const {
  diagnosisAnswersToPlaybookOptionIds,
  diagnosisAnswersToSelectedOptionIds,
  createSessionWorkshopFromDiagnosis
} = require("../src/features/recommendation-journey/journeyWorkshopAdapter.ts");
const {
  getLibraryDataset
} = require("../lib/product-system/library-read-model.ts");
const {
  createLibraryWorkshop,
  createRecommendedPlaybook
} = require("../lib/workshop-os/create-library-workshop.ts");

test("Composer interpretation preserves multiple resolved signals", () => {
  const interpretation = interpretComposerChallenge(
    "Our leadership team needs to align on a shared direction and leave with clear next steps."
  );

  assert.deepEqual(interpretation.resolvedAnswers.goals?.optionIds, [
    "align-a-team",
    "create-an-action-plan"
  ]);
  assert.deepEqual(interpretation.resolvedAnswers.participants?.optionIds, [
    "executives-or-sponsors"
  ]);
  assert.deepEqual(interpretation.resolvedAnswers.outcome?.optionIds, [
    "actionable-plan"
  ]);
});

test("Diagnosis adapter preserves every selected option", () => {
  const selectedOptionIds = diagnosisAnswersToSelectedOptionIds({
    goals: {
      optionIds: ["understand-a-problem", "create-an-action-plan"],
      questionId: "goals",
      source: "diagnosis"
    }
  });

  assert.deepEqual(selectedOptionIds, {
    goals: ["understand-a-problem", "create-an-action-plan"]
  });
});

test("Recommendation engine combines rules from multi-select answers", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createLibraryWorkshop(
    dataset,
    {
      goals: ["understand-a-problem", "create-an-action-plan"]
    },
    120
  );

  assert.deepEqual(
    workshop.matchedRules.map((rule) => rule.id),
    [
      "root-cause-unknown",
      "problem-not-clearly-defined",
      "need-actions-and-ownership"
    ]
  );
  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    ["block-five-whys", "block-problem-statement", "block-who-what-when"]
  );
  assert.equal(workshop.totalDuration, 120);
});

test("Recommendation engine remains compatible with single-value presets", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createLibraryWorkshop(
    dataset,
    { goals: "understand-a-problem" },
    120
  );

  assert.equal(workshop.fallbackUsed, false);
  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    ["block-five-whys", "block-problem-statement"]
  );
});

test("Alignment resolves the canonical OKR block", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createLibraryWorkshop(
    dataset,
    { goals: ["align-a-team"] },
    120
  );

  assert.deepEqual(
    workshop.matchedRules.map((rule) => rule.id),
    ["no-clear-goal", "need-alignment-on-options"]
  );
  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    [
      "block-objectives-and-key-results-okrs",
      "block-blind-vote",
      "block-how-might-we",
      "block-who-what-when"
    ]
  );
  assert.equal(workshop.totalDuration, 120);
  assert.equal(
    workshop.excluded.some(
      (candidate) => candidate.rule.id === "no-clear-goal" && !candidate.block
    ),
    false
  );
});

test("Goal and Challenge signals compose in deterministic order", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createLibraryWorkshop(
    dataset,
    {
      challenges: ["performance-issues"],
      goals: ["understand-a-problem"]
    },
    120
  );

  assert.deepEqual(
    workshop.matchedRules.map((rule) => rule.id),
    [
      "root-cause-unknown",
      "problem-not-clearly-defined",
      "need-team-reflection"
    ]
  );
  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    ["block-five-whys", "block-problem-statement"]
  );
  assert.equal(workshop.totalDuration, 105);
});

test("Goal and Outcome signals combine core and closing work", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createLibraryWorkshop(
    dataset,
    {
      goals: ["new-ideas"],
      outcome: ["actionable-plan"]
    },
    120
  );

  assert.deepEqual(
    workshop.matchedRules.map((rule) => rule.id),
    ["need-more-ideas", "need-actions-and-ownership"]
  );
  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    ["block-how-might-we", "block-who-what-when", "block-impact-effort-map"]
  );
  assert.equal(workshop.totalDuration, 100);
});

test("Overlapping signals deduplicate rules and blocks", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createLibraryWorkshop(
    dataset,
    {
      context: ["focus-priorities"],
      outcome: ["outcome-focus-priorities"]
    },
    120
  );

  assert.deepEqual(
    workshop.matchedRules.map((rule) => rule.id),
    ["need-clear-priorities"]
  );
  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    ["block-priority-map", "block-start-stop-continue"]
  );
});

test("Not-sure input explicitly selects the Discovery rules", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createLibraryWorkshop(
    dataset,
    { goals: ["not-sure"] },
    120
  );

  assert.equal(workshop.fallbackUsed, false);
  assert.deepEqual(
    workshop.matchedRules.map((rule) => rule.id),
    ["root-cause-unknown", "problem-not-clearly-defined"]
  );
  assert.equal(
    workshop.trace.find((entry) => entry.optionId === "not-sure")?.status,
    "mapped"
  );
  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    ["block-five-whys", "block-problem-statement"]
  );
});

test("Playbook construction uses intent and explicit uncertainty signals only", () => {
  const selectedOptionIds = diagnosisAnswersToPlaybookOptionIds({
    context: {
      optionIds: ["change-or-transition", "context-not-sure"],
      questionId: "context",
      source: "diagnosis"
    },
    goals: {
      optionIds: ["understand-a-problem"],
      questionId: "goals",
      source: "diagnosis"
    },
    participants: {
      optionIds: ["executives-or-sponsors"],
      questionId: "participants",
      source: "diagnosis"
    }
  });

  assert.deepEqual(selectedOptionIds, {
    context: ["context-not-sure"],
    goals: ["understand-a-problem"]
  });
});

test("Recommended playbook follows canonical dependency order", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createRecommendedPlaybook(dataset, {
    goals: ["new-ideas"],
    outcome: ["actionable-plan"]
  });

  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    [
      "block-how-might-we",
      "block-impact-effort-map",
      "block-priority-map",
      "block-who-what-when"
    ]
  );
  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.origin),
    ["diagnosis-adapter", "what-next", "what-next", "diagnosis-adapter"]
  );
  assert.equal(workshop.totalDuration, 145);
});

test("Recommended playbook handles each primary Goal deterministically", async () => {
  const dataset = await getLibraryDataset();
  const cases = [
    [
      "align-a-team",
      ["block-objectives-and-key-results-okrs", "block-blind-vote"],
      65
    ],
    [
      "understand-a-problem",
      ["block-five-whys", "block-problem-statement"],
      105
    ],
    ["make-decisions", ["block-priority-map", "block-blind-vote"], 50],
    [
      "new-ideas",
      ["block-how-might-we", "block-impact-effort-map", "block-priority-map"],
      130
    ],
    ["create-an-action-plan", ["block-who-what-when"], 15]
  ];

  for (const [goal, expectedBlocks, expectedDuration] of cases) {
    const workshop = createRecommendedPlaybook(dataset, { goals: [goal] });

    assert.deepEqual(
      workshop.selected.map((candidate) => candidate.block?.id),
      expectedBlocks
    );
    assert.equal(workshop.totalDuration, expectedDuration);
  }
});

test("Goal, Challenge and Outcome construct one coherent playbook", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createRecommendedPlaybook(dataset, {
    challenges: ["too-many-ideas"],
    goals: ["new-ideas"],
    outcome: ["actionable-plan"]
  });

  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    [
      "block-how-might-we",
      "block-impact-effort-map",
      "block-priority-map",
      "block-who-what-when"
    ]
  );
  assert.equal(workshop.totalDuration, 145);
});

test("Multiple answers retain deterministic sequence and provenance", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createRecommendedPlaybook(dataset, {
    goals: ["understand-a-problem", "new-ideas"]
  });

  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    [
      "block-five-whys",
      "block-problem-statement",
      "block-how-might-we",
      "block-impact-effort-map",
      "block-priority-map"
    ]
  );
  assert.equal(workshop.totalDuration, 235);
});

test("Action-only intent is not silently treated as a complete playbook", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createRecommendedPlaybook(dataset, {
    goals: ["create-an-action-plan"],
    outcome: ["actionable-plan"]
  });

  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    ["block-who-what-when"]
  );
  assert.equal(
    workshop.warnings.includes(
      "Action-plan intent did not provide enough upstream workshop context to construct a complete multi-activity playbook."
    ),
    true
  );
});

test("Unmapped collaboration-only intent does not become arbitrary Discovery", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createRecommendedPlaybook(dataset, {
    outcome: ["stronger-collaboration"]
  });

  assert.deepEqual(workshop.selected, []);
  assert.equal(workshop.totalDuration, 0);
  assert.deepEqual(workshop.warnings, [
    "The supplied intent does not yet have enough approved canonical recommendation logic to construct a playbook."
  ]);
});

test("Real journey derives duration and is not capped at 120 minutes", async () => {
  const dataset = await getLibraryDataset();
  const generated = createSessionWorkshopFromDiagnosis({
    brief: "Generate ideas, decide what matters, and leave with owners.",
    dataset,
    diagnosisAnswers: {
      goals: {
        optionIds: ["new-ideas"],
        questionId: "goals",
        source: "diagnosis"
      },
      outcome: {
        optionIds: ["actionable-plan"],
        questionId: "outcome",
        source: "diagnosis"
      }
    }
  });

  const canonicalDuration = generated.workshop.selected.reduce(
    (total, candidate) => total + candidate.duration,
    0
  );

  assert.equal(canonicalDuration, 145);
  assert.equal(generated.generatedWorkshop.totalDuration, canonicalDuration);
  assert.equal(generated.generatedWorkshop.durationMinutes, canonicalDuration);
});

test("Action-planning remains a truthful single-activity result", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createLibraryWorkshop(
    dataset,
    { goals: ["create-an-action-plan"] },
    120
  );

  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.block?.id),
    ["block-who-what-when"]
  );
  assert.equal(workshop.totalDuration, 15);
  assert.equal(
    workshop.warnings.some((warning) => warning.includes("Only one compatible")),
    true
  );
});

test("No-fit duration returns no activities and an explicit warning", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createLibraryWorkshop(
    dataset,
    { goals: ["understand-a-problem"] },
    30
  );

  assert.deepEqual(workshop.selected, []);
  assert.equal(workshop.totalDuration, 0);
  assert.equal(
    workshop.warnings.includes(
      "No compatible activities fit within the requested 30-minute workshop duration."
    ),
    true
  );
});

test("Constructor never knowingly exceeds its duration limit", async () => {
  const dataset = await getLibraryDataset();
  const cases = [
    { goals: ["align-a-team"] },
    { goals: ["understand-a-problem"] },
    { goals: ["make-decisions", "create-an-action-plan"] },
    { challenges: ["performance-issues", "too-many-ideas"] },
    { outcome: ["clear-alignment", "actionable-plan"] },
    {}
  ];

  for (const duration of [0, 15, 30, 45, 60, 90, 120]) {
    for (const selections of cases) {
      const workshop = createLibraryWorkshop(dataset, selections, duration);

      assert.equal(
        workshop.totalDuration <= duration,
        true,
        `${workshop.totalDuration} exceeded ${duration} for ${JSON.stringify(selections)}`
      );
    }
  }
});
