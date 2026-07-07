# Glossary

This glossary defines the canonical vocabulary for the PlayBooky Design Operating System.

Every important term must have exactly one definition. When a term is needed in another document, use the definition here rather than creating a local replacement.

## Portal

- Definition: A governed digital reference environment that makes system decisions visible, inspectable, and usable.
- Purpose: Provide a shared place for humans and AI agents to find operational product and design system truth.
- Used In: Design Portal, documentation, implementation review, AI guidance.
- Related Terms: Design Portal, Documentation, Specification, Current.
- Notes: `Portal` is the broad concept. `Design Portal` is the specific PlayBooky implementation.

## Design Portal

- Definition: The PlayBooky V3 source-of-truth interface at `/design-system` for approved and current design system decisions.
- Purpose: Show live, governed decisions for foundations, layout, components, patterns, assets, AI rules, and product-facing system decisions.
- Used In: Design system navigation, component pages, pattern pages, quality review, implementation.
- Related Terms: Portal, Foundation, Design Token, Component, Pattern.
- Notes: The Design Portal is not a playground, marketing site, or secondary component reference.

## Foundation

- Definition: A governing source-of-truth area that defines non-negotiable operating rules, principles, and expected behaviour for PlayBooky V3.
- Purpose: Anchor design, product, engineering, documentation, and AI decisions before interface work begins.
- Used In: Constitution, principles, AI behaviour, glossary, Design Portal foundation section.
- Related Terms: Constitution, Contract, Documentation, AI Agent.
- Notes: Use `Foundation` for governance. Use `Foundations` for token categories such as colour, typography, spacing, radius, elevation, motion tokens, and breakpoints.

## Design Token

- Definition: A named design value that encodes a reusable visual, spatial, motion, or responsive decision.
- Purpose: Keep styling decisions consistent, traceable, and reusable across documentation, portal examples, and implementation.
- Used In: Foundations, layout, components, product components, motion, implementation.
- Related Terms: Foundation, Motion, Surface, Variant.
- Notes: A token is not approved for product use until its documentation, Design Portal representation, and implementation are aligned.

## Layout

- Definition: The system of reusable composition rules and primitives that organize content, components, sections, and surfaces on a page.
- Purpose: Create predictable structure across PlayBooky interfaces without local one-off composition.
- Used In: Page, Section, Surface, components, product screens, Design Portal.
- Related Terms: Page, Section, Surface, Component.
- Notes: Layout primitives define structure; components define reusable interface behaviour.

## Component

- Definition: A reusable, governed UI building block with documented purpose, behaviour, states, accessibility expectations, and implementation guidance.
- Purpose: Provide consistent interface parts that can be reused safely across PlayBooky.
- Used In: Design Portal, product screens, patterns, implementation, review.
- Related Terms: Product Component, Variant, State, Status.
- Notes: A component must not be introduced into product screens unless it is Approved or Current with confidence rating 4 or 5.

## Product Component

- Definition: A reusable, governed PlayBooky-specific component that supports product needs but is not a full product screen.
- Purpose: Capture recurring product interface needs without creating local UI outside the design system.
- Used In: Product flows, Design Portal, product implementation, review.
- Related Terms: Component, Pattern, User Need, Success Criteria.
- Notes: Product components must document purpose, user need, success criteria, variants, states, responsive behaviour, accessibility, props or data contract, code examples, and decision history.

## Pattern

- Definition: A reusable workflow, behaviour, or multi-component arrangement that solves a recurring user or product problem.
- Purpose: Make complex interactions consistent across screens without forcing every page to invent its own flow.
- Used In: Recommendation, diagnosis, builder, facilitator guide, product screens.
- Related Terms: Component, Product Component, Page, User Need.
- Notes: A pattern may contain components, layout rules, content guidance, data expectations, and review criteria.

## Page

- Definition: A complete route-level interface or portal reference view with a clear purpose, structure, and source-of-truth responsibility.
- Purpose: Organize system or product information into navigable, reviewable units.
- Used In: Design Portal, product routes, documentation structure, implementation.
- Related Terms: Section, Layout, Pattern, Information Architecture.
- Notes: Product pages must use only Approved or Current items with confidence rating 4 or 5.

## Section

