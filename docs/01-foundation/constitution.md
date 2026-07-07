# PlayBooky V3 Constitution

| Field                | Value      |
| -------------------- | ---------- |
| Version              | 2.0.0      |
| Final decision owner | Vimal Raja |
| Last amended         | 2026-07-07 |

## Purpose

This constitution defines the non-negotiable operating rules for PlayBooky V3.

It exists so humans and AI agents can build from one source of truth without inventing product rules, duplicating design decisions, or creating interface work that is not grounded in documented intent.

Every future documentation file, Design Portal page, component, pattern, product page, token, asset, data contract, and implementation decision must comply with this constitution.

## Scope

This constitution applies to:

- The Design Portal at `/design-system`.
- All documentation in `docs/`.
- All design system components.
- All product-specific components.
- All future PlayBooky product screens.
- All shared tokens, utilities, assets, and implementation code.
- All AI-assisted work in the repository.
- All future data contracts and product data integrations.

This constitution does not define product strategy, detailed product requirements, or final component specifications. Those must be documented in their appropriate source-of-truth files before implementation.

## Language Rules

The constitution uses these requirement levels:

- `Must` means the rule is mandatory.
- `Should` means the rule is expected unless a documented exception exists.
- `May` means the rule is allowed but not required.

Weak requirement language must not be used for governance rules. Phrases such as `where relevant`, `where practical`, and `should normally` must be replaced with explicit applicability rules, exception rules, or `must`, `should`, and `may`.

## Source Of Truth

PlayBooky V3 uses three source-of-truth layers:

1. Documentation is the specification layer.
2. The Design Portal is the live implementation layer for approved and current design system decisions.
3. Code is the execution layer.

The Design Portal is the single source of truth for approved and current implementation. Documentation defines the rules, standards, rationale, and approval criteria that the portal must express. Code executes the documented and portal-approved system.

A component, token, pattern, layout primitive, asset, or product-specific component is not eligible for product use until its documentation, Design Portal page, and code are aligned.

There is no separate playground.

There is no second component reference.

There is no product-only UI library outside the governed component system.

If a design decision, component, token, pattern, usage rule, or data contract is not documented in the specification layer and represented in the Design Portal when implementation exists, it is not approved for product use.

## Hierarchy Of Trust

When sources conflict, use this hierarchy:

1. This constitution.
2. Design Portal pages for Approved and Current system decisions.
3. Documentation in `docs/`.
4. Existing shared component implementation.
5. Existing product implementation.
6. User task instructions for the current change.
7. AI inference.

AI inference is the least trusted source. It may be used only to connect clearly documented decisions, not to invent new product rules.

If a user request conflicts with this constitution, the constitution wins unless the user explicitly asks to amend the constitution.

If code conflicts with the Design Portal, the Design Portal wins and the code must be treated as stale.

If documentation conflicts with this constitution, the constitution wins and the conflicting documentation must be updated before the conflicting rule is used.

## Principle Zero: Intent Before Interface

Every component, pattern, and product-facing interface must define intent before interface.

Before creating or changing a component, pattern, page composition, data contract, or product-specific component, the work must define:

- Purpose: what the system part exists to do.
- User need: the user problem or moment it supports.
- Success criteria: how reviewers know it works.

Interface design, visual styling, props, states, motion, data, and code must follow from that intent.

AI agents must not start by inventing UI. They must identify the relevant purpose, user need, and success criteria first. If those do not exist, the agent must create or request the missing specification before implementing the interface.

Acceptance criteria:

- A component page cannot be considered complete without purpose, user need, and success criteria.
- A product page cannot use a component whose purpose, user need, and success criteria are missing.
- A one-off interface cannot bypass this principle.

## Governance Model

Vimal Raja is the final decision owner for PlayBooky V3 unless another owner is explicitly assigned in documentation, the Design Portal, or a recorded decision.

Decision ownership must be recorded for governed work. If an owner is not recorded, Vimal Raja is the final decision owner.

