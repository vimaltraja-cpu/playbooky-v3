# Documentation Standards

This document is the canonical owner for PlayBooky V3 documentation structure, naming, ownership, cross-referencing, and maintenance standards.

## Purpose

Documentation standards make PlayBooky V3 understandable, maintainable, and usable by both humans and AI agents.

They ensure that documentation acts as the specification layer without duplicating rules owned by the Constitution, Glossary, Design Portal information architecture, or page templates.

## Scope

These standards apply to:

- All files in `docs/`.
- Documentation mirrored by the Design Portal.
- Component, product component, pattern, layout, foundation, asset, AI, and product decision documents.
- Documentation written or modified by humans or AI agents.

These standards do not define the source-of-truth hierarchy, lifecycle status model, confidence model, or governance ownership. Those are owned by [the Constitution](../01-foundation/constitution.md).

These standards do not define canonical vocabulary. Use [the Glossary](../01-foundation/glossary.md).

These standards do not define the Design Portal hierarchy. Use [Design Portal Information Architecture](./information-architecture.md).

## Responsibilities

Document authors are responsible for writing complete, scoped, source-aware documentation.

Reviewers are responsible for checking ownership, cross-references, terminology, structure, and freshness.

AI agents are responsible for following these standards when creating, expanding, or updating documentation.

Owners are responsible for keeping their canonical documents accurate when rules change.

## Required Behaviour

Documentation must:

- State its purpose.
- State its scope.
- Identify responsibilities when the document governs behaviour.
- Define required behaviour when the document owns rules.
- Define validation when the document creates requirements.
- Define acceptance criteria when the document supports review or implementation.
- Cross-reference related documents.
- Use Glossary terms consistently.
- Reference the Constitution instead of duplicating constitutional rules.
- Make ownership clear when the document is canonical.

Documentation must not:

- Redefine terms owned by the Glossary.
- Duplicate rules owned by the Constitution.
- Add governance rules in a document that does not own them.
- Leave placeholder language in canonical owner documents.
- Use vague requirement language for mandatory rules.
- Rely on private context, screenshots, or implementation alone to explain decisions.

## Document Types

### Canonical Owner Documents

A canonical owner document defines rules for a specific area.

Canonical owner documents must include:

- Purpose.
- Scope.
- Responsibilities.
- Required behaviour.
- Validation.
- Acceptance criteria.
- AI behaviour when AI agents are expected to use or maintain the area.
- Related documents.

Canonical owner documents must state when another document owns a related concept.

### Specification Documents

A specification document defines what an item must do, support, and satisfy.

Specification documents must include:

- Purpose.
- User need when product-facing or reusable.
- Success criteria.
- Required behaviour.
- Validation.
- Acceptance criteria.
- Related documents or used-in references.

### Reference Documents

A reference document records stable information for lookup, orientation, or navigation.

Reference documents must include:

- Purpose or introductory context.
- Clear structure.
- Cross-references when the document depends on another owner document.
- Maintenance ownership when the document can become stale.

### Placeholder Documents

Placeholder documents are temporary and must be clearly treated as incomplete.

Placeholder documents must not be used as approval evidence for implementation.

When a placeholder becomes a canonical owner document, all placeholder language must be removed.

## Naming And File Structure

Documentation files must use lowercase kebab-case names.

Folder structure must follow the documented Design Portal information architecture unless an owner document explicitly defines an exception.

File names should describe the owned concept, not the implementation technology.

Each document must use a single H1 that matches the document title.

Headings should describe the role of each section using stable, literal language.

## Cross-References

Documents must link to:

- The Constitution when governance hierarchy, lifecycle status, confidence, or source-of-truth authority matters.
- The Glossary when terminology matters.
- The relevant owner document when a rule belongs elsewhere.
- The Design Portal information architecture when navigation or portal structure matters.
- The component page template when component documentation structure matters.
- The quality gate when validation or readiness matters.

Cross-references must be specific enough for a human or AI agent to find the owning source quickly.

## Ownership And Freshness

Canonical owner documents must identify responsibilities inside the document.

Documents that define governed behaviour must be updated when:

- Their rules change.
- Implementation changes the documented behaviour.
- Portal representation changes the documented behaviour.
- A new owner document supersedes part of the content.
- Validation reveals that the document is incomplete or stale.

Documents must not silently drift away from implementation or portal pages.

## Language Standards

Use `must` for mandatory requirements.

Use `should` for expected behaviour where a documented exception can exist.

Use `may` for allowed behaviour.

Avoid weak phrases such as `where relevant`, `as needed`, `usually`, and `if possible` when they affect governance or validation.

Use the exact term from the Glossary when a canonical term exists.

Do not create synonyms for governed concepts.

## AI Behaviour

AI agents creating or editing documentation must:

- Read related owner documents first.
- Identify whether the document owns the rule or references another owner.
- Preserve existing canonical meaning.
- Add cross-references instead of duplicating external rules.
- Remove placeholder language when expanding canonical documents.
- Validate headings, required sections, and terminology.

AI agents must not use a placeholder document as permission to implement governed behaviour.

AI agents must not invent missing owner decisions. They must document the gap or ask for the required decision.

## Validation

Documentation validation must check:

- Purpose, scope, responsibilities, required behaviour, validation, and acceptance criteria are present when required.
- Cross-references point to the correct owner documents.
- Terminology follows the Glossary.
- Constitution-owned rules are referenced rather than duplicated.
- The document does not conflict with higher-trust sources.
- Placeholder text is absent from canonical owner documents.
- Markdown structure is readable and consistent.

## Acceptance Criteria

A documentation change is accepted when:

- The document has the required sections for its type.
- Rules appear in the correct owner document.
- Related documents are cross-referenced.
- Glossary terms are used consistently.
- Constitution content is referenced instead of duplicated.
- Validation has been completed and reported.

A documentation change is not accepted when:

- It creates duplicate definitions.
- It hides ownership.
- It relies on placeholder language.
- It conflicts with the Constitution.
- It creates implementation requirements without validation or acceptance criteria.

## Related Documents

- [Constitution](../01-foundation/constitution.md)
- [Glossary](../01-foundation/glossary.md)
- [AI Behaviour](../01-foundation/ai-behaviour.md)
- [Design Portal Information Architecture](./information-architecture.md)
- [Component Page Template](./page-template.md)
- [AI Build Rules](../08-ai/build-rules.md)
- [Review Process](../08-ai/review-process.md)
- [Quality Gate](../08-ai/quality-gate.md)
