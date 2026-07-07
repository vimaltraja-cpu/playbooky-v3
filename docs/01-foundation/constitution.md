# PlayBooky V3 Constitution

## Purpose

This constitution defines the non-negotiable operating rules for PlayBooky V3.

It exists so humans and AI agents can build from one source of truth without inventing product rules, duplicating design decisions, or creating interface work that is not grounded in documented intent.

Every future documentation file, Design Portal page, component, pattern, product page, and implementation decision must comply with this constitution.

## Scope

This constitution applies to:

- The Design Portal at `/design-system`.
- All documentation in `docs/`.
- All design system components.
- All future PlayBooky product screens.
- All shared tokens, utilities, assets, and implementation code.
- All AI-assisted work in the repository.

This constitution does not define product strategy, detailed product requirements, or final component specifications. Those must be documented in their appropriate source-of-truth files before implementation.

## Source Of Truth

The Design Portal is the single source of truth for PlayBooky V3 design decisions.

The documentation in `docs/` defines the rules, standards, and rationale that support the Design Portal. The Design Portal turns those rules into navigable, inspectable, live system pages.

There is no separate playground.

There is no second component reference.

There is no product-only UI library.

If a design decision, component, token, pattern, or usage rule is not documented in the Design Portal or its supporting documentation, it is not approved for product use.

## Principle Zero: Intent Before Interface

Every component, pattern, and product-facing interface must define intent before interface.

Before creating or changing a component, the work must define:

- Purpose: what the component exists to do.
- User need: the user problem or moment the component supports.
- Success criteria: how the component will be judged as working.

Interface design, visual styling, props, states, motion, and code must follow from that intent.

AI agents must not start by inventing UI. They must first identify the relevant purpose, user need, and success criteria. If those do not exist, the agent must create or request the missing Design Portal documentation before implementing the interface.

Acceptance criteria:

- A component page cannot be considered complete without purpose, user need, and success criteria.
- A product page cannot use a component whose purpose, user need, and success criteria are missing.
- A one-off interface cannot bypass this principle.

## Hierarchy Of Trust

When sources conflict, use this hierarchy:

1. This constitution.
2. Design Portal pages for approved/current system decisions.
3. Documentation in `docs/`.
4. Existing shared component implementation.
5. Existing product implementation.
6. User task instructions for the current change.
7. AI inference.

AI inference is the least trusted source. It may be used only to connect clearly documented decisions, not to invent new product rules.

If a user request conflicts with this constitution, the constitution wins unless the user explicitly asks to amend the constitution.

If code conflicts with the Design Portal, the Design Portal wins and the code should be treated as stale.

## One Portal Model

PlayBooky V3 uses one portal model.

The Design Portal is the home for:

- Foundations.
- Layout.
- Components.
- Patterns.
- Motion.
- Assets.
- AI and build rules.
- Product-facing design system decisions.

Every component lives on its own portal page.

Every component page must be suitable for both humans and AI agents. A future contributor should be able to understand why the component exists, when to use it, how it behaves, how it responds across breakpoints, and how to implement it without relying on private context.

There must not be a separate playground, hidden examples area, or disconnected component showcase. Examples belong on the component's portal page.

## Component Lifecycle

Every component must move through a documented lifecycle.

Allowed lifecycle stages:

- Proposed: the component need has been identified, but the component is not ready for product use.
- Draft: the component is being explored in the Design Portal and may change substantially.
- Current: the component is usable and reflects the current design direction.
- Approved: the component is stable enough for product pages and should be preferred for production use.
- Deprecated: the component should no longer be used for new work and must include replacement guidance.
- Removed: the component is no longer available for use.

Product pages may only use Current or Approved components.

Deprecated components may remain only where they already exist and must not be introduced into new product work.

AI agents must check lifecycle status before using, changing, or recommending a component.

## Status Tags

Every component must display a status tag on its portal page.

Status tags must be explicit, visible, and consistent with the component lifecycle.

