# Review Process

This document is the canonical owner for reviewing AI-assisted and implementation changes in PlayBooky V3.

## Purpose

The review process ensures that changes are assessed against documented intent, governed source-of-truth rules, implementation quality, and user impact before they are accepted.

Review exists to catch gaps in specification, ownership, accessibility, lifecycle status, product eligibility, and implementation alignment.

## Scope

This process applies to:

- Documentation changes.
- Design Portal changes.
- Component, product component, pattern, layout, token, motion, and asset changes.
- Product-facing implementation.
- AI-generated or AI-assisted code.
- Data contracts, props, examples, and mock data.
- Lifecycle status, confidence, owner, and used-in changes.

This process does not define lifecycle status meanings, confidence rating meanings, owner hierarchy, or source-of-truth hierarchy. Those are owned by [the Constitution](../01-foundation/constitution.md).

## Responsibilities

The implementer must provide reviewable evidence.

The reviewer must compare the change against the correct source of truth, not only against the changed code.

The owner for an affected governance area must approve lifecycle movement, exceptions, and high-impact changes inside that area.

AI agents must prepare changes so a human reviewer can inspect purpose, impact, validation, and remaining risk without private context.

## Review Inputs

A review must identify:

- The user request or originating need.
- The affected source-of-truth documents.
- The affected Design Portal pages.
- The affected implementation files.
- The affected governed items.
- The owner or owners.
- The validation performed.
- Known gaps or exceptions.

If these inputs are missing, the reviewer should return the change for more evidence before assessing quality.

## Required Behaviour

Reviewers must check the change in this order:

1. Constitutional alignment.
2. Correct owner document.
3. Glossary terminology.
4. Design Portal alignment.
5. Implementation alignment.
6. Validation evidence.
7. User-facing risk.

Reviewers must not approve a change only because the implementation appears to work.

Reviewers must not require rules that are not documented unless they identify the missing owner document and request a specification update.

Reviewers must separate:

- Blocking issues that prevent acceptance.
- Required follow-ups that must be completed before product use.
- Non-blocking suggestions.

## Review Checks

### Source-Of-Truth Review

Check that:

- The change follows the Constitution.
- New rules are placed in the correct owner document.
- Existing owner documents are referenced instead of duplicated.
- The Glossary is used for canonical terminology.
- Placeholder documents are not treated as canonical specifications.

### Specification Review

Check that:

- Purpose is clear.
- Scope is clear.
- Responsibilities are clear.
- Required behaviour is explicit.
- Validation and acceptance criteria are testable.
- AI behaviour is defined when AI agents are expected to use or maintain the document.

### Design System Review

Check that:

- Components, product components, patterns, layout primitives, tokens, and motion rules follow their documented owners.
- Variants and states are documented.
- Status and confidence are present where required.
- Product-eligible use follows the Constitution.
- Used-in impact is recorded for reusable items.

### Implementation Review

Check that:

- Code follows the specification.
- Public contracts remain stable unless intentionally changed.
- Data and props match documented contracts.
- Existing patterns are respected.
- Unrelated files and behaviour are not changed.
- Tests or checks cover the risk introduced by the change.

### Accessibility And Motion Review

Check that:

- Keyboard and focus behaviour are defined for interactive elements.
- Labels, names, descriptions, semantics, and errors are accessible.
- Motion is purposeful and includes reduced-motion handling where applicable.
- Responsive behaviour remains usable.

### AI Review

Check that:

- AI-generated work cites or follows documented sources.
- Assumptions are named.
- The AI did not invent owner approvals, statuses, variants, states, product rules, or user needs.
- The final summary accurately reflects validation and risk.

## Review Outcomes

A review may result in:

- Accepted: the change satisfies the quality gate and required owner expectations.
- Accepted with documented follow-up: the change is safe, and remaining work is recorded with an owner.
- Changes requested: the change cannot be accepted until specific gaps are fixed.
- Rejected: the direction should not continue, and rationale must be recorded when the work is governed.

Lifecycle status changes must follow the Constitution and any relevant owner document.

## Validation

Review validation must include:

- Reading the changed files.
- Checking related owner documents.
- Checking relevant implementation when documentation affects code.
- Checking relevant documentation when code affects governed behaviour.
- Running or reviewing available checks appropriate to the change.

For documentation-only changes, validation must include structure, terminology, cross-reference, and ownership checks.

For UI changes, validation must include visual, responsive, accessibility, and implementation checks appropriate to the scope.

## Acceptance Criteria

A review is complete when:

- The affected source-of-truth areas have been checked.
- Required evidence has been evaluated.
- Validation results are recorded.
- Blocking issues are clearly identified or the change is accepted.
- Required follow-ups have owners.
- No undocumented rule is used as the basis for approval or rejection.

A review is incomplete when:

- It only reviews code style.
- It ignores documentation or portal impact.
- It accepts AI inference as product truth.
- It does not identify validation gaps.
- It approves lifecycle movement without owner evidence.

## AI Behaviour

When acting as reviewer, an AI agent must lead with findings ordered by severity.

When no findings are present, an AI agent must say that clearly and name any remaining test or validation gaps.

When acting as implementer, an AI agent must prepare the change for this review process by documenting evidence, validation, and risk.

An AI agent must not mark its own work as approved. It may report that the work appears to satisfy the quality gate based on available evidence.

## Related Documents

- [Constitution](../01-foundation/constitution.md)
- [Glossary](../01-foundation/glossary.md)
- [AI Behaviour](../01-foundation/ai-behaviour.md)
- [AI Build Rules](./build-rules.md)
- [Quality Gate](./quality-gate.md)
- [Documentation Standards](../02-design-system/documentation-standards.md)
- [Component Page Template](../02-design-system/page-template.md)
