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
  diagnosisAnswersToSelectedOptionIds
} = require("../src/features/recommendation-journey/journeyWorkshopAdapter.ts");
const {
  getLibraryDataset
} = require("../lib/product-system/library-read-model.ts");
const {
  createLibraryWorkshop
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