Decision ownership areas:

- Product: product intent, product priority, user outcomes, product eligibility, and product-specific decisions.
- Design system: component taxonomy, component lifecycle, portal structure, usage rules, and system coherence.
- Engineering: implementation architecture, component APIs, type contracts, testing, performance, and code maintainability.
- Accessibility: accessibility requirements, WCAG interpretation, keyboard behaviour, assistive technology support, and accessibility exceptions.
- Content: product language, labels, guidance text, examples, empty states, errors, and content quality.
- Motion: motion principles, motion tokens, transition behaviour, reduced-motion behaviour, and motion exceptions.
- Tokens: token categories, token naming, token scales, token usage, and token deprecation.
- AI behaviour: agent instructions, AI quality gates, promptable rules, and agent conflict handling.
- Data: data contracts, mock data, production data boundaries, privacy rules, and future database integration rules.

Governance rules:

- A decision owner may approve work only inside their assigned area.
- Cross-area changes must be reviewed by all affected owners.
- A component cannot become Approved or Current without design system and engineering review.
- Interactive or content-bearing components cannot become Approved or Current without accessibility and content review.
- Components with motion cannot become Approved or Current without motion review.
- Components with new token needs cannot become Approved or Current without token review.
- Components with data contracts cannot become Approved or Current without data review.
- Governance conflicts must be escalated to Vimal Raja unless another final owner is explicitly assigned.

## One Portal Model

PlayBooky V3 uses one portal model.

The Design Portal is the home for:

- Foundation governance.
- Design system operating rules.
- Foundations and tokens.
- Layout.
- Components.
- Product components.
- Patterns.
- Motion.
- Assets.
- AI and build rules.
- Product-facing design system decisions.

Every component and product component lives on its own portal page.

Every component page must be suitable for both humans and AI agents. A future contributor must be able to understand why the component exists, when to use it, how it behaves, how it responds across breakpoints, how it handles accessibility and motion, and how to implement it without relying on private context.

Examples belong on the component's portal page. Hidden examples, disconnected showcases, and alternate component references are not allowed.

## Canonical Lifecycle Status Model

Every governed system item must use this canonical status model:

- Exploring.
- Improved.
- Approved.
- Current.
- Rejected.
- Deprecated.

The status model applies to components, product components, patterns, layout primitives, token categories, motion rules, asset libraries, and reusable product decisions.

Product screens may use only items with status `Approved` or `Current`.

If an Approved and a Current version both exist, `Current` wins. `Current` is the preferred active implementation. `Approved` means reviewed and allowed for product use, but it is not necessarily the preferred implementation when a Current version exists.

### Exploring

Meaning: The item is being researched, shaped, or tested and must not be treated as ready for implementation.

Who can use it: Design system, product, engineering, accessibility, content, motion, token, data, and AI contributors may create Exploring work when the need is documented.

Entry criteria:

- Purpose is stated.
- User need is stated.
- Initial success criteria are stated.
- Owner or decision source is recorded.
- Known uncertainty is listed.

Exit criteria:

- Move to Improved when the item has a concrete direction and reviewable evidence.
- Move to Rejected when the direction should not continue.

Allowed transitions:

- Exploring to Improved.
- Exploring to Rejected.

Product screen eligibility: No.

### Improved

Meaning: The item has been revised from an earlier direction and is ready for structured review, but it is not yet approved for product use.

Who can use it: Contributors may mark work as Improved after addressing documented feedback or replacing a weaker direction.

Entry criteria:

- Purpose, user need, and success criteria are complete.
- Responsive behaviour is documented.
- Accessibility notes are documented.
- Motion behaviour is documented or explicitly marked as not used.
- Props or data contract is documented when the item accepts data.
- Code example or implementation plan exists.
- Decision history records what changed and why.
- Used-in impact is assessed.
- Quality gate checklist is prepared.

Exit criteria:

- Move to Approved when required reviewers accept the evidence.
- Move to Exploring when the direction needs further shaping.
- Move to Rejected when the direction should not continue.

Allowed transitions:

- Improved to Approved.
- Improved to Exploring.
- Improved to Rejected.

Product screen eligibility: No.

### Approved

Meaning: The item has passed review and is allowed for product use.

Who can use it: Product screens, portal examples, and implementation work may use Approved items.

Entry criteria:

- Required evidence is complete.
- Required decision owners have reviewed the work.
- Documentation, Design Portal page, and code are aligned when code exists.
- Quality gate checks pass or documented exceptions are approved.
- Confidence rating is 4 or 5.

Exit criteria:

- Move to Current when it becomes the preferred active implementation.
- Move to Improved when review identifies required changes before use expands.
- Move to Deprecated when it should no longer be introduced into new product work.

Allowed transitions:

- Approved to Current.
- Approved to Improved.
- Approved to Deprecated.

Product screen eligibility: Yes.

### Current

Meaning: The item is the preferred active implementation and the first choice for product use.

Who can use it: Product screens, portal examples, and implementation work should prefer Current items over Approved alternatives.

Entry criteria:

- Item is already Approved or receives equivalent approval evidence.
- Documentation, Design Portal page, and code are aligned.
- Used-in impact is known.
- Migration notes exist when Current replaces another product-eligible item.
- Confidence rating is 4 or 5.

Exit criteria:

- Move to Approved when it remains usable but is no longer preferred.
- Move to Improved when active implementation needs substantial correction.
- Move to Deprecated when it should no longer be used for new work.

Allowed transitions:

- Current to Approved.
- Current to Improved.
- Current to Deprecated.

Product screen eligibility: Yes.

### Rejected

Meaning: The item or direction was considered and intentionally not approved.

Who can use it: Decision owners and reviewers may mark work as Rejected with rationale.

Entry criteria:

- Rejection rationale is documented.
- Impact of rejection is recorded.
- Replacement guidance is provided when a contributor may reasonably seek the rejected capability again.

Exit criteria:

- Move to Exploring only when new evidence or a new user need reopens the decision.

Allowed transitions:

- Rejected to Exploring.

Product screen eligibility: No.

### Deprecated

Meaning: The item exists for legacy reference but must not be used for new work.

Who can use it: Existing product screens may continue using Deprecated items only during an approved migration window.

Entry criteria:

- Deprecation reason is documented.
- Replacement guidance is documented.
- Used-in impact is documented.
- Migration notes are documented.
- Deprecation window is documented.

Exit criteria:

- Archive from active navigation when usage reaches zero and historical decision records remain available.
- Move to Approved only after explicit review revalidates the item.

Allowed transitions:

- Deprecated to Approved.
- Deprecated to archived historical record.

Product screen eligibility: No for new work. Existing usage may remain only inside the documented migration window.

## Confidence Rating

Every component, product component, pattern, and reusable system item must have a confidence rating.

Confidence ratings communicate how stable the guidance is.

Canonical confidence scale:

| Rating | Label                | Meaning                                                                                                           |
| ------ | -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1      | Experimental         | Early concept with unresolved purpose, behaviour, or usability questions.                                         |
| 2      | Prototype            | Testable direction with known gaps and limited implementation confidence.                                         |
| 3      | Visually directional | Visual design is useful for alignment, but behaviour, accessibility, or edge cases may be incomplete.             |
| 4      | Usability ready      | Interaction, responsive behaviour, and accessibility expectations are defined well enough for product validation. |
| 5      | Production ready     | Component is ready for implementation, QA, reuse, and long-term maintenance.                                      |

Product screens may use only items with confidence rating 4 or 5.

Approved and Current items must have confidence rating 4 or 5.

Items with confidence rating 1, 2, or 3 are not product-eligible.

## Approval Workflow

Every governed item must move through the approval workflow before product use.

### 1. Proposal

The proposal identifies a need.