- Definition: A meaningful content or interface region within a page that groups related information or actions.
- Purpose: Help users scan, understand, and move through page content predictably.
- Used In: Page composition, layout primitives, Design Portal pages, product screens.
- Related Terms: Page, Layout, Surface, Information Architecture.
- Notes: A section is structural. It should not be treated as a decorative card.

## Surface

- Definition: A visual container or background treatment that separates, groups, or elevates interface content.
- Purpose: Clarify hierarchy and affordance without changing component meaning or creating local design exceptions.
- Used In: Layout, components, cards, panels, page backgrounds, Design Portal examples.
- Related Terms: Layout, Section, Design Token, Component.
- Notes: Surface rules cover panels, cards, backgrounds, borders, and elevation relationships.

## Variant

- Definition: A documented alternative form of a component, product component, pattern, or system item that preserves the same core purpose.
- Purpose: Support known usage differences without creating unrelated one-off implementations.
- Used In: Components, product components, patterns, Design Portal examples, implementation.
- Related Terms: Component, State, Status, Design Token.
- Notes: Variants must be defined at the system level, not invented locally by product pages.

## State

- Definition: A temporary condition of a component, product component, pattern, or interface caused by interaction, data, loading, validation, or availability.
- Purpose: Ensure behaviour and feedback are predictable across normal and edge-case use.
- Used In: Components, product components, patterns, accessibility, implementation.
- Related Terms: Variant, Status, Accessibility, Validation.
- Notes: Common states include loading, disabled, focused, selected, empty, error, and success.

## Status

- Definition: A lifecycle label that communicates the governance readiness of a system item.
- Purpose: Prevent unreviewed or unstable work from being used as if it were product-ready.
- Used In: Design Portal pages, documentation, quality gates, review, implementation.
- Related Terms: Exploring, Improved, Approved, Current, Rejected, Deprecated.
- Notes: The canonical statuses are Exploring, Improved, Approved, Current, Rejected, and Deprecated.

## Confidence

- Definition: A rating from 1 to 5 that communicates how stable and product-ready the guidance for a governed item is.
- Purpose: Help reviewers and implementers understand whether a system item is experimental, directional, usability-ready, or production-ready.
- Used In: Status tags, approval workflow, quality gates, product eligibility.
- Related Terms: Status, Approved, Current, Quality Gate.
- Notes: Product screens may use only items with confidence rating 4 or 5.

## Current

- Definition: The lifecycle status for the preferred active implementation and first choice for product use.
- Purpose: Identify the system item that should be used when multiple product-eligible options exist.
- Used In: Design Portal, components, product components, patterns, layout primitives, tokens.
- Related Terms: Status, Approved, Confidence, Deprecated.
- Notes: Current items must have aligned documentation, portal representation, and implementation when code exists.

## Approved

- Definition: The lifecycle status for a reviewed system item that is allowed for product use.
- Purpose: Mark work that has passed required evidence, review, and quality gate expectations.
- Used In: Design Portal, product screens, implementation, review, approval workflow.
- Related Terms: Status, Current, Review, Approval.
- Notes: Approved means usable. Current means preferred when both statuses exist.

## Exploring

- Definition: The lifecycle status for a system item being researched, shaped, or tested and not ready for implementation.
- Purpose: Allow early work to exist visibly without being mistaken for product-ready guidance.
- Used In: Proposals, discovery, design system exploration, AI-assisted shaping.
- Related Terms: Status, Improved, Rejected, User Need.
- Notes: Exploring items are not eligible for product screen use.

## Improved

- Definition: The lifecycle status for a system item that has been revised into a reviewable direction but is not yet approved for product use.
- Purpose: Show that feedback has been addressed and the work is ready for structured review.
- Used In: Review workflow, component updates, pattern updates, quality gate preparation.
- Related Terms: Status, Exploring, Approved, Review.
- Notes: Improved items are not eligible for product screen use.

## Rejected

- Definition: The lifecycle status for a system item or direction that was considered and intentionally not approved.
- Purpose: Preserve decision history and prevent contributors from repeating known unsuitable directions.
- Used In: Decision records, review outcomes, exploration archives, governance.
- Related Terms: Status, Exploring, Review, Approval.
- Notes: Rejected work may return to Exploring only when new evidence or a new user need reopens the decision.

## Deprecated

