# AI Behaviour

This document is the canonical owner for how AI agents must behave when working in the PlayBooky V3 repository.

## Purpose

AI behaviour rules keep AI-assisted work grounded in PlayBooky intent, source-of-truth documents, and governed implementation.

They exist so AI agents help maintain the system instead of creating undocumented product decisions, design exceptions, or misleading summaries.

## Scope

This document applies to:

- Codex.
- Future AI agents.
- AI-assisted documentation, implementation, review, validation, and maintenance.
- AI summaries, plans, recommendations, and final reports.

This document does not define the source-of-truth hierarchy, lifecycle status model, confidence model, or governance ownership. Those are owned by [the Constitution](./constitution.md).

This document does not define vocabulary. Use [the Glossary](./glossary.md).

## Responsibilities

AI agents are responsible for:

- Following the Constitution and relevant owner documents.
- Using the Glossary for canonical terminology.
- Identifying missing specification before implementation.
- Preserving user work and repository context.
- Reporting assumptions, blockers, validation, and residual risk honestly.
- Asking for clarification when a required decision cannot be inferred from governed sources.

Humans are responsible for:

- Supplying missing product intent when it is not documented.
- Approving governance exceptions.
- Making final owner decisions.

## Required Behaviour

AI agents must read before editing.

AI agents must identify the relevant source-of-truth layer before making or recommending a change.

AI agents must treat documentation as the specification layer, the Design Portal as the live approved implementation layer, and code as the execution layer, as defined by the Constitution.

AI agents must use documented purpose, user need, and success criteria to guide interface and implementation work.

AI agents must preserve the distinction between:

- What the user asked for.
- What documentation requires.
- What existing implementation does.
- What the AI is inferring.

AI agents must not present inferred decisions as documented truth.

AI agents must not create new product rules, lifecycle statuses, confidence ratings, owner approvals, component variants, component states, or product-specific UI without the required source-of-truth support.

AI agents must keep work scoped to the requested outcome unless the quality gate requires a related fix.

## Clarification Behaviour

AI agents should proceed when the missing detail can be safely resolved from existing owner documents.

AI agents must ask for clarification or create a specification before implementation when:

- The user request conflicts with the Constitution.
- A required owner decision is missing.
- A product-facing user need is missing.
- Acceptance criteria cannot be made testable.
- The requested change would introduce unapproved UI.
- Multiple source-of-truth documents conflict.
- The requested action would delete or overwrite unrelated user work.

When asking for clarification, AI agents must name the specific decision needed and the reason it blocks safe work.

## Documentation Behaviour

AI agents must:

- Put new rules in the document that owns them.
- Cross-reference related owner documents.
- Avoid duplicating Constitution content.
- Avoid redefining Glossary terms.
- Replace placeholder language when converting a document into a canonical owner.
- Keep headings, scope, validation, and acceptance criteria explicit.

If a document is not the owner of a concept, the AI agent must reference the owning document instead of restating the rule.

## Implementation Behaviour

AI agents must:

- Inspect nearby code before editing.
- Follow existing architecture and naming patterns.
- Reuse governed components, tokens, layouts, and patterns.
- Update documentation or portal pages when implementation changes governed behaviour.
- Run relevant checks when available.
- Report checks that were skipped or unavailable.

AI agents must not:

- Introduce one-off product UI when a governed component or pattern is required.
- Treat product code as approval for a design system decision.
- Change public contracts without updating the relevant specification.
- Make broad refactors without a documented need.

## Review Behaviour

When reviewing, AI agents must follow [the Review Process](../08-ai/review-process.md).

AI review must focus on:

- Source-of-truth conflicts.
- Missing specification.
- Product eligibility.
- Accessibility and motion gaps.
- Contract drift.
- Validation gaps.
- Regression risk.

AI agents must distinguish defects from preferences.

## Validation

AI agents must validate their work using [the Quality Gate](../08-ai/quality-gate.md).

Validation must include:

- Source-of-truth alignment.
- Documentation impact.
- Design Portal impact when applicable.
- Implementation checks when code changes.
- Accessibility and responsive checks when interface changes.
- Final status of tests or commands that were run.

AI agents must not claim that validation passed when checks were not run.

## Acceptance Criteria

AI-assisted work satisfies this document when:

- The AI used the relevant owner documents.
- The AI avoided redefining terms or duplicating Constitution rules.
- The AI did not invent product or design decisions.
- The AI preserved unrelated user work.
- The AI validated the change or clearly reported why validation could not be completed.
- The final response accurately describes changes, validation, and remaining risk.

AI-assisted work fails this document when:

- It presents inference as source-of-truth.
- It implements before required intent is documented.
- It bypasses owner approval.
- It hides conflicts, skipped checks, or incomplete work.
- It changes the meaning of a governed item outside its owner document.

## Related Documents

- [Constitution](./constitution.md)
- [Glossary](./glossary.md)
- [AI Build Rules](../08-ai/build-rules.md)
- [Review Process](../08-ai/review-process.md)
- [Quality Gate](../08-ai/quality-gate.md)
- [Documentation Standards](../02-design-system/documentation-standards.md)
- [Design Portal Information Architecture](../02-design-system/information-architecture.md)
