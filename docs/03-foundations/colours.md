# Colours

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.1.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

This document defines the PlayBooky V3 colour system.

The colour system governs how colour is named, structured, reviewed, exposed through tokens, represented in the Design Portal, and used by future components, patterns, layouts, assets, and product screens.

This document defines architecture and usage rules. It does not approve final brand colour values.

## Scope

In scope:

- Colour philosophy.
- Primitive colour token architecture.
- Semantic colour token architecture.
- Brand colour placeholder tokens.
- Neutral colour placeholder tokens.
- Feedback colour placeholder tokens.
- Surface, text, border, icon, focus, and interactive colour roles.
- Future dark mode strategy.
- Accessibility and contrast guidance.
- Do and don't guidance.
- Responsive colour considerations.
- AI behaviour.
- Acceptance criteria.

Out of scope:

- Final PlayBooky brand colour values.
- Final palette values.
- UI implementation.
- React components.
- Product screens.
- Asset production.

## Philosophy

Colour in PlayBooky must communicate structure, meaning, state, and brand expression without becoming arbitrary decoration.

Colour decisions must be:

- Tokenized.
- Purposeful.
- Accessible.
- Traceable.
- Responsive to context.
- Governed before product use.

Primitive colour tokens hold raw source values. Semantic colour tokens give those raw values meaning. Components consume semantic colour tokens. Product pages must not consume primitive colour tokens directly.

Colour must not be the only way to communicate meaning. Feedback, focus, selection, disabled, and error states must also use text, iconography, border treatment, layout, or assistive technology behaviour when meaning must be understood.

## Primitive Colour Tokens

Primitive colour tokens are raw colour source values.

Primitive colour tokens must use the naming structure defined in [Token Naming](./token-naming.md):

```text
colour.primitive.{scale-or-source}
```

Primitive colour tokens may include source scales for:

- Neutral colours.
- Brand colours after approval.
- Feedback colours.
- Data or categorical colours after a reusable need is documented.

Primitive colour tokens must not:

- Be consumed directly by product pages.
- Encode usage meaning such as `button`, `card`, `error-text`, or `primary-action`.
- Contain final brand values before brand approval.
- Be created locally inside components, layouts, patterns, or pages.

### Primitive Placeholder Tokens

These placeholder token names define intended architecture only. They do not approve final values.

| Token | Status | Confidence | Purpose |
| --- | --- | --- | --- |
| `colour.primitive.neutral.0` | Exploring | 3 Visually directional | Lightest neutral source step. |
| `colour.primitive.neutral.50` | Exploring | 3 Visually directional | Near-light neutral source step. |
| `colour.primitive.neutral.100` | Exploring | 3 Visually directional | Light neutral source step. |
| `colour.primitive.neutral.200` | Exploring | 3 Visually directional | Soft neutral source step. |
| `colour.primitive.neutral.400` | Exploring | 3 Visually directional | Mid neutral source step. |
| `colour.primitive.neutral.700` | Exploring | 3 Visually directional | Dark neutral source step. |
| `colour.primitive.neutral.900` | Exploring | 3 Visually directional | Darkest neutral source step. |
| `colour.primitive.brand.primary` | Exploring | 1 Experimental | Placeholder for approved primary brand source colour. |
| `colour.primitive.brand.secondary` | Exploring | 1 Experimental | Placeholder for approved secondary brand source colour. |
| `colour.primitive.brand.accent` | Exploring | 1 Experimental | Placeholder for approved accent brand source colour. |
| `colour.primitive.feedback.error` | Exploring | 2 Prototype | Placeholder for error source colour. |
| `colour.primitive.feedback.warning` | Exploring | 2 Prototype | Placeholder for warning source colour. |
| `colour.primitive.feedback.success` | Exploring | 2 Prototype | Placeholder for success source colour. |
| `colour.primitive.feedback.info` | Exploring | 2 Prototype | Placeholder for information source colour. |

Any primitive colour token not listed here must be proposed through the token approval workflow before use.

## Semantic Colour Tokens

Semantic colour tokens describe meaning and allowed use.

Semantic colour tokens must reference primitive colour tokens or approved aliases. They must not contain raw colour values when a primitive source token exists.