- Definition: The lifecycle status for a system item that exists for legacy reference but must not be used for new work.
- Purpose: Support migration away from older decisions while preserving historical context and replacement guidance.
- Used In: Design Portal, migration notes, product usage review, implementation cleanup.
- Related Terms: Status, Current, Approved, Used In.
- Notes: Existing usage may remain only inside a documented migration window.

## Motion

- Definition: Governed animation, transition, timing, easing, and movement behaviour used to support interaction and feedback.
- Purpose: Make movement purposeful, accessible, consistent, and aligned with system intent.
- Used In: Motion tokens, components, patterns, loading behaviour, interaction feedback.
- Related Terms: Design Token, Accessibility, State, Quality Gate.
- Notes: Motion behaviour must include reduced-motion expectations or an explicit no-motion statement.

## Accessibility

- Definition: The practice and requirements that ensure PlayBooky interfaces can be used by people with diverse abilities and assistive technologies.
- Purpose: Make product and system work inclusive, testable, and compliant with documented accessibility expectations.
- Used In: Components, product components, patterns, review, quality gates, implementation.
- Related Terms: State, Motion, Quality Gate, Validation.
- Notes: Interactive or content-bearing components require accessibility review before becoming Approved or Current.

## Quality Gate

- Definition: A required set of checks used to determine whether work is ready to merge, ship, or become product-eligible.
- Purpose: Protect system quality by verifying evidence, implementation, accessibility, motion, documentation, and review requirements.
- Used In: Review, approval workflow, implementation, validation, acceptance criteria.
- Related Terms: Review, Approval, Validation, Acceptance Criteria.
- Notes: Failed quality gates require correction or an explicitly documented approved exception.

## Specification

- Definition: A documented source-of-truth description of what a system item or product decision must do, include, support, and satisfy.
- Purpose: Define intent, rules, behaviour, acceptance expectations, and implementation boundaries before or alongside code.
- Used In: Documentation, Design Portal, implementation, review, quality gates.
- Related Terms: Contract, Documentation, Acceptance Criteria, Success Criteria.
- Notes: Documentation is the specification layer in the PlayBooky source-of-truth model.

## Contract

- Definition: A binding agreement between system parts that defines required structure, behaviour, data, props, or responsibilities.
- Purpose: Keep implementation, documentation, and review aligned across boundaries.
- Used In: Components, data integration, props, product components, implementation.
- Related Terms: Specification, Constitution, Implementation, Validation.
- Notes: Contracts may be technical, behavioural, content-related, or governance-related.

## Constitution

- Definition: The highest-trust governing document that defines the non-negotiable operating rules for PlayBooky V3.
- Purpose: Prevent conflicting sources, invented product rules, duplicated design decisions, and undocumented interface work.
- Used In: Foundation, governance, review, approval, AI behaviour.
- Related Terms: Foundation, Contract, Owner, AI Agent.
- Notes: When sources conflict, the constitution wins unless it is explicitly amended.

## Information Architecture

- Definition: The structure, hierarchy, naming, and navigation model that organizes system and product information.
- Purpose: Make the Design Portal and documentation predictable for humans and AI agents.
- Used In: Design Portal navigation, documentation structure, page hierarchy, sections.
- Related Terms: Page, Section, Documentation, Used In.
- Notes: Labels should be stable, literal, and aligned with documented source-of-truth areas.

## Documentation

- Definition: The maintained written source-of-truth layer that records rules, standards, rationale, evidence, and approval criteria.
- Purpose: Give humans and AI agents enough context to build, review, and maintain PlayBooky without private knowledge.
- Used In: Specifications, Design Portal, review, implementation, AI guidance.
- Related Terms: Specification, Information Architecture, Constitution, Used In.
- Notes: Documentation must not conflict with the constitution.

## Used In

- Definition: A recorded list of system areas, product areas, documents, or implementation surfaces where a term or item is applied.
- Purpose: Show scope, impact, and dependencies for review, migration, and AI-assisted work.
- Used In: Glossary entries, status tags, migration notes, quality gates, review.
- Related Terms: Documentation, Information Architecture, Deprecated, Validation.
- Notes: Used-in references help reviewers understand blast radius before approving changes.

## Owner