Required evidence:

- Purpose.
- User need.
- Initial success criteria.
- Suggested owner or decision source.
- Existing components or patterns considered.
- Reason existing Approved or Current items cannot solve the need.

Outcome:

- Create or update an Exploring item.
- Reject the proposal with rationale.
- Route the proposal to another source-of-truth area.

### 2. Exploration

Exploration shapes the solution.

Required evidence:

- Variants and states.
- Responsive behaviour for desktop, tablet, and mobile.
- Accessibility notes.
- Motion behaviour or explicit no-motion statement.
- Props or data contract when data is accepted.
- Token usage and token gaps.
- Content requirements.
- Known risks and open questions.

Outcome:

- Move to Improved when the direction is reviewable.
- Keep as Exploring when open questions remain.
- Move to Rejected when the direction should not continue.

### 3. Review

Review determines whether the work is safe for product use.

Required evidence:

- Purpose.
- User need.
- Success criteria.
- Responsive behaviour.
- Accessibility notes.
- Motion behaviour.
- Code example or implementation.
- Decision history.
- Used-in impact.
- Quality gate checklist.
- Owner approvals for affected governance areas.

Outcome:

- Move to Approved.
- Return to Improved with required changes.
- Move to Rejected with rationale.

### 4. Approval

Approval confirms that the item is allowed for product use.

Approval requirements:

- Required evidence is complete.
- Required reviewers have approved.
- Documentation, portal, and code are aligned when implementation exists.
- Quality gates pass.
- Confidence rating is 4 or 5.

Outcome:

- Status becomes Approved.

### 5. Current Release

Current release confirms that the item is the preferred active implementation.

Release requirements:

- Approved status or equivalent approval evidence.
- Aligned documentation, portal page, and code.
- Migration notes when replacing another product-eligible item.
- Used-in impact reviewed.
- Quality gates pass against the active implementation.

Outcome:

- Status becomes Current.

### 6. Deprecation

Deprecation removes an item from new product use.

Deprecation requirements:

- Deprecation reason.
- Replacement guidance.
- Used-in impact.
- Migration notes.
- Deprecation window.
- Owner approval.

Outcome:

- Status becomes Deprecated.

### 7. Removal Or Archive

Removal or archive removes a Deprecated item from active use while preserving decision history.

Archive requirements:

- No active product usage remains.
- Historical record remains available.
- Replacement guidance remains findable.
- Decision history records the archive date and reason.

Outcome:

- Item is removed from active navigation or marked as archived historical record.
- Archive is a historical record, not a lifecycle status.

## Status Tags

Every governed item must display a status tag on its portal page.

Status tags must be explicit, visible, and consistent with the canonical lifecycle model.

Minimum status metadata:

- Status.
- Confidence rating.
- Version.
- Last reviewed date.
- Owner.
- Used-in references when the item is used by product pages, patterns, or other components.

Validation:

- An item without a status tag is not eligible for product use.
- An item with an unclear or missing status must be treated as Exploring.
- Product implementation must not silently promote status.
- Status changes must be recorded in decision history.

## Product Usage Rules

Product pages may use only Approved or Current items with confidence rating 4 or 5.

Product pages must not create one-off UI.

Product pages must not define new component variants locally.

Product pages must not create local styling that changes the meaning, structure, behaviour, accessibility, motion, responsive rules, or data contract of an approved component.

Direct styling inside product pages is not allowed unless a documented product composition rule explicitly permits it.

If a product page needs something that does not exist in the design system, it must be created and documented in the Design Portal first.

Acceptance criteria:

- Product pages compose existing system components and patterns.
- Product pages pass data into Approved or Current components.
- New interface needs are routed back through the Design Portal.
- Product-specific composition may exist, but product-specific component invention may not.

## Page Composition Rules

Pages are compositions of approved layout primitives, components, product components, and patterns.

Page composition must follow documented layout rules for:

- Page structure.
- Container width.
- Section rhythm.
- Stack and grid behaviour.
- Surface usage.
- Desktop, tablet, and mobile behaviour.

Pages must not override component internals to force a layout.

If a page composition exposes a missing layout primitive or pattern, that primitive or pattern must be defined in the Design Portal before the page depends on it.

## New Component Rules

A new component may be created only when:

- The user need cannot be met by an existing Current or Approved component.
- The component purpose is clear.
- Success criteria are defined.
- The component has a portal page.
- The component has a lifecycle status.
- The component has confidence rating.
- The component defines variants, states, motion, accessibility, props, code examples, responsive behaviour, data requirements, and decision history.

New components must be created in the Design Portal first.

AI agents must not create new components directly inside product pages.

AI agents must not duplicate an existing component under a new name unless the Design Portal explicitly defines why both components exist.

## Engineering Rules

Code must serve the documented system.

Implementation rules:

- Shared reusable UI belongs in `components`.
- Product-specific reusable components belong in `components/product`.
- New shared non-UI logic belongs in `lib`.
- Product pages compose approved components, product components, layout primitives, and patterns.
- Product pages pass typed data into approved components.
- Product pages must not own reusable UI styling.
- Components own their own styling.
- Component APIs must be stable after approval.
- Component props must be typed.
- Component props must match documented usage and data contracts.
- Breaking changes require migration notes before implementation.
- Breaking changes require used-in impact review before implementation.
- Component examples must use real implementation code when implementation exists.
- Styling must use tokens and approved layout rules.
- Random token values are not allowed.
- Hard-coded values are allowed only when a missing token need is documented and the value is localized to exploration work.
- Unapproved product screens must not be created.
- Old assets must not be imported until approved through the asset system.
- Database connections must not be added until product architecture and data contracts are documented and approved.

AI agents must inspect existing code and documentation before making changes.

AI agents must keep changes scoped to the requested layer: documentation, portal, component, pattern, product, token, asset, data, or infrastructure.

## Responsive Governance

Every component, product component, layout primitive, pattern, and product page composition must define desktop, tablet, and mobile behaviour.

Responsive documentation must cover:

- Layout changes.
- Spacing changes.
- Content wrapping.
- Minimum and maximum widths.
- Interaction changes.
- Navigation or disclosure changes.
- Hidden, collapsed, or reordered content.

Responsive behaviour must be intentional. It must not be left to incidental CSS defaults when the behaviour affects usability, comprehension, accessibility, or product meaning.

Acceptance criteria:

- Components are not complete until all three breakpoint behaviours are documented.
- Product pages must not invent undocumented responsive behaviour for system components.
- Responsive review must be completed before Approved or Current status.

## Motion Governance

Motion must clarify state, hierarchy, causality, or feedback.

Motion must not be decorative by default.

Every component, pattern, or page composition that uses motion must define:

- Trigger.
- Duration.
- Easing.
- Affected properties.
- Enter and exit behaviour.
- Loading or pending behaviour.
- Reduced-motion behaviour.

Components must remain usable when reduced motion is enabled.

AI agents must not introduce motion that is not documented by the relevant component, pattern, motion rule, or motion token rule.

## Token Rules

Tokens are the preferred source for repeatable visual decisions.

Token-governed decisions include:

- Colour.
- Typography.
- Spacing.
- Radius.
- Elevation.
- Motion timing.
- Motion easing.
- Breakpoints.

Components and product pages must use existing tokens when a token exists.

New tokens require:

- Purpose.
- Category.
- Intended use.
- Relationship to the existing token system.
- Accessibility impact.
- Responsive impact.
- Owner approval.

AI agents must not create new token scales casually.

## Accessibility Governance

PlayBooky V3 targets WCAG 2.2 AA where applicable.

Accessibility is a requirement, not a later review layer.

Every interactive or content-bearing component must document:

- Semantic structure.
- Keyboard interaction.
- Focus visibility.
- Screen reader naming and announcement expectations.
- Colour contrast.
- Touch target minimums.
- Disabled states.
- Error states.
- Loading states.
- Reduced-motion behaviour.

Product pages must not use components in ways that break their documented accessibility behaviour.

AI agents must check accessibility before presenting work as complete.

Acceptance criteria:

- Interactive components are keyboard reachable and operable.
- Focus states are visible.
- Interactive controls have accessible names.
- Visual state is not communicated by colour alone.
- Required contrast meets WCAG 2.2 AA.
- Touch targets meet documented minimums.
- Disabled, error, and loading states are documented before product use.
- Motion-sensitive users have a reduced-motion path.

## Data Governance

Data must be governed before it shapes UI behaviour.

Data rules:

- Mock data is allowed for Design Portal examples.
- Mock data must be realistic enough to test layout, wrapping, empty states, loading states, and error states.
- Production data must not be hardcoded.
- Data contracts must be typed.
- Components that accept data must document required fields, optional fields, fallback behaviour, and invalid states.
- AI-generated data must be labelled when the user, reviewer, or future contributor could mistake it for production, research, or user-provided data.
- PII must not appear in examples unless explicitly approved by the data owner and final decision owner.
- Future database connections must respect approved design system data contracts.
- Future analytics and telemetry must be documented before they influence product behaviour.

## Decision History Rules

Every component page must include decision history.

Decision history records why the component exists and why meaningful changes were made.

Decision history must include:

- Date.
- Decision.
- Rationale.
- Impact.
- Source or owner.

Decision history is required for:

- New components.
- Status changes.
- Confidence rating changes.
- Major variant changes.
- Breaking prop changes.
- Accessibility changes.
- Responsive behaviour changes.
- Motion changes.
- Data contract changes.
- Deprecation.
- Archive.

AI agents must update decision history when their work changes a documented decision.

## Live Component Rules

Every component page must include live component examples once the component has an implementation.

Live examples must show:

- Default usage.
- Supported variants.
- Key states.
- Desktop, tablet, and mobile behaviour.
- Accessibility-relevant interactions for interactive components.

Live examples are part of the source of truth. They must use the same component implementation available to product pages.

The Design Portal must not show mock examples that diverge from production component code unless clearly marked as non-production exploration.

## Quality Gates

Before presenting work as complete, contributors and AI agents must self-review against this quality gate.

Hard checks:

- Lint must pass for code changes.
- Typecheck must pass for code changes.
- Build must pass for code changes that affect application behaviour, routing, components, or configuration.
- Accessibility review must be completed for interactive or content-bearing UI.
- Responsive review must cover desktop, tablet, and mobile for UI changes.
- Reduced-motion review must be completed for motion changes.
- Token review must confirm no random token values were introduced.
- Product safety review must confirm no one-off product page UI was introduced.
- Product styling review must confirm no direct styling inside product pages unless explicitly allowed.
- Documentation review must confirm purpose, user need, success criteria, status, confidence, decision history, and used-in impact are updated.

Required checks:

- Source of truth: the change follows the Design Portal and documentation hierarchy.
- Intent: purpose, user need, and success criteria are defined.
- Status: lifecycle status is present and valid.
- Confidence: confidence rating is present and valid.
- Portal-first: missing system pieces are created or documented in the portal before product use.
- Responsive: desktop, tablet, and mobile behaviour are documented or preserved.
- Motion: motion is documented and includes reduced-motion behaviour when motion exists.
- Tokens: token usage is respected.
- Accessibility: semantic, keyboard, focus, contrast, touch target, disabled, error, loading, and reduced-motion expectations are considered.
- Data: data contracts, mock data, and production data boundaries are respected.
- Decision history: meaningful system decisions are recorded.
- Used-in tracking: usage references are updated.
- Code quality: lint, typecheck, build, or targeted verification is run as required.

If any hard check fails, the contributor or AI agent must fix the issue or report it as a blocker.

## Used-In Tracking

