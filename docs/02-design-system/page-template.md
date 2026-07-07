# Component Page Template

This specification defines the required page template for every PlayBooky Design Portal component page.

Every component page must be self-contained. A human reviewer or AI agent must be able to understand the component, review its design intent, approve its readiness, and implement it without relying on unstated assumptions.

## Scope

This template applies to every page in the component library, including primitive UI components, composed product components, navigation components, form components, feedback components, and future component categories.

Pattern pages, foundation token pages, product strategy pages, and asset pages may reference this structure, but they are not required to follow it unless they describe a reusable component.

## Required Page Structure

Every component page must use the following sections in this order:

1. Page header
2. Purpose
3. User need
4. Success criteria
5. Overview
6. Live preview
7. Variants
8. States
9. Responsive previews
10. Motion behaviour
11. Anatomy
12. Props/data contract
13. Usage rules
14. Do and don't guidance
15. Accessibility
16. Code examples
17. Decision history
18. Used in
19. Related components
20. Related patterns
21. Quality gate checklist
22. Acceptance criteria

No required section may be omitted. If a section does not apply, the page must include the section with a short reason and a value of `Not applicable`.

## Page Header

The page header is the approval and ownership record for the component.

### Required fields

| Field | Required | Validation rule |
| --- | --- | --- |
| Title | Yes | Must be the component name in title case. |
| Category | Yes | Must match an approved Design Portal component category. |
| Status tag | Yes | Must use one allowed status tag. |
| Confidence rating | Yes | Must use one allowed confidence level. |
| Version | Yes | Must use semantic versioning: `major.minor.patch`. |
| Owner | Yes | Must name a role, team, or accountable person. |
| Last updated | Yes | Must use ISO date format: `YYYY-MM-DD`. |

### Allowed status tags

| Status tag | Meaning |
| --- | --- |
| Exploring | The component is being researched or shaped and must not be treated as ready for implementation. |
| Improved | The component has been revised from a previous direction and requires review before it can become current or approved. |
| Approved | The component has passed review and can be implemented as specified. |
| Current | The component represents the live source of truth for current product implementation. |
| Rejected | The component direction is intentionally not approved and must not be implemented. |
| Deprecated | The component exists for legacy reference and must not be used for new work. |

### Allowed confidence levels

| Rating | Label | Meaning |
| --- | --- | --- |
| 1 | Experimental | Early concept with unresolved purpose, behaviour, or usability questions. |
| 2 | Prototype | Testable direction with known gaps and limited implementation confidence. |
| 3 | Visually directional | Visual design is useful for alignment, but behaviour, accessibility, or edge cases may be incomplete. |
| 4 | Usability ready | Interaction, responsive behaviour, and accessibility expectations are defined well enough for product validation. |
| 5 | Production ready | Component is ready for implementation, QA, reuse, and long-term maintenance. |

### Header format

Each component page must start with this structure:

```md
# Component Name

| Field | Value |
| --- | --- |
| Category | Navigation |
| Status | Approved |
| Confidence | 5 Production ready |
| Version | 1.0.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |
```

### Header validation

- `Title` must match the H1 exactly.
- `Status` must be one of the allowed status tags.
- `Confidence` must include both the number and label.
- `Version` must change when the component contract, behaviour, accessibility requirement, or visual structure changes.
- `Last updated` must change whenever the page content changes.
- `Owner` must not be `TBD`, `Unknown`, or empty.

## Purpose

The purpose section must explain why the component exists.

Required content:

- The product problem the component solves.
- The component's role in the PlayBooky experience.
- The reason this component should exist instead of using a simpler existing component.

Validation rules:

- Must be written as a short paragraph, not a list of labels.
- Must not describe implementation details unless they are essential to the component's reason for existing.
- Must not use generic wording that could apply to any component.

AI behaviour:

- If the purpose is vague, an AI agent must flag the page as incomplete.
- An AI agent must not infer purpose from visual examples alone.

## User Need

The user need section must state the human need the component supports.

Required format:

```md
Users need [capability] so they can [outcome] without [avoidable problem].
```

Validation rules:

