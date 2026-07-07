# Foundations

Foundation tokens define the lowest-level visual rules for PlayBooky. They are the approved source for visual decisions used by components, layouts, patterns, pages, and the Design Portal.

This document defines the token architecture only. It does not define final token values.

## Purpose

Foundation tokens exist to keep PlayBooky visually consistent, maintainable, and safe for both human and AI contributors.

They prevent arbitrary visual choices by making every reusable visual value explicit, named, documented, approved, and validated before it is used in product code.

## Scope

Foundation tokens cover the primitive visual decisions that other system layers depend on.

In scope:

- Approved token categories
- Token naming rules
- Token approval and governance
- Token usage rules for code
- Token representation in the Design Portal
- Token validation expectations
- Rules for adding new tokens
- AI behaviour when working with tokens

Out of scope:

- Final token values
- Component-specific styling decisions
- Layout patterns
- Page-level composition
- Brand asset production
- One-off visual experiments

## Token Philosophy

Foundation tokens are system decisions, not implementation conveniences.

Every token must represent a reusable visual rule with a clear purpose. Tokens should be stable enough to support many surfaces, but specific enough that contributors can choose the correct token without guessing.

Tokens must be:

- Approved before use
- Named by purpose and category
- Available through the foundation system
- Documented in the Design Portal
- Validated in code
- Responsive where the category requires desktop, tablet, and mobile behaviour

Tokens must not be created locally inside components, layouts, patterns, or pages.

## Token Naming Convention

Token names must be predictable, readable, and category-led.

Use this structure:

```text
{category}.{role}.{variant}.{state-or-scale}
```

The exact number of segments may vary by category, but each token name must move from broad meaning to specific use.

Examples of allowed naming shape:

```text
colour.surface.primary
colour.text.muted
spacing.scale.4
radius.control.default
elevation.overlay.raised
motion.duration.fast
motion.easing.standard
breakpoint.tablet.min
z-index.overlay.modal
```

These are naming examples only. They do not approve final token values.

Naming rules:

- Use lowercase names.
- Use dot notation.
- Use clear category prefixes.
- Use semantic roles where possible.
- Use numeric scales only when the category is intentionally scale-based.
- Do not encode raw values in token names.
- Do not create names that describe a single component unless the token is approved as a shared system rule.

## Token Categories

The foundation system must support these token categories:

| Category | Purpose |
| --- | --- |
| Colour | Approved colours for surfaces, text, icons, borders, states, and data meaning. |
| Typography | Approved font families, sizes, weights, line heights, tracking, and text roles. |
| Spacing | Approved layout and component spacing scales. |
| Radius | Approved corner radius rules for surfaces, controls, and containers. |
| Elevation | Approved depth and shadow rules. |
| Border | Approved border widths, styles, and semantic border roles. |
| Opacity | Approved transparency levels for states, overlays, disabled UI, and effects. |
| Blur | Approved blur values for overlays, panels, and visual effects. |
| Motion duration | Approved timing values for transitions and animations. |
| Motion easing | Approved easing curves for transitions and animations. |
| Breakpoints | Approved responsive thresholds for desktop, tablet, and mobile. |
| Z-index | Approved stacking layers for navigation, overlays, dialogs, popovers, and system UI. |

No category may be bypassed with hardcoded values when an approved token is required.

## Token Approval Workflow

New tokens must move through the foundation system before they are used anywhere else.

Workflow:

1. Identify the visual need and confirm that no existing token solves it.
2. Propose the token name, category, intended use, responsive behaviour where relevant, and rationale.
3. Review the proposal against existing tokens, accessibility expectations, brand direction, and product needs.
4. Add the approved token to the foundation token source.
5. Document the token in the Design Portal.
6. Add or update validation coverage.
7. Use the token in components, layouts, patterns, or pages only after approval is complete.

A token is not approved just because it appears in a mockup, prototype, component, pull request, or AI-generated suggestion.

## How Tokens Are Used In Code

Code must consume tokens from the approved foundation token source.

Rules:

- Components must reference token names or generated token variables.
- Layouts must use approved spacing, breakpoint, z-index, and related layout tokens.
- Patterns and pages must compose existing tokens instead of defining new values.
- No component may define new token values locally.
- Raw visual values must not be introduced in component, layout, pattern, or page code.
- Temporary hardcoded values are not allowed for token-governed properties.
- Token usage must preserve desktop, tablet, and mobile support where relevant.

Implementation may expose tokens through generated CSS variables, theme objects, TypeScript constants, design-token JSON, or another approved system format. Regardless of implementation format, the source of truth must remain the foundation token system.

## How Tokens Are Shown In The Design Portal

The Design Portal must make foundation tokens visible, searchable, and understandable.

Each token entry should show:

- Token name
- Category
- Intended use
- Status
- Example rendering where visual
- Responsive behaviour where relevant
- Accessibility notes where relevant
- Usage guidance
- Related tokens

The Design Portal must distinguish between approved tokens, proposed tokens, deprecated tokens, and removed tokens.

The portal must not present unapproved examples as available system tokens.

## How Tokens Are Validated

Token validation protects the system from accidental drift.

Validation should confirm that:

- Token names follow the naming convention.
- Token categories are approved.
- Token values come from the foundation source.
- Code does not introduce random colours.
- Code does not introduce random spacing.
- Code does not introduce random typography.
- Code does not introduce random shadows.
- Code does not introduce random radii.
- Components do not define new token values locally.
- Responsive token requirements are covered for desktop, tablet, and mobile where relevant.
- Design Portal documentation matches the token source.

Validation may be handled through linting, type checks, token build checks, visual review, documentation checks, or CI workflows.

## Rules For Adding New Tokens

New tokens may be added only when there is a reusable system need.

Rules:

- Check existing tokens before proposing a new token.
- Add new tokens to the foundation system first.
- Document the token before product usage.
- Include category, purpose, intended use, and responsive behaviour where relevant.
- Avoid duplicates with different names.
- Avoid near-duplicates that make selection ambiguous.
- Avoid one-off component tokens unless they represent a reusable system rule.
- Do not add raw values directly to components, layouts, patterns, or pages.
- Deprecate old tokens deliberately when replacing them.

## AI Behaviour Rules

AI contributors must treat foundation tokens as mandatory system constraints.

AI must:

- Use existing approved tokens whenever styling token-governed properties.
- Refuse to invent random colours.
- Refuse to invent random spacing.
- Refuse to invent random typography.
- Refuse to invent random shadows.
- Refuse to invent random radii.
- Check the foundation system before suggesting new visual values.
- Propose new tokens through the approval workflow when an approved token does not exist.
- Keep token architecture, token values, and component implementation separate.
- Preserve desktop, tablet, and mobile support where relevant.

AI must not:

- Hardcode unapproved visual values.
- Create local component-only token values.
- Treat a prototype value as approved.
- Use visual values from memory when the source of truth is available.
- Add final token values in this architecture document.

## Acceptance Criteria

This architecture is accepted when:

- Foundation tokens are defined as the lowest-level visual rules in PlayBooky.
- The scope of foundation tokens is clear.
- Token philosophy and naming conventions are documented.
- All required token categories are listed.
- The approval workflow is defined.
- Code usage rules prevent local token invention.
- Design Portal expectations are documented.
- Validation expectations are documented.
- Rules for adding new tokens are documented.
- AI behaviour rules prevent arbitrary visual choices.
- The document does not define final token values.
