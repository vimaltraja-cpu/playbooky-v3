# Typography

| Field        | Value                  |
| ------------ | ---------------------- |
| Status       | Exploring              |
| Confidence   | 3 Visually directional |
| Version      | 0.1.0                  |
| Owner        | Design System          |
| Last updated | 2026-07-07             |

This document is the canonical owner for the PlayBooky Typography System.

It defines the type philosophy, font families, type scales, line heights, font weights, responsive rules, semantic typography tokens, accessibility requirements, reading comfort rules, usage rules, and AI behaviour for typography decisions.

## Purpose

Typography gives PlayBooky its reading rhythm, hierarchy, clarity, and product tone.

The typography system exists so every heading, paragraph, label, caption, control, and dense operational surface can use consistent text decisions without hardcoded local values.

## Scope

This document applies to:

- Typography primitive tokens.
- Typography semantic tokens.
- Design Portal typography documentation.
- Component and product component typography.
- Pattern and product-facing typography.
- Reading, scanning, labels, captions, and instructional text.
- AI-assisted typography decisions.

This document does not define colour, spacing, radius, elevation, motion, breakpoint, lifecycle status, confidence rating, or source-of-truth hierarchy. Those are owned by their related foundation documents and [the Constitution](../01-foundation/constitution.md).

This document does not define canonical vocabulary. Use [the Glossary](../01-foundation/glossary.md).

This document does not create UI.

## Typography Philosophy

PlayBooky typography must be calm, structured, readable, and useful.

The system should feel editorial enough to support reflection and guidance, but operational enough for repeated product use. Type choices must help people scan, compare, decide, and continue their work without visual noise.

Typography must:

- Prioritize readability over decoration.
- Use hierarchy to clarify meaning, not to create spectacle.
- Support dense but humane interfaces.
- Keep line length, line height, and spacing comfortable across desktop, tablet, and mobile.
- Make interactive and instructional text easy to identify.
- Avoid local visual flourishes that weaken system consistency.

Typography must not:

- Depend on decorative type treatments.
- Use one-off font sizes.
- Use negative letter spacing.
- Use oversized text inside compact panels, cards, controls, or tables.
- Use all-caps styling as a substitute for hierarchy.
- Shrink text below accessible reading sizes.

## Font Families

PlayBooky uses one primary sans-serif family and one monospace family.

### Primary Sans

The primary sans-serif family is:

