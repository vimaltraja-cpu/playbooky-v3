# Primitive Tokens

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.1.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

Primitive tokens define the raw source values that sit at the bottom of the PlayBooky V3 token system.

They exist so colour, typography, spacing, radius, elevation, border, opacity, blur, motion, breakpoint, and z-index decisions have one governed source before they are given semantic meaning or used by components.

Primitive tokens are architecture-level source values. They are not product-facing usage instructions.

## Scope

This document defines primitive token architecture only.

In scope:

- Primitive token purpose.
- Primitive token categories.
- Primitive token naming rules.
- Primitive token validation rules.
- AI behaviour for primitive token work.

Out of scope:

- Final primitive values.
- Final PlayBooky brand colours.
- Component styling.
- Product screen styling.
- React implementation.
- Token build tooling.

## What Primitive Tokens Are

Primitive tokens are named raw values.

They represent the smallest approved units of the visual, motion, responsive, and layering system. Primitive tokens do not communicate product meaning by themselves.

Examples of primitive token concepts:

- A raw colour step.
- A font family reference.
- A spacing step.
- A radius step.
- A shadow recipe.
- A motion duration.
- A breakpoint threshold.
- A z-index layer number.

Primitive tokens must not be consumed directly by product pages.

Primitive tokens must not be consumed directly by component implementation once a semantic token exists for the same decision.

Primitive tokens feed semantic tokens. Semantic tokens give raw values system meaning.

## Token Categories

The primitive token system must support these categories:

- Colour primitives.
- Typography primitives.
- Spacing primitives.
- Radius primitives.
- Elevation primitives.
- Border primitives.
- Opacity primitives.
- Blur primitives.
- Motion duration primitives.
- Motion easing primitives.
- Breakpoint primitives.
- Z-index primitives.

Each category must define its own scale shape before final values are approved.

## Colour Primitives

Colour primitives are raw colour values used as the source for semantic colour tokens.

Colour primitives may represent:

- Neutral scales.
- Brand source scales after brand approval.
- Feedback source scales.
- Data or categorical source scales when a reusable system need exists.

Rules:

- Colour primitives must not define final brand colour values in this document.
- Colour primitives must not be used directly by product pages.
- Colour primitives must be checked for contrast potential before becoming product-supporting source values.
- Colour primitive names must not encode usage meaning such as `button`, `card`, `error-text`, or `primary-action`.

## Typography Primitives

Typography primitives are raw type values used to build semantic typography tokens.

Typography primitives may represent:

- Font families.
- Font sizes.
- Font weights.
- Line heights.
- Letter spacing.
- Text transform rules when a reusable system need exists.

Rules:

- Typography primitives must not be applied directly in product pages.
- Typography primitives must support readable desktop, tablet, and mobile text systems.
- Typography primitives must not encode component names.

## Spacing Primitives

Spacing primitives are raw space values used to build layout, component, and semantic spacing decisions.

Spacing primitives may represent:

- Numeric spacing steps.
- Responsive spacing steps.
- Zero and compact values.
- Large page rhythm values.

Rules:

- Spacing primitives must use a predictable scale.
- Spacing primitives must support desktop, tablet, and mobile layouts.
- Product pages must not hardcode spacing values.
- Product pages must not consume primitive spacing tokens directly.

## Radius Primitives

Radius primitives are raw corner radius values used by semantic surface, control, and container tokens.

Rules:

- Radius primitives must support the approved PlayBooky shape language.
- Radius primitives must not be created for one component only unless a reusable system need is approved first.
- Product pages must not hardcode border radius values.

## Elevation Primitives

Elevation primitives are raw shadow and depth recipes used by semantic elevation tokens.

Elevation primitives may represent:

- Shadow offsets.
- Blur radii.
- Spread values.
- Shadow opacity.
- Layer recipes.

Rules:

- Elevation primitives must clarify hierarchy, not decoration.
- Elevation primitives must work with surface and border semantic tokens.
- Product pages must not hardcode shadow values.

## Border Primitives

Border primitives are raw border values used by semantic border tokens.

Border primitives may represent:

- Border widths.
- Border styles.
- Divider widths.
- Focus outline widths when focus semantics map to border or outline.

Rules:

- Border primitives must not define semantic colour meaning.
- Border colour meaning belongs to semantic border tokens.
- Product pages must not hardcode border widths or styles.