Allowed semantic colour families:

- Surface colours.
- Text colours.
- Border colours.
- Icon colours.
- Focus colours.
- Interactive colours.
- Feedback colours.
- Brand colours.
- Selection colours.
- Disabled colours.

Semantic colour tokens must use the naming structure defined in [Token Naming](./token-naming.md):

```text
colour.{semantic-family}.{role}.{property-or-state}
```

## Brand Colours

Brand colours express PlayBooky's identity after brand colour values are approved.

This document does not approve final brand colour values.

Brand colour tokens must remain Exploring until approved source values exist and contrast testing is complete.

Placeholder brand semantic tokens:

| Token | Status | Confidence | Purpose |
| --- | --- | --- | --- |
| `colour.brand.primary.surface.default` | Exploring | 1 Experimental | Primary brand surface role. |
| `colour.brand.primary.text.default` | Exploring | 1 Experimental | Text role for primary brand contexts. |
| `colour.brand.primary.border.default` | Exploring | 1 Experimental | Border role for primary brand contexts. |
| `colour.brand.primary.icon.default` | Exploring | 1 Experimental | Icon role for primary brand contexts. |
| `colour.brand.secondary.surface.default` | Exploring | 1 Experimental | Secondary brand surface role. |
| `colour.brand.accent.surface.default` | Exploring | 1 Experimental | Accent surface role for brand expression. |

Rules:

- Brand colours must not be invented by AI agents.
- Brand colours must not be copied from screenshots, prototypes, old assets, or memory.
- Brand colours must pass contrast requirements for every approved pairing.
- Brand colours must not be used in product screens until status, confidence, documentation, portal representation, and implementation are aligned.

## Neutral Colours

Neutral colours support structure, hierarchy, surfaces, text, borders, and quiet UI states.

Neutral primitives provide the raw source scale. Semantic tokens decide how neutral values are used.

Neutral semantic placeholder tokens:

| Token | Status | Confidence | Purpose |
| --- | --- | --- | --- |
| `colour.surface.page.default` | Exploring | 3 Visually directional | Default page background role. |
| `colour.surface.section.default` | Exploring | 3 Visually directional | Section background role. |
| `colour.surface.panel.default` | Exploring | 3 Visually directional | Panel background role. |
| `colour.surface.card.default` | Exploring | 3 Visually directional | Card background role. |
| `colour.text.primary.default` | Exploring | 3 Visually directional | Primary readable text role. |
| `colour.text.secondary.default` | Exploring | 3 Visually directional | Secondary readable text role. |
| `colour.text.muted.default` | Exploring | 3 Visually directional | Muted supporting text role. |
| `colour.border.default.default` | Exploring | 3 Visually directional | Default border role. |
| `colour.border.subtle.default` | Exploring | 3 Visually directional | Low-emphasis border role. |

Rules:

- Neutral colours must support calm, readable, spacious interfaces.
- Neutral colours must not reduce contrast below accessibility thresholds.
- Neutral colours must not become a one-note palette. They must support hierarchy without relying only on shade changes.

## Feedback Colours

Feedback colours communicate system or user-facing status.

Feedback colour roles:

- Error.
- Warning.
- Success.
- Info.
- Neutral.

Feedback semantic placeholder tokens:

| Token | Status | Confidence | Purpose |
| --- | --- | --- | --- |
| `colour.feedback.error.surface.default` | Exploring | 2 Prototype | Error feedback surface role. |
| `colour.feedback.error.text.default` | Exploring | 2 Prototype | Error feedback text role. |
| `colour.feedback.error.border.default` | Exploring | 2 Prototype | Error feedback border role. |
| `colour.feedback.error.icon.default` | Exploring | 2 Prototype | Error feedback icon role. |
| `colour.feedback.warning.surface.default` | Exploring | 2 Prototype | Warning feedback surface role. |
| `colour.feedback.warning.text.default` | Exploring | 2 Prototype | Warning feedback text role. |
| `colour.feedback.success.surface.default` | Exploring | 2 Prototype | Success feedback surface role. |
| `colour.feedback.success.text.default` | Exploring | 2 Prototype | Success feedback text role. |
| `colour.feedback.info.surface.default` | Exploring | 2 Prototype | Information feedback surface role. |
| `colour.feedback.info.text.default` | Exploring | 2 Prototype | Information feedback text role. |