Every component page must track where the component is used.

Used-in tracking must include:

- Product pages.
- Design Portal pages.
- Patterns.
- Other components that depend on it.

Used-in tracking helps future contributors understand impact before changing a component.

AI agents must check used-in references before making breaking changes.

If used-in tracking is missing, the agent must not assume the component is unused.

## Scalability Rules

The system must remain usable at 500+ components and across multiple years of product growth.

Scalability requirements:

- Component taxonomy must distinguish UI components, navigation components, form components, feedback components, product components, layout primitives, patterns, assets, and product decisions.
- Duplicate prevention must happen before new component creation.
- Similar components must include comparison guidance.
- Used-in tracking must be maintained for product-eligible components.
- Deprecated components must include deprecation windows.
- Migration notes must exist for breaking changes, replacements, and deprecations.
- Ownership registry must identify decision owners for governed areas.
- Discoverability must be maintained through stable names, predictable routes, status tags, related links, and search metadata.
- Components must not be renamed without migration notes and used-in impact review.
- Reusable behaviour must be documented once and referenced consistently.

## Multi-Agent Rules

AI agents working in PlayBooky V3 must:

- Read this constitution before making governed changes.
- Check the document map if one is available.
- Read relevant documentation before implementation.
- Inspect existing code before code changes.
- Treat the Design Portal as the source of truth for Approved and Current implementation.
- Avoid inventing product rules.
- Avoid creating one-off UI inside product pages.
- Create missing design system pieces in the portal before using them in product pages.
- Preserve existing documentation and decision history.
- Mark uncertainty instead of hiding it.
- Prefer small, scoped changes.
- Report changed files.
- Run required validation before reporting completion.
- Report conflicts between user instructions, documentation, portal state, and code.

AI agents must not:

- Overwrite another agent's or developer's work.
- Resolve governance conflicts by guessing.
- Continue when docs conflict with this constitution.
- Create product screens before the design system permits it.
- Import old assets without asset approval.
- Connect databases without documented architecture and data approval.
- Promote lifecycle status without required evidence.
- Treat existing code as more authoritative than the Design Portal.
- Skip responsive, motion, accessibility, token, data, or quality gate requirements for speed.

If docs conflict, an AI agent must stop the conflicting part of the work, report the conflict, and continue only on unrelated safe changes.

## Constitution Amendment Rules

This constitution may change only through explicit review.

Amendment rules:

- Constitution changes require explicit user instruction or final decision owner approval.
- Conflicts must be resolved in favour of the current constitution until the constitution is amended.
- Major rule changes must update the version number.
- Minor clarifications should update the last amended date.
- Amendment history must record meaningful changes.
- A constitution amendment must identify affected docs, portal pages, and implementation areas.

Versioning rules:

- Major version changes alter governance, source-of-truth hierarchy, lifecycle, approval workflow, or product eligibility.
- Minor version changes add rules without changing existing eligibility.
- Patch version changes clarify wording without changing meaning.

## Amendment History

| Date       | Version | Decision                                                               | Rationale                                                                                                                                                                                                                          | Owner      |
| ---------- | ------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 2026-07-07 | 2.0.0   | Strengthened the Constitution from charter to operational rule system. | Added canonical lifecycle, confidence scale, approval workflow, governance ownership, hard quality gates, multi-agent rules, engineering rules, accessibility governance, data governance, scalability rules, and amendment rules. | Vimal Raja |

## V3 Mission

PlayBooky V3 exists to create a durable, coherent product system before product complexity grows.

The mission is to build a Design Portal and documentation system that lets humans and AI agents work from the same source of truth, with intent, quality, accessibility, and product safety built into the process from the start.

PlayBooky V3 should become easier to extend over time because its decisions are documented, its components are governed, and its product interfaces are composed from approved system parts.

The work is successful when a future contributor can move through the documentation, Design Portal, and codebase using the same hierarchy and arrive at the same decisions without private context.
