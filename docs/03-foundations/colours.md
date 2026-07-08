# Colours

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.2.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

This document defines the PlayBooky V3 colour system.

Colour gives PlayBooky its emotional atmosphere. It should make the product feel calm, creative, intelligent, premium, human, and optimistic.

The colour system governs how colour is selected, named, tokenized, reviewed, exposed in the Design Portal, and used by future components, layouts, patterns, illustrations, and product screens.

This document defines the PlayBooky colour direction and token architecture. Final colour values must be added only when approved.

## Scope

In scope:

- Colour philosophy.
- PlayBooky brand personality.
- Brand colour roles.
- Neutral colour roles.
- Illustration colour rules.
- Primitive colour token architecture.
- Semantic colour token architecture.
- Surface, text, border, icon, focus, interactive, feedback, selection, and disabled colour roles.
- Dark mode strategy.
- Accessibility and contrast guidance.
- Responsive colour behaviour.
- AI behaviour.
- Acceptance criteria.

Out of scope:

- React implementation.
- Product screen implementation.
- Asset production.
- Unapproved final brand values.

## Philosophy

Colour is one of PlayBooky's primary design tools.

It must guide attention, reinforce hierarchy, communicate state, and support collaborative thinking without becoming decorative noise.

PlayBooky colour should feel:

- Calm
- Creative
- Intelligent
- Premium
- Human
- Optimistic

The interface should not feel like generic SaaS. It should not feel corporate, cold, neon, gamified, or overly saturated.

PlayBooky uses colour with restraint. Large surfaces should feel soft and spacious. Stronger colours should appear in deliberate moments: primary action, active state, progress, AI guidance, illustration, or meaningful emphasis.

Colour should support thinking before branding.

If a colour cannot justify its role through function, hierarchy, meaning, accessibility, or brand expression, it should not exist.

## PlayBooky Colour Personality

PlayBooky's palette is inspired by natural, crafted, workshop-like materials rather than dashboard software.

The colour direction should suggest:

- Paper
- Canvas
- Ink
- Watercolour
- Creative tools
- Quiet confidence
- Thoughtful progress

The palette should avoid:

- Pure black as a default
- Stark white as the only background
- Harsh blue SaaS defaults
- Loud saturated gradients
- Artificial neon colours
- Decorative colour without purpose

The product should feel premium because it is restrained, not because it is dark, glossy, or visually heavy.

## Brand Colours

PlayBooky's brand colour system is built around deep natural tones and warm neutrals.

The exact values must be approved separately before becoming Current tokens.

### Primary Green

Primary Green is the main PlayBooky brand colour.

It represents:

- Progress
- Creation
- Confidence
- Positive momentum
- Moving from uncertainty to clarity

Use Primary Green for:

- Primary actions
- Continue actions
- Active states
- Selected states
- Progress indicators
- Key positive moments
- Brand identity moments

Do not use Primary Green for:

- Large decorative backgrounds
- Error states
- Warning states
- Dense text blocks
- Pure decoration
- Every interactive element by default

Primary Green should feel grounded and intelligent, not bright or gamified.

### Secondary Purple

Secondary Purple supports the intelligent and reflective side of PlayBooky.

It represents:

- AI guidance
- Discovery
- Reflection
- Recommendation
- Workshop intelligence
- Strategic thinking

Use Secondary Purple for:

- AI-related moments
- Recommendation states
- Insight moments
- Supporting brand expression
- Selected illustration families
- Reflective or discovery-based product areas

Do not use Secondary Purple for:

- Primary actions when Primary Green is available
- Error states
- Warning states
- Large surfaces that overpower content
- Generic decoration

Secondary Purple should feel thoughtful, not playful for the sake of play.

### Supporting Teal

Supporting Teal adds depth and calm intelligence.

It represents:

- Context
- Understanding
- Structure
- System thinking
- Connected information

Use Supporting Teal for:

- Secondary supporting UI
- Contextual highlights
- Calm informational states
- Subtle visual depth

Do not use Supporting Teal as a replacement for Primary Green unless the component or pattern defines that role.

### Warm Champagne

Warm Champagne is an accent colour.

It represents:

- Craft
- Premium quality
- Celebration
- Completion
- Small moments of delight

Use Warm Champagne sparingly for:

- Fine highlights
- Premium details
- Completion moments
- Subtle decorative accents
- Illustration support

Do not use Warm Champagne for:

- Primary buttons
- Large interface backgrounds
- Long-form text
- Error, warning, or disabled states
- Repeated decorative UI

Warm Champagne should feel like a detail, not a theme.

## Neutral Colours

Neutral colours form most of the PlayBooky interface.

PlayBooky should not rely on pure white and pure black as the default visual language. The interface should sit on warm neutral surfaces that feel closer to paper, canvas, and creative workspaces.

Neutral colours are responsible for:

- Page backgrounds
- Cards
- Panels
- Sections
- Dividers
- Borders
- Text hierarchy
- Quiet UI states

Neutral colours should feel:

- Warm
- Soft
- Spacious
- Clean
- Readable
- Premium

Neutral colours should not feel:

- Grey and lifeless
- Cold enterprise
- Harshly contrasted
- Dirty or muddy
- Too low contrast

The neutral system must support clear hierarchy without relying only on shadow or saturation.

## Illustration Colours

Illustration colours are separate from interface colours.

PlayBooky's watercolour illustrations are allowed to be more expressive than the core interface palette. They provide emotional storytelling and visual warmth.

Illustration colours may use:

- Softer gradients
- Organic colour variation
- Realm-specific palettes
- Watercolour texture
- Richer emotional tones

Illustration colours must not:

- Replace semantic UI colours
- Define button colours
- Define error, success, warning, or focus states
- Reduce interface readability
- Become the source of truth for product tokens

The interface should remain restrained so illustrations can carry the expressive visual energy.

## Realm And Workshop Colours

PlayBooky may use realm or workshop colours to support meaning across activities and recommendations.

These colours are product semantics, not general interface decoration.

Potential realm colour roles include:

- Discovery
- Understanding
- Creation
- Alignment
- Decision
- Action
- Reflection

Realm colours must:

- Have a documented meaning
- Be used consistently
- Support accessibility
- Work alongside illustration assets
- Avoid conflicting with feedback colours

Realm colours must not:

- Replace brand colours
- Replace feedback colours
- Create decorative inconsistency
- Be invented for one-off screens

## Primitive Colour Tokens

Primitive colour tokens are raw source values.

They must use the naming structure defined in [Token Naming](./token-naming.md):

```text
colour.primitive.{scale-or-source}