## Opacity Primitives

Opacity primitives are raw opacity values used by semantic disabled, overlay, scrim, and state tokens.

Rules:

- Opacity primitives must preserve readability and contrast once paired with semantic tokens.
- Opacity primitives must not be used to make inaccessible text appear disabled.
- Product pages must not hardcode opacity values.

## Blur Primitives

Blur primitives are raw blur values used by semantic overlay or surface effects.

Rules:

- Blur primitives must have a clear functional purpose.
- Blur primitives must not be used as decorative background effects by default.
- Blur use must preserve readability and performance.

## Motion Duration Primitives

Motion duration primitives are raw timing values used by semantic motion tokens.

Rules:

- Duration primitives must support fast feedback, standard transitions, and longer contextual transitions only when those timing roles are approved.
- Duration primitives must not be chosen per component without a reusable motion purpose.
- Motion duration must support reduced-motion behaviour through semantic motion rules.

## Motion Easing Primitives

Motion easing primitives are raw easing curves used by semantic motion tokens.

Rules:

- Easing primitives must support clear state change and interaction feedback.
- Easing primitives must not be decorative by default.
- Easing primitives must be paired with semantic motion roles before component use.

## Breakpoint Primitives

Breakpoint primitives are raw responsive thresholds.

Rules:

- Breakpoint primitives must support desktop, tablet, and mobile.
- Breakpoint primitives must be stable enough for documentation, portal previews, and implementation.
- Product pages must not hardcode breakpoint values.

## Z-Index Primitives

Z-index primitives are raw layer values used by semantic layering tokens.

Rules:

- Z-index primitives must support predictable stacking for base content, sticky navigation, overlays, dialogs, popovers, and system UI.
- Z-index primitives must not be created locally inside components or product pages.
- Product pages must not hardcode z-index values.

## Naming Rules

Primitive token names must:

- Use lowercase.
- Use dot notation.
- Start with the category prefix.
- Use `primitive` as the second segment.
- Move from broad category to specific scale or source value.
- Avoid product meaning.
- Avoid component names.
- Avoid raw values in the name.

Allowed naming shape:

```text
{category}.primitive.{scale-or-source}
```

Examples of naming shape only:

```text
colour.primitive.neutral.100
typography.primitive.size.4
spacing.primitive.6
radius.primitive.2
motion-duration.primitive.fast
breakpoint.primitive.tablet
z-index.primitive.overlay
```

These examples do not approve final token values.

## Validation Rules

Primitive token validation must confirm:

- The token belongs to an approved primitive category.
- The token name follows the primitive naming rules.
- The token does not encode product meaning.
- The token does not encode component meaning.
- The token does not duplicate an existing primitive.
- The token has a documented purpose.
- The token has an owner.
- The token has status and confidence metadata.
- The token has a documented relationship to semantic tokens before product use.
- Desktop, tablet, and mobile support is documented for responsive categories.

## AI Behaviour

AI agents must:

- Treat primitive tokens as raw source values.
- Avoid inventing final token values.
- Avoid inventing PlayBooky brand colours.
- Stop and document a missing token request when a needed primitive does not exist.
- Route product-facing meaning through semantic tokens.
- Refuse to add random spacing, colour, radius, shadow, typography, opacity, blur, motion, breakpoint, or z-index values.

AI agents must not:

- Use primitive tokens directly in product pages.
- Treat primitive tokens as approved semantic usage guidance.
- Create component-only primitive tokens.
- Hardcode visual values to bypass missing tokens.

## Acceptance Criteria

Primitive token architecture is accepted when:

- Primitive tokens are defined as raw source values.
- Primitive token categories are documented.
- Product pages are prohibited from consuming primitive tokens directly.
- Primitive tokens feed semantic tokens.
- Naming rules are explicit.
- Validation rules prevent random visual values.
- AI behaviour requires missing token requests instead of invention.
- No final colour values or brand colours are defined in this document.

## Related Documents

- [Constitution](../01-foundation/constitution.md)
- [Document Map](../01-foundation/document-map.md)
- [Glossary](../01-foundation/glossary.md)
- [Foundations Overview](./README.md)
- [Token Naming](./token-naming.md)
- [Semantic Tokens](./semantic-tokens.md)
- [Token Portal Experience](./token-portal-experience.md)
- [Quality Gate](../08-ai/quality-gate.md)