Minimum status metadata:

- Status.
- Confidence rating.
- Last reviewed date.
- Owner or decision source when known.
- Used-in references when the component is used by product pages or patterns.

Validation:

- A component without a status tag is not eligible for product use.
- A component with an unclear or missing status must be treated as Proposed.
- Product implementation must not silently promote component status.

## Product Usage Rules

Product pages may only use Approved or Current components.

Product pages must not create one-off UI.

Product pages must not define new component variants locally.

Product pages must not create local styling that changes the meaning, structure, behaviour, accessibility, or responsive rules of an approved component.

If a product page needs something that does not exist in the design system, it must be created and documented in the Design Portal first.

Acceptance criteria:

- Product pages compose existing system components and patterns.
- Any new interface need is routed back through the Design Portal.
- Product-specific composition may exist, but product-specific component invention may not.

## Page Composition Rules

Pages are compositions of approved layout primitives, components, and patterns.

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
- The component defines variants, states, motion, accessibility, props, code examples, responsive behaviour, and decision history.

New components must be created in the Design Portal first.

AI agents must not create new components directly inside product pages.

AI agents must not duplicate an existing component under a new name unless the Design Portal explicitly defines why both components exist.

## Responsive Rules

Every component and pattern must define desktop, tablet, and mobile behaviour.

Responsive documentation must cover:

- Layout changes.
- Spacing changes.
- Content wrapping.
- Minimum and maximum widths.
- Interaction changes.
- Navigation or disclosure changes.
- Any hidden, collapsed, or reordered content.

Responsive behaviour must be intentional. It must not be left to incidental CSS defaults where the behaviour affects usability, comprehension, or accessibility.

Acceptance criteria:

- Components are not complete until all three breakpoint behaviours are documented.
- Product pages must not invent undocumented responsive behaviour for system components.

## Motion Rules

Motion must clarify state, hierarchy, causality, or feedback.

Motion must not be decorative by default.

Every component that uses motion must define:

- Trigger.
- Duration.
- Easing.
- Affected properties.
- Enter and exit behaviour.
- Loading or pending behaviour where relevant.
- Reduced-motion behaviour.

Components must remain usable when reduced motion is enabled.

AI agents must not introduce motion that is not documented by the relevant component, pattern, or motion token rule.

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

Components and product pages must use existing tokens where available.

Hard-coded values are allowed only when:

- The value is temporary and clearly localized.
- No token exists yet.
- The missing token need is documented for future system work.

AI agents must not create new token scales casually. New tokens require a documented purpose and a relationship to the existing token system.

## Accessibility Rules

Accessibility is a requirement, not a later review layer.

Every component must document:

- Semantic structure.
- Keyboard behaviour.
- Focus behaviour.
- Screen reader expectations.
- Colour contrast expectations.
- Touch target expectations where relevant.
- Error and feedback behaviour where relevant.
- Reduced-motion behaviour where relevant.

Product pages must not use components in ways that break their documented accessibility behaviour.

AI agents must check accessibility before presenting work as complete.

Acceptance criteria:

- Interactive components are keyboard reachable and operable.
- Focus states are visible.
- Visual state is not communicated by colour alone.
- Motion-sensitive users have a reduced-motion path.

## Decision History Rules

Every component page must include decision history.

Decision history records why the component exists and why meaningful changes were made.

Decision history must include:

- Date.
- Decision.
- Rationale.
- Impact.
- Source or owner where known.

Decision history is required for:

- New components.
- Status changes.
- Major variant changes.
- Breaking prop changes.
- Accessibility changes.
- Responsive behaviour changes.
- Motion changes.
- Deprecation or removal.

AI agents must update decision history when their work changes a documented decision.

## Live Component Rules

Every component page must include live component examples once the component has an implementation.

Live examples must show:

- Default usage.
- Supported variants.
- Key states.
- Responsive behaviour where practical.
- Accessibility-relevant interactions where practical.

