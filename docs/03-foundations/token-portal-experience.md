# Token Portal Experience

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.1.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

This document defines how foundation token pages must appear and behave inside the PlayBooky V3 Design Portal.

Token portal pages must make token decisions visible, searchable, reviewable, accessible, and traceable to documentation and future implementation.

## Scope

This document applies to Design Portal pages for:

- Primitive tokens.
- Semantic tokens.
- Token naming.
- Token category pages.
- Token status and confidence display.
- Token examples.
- Token accessibility and contrast checks.
- Token decision history.

This document does not build portal UI, React components, or product screens.

## How Token Pages Appear Inside The Design Portal

Every token page must present tokens as governed system decisions, not decorative swatches or loose examples.

Each token page must include:

- Page title.
- Purpose.
- Scope.
- Status badge.
- Confidence rating.
- Owner.
- Last updated date.
- Token category.
- Token layer.
- Token table or token list.
- Usage guidance.
- Validation rules.
- Related documentation.
- Related code link when implementation exists.
- Decision history.
- AI review checklist.
- Acceptance criteria.

Token pages must support desktop, tablet, and mobile reading.

## Primitive Token Display

Primitive token pages must show raw source values only after values are approved.

Before final values exist, primitive token pages may show:

- Token category.
- Token name shape.
- Intended source role.
- Approval status.
- Confidence rating.
- Expected relationship to semantic tokens.
- Missing value request status.

Primitive token display must not imply product usage.

Primitive token display must clearly state that product pages cannot consume primitive tokens directly.

## Semantic Token Display

Semantic token pages must show the meaning and allowed use of tokens.

Semantic token entries must include:

- Semantic token name.
- Token family.
- Purpose.
- Allowed usage.
- Linked primitive token or alias when approved.
- Accessibility requirements.
- Contrast requirements for colour tokens.
- Responsive behaviour for responsive tokens.
- Status badge.
- Confidence rating.
- Related components or patterns.

Semantic token display must distinguish between tokens that are approved for component use and tokens that are still Exploring or Improved.

## Usage Examples

Token pages must include usage examples when examples help prevent misuse.

Usage examples must:

- Use realistic PlayBooky context.
- Avoid creating product screens.
- Identify whether the example is primitive, semantic, component, or product token usage.
- Show allowed usage.
- Show prohibited usage when misuse is likely.

Usage examples must not:

- Introduce unapproved final values.
- Use primitive tokens directly in product page examples.
- Show one-off UI as approved token usage.
- Bypass semantic tokens.

## Accessibility Checks

Token portal pages must show accessibility checks for token categories that affect usability.

Accessibility checks must cover:

- Text contrast.
- Non-text contrast.
- Focus visibility.
- Disabled state legibility.
- Reduced-motion support.
- Touch and spacing implications when token usage affects interaction.
- Readability across desktop, tablet, and mobile for typography tokens.

If a token category does not have a direct accessibility check, the page must state the reason.

## Contrast Checks

Colour, surface, text, border, icon, feedback, focus, selection, and disabled tokens must include contrast guidance.

Contrast display must show:

- Tested token pairing.
- Required contrast threshold.
- Result.
- Usage notes.
- Failure state or blocker when the pairing fails.

Contrast checks must not approve a token pairing that fails accessibility requirements.

AI agents must not infer contrast success without evidence once token values exist.

## Code Examples

Token portal pages must include code examples only when implementation exists or an implementation contract has been approved.

Code examples must:

- Use approved token names.
- Avoid raw visual values.
- Show semantic token usage for components.
- Avoid primitive token usage in product page examples.
- Identify import paths or generated variable names when known.

When implementation does not exist, the code examples section must state:

```text
Implementation pending.
```

## Responsive Preview

Token portal pages must support responsive preview for token categories that change or affect layout across breakpoints.

Responsive preview must cover:

- Desktop.
- Tablet.
- Mobile.

Responsive preview is required for:

- Typography tokens.
- Spacing tokens.
- Breakpoint tokens.
- Layout-affecting semantic tokens.
- Motion tokens when motion behaviour changes by viewport.

Responsive preview must not rely on product screens.

## Token Status Badges

Every token entry must display lifecycle status when the token is governed individually.

Allowed statuses are owned by the Constitution:

- Exploring.
- Improved.
- Approved.
- Current.
- Rejected.
- Deprecated.

Status badges must not promote a token to product eligibility by visual treatment alone.

Product eligibility must follow the Constitution and the relevant token documentation.

## Confidence Rating

Every governed token category and reusable token decision must show confidence rating.

Confidence rating must use the canonical scale owned by the Constitution.

Token portal pages must explain confidence impact:

- Ratings 1, 2, and 3 are not product-eligible.
- Ratings 4 and 5 can support product use only when status, documentation, portal representation, and implementation alignment also pass.

## Decision History

Token portal pages must record decision history for meaningful token changes.

Decision history must include:

- Date.
- Status.
- Decision.
- Rationale.
- Owner or approver.
- Impact.

Decision history is required for:

- New token categories.
- New token layers.
- Naming rule changes.
- Primitive value approval.
- Semantic mapping changes.
- Accessibility or contrast rule changes.
- Deprecation.
- Rejection.

## Related Components

Token portal pages must list related components when components depend on the token category or token family.

Related component entries must include:

- Component name.
- Relationship.
- Token dependency.
- Status of dependency.

If no related components exist, the page must state:

```text
None documented.
```

## Related Patterns

Token portal pages must list related patterns when patterns depend on token usage.

Related pattern entries must include:

- Pattern name.
- Relationship.
- Token dependency.
- Status of dependency.

If no related patterns exist, the page must state:

```text
None documented.
```

## AI Review Checklist

AI agents must use this checklist before presenting token portal work as complete:

- [ ] The token page states purpose and scope.
- [ ] The token layer is identified.
- [ ] The token category is identified.
- [ ] Primitive tokens are not presented as product-facing usage guidance.
- [ ] Semantic tokens show meaning and allowed use.
- [ ] Product pages are prohibited from consuming primitive tokens directly.
- [ ] Component tokens reference semantic tokens only.
- [ ] No hardcoded visual values are introduced.
- [ ] No final brand colours are invented.
- [ ] Desktop, tablet, and mobile support is documented when the token affects responsive behaviour.
- [ ] Accessibility checks are documented for usability-affecting token categories.
- [ ] Contrast checks are documented for colour-related token categories once values exist.
- [ ] Status badges use the canonical lifecycle model.
- [ ] Confidence rating uses the canonical confidence scale.
- [ ] Decision history is present.
- [ ] Related components and patterns are linked or marked `None documented`.
- [ ] Missing token needs are recorded as missing token requests instead of invented values.

## Acceptance Criteria

The token portal experience is accepted when:

- Token pages present governed source-of-truth decisions.
- Primitive and semantic token displays are clearly different.
- Usage examples prevent misuse without building product screens.
- Accessibility and contrast expectations are explicit.
- Code examples use approved tokens only or state `Implementation pending`.
- Responsive previews support desktop, tablet, and mobile for responsive token categories.
- Token status badges and confidence ratings are visible.
- Decision history is required for meaningful token changes.
- Related components and patterns are tracked.
- AI review checklist blocks invented token values.

## Related Documents

- [Constitution](../01-foundation/constitution.md)
- [Document Map](../01-foundation/document-map.md)
- [Glossary](../01-foundation/glossary.md)
- [Design Portal Information Architecture](../02-design-system/information-architecture.md)
- [Foundations Overview](./README.md)
- [Primitive Tokens](./primitive-tokens.md)
- [Semantic Tokens](./semantic-tokens.md)
- [Token Naming](./token-naming.md)
- [Quality Gate](../08-ai/quality-gate.md)