Rules:

- Feedback colour must never be the only signal of meaning.
- Feedback text, icon, or content must identify the state.
- Feedback colour pairings must pass contrast requirements.
- Feedback colours must not be used as decorative accents.

## Surface Colours

Surface colours define backgrounds and container roles.

Surface roles:

- Page.
- Section.
- Panel.
- Card.
- Overlay.
- Raised.
- Inverse.
- Disabled.
- Selected.

Rules:

- Every surface colour must define compatible text, border, and icon roles.
- Surface colours must support desktop, tablet, and mobile reading contexts.
- Surface colours must not create inaccessible low-contrast combinations.
- Surface colours must not be hardcoded in product pages.

## Text Colours

Text colours define readable content hierarchy.

Text roles:

- Primary.
- Secondary.
- Muted.
- Link.
- Inverse.
- Disabled.
- Feedback.
- Brand.

Rules:

- Primary text must meet the required contrast threshold against its approved surface.
- Secondary and muted text must remain readable.
- Link text must remain distinguishable from surrounding text by more than colour when the link meaning is critical.
- Disabled text must remain legible enough to explain unavailable choices when the content is visible.
- Product pages must not hardcode text colours.

## Border Colours

Border colours define separation, emphasis, state, and focus relationships.

Border roles:

- Default.
- Subtle.
- Strong.
- Interactive.
- Focus.
- Error.
- Warning.
- Success.
- Divider.

Rules:

- Border colours must support hierarchy without replacing layout structure.
- Focus borders must satisfy focus visibility requirements.
- Error, warning, and success borders must be paired with text or icon meaning.
- Product pages must not hardcode border colours.

## Icon Colours

Icon colours define how icons communicate action, state, and support.

Icon roles:

- Default.
- Muted.
- Interactive.
- Brand.
- Feedback.
- Disabled.
- Inverse.

Rules:

- Meaningful icons must meet non-text contrast requirements.
- Decorative icons must not carry semantic meaning.
- Icon colours must align with matching text or feedback semantics.
- Product pages must not hardcode icon colours.

## Focus Colours

Focus colours identify keyboard focus and assistive navigation position.

Focus colour roles:

- Focus ring.
- Focus outline.
- Focus surface.
- Focus border.

Rules:

- Focus colour must be visible against all approved interactive surfaces.
- Focus treatment must not rely on colour alone when a shape, outline, ring, or offset is needed for clarity.
- Focus colour must not be removed for visual preference.
- Interactive components must use approved focus semantic tokens.

## Interactive Colours

Interactive colours define actionable states.

Interactive roles:

- Default.
- Hover.
- Active.
- Pressed.
- Selected.
- Loading.
- Disabled.
- Focus-visible.

Rules:

- Interactive colours must map to documented component states.
- Interactive colours must not create undocumented variants.
- Hover, active, selected, and focus states must remain distinguishable.
- Interactive colour changes must preserve contrast.
- Product pages must not create local interactive colours.

## Dark Mode Strategy

Dark mode is a future strategy, not an approved implementation requirement in this document.

The colour system must be architected so dark mode can be added without renaming every semantic token.

Dark mode strategy rules:

- Primitive colour scales must be able to support multiple themes.
- Semantic colour tokens must define roles that can map to different primitive values per theme.
- Component tokens must reference semantic tokens so theme changes do not require component API changes.
- Product pages must not hardcode light-mode assumptions.
- Dark mode must not be implemented until a dedicated dark mode decision is documented and approved.

Placeholder theme naming shape:

```text
theme.light.colour.surface.page.default
theme.dark.colour.surface.page.default
```

This naming shape does not approve dark mode implementation.

## Accessibility

Colour accessibility is mandatory.

Accessibility requirements:

- Text colour pairings must meet WCAG contrast requirements for their text size and purpose.
- Meaningful non-text elements must meet non-text contrast requirements.
- Focus indicators must be visible.
- Feedback states must not rely on colour alone.
- Disabled states must remain understandable.
- Selection states must remain distinguishable from hover, active, and focus states.