Live examples are part of the source of truth. They must use the same component implementation available to product pages.

The Design Portal must not show mock examples that diverge from production component code unless clearly marked as non-production exploration.

## Code Rules

Code must serve the documented system.

Implementation rules:

- Shared components belong in the appropriate component area.
- Product pages compose system components instead of creating local one-off UI.
- Component props must match documented usage.
- Component examples must stay close to real implementation.
- Styling must use tokens and approved layout rules where available.
- Unapproved product screens must not be created.
- Old assets must not be imported until approved through the asset system.
- Database connections must not be added until product architecture requires and documents them.

AI agents must inspect existing code and documentation before making changes.

AI agents must keep changes scoped to the requested layer: documentation, portal, component, pattern, product, token, or asset.

## AI Quality Gate

Before presenting work as complete, an AI agent must self-review against this quality gate.

Required checks:

- Source of truth: the change follows the Design Portal and documentation hierarchy.
- Intent: purpose, user need, and success criteria are defined where required.
- Status: component lifecycle status is present where required.
- Product safety: no one-off product UI was introduced.
- Portal-first: missing system pieces were created or documented in the portal before product use.
- Responsive: desktop, tablet, and mobile behaviour are documented or preserved.
- Motion: motion is documented and includes reduced-motion behaviour where relevant.
- Tokens: token usage is respected.
- Accessibility: semantic, keyboard, focus, contrast, and reduced-motion expectations are considered.
- Decision history: meaningful system decisions are recorded.
- Used-in tracking: component usage references are updated where relevant.
- Code quality: lint, typecheck, build, or targeted verification is run when relevant.

If any check fails, the AI agent must either fix the issue or report it as a blocker.

## Confidence Rating

Every component must have a confidence rating.

Confidence ratings communicate how stable the component guidance is.

Allowed ratings:

- High: the component is well understood, implemented, documented, and safe for product use.
- Medium: the component is usable but has known open questions or limited validation.
- Low: the component is exploratory, incomplete, or risky.

Product pages should prefer High confidence components.

Current components may have Medium confidence if their open questions are documented.

Approved components should normally have High confidence. If an Approved component has Medium confidence, the reason must be explicit.

Low confidence components are not eligible for product use.

## Used-In Tracking

Every component page must track where the component is used.

Used-in tracking should include:

- Product pages.
- Design Portal pages.
- Patterns.
- Other components that depend on it.

Used-in tracking helps future contributors understand impact before changing a component.

AI agents must check used-in references before making breaking changes.

If used-in tracking is missing, the agent must not assume the component is unused.

## AI Behaviour Rules

AI agents working in PlayBooky V3 must:

- Treat this constitution as binding.
- Use the Design Portal as the source of truth.
- Read relevant documentation before implementation.
- Avoid inventing product rules.
- Avoid creating one-off UI inside product pages.
- Create missing design system pieces in the portal before using them in product pages.
- Preserve existing documentation and decision history.
- Mark uncertainty instead of hiding it.
- Prefer small, scoped changes.
- Run relevant validation before reporting completion.
- Report any conflict between user instructions, documentation, and code.

AI agents must not:

- Create product screens before the design system permits it.
- Import old assets without asset approval.
- Connect databases without documented architecture approval.
- Promote component status without evidence.
- Treat existing code as more authoritative than the Design Portal.
- Skip responsive, motion, accessibility, or token requirements for speed.

## V3 Mission

PlayBooky V3 exists to create a durable, coherent product system before product complexity grows.

The mission is to build a Design Portal and documentation system that lets humans and AI agents work from the same source of truth, with intent, quality, accessibility, and product safety built into the process from the start.

PlayBooky V3 should become easier to extend over time because its decisions are documented, its components are governed, and its product interfaces are composed from approved system parts.

The work is successful when a future contributor can move through the documentation, Design Portal, and codebase using the same hierarchy and arrive at the same decisions without private context.
