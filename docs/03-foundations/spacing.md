# Spacing

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.1.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

This document defines the architecture for PlayBooky spacing tokens.

Spacing tokens control distance, rhythm, density, and responsive composition across foundations, layouts, components, patterns, portal pages, and product screens.

This document does not define final spacing values.

## Philosophy

Spacing is a system rule, not a local design choice.

PlayBooky spacing must make interfaces feel calm, scannable, and intentional. Space should clarify relationships between content, controls, panels, and workflows. It must not be used as decorative filler or adjusted locally until a layout happens to look acceptable.

Spacing decisions must support:

- Clear hierarchy.
- Predictable rhythm.
- Accessible touch and pointer interaction.
- Dense but readable product workflows.
- Responsive behaviour across desktop, tablet, and mobile.
- Consistent component composition.

All spacing used in product-facing implementation must come from approved spacing tokens, layout primitives, or component contracts.

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

Semantic spacing tokens give purpose to primitive spacing.

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

## Auto Layout Guidance

Auto Layout guidance defines how spacing behaves inside repeatable component and layout structures.

Rules:

- Use gap-based spacing for relationships between sibling elements.
- Use padding tokens for internal space between an element boundary and its content.
- Use margin-like spacing only through layout primitives or documented composition rules.
- Do not combine local margins and parent gaps to create hidden spacing.
- Do not use negative spacing unless a documented component anatomy explicitly requires overlap.
- Do not use arbitrary offsets to align content that should be handled by grid, stack, or container rules.
- Auto Layout controls in design tools must reference spacing token names, not visual guesses.

AI behaviour:

- AI agents must identify whether a spacing need is gap, padding, or layout composition before suggesting a token.
- AI agents must not compensate for weak layout structure by inventing local spacing.

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
