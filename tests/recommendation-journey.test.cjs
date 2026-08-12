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
const {
  getActivityGridRowCount
} = require("../lib/design-system/activity-grid-layout.ts");

test("Desktop Activity Grid reserves two rows for every supported card count", () => {
  for (let cardCount = 2; cardCount <= 7; cardCount += 1) {
    assert.equal(getActivityGridRowCount("desktop", cardCount + 1, 5), 2);
  }
});

test("Responsive Activity Grid row counts continue to follow their columns", () => {
  assert.equal(getActivityGridRowCount("tablet", 5, 3), 2);
  assert.equal(getActivityGridRowCount("mobile", 5, 1), 5);
});

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
  const workshop = createLibraryWorkshop(dataset, { goals: ["not-sure"] }, 120);

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

function canonicalIds(workshop) {
  return workshop.selected.map((candidate) => candidate.canonicalItemId);
}

test("Canonical routes resolve documented diagnosis scenarios", async () => {
  const dataset = await getLibraryDataset();
  const cases = [
    [
      { goals: ["understand-a-problem"] },
      "discovery-problem-understanding",
      150
    ],
    [{ goals: ["new-ideas"] }, "ideation", 90],
    [
      { goals: ["make-decisions"], outcome: ["better-decisions"] },
      "prioritisation-and-decision",
      75
    ],
    [
      { goals: ["align-a-team"], outcome: ["clear-alignment"] },
      "product-strategy-alignment",
      150
    ],
    [
      { challenges: ["alignment-issues"], outcome: ["actionable-plan"] },
      "stakeholder-alignment",
      195
    ],
    [
      { challenges: ["too-many-ideas"], outcome: ["actionable-plan"] },
      "mvp-definition",
      105
    ],
    [{ challenges: ["performance-issues"] }, "operational-root-cause", 180],
    [{ goals: ["not-sure"] }, "discovery-problem-understanding", 150]
  ];

  for (const [diagnosis, routeId, duration] of cases) {
    const workshop = createRecommendedPlaybook(dataset, diagnosis);
    assert.equal(workshop.selectedRoute?.id, routeId);
    assert.equal(workshop.totalDuration, duration);
  }
});

test("Canonical route preserves documented order and source identity", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createRecommendedPlaybook(dataset, {
    goals: ["understand-a-problem"]
  });

  assert.deepEqual(canonicalIds(workshop), [
    "activity-journey-map",
    "activity-five-whys",
    "activity-problem-statement"
  ]);
  assert.deepEqual(
    workshop.selected.map((candidate) => candidate.canonicalSource),
    ["activity", "activity", "activity"]
  );
});

test("Goal dominance wins while the next-highest need remains secondary", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createRecommendedPlaybook(dataset, {
    challenges: ["performance-issues"],
    goals: ["new-ideas"],
    outcome: ["better-decisions"]
  });

  assert.equal(workshop.stageRanking?.[0]?.stage, "ideas");
  assert.equal(workshop.stageRanking?.[1]?.stage, "understand");
  assert.equal(workshop.selectedRoute?.id, "ideation");
});

test("Action-only intent remains explicitly unresolved", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createRecommendedPlaybook(dataset, {
    goals: ["create-an-action-plan"],
    outcome: ["actionable-plan"]
  });

  assert.deepEqual(workshop.selected, []);
  assert.equal(workshop.totalDuration, 0);
  assert.match(workshop.warnings[0], /complete canonical playbook route/);
});

test("Unmapped collaboration-only intent does not become arbitrary Discovery", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createRecommendedPlaybook(dataset, {
    outcome: ["stronger-collaboration"]
  });
  assert.deepEqual(workshop.selected, []);
  assert.equal(workshop.totalDuration, 0);
});

test("Every successful canonical route contains 2–7 real canonical items", async () => {
  const dataset = await getLibraryDataset();

  for (const route of dataset.playbookRoutes) {
    const references = route.itemReferences;
    assert.equal(references.length >= 2 && references.length <= 7, true);
    for (const reference of references) {
      const collection =
        reference.source === "activity"
          ? dataset.activities
          : dataset.buildingBlocks;
      assert.equal(
        collection.some((item) => item.id === reference.id),
        true,
        `${route.id}: ${reference.id}`
      );
    }
  }
});

