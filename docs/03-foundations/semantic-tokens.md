# Semantic Tokens

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.1.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

Semantic tokens give meaning to primitive token values.

They exist so components, layouts, patterns, portal pages, and future product work can use named design decisions without consuming raw primitive values or hardcoded visual values.

## Scope

This document defines semantic token architecture only.

In scope:

- Semantic token purpose.
- Semantic token relationship to primitive tokens.
- Required semantic token families.
- Component and product semantic token rules.
- Validation rules.
- AI behaviour.

Out of scope:

- Final token values.
- Final brand colours.
- React components.
- Product screens.
- Component-specific implementation.

## What Semantic Tokens Are

Semantic tokens are named design decisions that describe intended use.

They sit between primitive tokens and implementation.

Semantic tokens answer questions such as:

- What surface colour should this role use?
- What text colour should muted text use?
- What border colour communicates an error?
- What focus treatment identifies keyboard focus?
- What token should a disabled action use?

Semantic tokens must reference primitive tokens or approved token aliases.

Product pages must never consume primitive tokens directly. Product pages must use governed components and layout primitives that consume semantic tokens through the design system.

Components may consume semantic tokens.

Component tokens may only reference semantic tokens.

## Relationship To Primitive Tokens

Primitive tokens provide raw source values.

Semantic tokens provide meaning.

Relationship rules:

- A semantic token must resolve to an approved primitive token or an approved token alias.
- A semantic token must document its purpose.
- A semantic token must document its allowed use.
- A semantic token must not contain a raw value directly when a primitive token exists.
- A semantic token must not duplicate another semantic token with a different name.
- A semantic token must preserve desktop, tablet, and mobile behaviour when the mapped primitive or usage is responsive.

## Surface Tokens

Surface tokens define backgrounds and containers.

Surface semantic tokens may cover:

- Page background.
- Section background.
- Panel background.
- Card background.
- Overlay background.
- Raised surface background.
- Inverse surface background.

Rules:

- Surface tokens must define allowed content contrast expectations.
- Surface tokens must pair with text, border, and elevation tokens.
- Surface tokens must not be invented locally inside product pages.

## Text Tokens

Text tokens define semantic text colour and typography roles.

Text semantic tokens may cover:

- Primary text.
- Secondary text.
- Muted text.
- Inverse text.
- Link text.
- Error text.
- Success text.
- Warning text.
- Disabled text.

Rules:

- Text tokens must meet contrast requirements against approved surfaces.
- Typography semantic tokens must map raw type primitives to roles such as heading, body, label, caption, and code when those roles are approved.
- Product pages must not hardcode text colour, font size, line height, or font weight.

## Border Tokens

Border semantic tokens define border and divider meaning.

Border semantic tokens may cover:

- Default border.
- Muted border.
- Strong border.
- Interactive border.
- Focus border.
- Error border.
- Success border.
- Divider border.

Rules:

- Border tokens must map to approved border primitives and colour semantics.
- Focus border tokens must meet accessibility requirements.
- Product pages must not hardcode border values.

## Icon Tokens

Icon semantic tokens define colour and sizing roles for icons.

Icon semantic tokens may cover:

- Default icon.
- Muted icon.
- Interactive icon.
- Inverse icon.
- Feedback icon.
- Disabled icon.

Rules:

- Icon colour tokens must meet contrast requirements for meaningful icons.
- Decorative icons must not rely on semantic meaning.
- Product pages must not hardcode icon colour or size.

## Brand Tokens

Brand semantic tokens define approved brand roles after brand source values are approved.

Brand semantic tokens may cover:

- Brand primary.
- Brand secondary.
- Brand accent.
- Brand surface.
- Brand text.
- Brand interactive.

Rules:

- This document does not define final PlayBooky brand colours.
- Brand tokens must not be created from memory or visual preference.
- Brand tokens must map to approved primitive colour sources.
- Product pages must use brand semantics only through approved components or documented semantic token usage.

## Interactive Tokens

Interactive semantic tokens define states for controls and actionable elements.

Interactive semantic tokens may cover:

- Default.
- Hover.
- Active.
- Pressed.
- Selected.
- Loading.
- Focus-visible.

Rules:

- Interactive tokens must define state transitions.
- Interactive colour and motion combinations must pass accessibility requirements.
- Interactive tokens must not create undocumented variants.

## Feedback Tokens

Feedback semantic tokens define system meaning for feedback states.

Feedback semantic tokens may cover:

- Error.
- Warning.
- Success.
- Info.
- Neutral.

Rules:

- Feedback tokens must support text, icon, border, surface, and focus needs when the feedback role requires them.
- Feedback must not rely on colour alone.
- Feedback tokens must support accessible labels or content guidance through component documentation.

## Focus Tokens

Focus semantic tokens define keyboard and assistive-navigation focus treatment.

Focus semantic tokens may cover:

- Focus outline colour.
- Focus outline width.
- Focus offset.
- Focus ring shadow.
- Focus surface treatment.

Rules:

- Focus tokens must be visible.
- Focus tokens must meet contrast expectations.
- Focus tokens must not be removed for visual preference.
- Interactive components must consume approved focus semantics.

## Selection Tokens

Selection semantic tokens define selected state treatment.

Selection semantic tokens may cover:

- Selected surface.
- Selected text.
- Selected border.
- Selected icon.
- Selected focus.

Rules:

- Selection tokens must distinguish selected from hover, active, and focus states.
- Selection must not rely on colour alone when selection communicates important state.

## Disabled Tokens

Disabled semantic tokens define unavailable state treatment.

Disabled semantic tokens may cover:

- Disabled surface.
- Disabled text.
- Disabled border.
- Disabled icon.
- Disabled opacity.

Rules:

- Disabled tokens must preserve enough legibility for visible disabled content.
- Disabled tokens must not hide required context.
- Disabled semantics must align with component accessibility rules.

## Component Semantic Tokens

Component semantic tokens describe component-specific decisions only after a reusable component need exists.

Rules:

- Component tokens may only reference semantic tokens.
- Component tokens must not reference primitive tokens directly.
- Component tokens must not contain raw visual values.
- Component tokens must be documented on the component page or token portal page before use.
- Component tokens must not be created to bypass missing semantic tokens.

Allowed naming shape:

```text
component.{component-name}.{part}.{property}.{state}
```

This shape is architecture guidance only. It does not approve any component tokens.

## Product Semantic Tokens

Product semantic tokens describe reusable PlayBooky product meaning only when the product concept recurs across product surfaces.

Rules:

- Product semantic tokens must not be created for one-off product screens.
- Product semantic tokens must reference semantic tokens, not primitive tokens.
- Product semantic tokens must document purpose, user need, and success criteria.
- Product semantic tokens must not define product strategy.
- Product pages must not hardcode product token values.

Allowed naming shape:

```text
product.{product-concept}.{role}.{property}.{state}
```

This shape is architecture guidance only. It does not approve product tokens.

## Validation Rules

Semantic token validation must confirm:

- The token has a documented purpose.
- The token maps to an approved primitive token or approved token alias.
- The token belongs to an approved semantic family.
- The token name follows naming rules.
- The token does not duplicate an existing semantic role.
- The token does not contain a raw visual value.
- The token supports desktop, tablet, and mobile when the usage is responsive.
- The token passes contrast checks when it affects visible colour.
- Component tokens reference semantic tokens only.
- Product semantic tokens are reusable product decisions, not one-off page styling.

## AI Behaviour

AI agents must:

- Use semantic tokens for meaningful design decisions.
- Refuse to use primitive tokens directly in product pages.
- Refuse to create hardcoded visual values in product pages.
- Stop and document a missing token request when no semantic token fits.
- Keep primitive, semantic, component, and product token layers separate.
- Check contrast and accessibility implications before recommending semantic colour use.

AI agents must not:

- Invent PlayBooky brand colours.
- Create component tokens that reference primitives directly.
- Create product tokens for one-off UI.
- Treat raw values as semantic tokens.
- Use random spacing, colour, radius, shadow, typography, opacity, blur, motion, breakpoint, or z-index values.

## Acceptance Criteria

Semantic token architecture is accepted when:

- Semantic tokens are defined as meaning-bearing tokens.
- The relationship to primitive tokens is explicit.
- Product pages are prohibited from consuming primitive tokens directly.
- Components may consume semantic tokens.
- Component tokens may reference semantic tokens only.
- Required semantic token families are documented.
- Validation rules prevent raw values and duplicate meanings.
- AI behaviour requires missing token requests instead of invention.
- No final brand colours or final token values are defined in this document.

## Related Documents

- [Constitution](../01-foundation/constitution.md)
- [Document Map](../01-foundation/document-map.md)
- [Glossary](../01-foundation/glossary.md)
- [Foundations Overview](./README.md)
- [Primitive Tokens](./primitive-tokens.md)
- [Token Naming](./token-naming.md)
- [Token Portal Experience](./token-portal-experience.md)
- [Quality Gate](../08-ai/quality-gate.md)