- Definition: The person or assigned governance area responsible for decisions about a system item, rule, or product direction.
- Purpose: Make accountability explicit and route approvals to the right decision source.
- Used In: Governance, status tags, approval workflow, decision records.
- Related Terms: Constitution, Review, Approval, Quality Gate.
- Notes: If an owner is not recorded, Vimal Raja is the final decision owner.

## AI Agent

- Definition: An AI contributor operating in the repository or Design Portal context under documented PlayBooky rules.
- Purpose: Assist with specification, implementation, review, validation, and maintenance without inventing undocumented product or design decisions.
- Used In: AI behaviour, build rules, quality gates, documentation, implementation.
- Related Terms: Codex, Constitution, Documentation, Review.
- Notes: AI inference is the least trusted source in the hierarchy of trust.

## Codex

- Definition: The AI coding agent used to inspect, edit, validate, and document PlayBooky repository work.
- Purpose: Help execute governed changes while following repository instructions, documentation, and source-of-truth hierarchy.
- Used In: AI-assisted implementation, documentation updates, review support, validation.
- Related Terms: AI Agent, Implementation, Validation, Quality Gate.
- Notes: Codex must follow the same governance model as any other AI agent.

## Review

- Definition: The structured assessment of whether work satisfies its purpose, user need, success criteria, documentation, implementation, and governance requirements.
- Purpose: Identify gaps before work becomes approved, current, merged, or product-eligible.
- Used In: Approval workflow, quality gates, component lifecycle, implementation changes.
- Related Terms: Approval, Quality Gate, Acceptance Criteria, Validation.
- Notes: Review can return work to Improved, approve it, or reject it with rationale.

## Approval

- Definition: The governance decision that confirms a system item or change has met required evidence and may move to an allowed status or use.
- Purpose: Establish when work is officially allowed for product use, release, or lifecycle transition.
- Used In: Approval workflow, status changes, Design Portal, quality gates.
- Related Terms: Review, Approved, Owner, Quality Gate.
- Notes: Approval must come from the required owner or owners for the affected governance areas.

## Implementation

- Definition: The code, configuration, assets, or route-level work that executes documented and portal-approved decisions.
- Purpose: Turn specifications and Design Portal decisions into working product or system behaviour.
- Used In: Components, product screens, Design Portal, validation, quality gates.
- Related Terms: Specification, Contract, Validation, Acceptance Criteria.
- Notes: Code is the execution layer, not the highest-trust source of truth.

## Validation

- Definition: The process of checking that implementation, documentation, portal representation, and acceptance expectations align.
- Purpose: Confirm that the work behaves as specified and remains safe for product or system use.
- Used In: Quality gates, implementation, review, acceptance criteria, approval.
- Related Terms: Quality Gate, Acceptance Criteria, Success Criteria, Review.
- Notes: Validation may include tests, visual checks, accessibility checks, content review, and source-of-truth comparison.

## Acceptance Criteria

- Definition: Specific conditions that must be satisfied for a change, item, or implementation task to be accepted.
- Purpose: Make completion testable and reduce ambiguity during review.
- Used In: Specifications, implementation tasks, quality gates, review, validation.
- Related Terms: Success Criteria, Validation, Quality Gate, Specification.
- Notes: Acceptance criteria are task or item checks. Success criteria describe intended outcomes.

## Success Criteria

- Definition: Outcome-focused measures that show whether a component, pattern, page, or product decision achieves its intended purpose.
- Purpose: Connect interface and implementation choices back to user and product value.
- Used In: Components, product components, patterns, pages, review.
- Related Terms: Purpose, User Need, Acceptance Criteria, Review.
- Notes: Success criteria must be defined before interface work is considered complete.

## User Need

- Definition: The user problem, moment, or requirement that a system item or product decision exists to support.
- Purpose: Ensure work starts from intent rather than visual invention or implementation convenience.
- Used In: Components, product components, patterns, pages, proposals, review.
- Related Terms: Purpose, Success Criteria, Pattern, Product Component.
- Notes: A missing user need blocks completion for component, pattern, and product-facing interface work.

## Purpose

- Definition: The reason a system item, document, page, component, pattern, or decision exists.
- Purpose: Establish intent before interface, implementation, status, or approval decisions are made.
- Used In: Specifications, glossary entries, components, product components, patterns, pages.
- Related Terms: User Need, Success Criteria, Foundation, Specification.
- Notes: Purpose must be stated before creating or changing governed work.