```text
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Purpose:

- Support product UI, documentation, Design Portal pages, headings, body text, labels, captions, and controls.
- Provide clear letterforms, strong readability, and stable rendering across platforms.

Rules:

- Use the primary sans family for all product and portal interface text.
- Do not introduce a second decorative display family.
- Do not use serif typography unless a future canonical owner document approves a specific editorial need.

### Monospace

The monospace family is:

```text
"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace
```

Purpose:

- Support code, token names, file paths, command names, technical identifiers, and short machine-readable values.

Rules:

- Use monospace only for technical content.
- Do not use monospace for general labels, headings, or body copy.
- Keep monospace text at body or caption sizes unless a specific code-display pattern defines otherwise.

## Font Weights

PlayBooky typography uses a small weight range.

| Token                                  | Weight | Purpose                                                 |
| -------------------------------------- | -----: | ------------------------------------------------------- |
| `typography.primitive.weight.regular`  |    400 | Body copy, captions, secondary text, long-form reading. |
| `typography.primitive.weight.medium`   |    500 | Labels, navigation, compact emphasis, table headers.    |
| `typography.primitive.weight.semibold` |    600 | Headings, section titles, primary emphasis.             |
| `typography.primitive.weight.bold`     |    700 | Rare emphasis where semibold is not strong enough.      |

Rules:

- Use regular for reading.
- Use medium for labels and compact control text.
- Use semibold for hierarchy.
- Use bold sparingly.
- Do not use weights below 400 or above 700.

## Letter Spacing

PlayBooky typography uses normal letter spacing.

| Token                                  | Value | Purpose                              |
| -------------------------------------- | ----- | ------------------------------------ |
| `typography.primitive.tracking.normal` | `0`   | Default tracking for all text roles. |

Rules:

- Letter spacing must be `0` for display, heading, body, label, and caption text.
- Negative letter spacing is not allowed.
- Positive decorative tracking is not allowed for hierarchy.
- Do not use all-caps text with expanded tracking as a design motif.

## Line Heights

Line height must support comfortable reading and clear hierarchy.

| Token                                      | Value | Purpose                                         |
| ------------------------------------------ | ----: | ----------------------------------------------- |
| `typography.primitive.line-height.tight`   |   1.1 | Large display text with short line lengths.     |
| `typography.primitive.line-height.heading` |   1.2 | Headings and compact titles.                    |
| `typography.primitive.line-height.snug`    |  1.35 | Labels, dense supporting text, compact UI copy. |
| `typography.primitive.line-height.body`    |   1.6 | Paragraphs and main reading text.               |
| `typography.primitive.line-height.caption` |  1.45 | Captions, helper text, and metadata.            |

Rules:

- Body copy must use a line height of at least 1.5.
- Long-form reading should use `typography.primitive.line-height.body`.
- Headings should not use body line height unless they wrap across several lines in a reading context.
- Captions must remain readable and must not collapse below 1.4 line height.

## Display Scale

Display text is reserved for primary page or portal moments where the text is the main orientation signal.

| Token                  | Desktop |   Tablet |  Mobile | Line height | Weight | Letter spacing | Purpose                                              |
| ---------------------- | ------: | -------: | ------: | ----------: | -----: | -------------: | ---------------------------------------------------- |
| `typography.display.1` |    4rem |  3.25rem |  2.5rem |         1.1 |    600 |              0 | Largest page-level display title.                    |
| `typography.display.2` | 3.25rem |  2.75rem | 2.25rem |         1.1 |    600 |              0 | Strong page title or major portal introduction.      |
| `typography.display.3` | 2.75rem | 2.375rem |    2rem |        1.15 |    600 |              0 | Smaller display title for constrained page contexts. |

Rules:

- Use display text only once per page or major portal view.
- Do not use display tokens inside cards, sidebars, tables, dense panels, forms, or repeated items.
- Display text must wrap cleanly on mobile without overlapping neighbouring content.

## Heading Scale

Headings structure content and support scanning.

| Token                  |  Desktop |    Tablet |    Mobile | Line height | Weight | Letter spacing | Purpose                                               |
| ---------------------- | -------: | --------: | --------: | ----------: | -----: | -------------: | ----------------------------------------------------- |
| `typography.heading.1` |  2.25rem |      2rem |   1.75rem |         1.2 |    600 |              0 | Page H1 when display text is not used.                |
| `typography.heading.2` | 1.875rem |   1.75rem |    1.5rem |         1.2 |    600 |              0 | Major section heading.                                |
| `typography.heading.3` |   1.5rem |  1.375rem |   1.25rem |        1.25 |    600 |              0 | Subsection heading.                                   |
| `typography.heading.4` |  1.25rem | 1.1875rem |  1.125rem |         1.3 |    600 |              0 | Panel or grouped-content heading.                     |
| `typography.heading.5` | 1.125rem | 1.0625rem |      1rem |        1.35 |    600 |              0 | Compact heading inside dense content.                 |
| `typography.heading.6` |     1rem |      1rem | 0.9375rem |        1.35 |    600 |              0 | Small heading, table group, or compact label heading. |

Rules:

- Use semantic heading order in markup.
- Choose a visual heading token based on content hierarchy and container size.
- Do not skip heading levels for visual effect.
- Do not use heading tokens for ordinary labels or button text.

## Body Scale

Body text supports reading, explanation, and product content.

| Token                     |   Desktop |    Tablet |    Mobile | Line height | Weight | Letter spacing | Purpose                                                 |
| ------------------------- | --------: | --------: | --------: | ----------: | -----: | -------------: | ------------------------------------------------------- |
| `typography.body.large`   |  1.125rem | 1.0625rem |      1rem |         1.6 |    400 |              0 | Introductory paragraphs and important explanatory text. |
| `typography.body.default` |      1rem |      1rem |      1rem |         1.6 |    400 |              0 | Default readable body copy.                             |
| `typography.body.compact` | 0.9375rem | 0.9375rem | 0.9375rem |        1.55 |    400 |              0 | Dense interface body copy.                              |
| `typography.body.small`   |  0.875rem |  0.875rem |  0.875rem |         1.5 |    400 |              0 | Secondary body copy and short supporting text.          |

Rules:

- Use `typography.body.default` as the baseline for readable product text.
- Use compact and small body text only when the content is short.
- Do not use body text below `0.875rem`.
- Long-form reading must not use compact text.

## Label Scale

Labels identify controls, navigation items, filters, metadata groups, and short interface actions.

| Token                      |   Desktop |    Tablet |    Mobile | Line height | Weight | Letter spacing | Purpose                                                |
| -------------------------- | --------: | --------: | --------: | ----------: | -----: | -------------: | ------------------------------------------------------ |
| `typography.label.large`   |      1rem |      1rem |      1rem |        1.35 |    500 |              0 | Prominent control labels and navigation labels.        |
| `typography.label.default` |  0.875rem |  0.875rem |  0.875rem |        1.35 |    500 |              0 | Default labels, buttons, tabs, chips, and form labels. |
| `typography.label.small`   | 0.8125rem | 0.8125rem | 0.8125rem |        1.35 |    500 |              0 | Compact labels and dense metadata labels.              |

Rules:

- Labels must be short.
- Labels must not replace headings for content structure.
- Label text must not rely on uppercase styling to communicate hierarchy.
- Interactive labels must remain large enough for clear recognition.

## Caption Scale

Captions support metadata, helper text, timestamps, short notes, and secondary explanations.

| Token                        |   Desktop |    Tablet |    Mobile | Line height | Weight | Letter spacing | Purpose                                                           |
| ---------------------------- | --------: | --------: | --------: | ----------: | -----: | -------------: | ----------------------------------------------------------------- |
| `typography.caption.default` | 0.8125rem | 0.8125rem | 0.8125rem |        1.45 |    400 |              0 | Default caption, helper text, and metadata.                       |
| `typography.caption.small`   |   0.75rem |   0.75rem |   0.75rem |        1.45 |    400 |              0 | Short timestamps, compact metadata, and non-critical helper text. |

Rules:

- Captions must not carry primary instructions.
- Captions must not be used for long paragraphs.
- Caption text must preserve contrast and legibility.
- Do not use caption small for interactive controls.

## Responsive Scaling

Typography must support desktop, tablet, and mobile without relying on viewport-width font formulas.

Rules:

- Use the explicit desktop, tablet, and mobile values in this document.
- Do not scale font size directly with viewport width.
- Do not use fluid typography formulas such as `vw`, `vmin`, or unbounded `clamp()` for font size.
- Reduce display and heading sizes at smaller breakpoints.
- Keep body, label, and caption sizes stable unless this document defines a smaller responsive value.
- Preserve line height when text wraps.
- Test long labels and headings at mobile width.

Responsive typography depends on breakpoint ownership in [Breakpoints](./breakpoints.md). Until breakpoint values are approved, implementation must map these desktop, tablet, and mobile roles to the approved breakpoint tokens once they exist.

## Semantic Typography Tokens

Semantic typography tokens map primitive type values to usage roles.

| Token                        | Font family                        | Size token                                  | Weight token                           | Line-height token                          | Tracking token                         | Purpose                   |
| ---------------------------- | ---------------------------------- | ------------------------------------------- | -------------------------------------- | ------------------------------------------ | -------------------------------------- | ------------------------- |
| `typography.display.1`       | `typography.primitive.family.sans` | `typography.primitive.size.display-1`       | `typography.primitive.weight.semibold` | `typography.primitive.line-height.tight`   | `typography.primitive.tracking.normal` | Largest display title.    |
| `typography.display.2`       | `typography.primitive.family.sans` | `typography.primitive.size.display-2`       | `typography.primitive.weight.semibold` | `typography.primitive.line-height.tight`   | `typography.primitive.tracking.normal` | Secondary display title.  |
| `typography.display.3`       | `typography.primitive.family.sans` | `typography.primitive.size.display-3`       | `typography.primitive.weight.semibold` | `typography.primitive.line-height.heading` | `typography.primitive.tracking.normal` | Compact display title.    |
| `typography.heading.1`       | `typography.primitive.family.sans` | `typography.primitive.size.heading-1`       | `typography.primitive.weight.semibold` | `typography.primitive.line-height.heading` | `typography.primitive.tracking.normal` | Page heading.             |
| `typography.heading.2`       | `typography.primitive.family.sans` | `typography.primitive.size.heading-2`       | `typography.primitive.weight.semibold` | `typography.primitive.line-height.heading` | `typography.primitive.tracking.normal` | Major section heading.    |
| `typography.heading.3`       | `typography.primitive.family.sans` | `typography.primitive.size.heading-3`       | `typography.primitive.weight.semibold` | `typography.primitive.line-height.heading` | `typography.primitive.tracking.normal` | Subsection heading.       |
| `typography.heading.4`       | `typography.primitive.family.sans` | `typography.primitive.size.heading-4`       | `typography.primitive.weight.semibold` | `typography.primitive.line-height.snug`    | `typography.primitive.tracking.normal` | Panel heading.            |
| `typography.heading.5`       | `typography.primitive.family.sans` | `typography.primitive.size.heading-5`       | `typography.primitive.weight.semibold` | `typography.primitive.line-height.snug`    | `typography.primitive.tracking.normal` | Compact heading.          |
| `typography.heading.6`       | `typography.primitive.family.sans` | `typography.primitive.size.heading-6`       | `typography.primitive.weight.semibold` | `typography.primitive.line-height.snug`    | `typography.primitive.tracking.normal` | Small heading.            |
| `typography.body.large`      | `typography.primitive.family.sans` | `typography.primitive.size.body-large`      | `typography.primitive.weight.regular`  | `typography.primitive.line-height.body`    | `typography.primitive.tracking.normal` | Introductory body copy.   |
| `typography.body.default`    | `typography.primitive.family.sans` | `typography.primitive.size.body-default`    | `typography.primitive.weight.regular`  | `typography.primitive.line-height.body`    | `typography.primitive.tracking.normal` | Default body copy.        |
| `typography.body.compact`    | `typography.primitive.family.sans` | `typography.primitive.size.body-compact`    | `typography.primitive.weight.regular`  | `typography.primitive.line-height.body`    | `typography.primitive.tracking.normal` | Dense body copy.          |
| `typography.body.small`      | `typography.primitive.family.sans` | `typography.primitive.size.body-small`      | `typography.primitive.weight.regular`  | `typography.primitive.line-height.body`    | `typography.primitive.tracking.normal` | Secondary body copy.      |
| `typography.label.large`     | `typography.primitive.family.sans` | `typography.primitive.size.label-large`     | `typography.primitive.weight.medium`   | `typography.primitive.line-height.snug`    | `typography.primitive.tracking.normal` | Prominent labels.         |
| `typography.label.default`   | `typography.primitive.family.sans` | `typography.primitive.size.label-default`   | `typography.primitive.weight.medium`   | `typography.primitive.line-height.snug`    | `typography.primitive.tracking.normal` | Default labels.           |
| `typography.label.small`     | `typography.primitive.family.sans` | `typography.primitive.size.label-small`     | `typography.primitive.weight.medium`   | `typography.primitive.line-height.snug`    | `typography.primitive.tracking.normal` | Compact labels.           |
| `typography.caption.default` | `typography.primitive.family.sans` | `typography.primitive.size.caption-default` | `typography.primitive.weight.regular`  | `typography.primitive.line-height.caption` | `typography.primitive.tracking.normal` | Captions and helper text. |
| `typography.caption.small`   | `typography.primitive.family.sans` | `typography.primitive.size.caption-small`   | `typography.primitive.weight.regular`  | `typography.primitive.line-height.caption` | `typography.primitive.tracking.normal` | Compact metadata.         |
| `typography.code.default`    | `typography.primitive.family.mono` | `typography.primitive.size.body-small`      | `typography.primitive.weight.regular`  | `typography.primitive.line-height.caption` | `typography.primitive.tracking.normal` | Inline technical text.    |

Rules:

- Product code must consume semantic typography tokens through approved components, layouts, or generated token variables.
- Product pages must not consume primitive typography tokens directly.
- Component tokens may reference semantic typography tokens when component-specific mappings are required.
- Token names must follow [Token Naming](./token-naming.md).

## Accessibility

Typography must support readable, navigable, and assistive-technology-compatible interfaces.

Requirements:

- Body copy must not be smaller than `0.875rem`.
- Interactive control text must not be smaller than `0.875rem`.
- Text must remain readable at 200% browser zoom.
- Text must not overlap, clip, or truncate unless the component specification defines accessible truncation behaviour.
- Heading order must preserve document structure.
- Text contrast is governed by the colour system and must be validated against approved surface tokens.
- Text must not rely on colour, weight, or size alone to communicate critical state.
- Line height must preserve legibility when content wraps.
- User browser font-size preferences must not be blocked.

## Reading Comfort

Reading comfort is part of typography quality.

Rules:

- Long-form body text should target 60 to 80 characters per line.
- Dense operational text should target 40 to 70 characters per line.
- Paragraphs should use `typography.body.default` or larger.
- Lists must use the same readable body scale as surrounding content unless a component specification defines a compact list.
- Avoid long passages in caption or label styles.
- Avoid centered text for paragraphs longer than one short sentence.
- Avoid justified text.
- Keep heading and paragraph rhythm consistent with the spacing system.

## Usage Rules

Use typography tokens by role:

- Use display tokens for rare page-level orientation.
- Use heading tokens for hierarchy.
- Use body tokens for reading and explanation.
- Use label tokens for controls, navigation, and short identifiers.
- Use caption tokens for metadata and helper text.
- Use code tokens for technical identifiers.

Implementation rules:

- Do not hardcode font size, weight, line height, letter spacing, or font family when an approved token exists.
- Do not create local text styles inside product pages.
- Do not use typography primitives directly in product pages.
- Do not use visual size to fake semantic heading structure.
- Do not add font families without updating this document and the token source.
- Do not use text images for interface text.

## Do And Don't

Do:

- Use `typography.body.default` for most readable product copy.
- Use heading tokens to create clear content hierarchy.
- Use label tokens for short actionable or identifying text.
- Keep long text comfortable with generous line height.
- Check mobile wrapping before accepting heading or label choices.
- Use semantic typography tokens instead of raw CSS values.

Don't:

- Don't use display type inside compact cards, tables, sidebars, or controls.
- Don't use caption styles for primary instructions.
- Don't invent one-off font sizes.
- Don't use negative letter spacing.
- Don't use uppercase tracking as a hierarchy system.
- Don't reduce body text below `0.875rem`.
- Don't treat current implementation values as approved if they conflict with this document.

## AI Behaviour

AI agents must treat this document as the owner for PlayBooky typography decisions.

AI agents must:

- Use the typography scale before proposing text styles.
- Use semantic typography tokens instead of raw font values.
- Check [Primitive Tokens](./primitive-tokens.md), [Semantic Tokens](./semantic-tokens.md), and [Token Naming](./token-naming.md) before proposing token changes.
- Preserve desktop, tablet, and mobile typography behaviour.
- Check heading hierarchy and reading comfort when creating or reviewing interface work.
- Flag missing typography tokens instead of inventing local styles.
- Keep typography documentation separate from UI implementation.

AI agents must not:

- Create UI in this document.
- Invent a new font family.
- Use viewport-width font scaling.
- Use negative letter spacing.
- Promote token status or confidence beyond documented evidence.
- Treat placeholder foundation docs as complete owners when this document owns typography.

## Validation

Typography validation must confirm:

- Font family usage matches this document.
- Font weights stay within the approved weight range.
- Font sizes map to approved semantic typography tokens.
- Line heights map to approved line-height tokens.
- Letter spacing is `0`.
- Responsive typography uses explicit desktop, tablet, and mobile roles.
- Heading order is semantic.
- Body and interactive text meet minimum readable sizes.
- Long-form text meets reading comfort rules.
- Product pages do not hardcode typography values when tokens exist.
- Design Portal typography documentation matches this document.

Validation may use documentation review, token checks, linting, visual review, responsive review, accessibility review, and implementation review.

## Acceptance Criteria

The PlayBooky Typography System is accepted when:

- Typography philosophy is defined.
- Font families are defined.
- Display, heading, body, label, and caption scales are defined.
- Line heights, letter spacing, and font weights are defined.
- Responsive typography behaviour is defined for desktop, tablet, and mobile.
- Semantic typography tokens are defined and aligned with token naming rules.
- Accessibility and reading comfort requirements are documented.
- Usage rules and Do/Don't guidance are documented.
- AI behaviour is documented.
- The document does not create UI.
- The document cross-references related owner documents without duplicating their rules.

## Related Documents

- [Constitution](../01-foundation/constitution.md)
- [Glossary](../01-foundation/glossary.md)
- [Foundation Tokens](./README.md)
- [Primitive Tokens](./primitive-tokens.md)
- [Semantic Tokens](./semantic-tokens.md)
- [Token Naming](./token-naming.md)
- [Token Portal Experience](./token-portal-experience.md)
- [Breakpoints](./breakpoints.md)
- [Colours](./colours.md)
- [Spacing](./spacing.md)
- [Documentation Standards](../02-design-system/documentation-standards.md)
- [Quality Gate](../08-ai/quality-gate.md)