- Must identify the user capability.
- Must identify the desired outcome.
- Must identify the problem the component prevents or reduces.
- Must avoid internal-only needs such as "the team needs a component".

AI behaviour:

- If more than one primary user need exists, an AI agent must identify the primary need and list secondary needs separately.
- An AI agent must not convert business goals into user needs unless the user outcome is explicit.

## Success Criteria

Success criteria define how reviewers know the component works.

Required content:

- At least three measurable criteria.
- Criteria covering usability, accessibility, and implementation readiness.
- Any required visual, behavioural, or content constraints.

Validation rules:

- Each criterion must be testable.
- Criteria must not rely on subjective approval alone.
- Criteria must map to the acceptance criteria or quality gate checklist.

AI behaviour:

- An AI agent must use success criteria when reviewing implementation.
- If success criteria conflict with another section, an AI agent must flag the conflict and follow the stricter requirement until resolved.

## Overview

The overview section must describe what the component is, how it behaves, and when it appears.

Required content:

- A plain-language summary of the component.
- The main user interaction.
- The component's relationship to surrounding layout or content.
- Any constraints that affect composition.

Validation rules:

- Must include enough detail to distinguish the component from related components.
- Must not duplicate the purpose section.
- Must mention any required data or content dependencies at a high level.

AI behaviour:

- An AI agent may use the overview to orient implementation.
- An AI agent must treat detailed rules in later sections as more authoritative than the overview.

## Live Preview

The live preview section must define the canonical preview shown in the Design Portal.

Required content:

- The default preview state.
- Required preview content.
- Any interactive controls available in the preview.
- Any known limitations of the preview.

Validation rules:

- Must include the default variant.
- Must use realistic PlayBooky content, not placeholder text, unless placeholder content is explicitly part of the component.
- Must describe what should be visible before interaction.

AI behaviour:

- An AI agent implementing the page must create or maintain a preview that matches the default variant and default state.
- If a live preview cannot be rendered, an AI agent must explain why and provide the closest static preview requirement.

## Variants

The variants section must define all supported component variants.

Required content for each variant:

- Variant name.
- Purpose.
- Visual or behavioural differences.
- Required props or data.
- Usage conditions.
- Restrictions.

Validation rules:

- Every variant shown in preview or code must be documented here.
- Every documented variant must be represented by either a preview, code example, or explicit implementation note.
- Variant names must be stable and implementation-friendly.
- Unsupported visual experiments must not be listed as variants.

AI behaviour:

- An AI agent must not create undocumented variants.
- If implementation requires a new variant, an AI agent must update this section before or alongside implementation.

## States

The states section must define all supported interaction, system, and content states.

Required states to consider:

- Default.
- Hover.
- Focus.
- Active or pressed.
- Disabled.
- Loading.
- Empty.
- Error.
- Success.
- Selected.
- Expanded or collapsed.

Validation rules:

- If a state is supported, its visual treatment and behaviour must be specified.
- If a state is not supported, it must be listed as `Not supported` with a reason.
- Keyboard focus must always be documented for interactive components.
- Error and loading states must define content behaviour, not only visual treatment.

AI behaviour:

- An AI agent must not guess missing state behaviour.
- If a required state is absent for an interactive component, an AI agent must flag the component page as incomplete.

## Responsive Previews

The responsive previews section must describe how the component behaves across viewport classes.

### Required tabs

Every component page must include these responsive tabs:

- Desktop
- Tablet
- Mobile

### Required content for each tab

- Preview size or breakpoint range.
- Layout behaviour.
- Content wrapping or truncation rules.
- Interaction differences.
- Minimum and maximum sizing constraints.

Validation rules:

- Mobile behaviour must not be inferred from desktop behaviour.
- Tablet behaviour must be explicitly documented, even when it matches desktop or mobile.
- Any hidden, collapsed, reordered, or transformed content must be named.
- Text must not overlap, clip unexpectedly, or become unreadable at any supported viewport.

AI behaviour:

- An AI agent must verify all three responsive tabs when reviewing or implementing a component page.
- If only one viewport is provided, an AI agent must mark responsive documentation as incomplete.

## Motion Behaviour

The motion behaviour section must define animation and transition rules.

Required content:

- Whether motion is used.
- Trigger.
- Duration.
- Easing.
- Properties animated.
- Reduced motion behaviour.
- Conditions where motion must not run.

Validation rules:

- Motion must support reduced motion preferences.
- Motion must not be required to understand or complete a task.
- Motion must not hide state changes from assistive technology.
- Duration and easing must use approved motion tokens where available.

AI behaviour:

- An AI agent must not add decorative motion that is not specified.
- If motion is unspecified, implementation must use no motion except existing system defaults.

## Anatomy

The anatomy section must name the component's structural parts.

Required content:

- Ordered list of visible parts.
- Optional parts.
- Required parts.
- Slots or content regions.
- Relationship between parent and child elements.

Validation rules:

- Anatomy names must be reused consistently in usage rules, props, accessibility, and code examples.
- Every visual part shown in the preview must be represented in anatomy.
- Optional parts must define when they appear and disappear.

AI behaviour:

- An AI agent must use anatomy names when discussing changes or review feedback.
- An AI agent must not introduce unnamed structural parts in implementation.

## Props/Data Contract

The props/data contract section must define the interface required to render the component.

Required content:

- Prop or field name.
- Type.
- Required or optional status.
- Default value.
- Allowed values.
- Description.
- Validation rule.

Required format:

```md
| Name | Type | Required | Default | Allowed values | Description | Validation |
| --- | --- | --- | --- | --- | --- | --- |
| variant | string | No | default | default, compact | Controls the component presentation. | Must match a documented variant. |
```

Validation rules:

- Every prop used in a code example must be documented.
- Every required prop must explain what happens when it is missing.
- Enum values must match documented variants, states, or behaviours.
- Content props must define length, formatting, and fallback rules where relevant.

AI behaviour:

- An AI agent must treat the props/data contract as the source of truth for implementation inputs.
- An AI agent must not add undocumented props unless the page is updated.
- If code examples and the props/data contract conflict, an AI agent must flag the conflict before implementation.

## Usage Rules

Usage rules define where, when, and how the component may be used.

Required content:

- Approved use cases.
- Prohibited use cases.
- Placement rules.
- Content rules.
- Interaction rules.
- Composition rules with other components.

Validation rules:

- Rules must be actionable.
- Rules must identify any dependency on category, layout, or pattern guidance.
- Rules must prevent misuse that would harm clarity, accessibility, or consistency.

AI behaviour:

- An AI agent must follow usage rules when generating product UI.
- If a requested implementation violates usage rules, an AI agent must state the violation and propose the nearest compliant alternative.

## Do and Don't Guidance

The do and don't section must give concrete examples of correct and incorrect usage.

Required content:

- At least three `Do` examples.
- At least three `Don't` examples.
- A reason for each example.

Required format:

```md
| Do | Reason |
| --- | --- |
| Use concise labels. | Short labels are easier to scan and less likely to wrap. |

| Don't | Reason |
| --- | --- |
| Don't use the component for long-form content. | It creates dense layouts that are hard to scan. |
```

Validation rules:

- Do and don't examples must be specific to the component.
- Reasons must explain the user or system impact.
- Don't examples must not introduce unsupported variants as visual examples.

AI behaviour:

- An AI agent must consult this section when choosing between similar components.
- If the section conflicts with usage rules, usage rules take precedence.

## Accessibility

The accessibility section must define requirements for inclusive use.

Required content:

- Semantic role or native element expectation.
- Keyboard behaviour.
- Focus behaviour.
- Screen reader name, role, and value expectations.
- Colour contrast requirements.
- Touch target requirements.
- Reduced motion behaviour.
- Error announcement behaviour where relevant.
- Accessible content requirements.

Validation rules:

- Interactive components must define keyboard operation.
- Focus indicators must be visible and must not rely on colour alone.
- Components that update dynamically must define announcement behaviour.
- Disabled states must define whether content remains discoverable.
- Accessibility requirements must be testable.

AI behaviour:

- An AI agent must not mark a component as `Approved`, `Current`, or `5 Production ready` if accessibility requirements are missing.
- An AI agent reviewing implementation must report accessibility gaps before visual polish issues of lower severity.

