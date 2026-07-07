# AI Build Rules

This document is the canonical owner for how Codex and future AI agents modify the PlayBooky V3 repository.

## Purpose

AI build rules ensure that AI-assisted work changes the repository through documented intent, approved system decisions, and verifiable implementation.

They prevent AI agents from creating undocumented UI, bypassing the Design Portal, inventing product rules, or treating existing code as more authoritative than governed sources.

## Scope

These rules apply to:

- Codex work in this repository.
- Future AI agents modifying documentation, Design Portal pages, product screens, components, tokens, assets, data contracts, tests, or configuration.
- AI-generated implementation plans, code changes, review notes, and validation summaries.

These rules do not define source-of-truth hierarchy, lifecycle status, confidence rating, or governance ownership. Those are owned by [the Constitution](../01-foundation/constitution.md).

These rules do not define glossary terms. Use [the Glossary](../01-foundation/glossary.md).

## Responsibilities

AI agents are responsible for:

- Reading the relevant source-of-truth documents before editing.
- Identifying the owner document for any rule they add or change.
- Keeping changes scoped to the requested outcome.
- Preserving user and repository changes they did not make.
- Validating the result before reporting completion.
- Reporting incomplete checks, assumptions, and remaining risk.

Human requesters and reviewers are responsible for:

- Providing product intent when it is not already documented.
- Approving governance exceptions.
- Reviewing lifecycle movement and owner decisions.

## Required Behaviour

AI agents must begin by locating the relevant documentation, portal, and code context.

AI agents must implement from documented intent. If purpose, user need, success criteria, acceptance criteria, or owner information is missing for governed work, the AI agent must add or request the missing specification before treating implementation as complete.

AI agents must use existing repository patterns unless the relevant owner document or task requires a different pattern.

AI agents must keep source-of-truth alignment intact:

- Documentation describes the specification.
- The Design Portal expresses approved and current implementation decisions.
- Code executes the approved specification.

AI agents must avoid broad refactors unless the task requires them or the current implementation blocks a safe fix.

AI agents must not:

- Invent product strategy.
- Create new component variants locally in product pages.
- Promote a status or confidence rating without evidence.
- Treat placeholder documentation as an approved specification.
- Add decorative or product-facing UI outside the governed system.
- Delete, revert, or overwrite unrelated user work.
- Hide validation failures.

## Build Workflow

### 1. Understand

Identify:

- The requested outcome.
- The affected source-of-truth areas.
- The relevant owner documents.
- Existing implementation patterns.
- Required validation.

If the request conflicts with the Constitution, the AI agent must report the conflict and follow the Constitution unless the user explicitly asks to amend it.

### 2. Specify

Before implementation, confirm that governed work has:

- Purpose.
- User need when applicable.
- Success criteria.
- Acceptance criteria.
- Owner.
- Status and confidence when lifecycle metadata is required.
- Used-in impact when the item is reused.

If the specification is missing and the task asks for implementation, the AI agent should add the minimal required specification in the correct owner document or portal page.

### 3. Implement

Implementation must:

- Follow the existing architecture.
- Reuse approved or current components, tokens, layout primitives, and patterns.
- Keep data and props aligned with documented contracts.
- Preserve accessibility and motion requirements.
- Keep changes limited to affected files.

Product screens must not become the place where new reusable UI is invented.

### 4. Validate

Validation must follow [the Quality Gate](./quality-gate.md).

The AI agent must run available checks that are relevant to the change. If checks cannot be run, the AI agent must state why.

### 5. Report

The final response must include:

- What changed.
- Where it changed.
- What validation was performed.
- Any known gaps, skipped checks, or follow-up risk.

## Documentation Behaviour

When changing documentation, AI agents must:

- Follow [Documentation Standards](../02-design-system/documentation-standards.md).
- Cross-reference related owner documents.
- Avoid redefining terms from the Glossary.
- Avoid duplicating Constitution rules.
- Replace placeholders when a document becomes canonical.
- Keep rules in the document that owns them.

When a new document introduces a reusable system rule, the AI agent must make clear whether that document owns the rule or references another owner.

## Implementation Behaviour

When changing code, AI agents must:

- Inspect the current file and nearby patterns first.
- Prefer established helpers, components, tokens, and utilities.
- Preserve public contracts unless the task explicitly changes them.
- Update related tests, examples, and docs when behaviour changes.
- Avoid unrelated formatting churn.
- Keep generated or mechanical updates separate from authored rule changes when practical.

When changing UI, AI agents must also check:

- Responsive behaviour.
- Keyboard behaviour.
- Focus behaviour.
- Accessible names and labels.
- Empty, loading, error, disabled, and success states when relevant.
- Motion and reduced-motion behaviour.

## Validation

AI-assisted work is valid when:

- The work follows the Constitution and the relevant owner documents.
- The implementation matches the specification.
- Required checks have been run or clearly reported as unavailable.
- Documentation and portal impacts have been addressed.
- The final response does not overstate readiness.

AI-assisted work is not valid when:

- It relies on undocumented inference for a product or design decision.
- It introduces product-facing behaviour without source-of-truth alignment.
- It changes governance metadata without owner evidence.
- It leaves known quality gate failures unresolved without naming them.

## AI Behaviour

AI agents must treat these build rules as active operating instructions for repository work.

AI agents must use the build workflow in this document before editing files, during implementation, and before the final response.

AI agents must not use successful code execution as proof that source-of-truth, documentation, accessibility, or governance requirements are satisfied.

When an AI agent discovers that the requested implementation depends on missing documentation, it must create the missing owner-aligned specification when the task permits it or report the missing specification as a blocker.

When an AI agent completes work, it must report validation in plain language and avoid claiming approval, current status, or production readiness unless those decisions are already documented by the relevant owner.

## Acceptance Criteria

An AI-assisted build is accepted when:

- The requested outcome is implemented or the blocker is clearly documented.
- The affected files are scoped to the request.
- Source-of-truth alignment is maintained.
- Required validation is complete or explicitly reported.
- The final response identifies any remaining risk.

## Related Documents

- [Constitution](../01-foundation/constitution.md)
- [Glossary](../01-foundation/glossary.md)
- [AI Behaviour](../01-foundation/ai-behaviour.md)
- [Quality Gate](./quality-gate.md)
- [Review Process](./review-process.md)
- [Documentation Standards](../02-design-system/documentation-standards.md)
- [Design Portal Information Architecture](../02-design-system/information-architecture.md)