test("Previously oversized unions now select one bounded route", async () => {
  const dataset = await getLibraryDataset();
  const cases = [
    {
      goals: ["align-a-team"],
      challenges: ["too-many-ideas", "performance-issues"],
      outcome: ["clear-alignment", "actionable-plan"]
    },
    {
      goals: ["align-a-team", "new-ideas"],
      challenges: ["alignment-issues", "performance-issues"],
      outcome: ["clear-alignment"]
    },
    {
      goals: ["align-a-team", "new-ideas"],
      challenges: ["alignment-issues", "performance-issues"],
      outcome: ["clear-alignment", "actionable-plan"]
    },
    {
      goals: ["understand-a-problem", "new-ideas"],
      challenges: ["alignment-issues"],
      outcome: ["clear-alignment", "actionable-plan"]
    },
    {
      goals: ["understand-a-problem", "new-ideas"],
      challenges: ["unclear-priorities", "performance-issues"],
      outcome: ["better-decisions", "actionable-plan"]
    }
  ];

  for (const diagnosis of cases) {
    const workshop = createRecommendedPlaybook(dataset, diagnosis);
    assert.equal(
      workshop.selected.length >= 2 && workshop.selected.length <= 7,
      true
    );
  }
});

test("Optional future duration rejects whole incompatible routes without slicing", async () => {
  const dataset = await getLibraryDataset();
  const workshop = createRecommendedPlaybook(
    dataset,
    { goals: ["understand-a-problem"] },
    { requestedDurationMinutes: 90 }
  );

  assert.deepEqual(workshop.selected, []);
  assert.match(workshop.warnings[0], /requested 90-minute duration/);
});

test("Real journey duration equals the sum of canonical route activities", async () => {
  const dataset = await getLibraryDataset();
  const generated = createSessionWorkshopFromDiagnosis({
    brief: "Generate ideas and explore multiple approaches.",
    dataset,
    diagnosisAnswers: {
      goals: {
        optionIds: ["new-ideas"],
        questionId: "goals",
        source: "diagnosis"
      }
    }
  });
  const canonicalDuration = generated.workshop.selected.reduce(
    (total, candidate) => total + candidate.duration,
    0
  );

  assert.equal(canonicalDuration, 90);
  assert.equal(generated.generatedWorkshop.totalDuration, canonicalDuration);
  assert.equal(generated.generatedWorkshop.durationMinutes, canonicalDuration);
});

test("Journey activity state contains only genuine canonical route items", async () => {
  const dataset = await getLibraryDataset();
  const cases = [
    {
      diagnosisAnswers: {
        goals: {
          optionIds: ["understand-a-problem"],
          questionId: "goals",
          source: "diagnosis"
        }
      },
      routeId: "discovery-problem-understanding"
    },
    {
      diagnosisAnswers: {
        goals: {
          optionIds: ["new-ideas"],
          questionId: "goals",
          source: "diagnosis"
        }
      },
      routeId: "ideation"
    },
    {
      diagnosisAnswers: {
        goals: {
          optionIds: ["make-decisions"],
          questionId: "goals",
          source: "diagnosis"
        },
        outcome: {
          optionIds: ["better-decisions"],
          questionId: "outcome",
          source: "diagnosis"
        }
      },
      routeId: "prioritisation-and-decision"
    },
    {
      diagnosisAnswers: {
        goals: {
          optionIds: ["align-a-team"],
          questionId: "goals",
          source: "diagnosis"
        },
        outcome: {
          optionIds: ["clear-alignment"],
          questionId: "outcome",
          source: "diagnosis"
        }
      },
      routeId: "product-strategy-alignment"
    }
  ];

  for (const { diagnosisAnswers, routeId } of cases) {
    const route = dataset.playbookRoutes.find((item) => item.id === routeId);
    const generated = createSessionWorkshopFromDiagnosis({
      brief: routeId,
      dataset,
      diagnosisAnswers
    });
    const expectedIds = route.itemReferences.map((reference) => reference.id);

    assert.equal(generated.workshop.selectedRoute?.id, routeId);
    assert.equal(generated.activityCards.length, expectedIds.length);
    assert.deepEqual(
      generated.activityCards.map((card) => card.id),
      expectedIds
    );
    assert.deepEqual(
      generated.activityCards.map((card) => card.source),
      expectedIds.map(() => "generated")
    );
    assert.equal(
      generated.activityCards.some((card) => card.source === "fallback"),
      false
    );
    assert.equal(
      generated.activityCards.length >= 2 && generated.activityCards.length <= 7,
      true
    );
  }
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
    workshop.warnings.some((warning) =>
      warning.includes("Only one compatible")
    ),
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