## Code Examples

The code examples section must show how to implement the component correctly.

Required content:

- Default usage example.
- Example for each supported variant.
- Example for important states or data conditions.
- Import path or usage location when known.
- Notes for unsupported or future implementation when relevant.

Validation rules:

- Code examples must use documented props only.
- Code examples must use realistic content.
- Examples must not include deprecated patterns.
- If implementation is not yet available, the section must state `Implementation pending` and describe the expected interface.

AI behaviour:

- An AI agent may use code examples as implementation guidance only when they do not conflict with the props/data contract.
- An AI agent must update code examples when props, variants, or required states change.

## Decision History

Decision history records how the component reached its current state.

### Required tabs

Every component page must include these decision history tabs:

- Rejected
- Improved
- Approved
- Current

### Required content for each decision

- Date.
- Decision status.
- Decision summary.
- Reason.
- Owner or approver.
- Impact on component design or implementation.

Validation rules:

- Decisions must be listed newest first within each tab.
- Rejected directions must explain why they were rejected.
- Improved entries must describe what changed.
- Approved entries must identify the approval basis.
- Current entries must identify the active source-of-truth decision.

AI behaviour:

- An AI agent must not remove decision history when updating a page.
- An AI agent must add a decision entry when changing status, confidence, behaviour, contract, accessibility requirements, or acceptance criteria.
- If a page has status `Rejected`, `Deprecated`, or `Exploring`, an AI agent must not treat it as implementation-ready.

## Used In

The used in section must list known product surfaces, flows, or pages where the component appears.

Required content:

- Surface or flow name.
- Usage context.
- Status of usage: planned, active, legacy, or removed.
- Link or reference when available.

Validation rules:

- Must include `None documented` if no usage is known.
- Must distinguish planned usage from active usage.
- Must be updated when implementation usage changes.

AI behaviour:

- An AI agent must check this section before proposing breaking changes.
- If a component is used in active surfaces, an AI agent must consider migration or compatibility impact.

## Related Components

The related components section must list components that are alternatives, dependencies, or common companions.

Required content:

- Component name.
- Relationship type: alternative, dependency, companion, parent, or child.
- When to use the related component instead.

Validation rules:

- Must include `None documented` if no related components are known.
- Related components must be linked when their pages exist.
- Alternative components must include a decision rule.

AI behaviour:

- An AI agent must use related components to avoid creating duplicates.
- If a requested component overlaps with an existing related component, an AI agent must flag the overlap.

## Related Patterns

The related patterns section must list design patterns that influence the component.

Required content:

- Pattern name.
- Relationship to the component.
- Required behaviour inherited from the pattern.

Validation rules:

- Must include `None documented` if no related patterns are known.
- Pattern requirements must not contradict component-specific rules.
- Component-specific exceptions must be documented explicitly.

AI behaviour:

- An AI agent must check related patterns before implementing complex behaviour.
- If a pattern and component page conflict, an AI agent must flag the conflict and follow the component page for component-specific implementation until resolved.

## Quality Gate Checklist

The quality gate checklist defines what must be true before the component can be considered ready.

Required checklist:

```md
- [ ] Header metadata is complete and valid.
- [ ] Purpose and user need are specific.
- [ ] Success criteria are measurable.
- [ ] Overview describes behaviour and context.
- [ ] Live preview represents the default component accurately.
- [ ] Variants are documented and represented.
- [ ] States are documented, including focus and disabled where relevant.
- [ ] Desktop, tablet, and mobile previews are documented.
- [ ] Motion behaviour and reduced motion rules are documented.
- [ ] Anatomy names every visible and optional part.
- [ ] Props/data contract is complete and matches examples.
- [ ] Usage rules prevent known misuse.
- [ ] Do and don't guidance includes reasons.
- [ ] Accessibility requirements are testable.
- [ ] Code examples use only documented props and variants.
- [ ] Decision history is current.
- [ ] Used in references are accurate.
- [ ] Related components and patterns are linked or marked as none documented.
- [ ] Acceptance criteria are complete.
```

Validation rules:

- A component cannot be `Approved`, `Current`, or `5 Production ready` unless every checklist item is complete.
- Checklist items must not be removed to make approval easier.
- If an item is not applicable, it must remain in the checklist and include a note explaining why.

AI behaviour:

- An AI agent must run this checklist before marking a page ready for review or implementation.
- An AI agent must not silently pass checklist items that cannot be verified.

## Acceptance Criteria

Acceptance criteria define the final approval conditions for the component page and implementation guidance.

Required content:

- Documentation acceptance criteria.
- Design acceptance criteria.
- Accessibility acceptance criteria.
- Implementation acceptance criteria.
- Review acceptance criteria.

Validation rules:

- Acceptance criteria must be written as testable statements.
- Criteria must cover both the page specification and the component behaviour.
- Criteria must identify any known blockers.
- Criteria must align with the success criteria and quality gate checklist.

AI behaviour:

- An AI agent must use acceptance criteria as the final readiness check.
- If acceptance criteria are incomplete, an AI agent must not claim the component is ready for implementation.
- If an implementation request conflicts with acceptance criteria, an AI agent must report the conflict before changing code.

## AI Behaviour Summary

AI agents working with component pages must follow these rules:

- Treat the component page as the source of truth only when all required sections are present and valid.
- Do not infer missing variants, states, props, accessibility behaviour, or responsive behaviour.
- Do not implement components with status `Exploring`, `Rejected`, or `Deprecated` unless the user explicitly asks for exploratory or legacy work.
- Do not mark a component as `Approved`, `Current`, or `5 Production ready` when required sections are missing.
- Prefer documented rules over visual inference.
- Flag contradictions between sections before implementation.
- Update decision history when changing status, confidence, behaviour, contract, accessibility requirements, or acceptance criteria.
- Preserve previous decision history.
- Use realistic PlayBooky content in examples and previews.
- Keep component pages self-contained enough for a future human or AI agent to continue without external context.

## Component Page Starter Template

Use this starter when creating a new component page.

```md
# Component Name

| Field | Value |
| --- | --- |
| Category |  |
| Status | Exploring |
| Confidence | 1 Experimental |
| Version | 0.1.0 |
| Owner | Design System |
| Last updated | YYYY-MM-DD |

## Purpose

Not documented.

## User Need

Users need [capability] so they can [outcome] without [avoidable problem].

## Success Criteria

- Not documented.

## Overview

Not documented.

## Live Preview

Not documented.

## Variants

Not documented.

## States

Not documented.

## Responsive Previews

### Desktop

Not documented.

### Tablet

Not documented.

### Mobile

Not documented.

## Motion Behaviour

Not documented.

## Anatomy

Not documented.

## Props/Data Contract

| Name | Type | Required | Default | Allowed values | Description | Validation |
| --- | --- | --- | --- | --- | --- | --- |

## Usage Rules

Not documented.

## Do and Don't Guidance

| Do | Reason |
| --- | --- |

| Don't | Reason |
| --- | --- |

## Accessibility

Not documented.

## Code Examples

Implementation pending.

## Decision History

### Rejected

None documented.

### Improved

None documented.

### Approved

None documented.

### Current

None documented.

## Used In

None documented.

## Related Components

None documented.

## Related Patterns

None documented.

## Quality Gate Checklist

- [ ] Header metadata is complete and valid.
- [ ] Purpose and user need are specific.
- [ ] Success criteria are measurable.
- [ ] Overview describes behaviour and context.
- [ ] Live preview represents the default component accurately.
- [ ] Variants are documented and represented.
- [ ] States are documented, including focus and disabled where relevant.
- [ ] Desktop, tablet, and mobile previews are documented.
- [ ] Motion behaviour and reduced motion rules are documented.
- [ ] Anatomy names every visible and optional part.
- [ ] Props/data contract is complete and matches examples.
- [ ] Usage rules prevent known misuse.
- [ ] Do and don't guidance includes reasons.
- [ ] Accessibility requirements are testable.
- [ ] Code examples use only documented props and variants.
- [ ] Decision history is current.
- [ ] Used in references are accurate.
- [ ] Related components and patterns are linked or marked as none documented.
- [ ] Acceptance criteria are complete.

## Acceptance Criteria

Not documented.
```
