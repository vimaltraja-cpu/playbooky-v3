# Spacing

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.1.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

This document defines how space is used throughout PlayBooky.

Spacing is one of the product's primary design tools. More than simply controlling distance, it creates rhythm, hierarchy and breathing room, helping users focus on thinking rather than navigating the interface.

The spacing system ensures every screen feels calm, intentional and consistently crafted across desktop, tablet and mobile.

This document defines how spacing is organised, tokenised and applied across foundations, layouts, components, patterns, the Design Portal and PlayBooky itself.

Final spacing values are approved separately. This document defines the system that governs them.

## Philosophy

Spacing is a design decision, not a visual adjustment.

Every spacing decision should help users understand relationships between information, actions and content. Space should never be added simply because something "looks better". Every gap, padding value and layout rhythm should have a clear purpose.

PlayBooky uses generous whitespace to create moments of clarity while remaining efficient enough for real product work. The interface should feel calm, focused and easy to scan rather than crowded or sparse.

The spacing system should create a predictable rhythm across the entire product so users instinctively understand how content is grouped and where their attention should move next.

PlayBooky spacing should feel:

- Calm
- Spacious
- Intentional
- Consistent
- Human
- Efficient

Spacing should never feel:

- Random
- Decorative
- Compressed
- Inconsistent
- Arbitrary

Every spacing decision must come from the approved spacing system.

## Primitive Spacing Scale

Primitive spacing tokens define the raw spacing steps used by semantic spacing tokens.

Primitive spacing tokens must use this naming shape:

```text
spacing.primitive.{scale}
```

The primitive scale must support:

- `0` for no space.
- Fine-grained compact spacing for small internal relationships.
- Standard spacing for common component and layout rhythm.
- Larger spacing for page, section, and container rhythm.
- Reserved scale gaps only when they are intentionally documented.

Example naming shape only:

```text
spacing.primitive.0
spacing.primitive.1
spacing.primitive.2
spacing.primitive.3
spacing.primitive.4
spacing.primitive.5
spacing.primitive.6
spacing.primitive.7
spacing.primitive.8
```

These names do not approve final spacing values.

Primitive spacing rules:

- Primitive spacing tokens must not encode raw values in their names.
- Primitive spacing tokens must not be used directly by product pages.
- Primitive spacing tokens must feed semantic spacing tokens.
- Primitive spacing scale direction must be documented before values are approved.
- New primitive spacing steps require token governance review.

## Semantic Spacing

Semantic spacing tokens give meaning to primitive spacing tokens.

While primitive spacing tokens define reusable spacing increments, semantic spacing tokens describe where and why spacing is used throughout PlayBooky.

Semantic spacing creates consistency across layouts, components, patterns and product experiences while allowing the underlying primitive spacing scale to evolve over time.

Semantic spacing tokens must:

- Describe purpose rather than value.
- Reference approved primitive spacing tokens or approved aliases.
- Remain stable even if primitive spacing values change.
- Be the primary spacing tokens consumed by layouts and reusable components.

Semantic spacing tokens must use this naming shape:

```text
spacing.{semantic-family}.{role}.{state-or-scale}
```

Approved semantic spacing families:

- `layout`
- `container`
- `grid`
- `component`
- `control`
- `content`
- `stack`
- `inline`

Example naming shape only:

```text
spacing.layout.page.default
spacing.layout.section.default
spacing.container.inline.default
spacing.grid.gap.default
spacing.component.group.default
spacing.control.padding.default
spacing.content.block.default
spacing.stack.gap.compact
spacing.inline.gap.default
```

These names do not approve final spacing values.

Semantic spacing rules:

- Semantic spacing tokens must map to approved primitive spacing tokens or approved token aliases.
- Semantic spacing tokens must document purpose and allowed use.
- Semantic spacing tokens must not duplicate another semantic token with a different name.
- Component tokens may reference semantic spacing tokens.
- Product tokens may reference semantic spacing tokens only through approved product token architecture.

## Rhythm

PlayBooky's visual rhythm is created through consistent spacing rather than decoration.

Interfaces should alternate between areas of generous whitespace and closely related groups of content. This rhythm helps users naturally understand hierarchy without relying on excessive borders, colours or visual effects.

The system should encourage:

- Clear grouping of related information.
- Comfortable reading rhythm.
- Consistent vertical flow.
- Predictable horizontal alignment.
- Spacious layouts that support collaborative thinking.

Rhythm should remain consistent across desktop, tablet and mobile.

## Auto Layout Guidance

PlayBooky layouts are built using Auto Layout principles.

Spacing should emerge naturally from layout structure rather than manual adjustment.

Rules:

- Every page should use a single parent Auto Layout.
- Parent layouts own spacing between sections.
- Components own their internal spacing.
- Gaps define relationships between siblings.
- Padding defines relationships between a container and its content.
- Components should stretch naturally rather than rely on fixed widths where possible.
- Absolute positioning should only be used when explicitly documented.
- Local spacing adjustments should never compensate for poor layout structure.

Design files and code should describe the same layout behaviour.

## Container Spacing

Container spacing controls distance between viewport edges, page content, and bounded layout regions.

Container spacing must define:

- Desktop inline spacing.
- Tablet inline spacing.
- Mobile inline spacing.
- Maximum content width relationships.
- Nested container behaviour.
- Edge-to-edge exceptions.

Rules:

- Container spacing must come from approved semantic spacing tokens.
- Desktop, tablet, and mobile container spacing must be documented before product use.
- Nested containers must not compound spacing accidentally.
- Full-bleed sections must document how content returns to the approved container rhythm.
- Product pages must not set container padding locally.

## Component Anatomy

Every reusable component should document its internal spacing anatomy.

Typical anatomy includes:

- Outer padding
- Header spacing
- Content spacing
- Footer spacing
- Icon spacing
- Label spacing
- Action spacing

Internal spacing belongs to the component.

External spacing belongs to the parent layout.

Components must never assume how much space surrounds them.

## Grid Spacing

Grid spacing controls gutters, row gaps, and column gaps.

Grid spacing must define:

- Column gap tokens.
- Row gap tokens.
- Responsive gap behaviour.
- Dense grid behaviour.
- Content-card grid behaviour.
- Form or table grid behaviour when those patterns are approved.

Rules:

- Grid gap values must come from semantic grid spacing tokens.
- Grid spacing must coordinate with breakpoint tokens.
- Grid spacing must not be hardcoded inside product screens.
- Grid gap changes across desktop, tablet, and mobile must be documented.
- Components inside grids must not override grid spacing to force alignment.

## Component Spacing

Component spacing controls the internal rhythm of reusable components.

Component spacing may include:

- Root padding.
- Header/body/footer gaps.
- Icon and label gaps.
- Field and helper-text gaps.
- Control group gaps.
- List item gaps.
- Empty, loading, error, and success state spacing.

Rules:

- Component spacing must be documented in the component page.
- Component spacing must reference semantic spacing tokens or component tokens that map to semantic spacing tokens.
- Component variants must document spacing changes.
- Component states must document spacing changes when layout, content, or affordance changes.
- Product pages must not override component internal spacing.

## Responsive Rules

Spacing must support desktop, tablet, and mobile behaviour.

Responsive spacing rules:

- Every layout primitive must document desktop, tablet, and mobile spacing behaviour.
- Every component with responsive spacing changes must document those changes in its component page.
- Mobile spacing must not be inferred from desktop spacing.
- Tablet spacing must be explicitly documented, even when it matches desktop or mobile.
- Responsive spacing changes must preserve readability, touch targets, and content hierarchy.
- Breakpoint-driven spacing must reference approved breakpoint tokens.
- Product pages must not introduce undocumented responsive spacing.

## Usage Rules

Spacing usage must follow the governed token system.

Rules:

- No random spacing.
- No hardcoded product spacing.
- No local spacing values inside product pages.
- No component may define new spacing values locally.
- New spacing needs must be added to the foundation system before product use.
- Use primitive spacing only when defining semantic spacing.
- Use semantic spacing when defining component, layout, pattern, or product spacing contracts.
- Use layout primitives for page-level spacing.
- Use component contracts for component internal spacing.

## AI Behaviour

AI contributors must treat spacing as a governed foundation token category.

AI must:

- Read this spacing document before making spacing decisions.
- Use approved spacing tokens or layout primitives.
- Determine whether the need is primitive, semantic, component, layout, pattern, or product spacing.
- Preserve desktop, tablet, and mobile spacing rules.
- Flag missing spacing tokens instead of inventing values.
- Propose new spacing tokens through the foundation approval workflow.
- Report conflicts between spacing documentation, portal pages, and code.

AI must not:

- Invent arbitrary spacing values.
- Use raw spacing values in product pages.
- Create component-local spacing scales.
- Treat visual screenshots or prototypes as approved spacing sources.
- Use primitive spacing tokens directly in product pages.

## Acceptance Criteria

This spacing system is accepted when:

- Spacing philosophy is defined.
- Primitive spacing scale architecture is defined without final values.
- Semantic spacing families are defined.
- Auto Layout guidance is documented.
- Container, grid, and component spacing rules are documented.
- Responsive spacing rules cover desktop, tablet, and mobile.
- Usage rules prevent random spacing.
- AI behaviour rules prevent arbitrary spacing decisions.