Colour decisions that fail accessibility checks are not product-eligible.

## Contrast Guidance

Contrast checks must be documented for every approved colour pairing.

Required contrast records:

- Token pairing.
- Intended use.
- Surface token.
- Foreground token.
- Required threshold.
- Result.
- Approval status.
- Known restriction.

Contrast validation must cover:

- Text on surfaces.
- Icons on surfaces.
- Borders against surfaces when borders communicate meaning.
- Focus indicators against surrounding surfaces.
- Feedback text and icons.
- Disabled text and controls.

When contrast evidence does not exist, the token pairing must remain Exploring and must not be used in product screens.

## Do And Don't

| Do | Reason |
| --- | --- |
| Use semantic colour tokens for component decisions. | Semantic tokens describe meaning and preserve future theming flexibility. |
| Document missing colour needs as token requests. | Missing token requests prevent random visual values from entering the system. |
| Pair feedback colour with text, icon, or assistive messaging. | Colour alone is not enough to communicate state accessibly. |
| Check contrast before promoting a colour token. | Contrast evidence is required before product use. |

| Don't | Reason |
| --- | --- |
| Don't invent PlayBooky brand colours. | Brand values are not approved in this document. |
| Don't use primitive colour tokens directly in product pages. | Primitive tokens are raw source values, not product-facing decisions. |
| Don't hardcode colour values in product pages. | Hardcoded values bypass governance and break future theming. |
| Don't use colour as decoration without purpose. | Colour must support structure, meaning, state, or approved brand expression. |

## Responsive Considerations

Colour must support desktop, tablet, and mobile contexts.

Responsive colour requirements:

- Colour pairings must remain readable at all supported viewport sizes.
- Text over surfaces must preserve contrast when content wraps.
- Focus and interactive states must remain visible on touch and keyboard-driven contexts.
- Compact mobile layouts must not rely on subtle colour differences alone.
- Responsive previews in the Design Portal must show colour pairings that affect readability, focus, interaction, or feedback.

Colour tokens do not change by breakpoint unless a documented responsive colour decision exists.

## AI Behaviour

AI agents must:

- Read this document before proposing colour tokens or colour usage.
- Use semantic colour tokens for meaningful colour decisions.
- Treat primitive colour tokens as raw source values.
- Refuse to invent final PlayBooky brand colours.
- Refuse to hardcode colour values in product pages.
- Stop and document a missing token request when no approved colour token fits.
- Preserve desktop, tablet, and mobile readability.
- Check accessibility and contrast requirements before recommending colour usage.

AI agents must not:

- Use colours from memory, screenshots, old assets, or visual preference.
- Promote Exploring colour tokens to product use.
- Create component colour tokens that reference primitive colour tokens directly.
- Use colour alone to communicate feedback, focus, selection, or error.
- Build UI as part of colour documentation work.

## Acceptance Criteria

The PlayBooky colour system is accepted when:

- Colour philosophy is documented.
- Primitive colour token architecture is documented.
- Semantic colour token architecture is documented.
- Brand colour values remain placeholders until approved.
- Neutral, feedback, surface, text, border, icon, focus, and interactive colour roles are documented.
- Dark mode is defined as a future strategy, not implemented.
- Accessibility and contrast requirements are explicit.
- Do and don't guidance prevents misuse.
- Responsive colour considerations cover desktop, tablet, and mobile.
- AI behaviour prevents brand colour invention and hardcoded values.
- No UI, React components, product screens, final brand values, or final palette values are created by this document.

## Related Documents

- [Constitution](../01-foundation/constitution.md)
- [Document Map](../01-foundation/document-map.md)
- [Glossary](../01-foundation/glossary.md)
- [Foundations Overview](./README.md)
- [Primitive Tokens](./primitive-tokens.md)
- [Semantic Tokens](./semantic-tokens.md)
- [Token Naming](./token-naming.md)
- [Token Portal Experience](./token-portal-experience.md)
- [Quality Gate](../08-ai/quality-gate.md)
