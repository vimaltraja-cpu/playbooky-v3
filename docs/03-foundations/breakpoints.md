# Breakpoints

| Field | Value |
| --- | --- |
| Status | Current |
| Confidence | 4 Usability ready |
| Version | 1.1.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

Breakpoints define how PlayBooky interfaces adapt across desktop, tablet, and mobile viewports.

The breakpoint system exists so layout, components, patterns, and Design Portal previews use the same responsive language. It prevents each component from inventing local viewport rules.

## Responsive Strategy

PlayBooky uses adaptive responsive design.

Interfaces should preserve the same user intent across viewport sizes while adapting layout, density, navigation, and interaction patterns to the available space.

PlayBooky uses a hybrid responsive strategy.

- Customer-facing experiences (Homepage, Diagnosis, Recommendation) are designed mobile-first.
- Workshop creation experiences (Builder, Facilitator Guide, Design Portal) are designed desktop-first.
- Every experience must preserve the same product intent regardless of viewport.

Responsive decisions must prioritise:

- Readability.
- Task continuity.
- Touch and pointer usability.
- Predictable navigation.
- Stable content hierarchy.
- Avoiding overlap, clipping, and unexpected horizontal scrolling.

Responsive decisions must not:

- Hide required task content without providing an accessible path to it.
- Make desktop-only interactions required on touch devices.
- Reduce text below readable sizes.
- Depend on viewport-width-scaled typography.
- Use mobile behaviour as an afterthought after desktop layout is complete.

## Product Responsive Priorities

Different areas of PlayBooky have different responsive priorities.

| Product Area | Priority |
| --- | --- |
| Homepage | Mobile first |
| Diagnosis | Mobile first |
| Recommendation | Mobile first |
| Builder | Desktop first |
| Facilitator Guide | Desktop first |
| Workshop Live | Tablet/Desktop |
| Design Portal | Desktop first |

## Content Width Tokens

| Token | Use |
| --- | --- |
| `content.narrow` | Reading-focused layouts |
| `content.default` | Standard pages |
| `content.wide` | Application layouts |
| `content.full` | Builder canvas |

## Breakpoint Tokens

Use breakpoint tokens instead of local media query values.

| Token | Range | Primary device class | Use |
| --- | --- | --- | --- |
| `breakpoint.mobile` | `0px` to `767px` | Mobile | Single-column layouts, touch-first controls, compact navigation. |
| `breakpoint.tablet` | `768px` to `1023px` | Tablet | Transitional layouts, two-column opportunities, hybrid touch and pointer use. |
| `breakpoint.desktop` | `1024px` and above | Desktop | Full navigation, multi-column layouts, denser review and management views. |

Implementation may define additional internal widths for testing or container queries, but component documentation must still describe behaviour under Desktop, Tablet, and Mobile.

## Desktop

Desktop is the primary viewport for dense review, management, comparison, and Design Portal work.

Rules:

- Use available width to improve scanning, not to spread content unnecessarily.
- Support multi-column layout only when comparison or grouping benefits the task.
- Keep primary navigation visible when space allows.
- Preserve predictable page structure and landmarks.
- Do not use oversized hero-style composition for operational Design Portal views.
- Avoid very long line lengths by using container constraints.

Desktop validation:

- Content hierarchy remains clear at `1024px` and wider.
- Main content has a readable maximum width.
- Multi-column layouts do not create uneven or confusing reading order.
- Floating or overlay surfaces stay within viewport bounds.

## Tablet

Tablet should always be evaluated independently. Where appropriate it may share behaviour with either Desktop or Mobile, provided usability is preserved.

Rules:

- Tablet behaviour must be documented even when it matches desktop or mobile.
- Navigation may collapse or simplify when it improves space and touch usability.
- Layouts may move from multi-column to fewer columns.
- Touch targets must remain comfortable.
- Sidebars may become collapsible, stacked, or drawer-based.
- Content order must stay logical when columns collapse.

Tablet validation:

- Component and page previews work at `768px` through `1023px`.
- Touch targets remain usable.
- No required content is hidden behind unavailable hover interactions.
- Collapsed navigation remains discoverable.
- Tables, grids, and cards reflow without clipping.

## Mobile

Mobile is the most constrained viewport and must be designed explicitly.

Rules:

- Use single-column layout by default.
- Prioritise the primary task and reduce competing secondary content.
- Place controls where they can be reached and understood.
- Use disclosure, stacking, or step-by-step flow when content is too dense.
- Avoid hover-only interactions.
- Avoid horizontal scrolling except for explicitly documented data tables or controlled previews.
- Keep text readable and avoid viewport-width-scaled font sizes.
- Ensure sticky or fixed controls do not cover content.

Mobile validation:

- Component and page previews work below `768px`.
- Text wraps without overlapping or clipping.
- Primary actions remain visible or easy to reach.
- Navigation remains accessible.
- Inputs, menus, dialogs, and overlays fit within the viewport.
- Touch targets meet accessibility expectations.

## Adaptive Layouts

Adaptive layouts change structure at documented breakpoints to preserve usability.

Allowed adaptive behaviours:

- Columns collapse into a single column.
- Sidebars collapse into drawers or stacked sections.
- Dense navigation moves into a compact menu.
- Secondary content moves below primary content.
- Preview controls become segmented or stacked.
- Cards shift from grid to list.
- Long metadata rows become stacked field groups.

Rules:

- Adaptive changes must preserve content meaning.
- Adaptive changes must be documented in the relevant component, layout, or pattern page.
- Reordered content must maintain logical reading and keyboard order.
- Hidden content must remain accessible through a visible control or documented alternative.
- Adaptive behaviour must not create a different product decision at each viewport.

## Component Responsive Requirements

Every responsive component page must document:

- Desktop behaviour.
- Tablet behaviour.
- Mobile behaviour.
- Minimum width.
- Maximum width when relevant.
- Wrapping or truncation rules.
- Hidden or collapsed content.
- Interaction changes for touch and pointer input.

Component validation:

- Mobile behaviour must not be inferred from desktop behaviour.
- Tablet behaviour must not be skipped.
- The same component variant must be testable across all three viewport classes.
- If a component cannot support a viewport, that limitation must be documented as a blocker.

## Portal Preview Requirements

The Design Portal must support responsive preview tabs for:

- Desktop.
- Tablet.
- Mobile.

Rules:

- Preview tabs must use the same labels across component pages.
- Preview frames must use stable dimensions for review.
- Preview content must not resize controls in a way that changes the layout unexpectedly.
- Responsive previews must show realistic PlayBooky content.
- Portal preview behaviour must not replace the need to document responsive rules.

## Validation Rules

Responsive work must be validated by checking:

- Desktop, tablet, and mobile behaviour are all documented.
- No text overlaps, clips unexpectedly, or becomes unreadable.
- Navigation remains understandable and reachable.
- Interactive controls remain operable by touch and keyboard.
- Content order remains logical after layout changes.
- Overlays, dropdowns, modals, and tooltips stay within viewport bounds.
- No undocumented breakpoint values are introduced.
- Responsive behaviour aligns with layout and component documentation.

## AI Behaviour

AI agents must:

- Use `breakpoint.mobile`, `breakpoint.tablet`, and `breakpoint.desktop` language when documenting responsive behaviour.
- Document all three viewport classes before marking responsive work complete.
- Avoid inventing local breakpoint values.
- Flag missing tablet behaviour as incomplete.
- Treat mobile behaviour as explicit design work, not an automatic collapse of desktop layout.
- Validate responsive rules before implementing or approving components, layouts, or patterns.

## Acceptance Criteria

This breakpoint system is ready when:

- Desktop, tablet, and mobile breakpoint ranges are documented.
- Responsive strategy is explicit.
- Adaptive layout rules are defined.
- Component and portal responsive requirements are documented.
- Validation rules are testable.
- Humans and AI agents can describe responsive behaviour without inventing local breakpoint rules.
