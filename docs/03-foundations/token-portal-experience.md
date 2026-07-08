# Token Portal Experience

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.2.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

This document defines the behaviour that is unique to Foundation Token pages inside the PlayBooky Design Portal.

General portal behaviour—including navigation, page layout, search, status badges, confidence ratings, version history, decision history, related links and inspection tools—is owned by **Design Portal UX Architecture**.

This document defines only the behaviour specific to token pages.

## Scope

Applies to:

- Primitive Tokens
- Semantic Tokens
- Token Naming
- Token Categories
- Token Examples
- Accessibility Checks
- Contrast Checks
- Responsive Token Preview
- Token Implementation Guidance

It does not define portal navigation, page chrome or product UI.

## Token Page Structure

Every token page inherits the standard Design Portal page layout.

Token pages additionally include:

- Token category
- Token layer
- Token table
- Usage guidance
- Accessibility guidance
- Contrast guidance where applicable
- Implementation guidance
- Responsive preview where applicable

## Primitive Token Pages

Primitive token pages describe source values.

Before approval they should describe:

- Token purpose
- Expected role
- Naming
- Relationship to semantic tokens
- Approval status
- Missing value requests

Primitive tokens must never be presented as product-facing values.

## Semantic Token Pages

Semantic token pages describe meaning rather than implementation.

Each semantic token should document:

- Purpose
- Allowed usage
- Related primitive token
- Accessibility implications
- Responsive behaviour where relevant

Product components consume semantic tokens—not primitive tokens.

## Usage Examples

Examples should:

- Use realistic PlayBooky content.
- Demonstrate correct semantic token usage.
- Show common mistakes when helpful.

Examples must not:

- Invent final values.
- Bypass semantic tokens.
- Present exploratory values as approved.

## Accessibility

Token pages must document accessibility whenever the token category affects usability.

Examples include:

- Typography
- Colour
- Motion
- Spacing
- Breakpoints

If accessibility does not apply, the page should explain why.

## Contrast Checks

Colour-related token pages should include:

- Approved pairings
- Contrast result
- Usage guidance
- Blockers when requirements fail

## Code Examples

Where implementation exists:

- Show approved semantic token usage.
- Avoid raw values.
- Reference implementation contracts.

Otherwise display:

`Implementation pending.`

## Responsive Preview

Responsive previews are required for token categories that influence responsive behaviour, including:

- Typography
- Spacing
- Breakpoints
- Layout-affecting tokens
- Motion tokens where viewport changes behaviour

## AI Guidance

AI agents must:

- Never invent token values.
- Keep primitive and semantic tokens separate.
- Use semantic tokens for product examples.
- Record missing values rather than guessing.
- Validate accessibility where relevant.

## Acceptance Criteria

The Token Portal Experience is complete when:

- Primitive and semantic token pages are clearly differentiated.
- Token usage is clearly documented.
- Accessibility and contrast guidance exists where required.
- Responsive previews exist for responsive token categories.
- Code examples reference approved semantic tokens.
- AI agents can review token pages without inventing values.

## Related Documents

- Design Portal UX Architecture
- Constitution
- Primitive Tokens
- Semantic Tokens
- Token Naming
- Quality Gate
