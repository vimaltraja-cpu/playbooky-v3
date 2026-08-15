/* eslint-disable @typescript-eslint/no-require-imports */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const lifecyclePath = path.resolve(
  __dirname,
  "../lib/facilitator-guide/steps-render-lifecycle.ts"
);
const lifecycleSource = fs.readFileSync(lifecyclePath, "utf8");
const lifecycleModule = { exports: {} };

new Function(
  "module",
  "exports",
  ts.transpileModule(lifecycleSource, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText
)(lifecycleModule, lifecycleModule.exports);

const {
  getFacilitatorStepsIdentity,
  getFacilitatorStepsReadyDelay
} = lifecycleModule.exports;

test("stable selected activity always has a finite building-to-ready plan", () => {
  assert.equal(getFacilitatorStepsReadyDelay(false, false), 1640);
  assert.equal(getFacilitatorStepsReadyDelay(true, false), 1280);
  assert.equal(getFacilitatorStepsReadyDelay(false, true), 0);
});

test("equivalent activity data and unrelated session updates preserve identity", () => {
  const before = getFacilitatorStepsIdentity("journey-map", ["one", "two"]);
  const afterEquivalentRemap = getFacilitatorStepsIdentity(
    "journey-map",
    ["replacement-one", "replacement-two"]
  );

  assert.equal(before, afterEquivalentRemap);
});

test("tab changes create a new lifecycle identity and returning restores it", () => {
  const first = getFacilitatorStepsIdentity("journey-map", ["one"]);
  const second = getFacilitatorStepsIdentity("five-whys", ["one"]);
  const returned = getFacilitatorStepsIdentity("journey-map", ["different"]);

  assert.notEqual(first, second);
  assert.equal(returned, first);
});

test("step IDs provide a stable fallback identity without an activity key", () => {
  assert.equal(
    getFacilitatorStepsIdentity(undefined, ["one", "two"]),
    getFacilitatorStepsIdentity(undefined, ["one", "two"])
  );
});
