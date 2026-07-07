# Token Naming

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.1.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

This document defines the naming architecture for PlayBooky V3 tokens.

Token names must make the token layer, category, role, scale, state, and usage clear enough that humans and AI agents can choose tokens without guessing or inventing local values.

## Scope

This document applies to:

- Primitive tokens.
- Semantic tokens.
- Component tokens.
- Product semantic tokens.
- Token names shown in documentation.
- Token names shown in the Design Portal.
- Token names used in implementation once token code exists.

This document does not define final token values.

## Naming Philosophy

Token names are product-system contracts.

A good token name must:

- Identify the token layer.
- Identify the token category.
- Describe purpose without encoding raw values.
- Stay stable when implementation details change.
- Avoid visual preference language.
- Avoid one-off product or component naming unless the token layer explicitly allows it.
- Support automated validation.

Token names must not be clever, decorative, theme-based, or dependent on private context.

## Prefix Convention

Every token must start with a category prefix.

Approved category prefixes:

- `colour`
- `typography`
- `spacing`
- `radius`
- `elevation`
- `border`
- `opacity`
- `blur`
- `motion-duration`
- `motion-easing`
- `breakpoint`
- `z-index`
- `component`
- `product`

Rules:

- Prefixes must be lowercase.
- Prefixes must use kebab-case when they contain more than one word.
- Prefixes must not be abbreviated.
- New prefixes require token governance review.

## Category Convention

Token names must identify the token category before role or scale.

Primitive tokens use:

```text
{category}.primitive.{scale-or-source}
```

Semantic tokens use:

```text
{category}.{semantic-family}.{role}.{property-or-state}
```

Component tokens use:

```text
component.{component-name}.{part}.{property}.{state}
```

Product semantic tokens use:

```text
product.{product-concept}.{role}.{property}.{state}
```

Segments may be omitted only when the remaining name stays unambiguous and the omission is documented in the token category rules.

## Scale Convention

Scale-based tokens must use stable scale labels.

Allowed scale patterns:

- Numeric scales for size-like primitives.
- Role scales for semantic usage.
- Named motion roles for motion duration and easing.
- Named breakpoint roles for responsive thresholds.
- Named z-index roles for layering.

Rules:

- Numeric scales must not encode raw values.
- Scale direction must be documented before use.
- Scale gaps may exist only when reserved intentionally.
- Scale names must not change to match a temporary implementation.

Examples of naming shape only:

```text
spacing.primitive.4
radius.primitive.2
typography.primitive.size.5
motion-duration.primitive.fast
breakpoint.primitive.mobile
z-index.primitive.overlay
```

These examples do not approve token values.

## State Convention

State segments identify interaction, feedback, or availability state.

Approved state segment examples:

- `default`
- `hover`
- `active`
- `pressed`
- `focus`
- `focus-visible`
- `selected`
- `loading`
- `disabled`
- `error`
- `warning`
- `success`
- `info`

Rules:

- State names must match documented component or semantic states.
- State names must not invent unsupported component behaviour.
- Feedback states must align with feedback semantic tokens.
- Focus state names must preserve accessibility meaning.

## Component Token Convention

Component tokens describe reusable component-specific mappings.

Component token names must use:

```text
component.{component-name}.{part}.{property}.{state}
```

Rules:

- Component tokens may only reference semantic tokens.
- Component tokens must not reference primitive tokens directly.
- Component tokens must not contain raw values.
- Component names must match the component page name.
- Part names must match documented component anatomy.
- Property names must describe tokenized properties such as `surface`, `text`, `border`, `icon`, `spacing`, `radius`, `elevation`, or `motion`.
- State names must match documented component states.

Example naming shapes:

```text
component.button.root.surface.default
component.button.label.text.disabled
component.card.root.border.hover
```

These examples do not approve component tokens.

## Product Token Convention

Product semantic tokens describe reusable PlayBooky product meaning.

Product token names must use:

```text
product.{product-concept}.{role}.{property}.{state}
```

Rules:

- Product tokens may only reference semantic tokens.
- Product tokens must not reference primitive tokens directly.
- Product tokens must not contain raw values.
- Product concepts must be documented in Product or Pattern source-of-truth documents.
- Product tokens must not be created for one-off screens.

Example naming shapes:

```text
product.recommendation.priority.surface.default
product.diagnosis.result.text.warning
product.builder.step.border.current
```

These examples do not approve product tokens or product rules.

## Examples

These examples show naming shape only.

Primitive:

```text
colour.primitive.neutral.100
spacing.primitive.6
radius.primitive.3
motion-easing.primitive.standard
```

Semantic:

```text
colour.surface.page.default
colour.text.primary.default
colour.border.error.default
spacing.layout.section.default
motion-duration.interaction.fast.default
```

Component:

```text
component.button.root.surface.hover
component.input.label.text.default
component.modal.overlay.surface.default
```

Product:

```text
product.recommendation.card.surface.default
product.facilitator-guide.prompt.text.default
```

No example in this document approves a final token value.

## Banned Naming Patterns

Token names must not:

- Encode raw values, such as `12px`, `blue500`, or `shadow24`.
- Use visual preference labels, such as `nice`, `pretty`, `modern`, or `premium`.
- Use temporary labels, such as `new`, `old`, `v2`, or `test`.
- Use product-screen-specific labels for one-off pages.
- Use component names in primitive or general semantic tokens.
- Use abbreviations that are not documented.
- Use synonyms for canonical categories.
- Use brand colour names before brand approval.
- Use status names as token names.
- Use confidence ratings as token names.

## Validation Rules

Token naming validation must confirm:

- The token starts with an approved prefix.
- The token uses lowercase dot notation.
- Multi-word segments use kebab-case.
- The category is approved.
- The layer is clear.
- The name does not encode raw values.
- The name does not duplicate an existing token meaning.
- Component token names match documented component pages and anatomy.
- Product token names match documented product concepts.
- State names match documented states.
- The token does not bypass primitive, semantic, component, or product token layer rules.

## AI Behaviour

AI agents must:

- Use this document before proposing token names.
- Keep token layer names distinct.
- Stop and document a missing token request when no valid token name exists.
- Avoid inventing undocumented categories, prefixes, states, or product concepts.
- Treat example names as naming shapes, not approved token values.

AI agents must not:

- Create random token names to fit a visual idea.
- Encode raw values in token names.
- Use brand colour names before brand approval.
- Create component tokens that reference primitives.
- Create product tokens for one-off UI.
- Add token names that cannot be validated.

## Acceptance Criteria

Token naming architecture is accepted when:

- Prefix conventions are documented.
- Category conventions are documented.
- Scale conventions are documented.
- State conventions are documented.
- Component token naming rules are documented.
- Product token naming rules are documented.
- Examples are clearly marked as naming shapes only.
- Banned patterns prevent ambiguous or raw-value names.
- Validation rules support automated checking.
- AI behaviour prevents naming invention.

## Related Documents

- [Constitution](../01-foundation/constitution.md)
- [Document Map](../01-foundation/document-map.md)
- [Glossary](../01-foundation/glossary.md)
- [Foundations Overview](./README.md)
- [Primitive Tokens](./primitive-tokens.md)
- [Semantic Tokens](./semantic-tokens.md)
- [Token Portal Experience](./token-portal-experience.md)
- [Quality Gate](../08-ai/quality-gate.md)
