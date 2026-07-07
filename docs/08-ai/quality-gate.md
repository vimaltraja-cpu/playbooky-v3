# Quality Gate

This document is the canonical owner for PlayBooky V3 quality gate requirements.

The quality gate defines the checks that must pass before a change can be merged, shipped, marked product-eligible, or promoted through the governed lifecycle.

## Purpose

The quality gate protects PlayBooky V3 from undocumented decisions, unapproved design system work, accessibility regressions, implementation drift, and AI-generated assumptions.

It exists so reviewers can decide whether work is ready using explicit evidence instead of preference, memory, or private context.

## Scope

This document applies to:

- Documentation changes.
- Design Portal changes.
- Design token changes.
- Layout, component, product component, and pattern changes.
- Product-facing interface changes.
- AI-assisted implementation.
- Data contracts, props, examples, and mock data used by governed system items.
- Assets, motion behaviour, and accessibility-relevant changes.

This document does not define the lifecycle status model, confidence model, hierarchy of trust, or source-of-truth model. Those are owned by [the Constitution](../01-foundation/constitution.md).

This document does not define vocabulary. Use [the Glossary](../01-foundation/glossary.md).

## Responsibilities

The implementer is responsible for preparing the evidence needed for the gate.

The reviewer is responsible for checking that evidence against this document, the relevant owner documents, and the Constitution.

The owner for an affected governance area is responsible for approving exceptions and lifecycle movement inside that area.

AI agents are responsible for applying this gate before presenting work as complete.

## Required Behaviour

Every change must identify its affected source-of-truth areas before implementation is treated as complete.

Every governed item must have:

- Purpose.
- User need when the item is product-facing or reusable.
- Success criteria.
- Acceptance criteria.
- Owner.
- Used-in impact when the item is reused or replacing existing behaviour.
- Related documentation references.

Every implementation change must be checked against:

- The Constitution.
- The relevant canonical owner document.
- The Design Portal page when one exists.
- The implementation code.
- The glossary for terminology.

Product-facing work must use only product-eligible governed items. Product eligibility is defined by the Constitution.

New local UI, undocumented variants, local styling changes that alter component meaning, and unrecorded behaviour changes fail the quality gate.

## Gate Categories

### Source-Of-Truth Gate

The change passes when:

- The correct source-of-truth document is identified.
- No lower-trust source overrides a higher-trust source.
- Terminology matches the Glossary.
- New rules are added only to the document that owns them.
- Conflicts with the Constitution are resolved before the change is accepted.

### Documentation Gate

The change passes when:

- Required documentation exists or is updated.
- Documentation describes purpose, scope, responsibilities, required behaviour, validation, and acceptance criteria where applicable.
- Cross-references point to related owner documents.
- The change avoids duplicating rules owned by another document.
- Placeholder language is removed from canonical owner documents.

### Design Portal Gate

The change passes when:

- Any affected portal page reflects the documented decision.
- Status, confidence, owner, version, last-reviewed date, and used-in references are present when required by the page type.
- Portal examples match the documented behaviour.
- Portal navigation remains aligned with the documented information architecture.

### Design System Gate

The change passes when:

- Components, product components, patterns, layout primitives, tokens, and motion rules are documented before product use.
- Variants and states are explicitly defined.
- Product-specific needs are handled through product components or patterns, not one-off UI.
- Deprecated or rejected items are not introduced into new work.

### Accessibility Gate

The change passes when:

- Keyboard behaviour is defined and tested for interactive work.
- Focus behaviour is visible and predictable.
- Semantic structure matches the interface purpose.
- Accessible names, labels, descriptions, and error messaging are present where needed.
- Motion includes reduced-motion behaviour or an explicit no-motion statement.
- Colour, contrast, layout, and responsive behaviour do not block use.

### Implementation Gate

The change passes when:

- Code follows the documented specification and existing implementation patterns.
- Data, props, and contracts match the documented contract.
- Tests or checks are run when available and relevant.
- The implementation does not introduce unrelated refactors.
- Build, lint, type, and visual verification are run when the repository provides them and the change affects those surfaces.

### AI Gate

The change passes when:

- AI work is grounded in documented sources.
- Assumptions are called out when documentation is incomplete.
- The AI agent does not invent product strategy, lifecycle status, variants, states, or owner approvals.
- The final response identifies what changed, what was validated, and any remaining risk.

## Validation

Validation must be proportionate to the change.

Documentation-only changes require:

- Markdown structure review.
- Link and cross-reference review when links are added or changed.
- Terminology review against the Glossary.
- Owner-document review to ensure rules are placed in the correct document.

Design Portal or interface changes require:

- Relevant automated checks when available.
- Visual review at affected viewport sizes.
- Accessibility review for keyboard, focus, labels, semantics, and reduced motion.
- Comparison with the relevant documentation and portal page.

Component, product component, pattern, token, or layout changes require:

- Lifecycle and confidence metadata review.
- Used-in impact review.
- Variant and state review when applicable.
- Migration or deprecation review when replacing existing behaviour.

Data contract changes require:

- Contract review.
- Mock data or example data review.
- Implementation alignment review.
- Consumer impact review.

## Acceptance Criteria

A change passes the quality gate when:

- The affected source-of-truth areas are named.
- The change follows the Constitution and relevant owner documents.
- Required documentation and portal updates are complete.
- Required owner reviews are complete or explicitly documented as not required.
- Validation evidence is recorded in the change summary, pull request, or review notes.
- No unapproved component, pattern, token, layout primitive, variant, state, or product-specific UI is introduced.
- Any exception is documented with owner approval, reason, impact, and follow-up.

A change fails the quality gate when:

- It conflicts with the Constitution.
- It relies on AI inference as the source of a product or design decision.
- It uses undefined terminology.
- It introduces implementation without a required specification.
- It changes user-facing behaviour without validation.
- It hides known risk, missing checks, or incomplete documentation.

## AI Behaviour

AI agents must run this gate mentally before claiming that work is complete.

AI agents must not mark a change as accepted, approved, current, or production-ready unless the required evidence exists in the appropriate source of truth.

If a requested change cannot pass the gate because a specification, owner, status, confidence rating, or acceptance criterion is missing, the AI agent must create the missing documentation when the task permits it or clearly report the blocker.

AI agents must not weaken acceptance criteria to fit an implementation they already produced.

## Related Documents

- [Constitution](../01-foundation/constitution.md)
- [Glossary](../01-foundation/glossary.md)
- [AI Behaviour](../01-foundation/ai-behaviour.md)
- [AI Build Rules](./build-rules.md)
- [Review Process](./review-process.md)
- [Documentation Standards](../02-design-system/documentation-standards.md)
- [Design Portal Information Architecture](../02-design-system/information-architecture.md)
- [Component Page Template](../02-design-system/page-template.md)
