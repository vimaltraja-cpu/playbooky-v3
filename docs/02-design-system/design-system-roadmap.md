# PlayBooky Design System Build Roadmap

| Field | Value |
| --- | --- |
| Status | Current |
| Confidence | 4 Usability ready |
| Version | 1.0.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

This document defines the implementation roadmap for building the PlayBooky Design System itself.

This is not the PlayBooky product roadmap. It does not define product feature priority, customer-facing releases, or product launch sequencing. It defines the order in which the design system foundations, layout primitives, components, product components, patterns, and portal capabilities should be specified, built, reviewed, and made ready for use.

The roadmap exists so humans and AI agents can build the system in a dependable order, avoid implementing components before their foundations exist, and know what evidence is required before each phase is complete.

## Roadmap Principles

- Build from foundations to composed experience.
- Do not implement a phase before its required dependencies are documented and usable.
- Do not treat product components as ready until their core component and pattern dependencies exist.
- Do not treat the Design Portal as complete until it can document, preview, validate, and explain design decisions.
- Every deliverable must have documentation, implementation guidance, validation rules, and a quality gate before it can be considered done.
- AI agents must follow this roadmap unless a human explicitly changes the roadmap or records an exception.

## Phase Overview

| Phase | Name | Primary outcome |
| --- | --- | --- |
| 1 | Foundation Tokens | Establish the visual, responsive, motion, and layering primitives that all later work depends on. |
| 2 | Layout | Establish reusable page and composition primitives. |
| 3 | Core Components | Establish reusable interface components for common UI needs. |
| 4 | Product Components | Establish PlayBooky-specific composed components. |
| 5 | Patterns | Establish reusable end-to-end interaction and product flows. |
| 6 | Portal | Establish the Design Portal capabilities that make the system navigable, reviewable, and maintainable. |

## Global Dependencies

All phases depend on:

- `docs/01-foundation/constitution.md`
- `docs/01-foundation/document-map.md`
- `docs/01-foundation/principles.md`
- `docs/02-design-system/page-template.md`
- `docs/08-ai/quality-gate.md`

Global validation must confirm:

- Purpose, user need, and success criteria exist before implementation.
- Status and confidence are documented.
- Documentation, Design Portal page, and implementation are aligned when implementation exists.
- Accessibility requirements are documented before a component or pattern becomes `Approved` or `Current`.
- Responsive behaviour is documented before a component, layout primitive, or pattern becomes `Approved` or `Current`.

## Phase 1: Foundation Tokens

### Purpose

Build the shared foundation tokens that give the PlayBooky Design System consistent visual language, responsive behaviour, motion behaviour, and layering rules.

This phase prevents downstream components from inventing local values for colour, type, spacing, radius, elevation, borders, opacity, motion, breakpoints, and z-index.

### Dependencies

- Foundation governance and principles.
- Design system documentation standards.
- Existing foundation token documents where available.
- Product tone and visual direction when it affects token decisions.

### Estimated Build Order

1. Colours
2. Typography
3. Spacing
4. Radius
5. Elevation
6. Borders
7. Opacity
8. Motion Tokens
9. Breakpoints
10. Z-index

### Deliverables

| Deliverable | Required output |
| --- | --- |
| Colours | Palette, semantic colour roles, state colours, contrast rules, and usage restrictions. |
| Typography | Type scale, font weights, line heights, heading/body roles, responsive text rules, and content constraints. |
| Spacing | Spacing scale, layout rhythm, component spacing rules, and responsive spacing rules. |
| Radius | Radius scale, usage rules, prohibited radius patterns, and component mapping guidance. |
| Elevation | Elevation scale, shadow usage, layering purpose, and state-specific guidance. |
| Borders | Border widths, border colours, divider rules, focus border expectations, and usage restrictions. |
| Opacity | Allowed opacity values, disabled-state rules, overlay rules, and contrast restrictions. |
| Motion Tokens | Duration, easing, transition roles, reduced-motion rules, and prohibited motion. |
| Breakpoints | Desktop, tablet, mobile breakpoint definitions and responsive validation expectations. |
| Z-index | Layer scale, stacking contexts, overlay rules, and conflict resolution guidance. |

### Acceptance Criteria

- Every token category has a documented purpose, allowed values, usage rules, and validation rules.
- Token names are stable enough for implementation.
- Tokens cover default, interactive, disabled, error, and focus needs where relevant.
- Colour and opacity rules meet accessibility contrast expectations.
- Motion tokens define reduced-motion behaviour.
- Breakpoints support desktop, tablet, and mobile documentation.
- Z-index rules prevent arbitrary local stacking values.

### Exit Criteria

- Foundation token documents are complete enough to guide layout and component work.
- No downstream phase requires an undocumented token category to begin.
- Token gaps are either resolved or recorded as explicit blockers.
- Phase 1 deliverables are ready to be referenced by layout and component specifications.

### Validation

- Validate token names against implementation naming rules before use.
- Check colour and opacity combinations for contrast.
- Check typography values for readability and responsive fit.
- Check motion tokens against reduced-motion requirements.
- Check breakpoints against responsive preview requirements.
- Check z-index values for predictable overlay ordering.

## Phase 2: Layout

### Purpose

Build the layout primitives that structure PlayBooky pages, sections, surfaces, navigation areas, and responsive composition.

This phase creates the reusable layout language needed before core components and product components are placed into real interfaces.

### Dependencies

- Phase 1 foundation tokens.
- Breakpoint rules.
- Spacing, radius, elevation, border, and z-index guidance.
- Design Portal information architecture where layout appears inside the portal.

### Estimated Build Order

1. Page
2. Container
3. Stack
4. Grid
5. Surface
6. Section
7. Sidebar

### Deliverables

| Deliverable | Required output |
| --- | --- |
| Page | Page shell rules, page width, vertical rhythm, responsive behaviour, and landmark expectations. |
| Container | Max-widths, gutters, alignment, nesting rules, and responsive constraints. |
| Stack | Vertical and horizontal spacing rules, gap options, alignment, and wrapping behaviour. |
| Grid | Column rules, responsive changes, minimum item sizing, and gap behaviour. |
| Surface | Background, border, elevation, radius, and content containment rules. |
| Section | Section spacing, headings, content grouping, and page relationship rules. |
| Sidebar | Sidebar placement, width, collapse behaviour, navigation relationship, and accessibility rules. |

### Acceptance Criteria

- Layout primitives use only documented foundation tokens.
- Desktop, tablet, and mobile behaviour is documented for every layout primitive.
- Layout primitives define constraints that prevent text overlap, unexpected clipping, and unstable composition.
- Page and sidebar primitives include semantic landmark expectations.
- Surface rules define when elevation, border, radius, and background may be used.
- Layout primitives can support all planned core component previews.

### Exit Criteria

- Layout primitives are documented and implementation-ready.
- Core component pages can reference layout rules without inventing local layout behaviour.
- Responsive preview requirements can be satisfied using documented layout primitives.
- Any layout primitive not ready for use is marked with a blocker and excluded from dependent work.

### Validation

- Validate layout primitives at desktop, tablet, and mobile breakpoints.
- Validate that layout primitives use documented spacing, radius, border, elevation, and z-index tokens.
- Validate that content remains readable and does not overlap at minimum supported widths.
- Validate that layout primitives do not create nested card structures where prohibited.
- Validate semantic landmark guidance for page-level layout.

## Phase 3: Core Components

### Purpose

Build the reusable UI components that form the everyday interaction layer of the PlayBooky Design System.

Core components must be generic enough to support multiple product contexts while remaining tightly governed by documented variants, states, accessibility rules, and data contracts.

### Dependencies

- Phase 1 foundation tokens.
- Phase 2 layout primitives.
- Component page template.
- AI quality gate.
- Accessibility and keyboard behaviour requirements.

### Estimated Build Order

1. Buttons
2. Inputs
3. Cards
4. Navigation
5. Modal
6. Tooltip
7. Dropdown

### Deliverables

| Deliverable | Required output |
| --- | --- |
| Buttons | Button variants, sizes, icons, loading, disabled, focus, and usage rules. |
| Inputs | Text input, textarea, select-like input needs, labels, help text, validation, error, and disabled states. |
| Cards | Base card anatomy, clickable and static card rules, media/content slots, and density rules. |
| Navigation | Primary, secondary, breadcrumb, tab, and in-page navigation rules as needed. |
| Modal | Dialog anatomy, focus management, dismiss behaviour, stacking, and accessibility rules. |
| Tooltip | Trigger rules, placement, delay, keyboard access, mobile alternatives, and content limits. |
| Dropdown | Trigger, menu, option, selection, keyboard navigation, positioning, and dismissal behaviour. |

### Acceptance Criteria

- Every core component has a component page using the standard page template.
- Variants, states, responsive behaviour, motion, anatomy, props/data contract, usage rules, accessibility, and code examples are documented.
- Interactive components define keyboard and focus behaviour.
- Components use only documented foundation tokens and layout primitives.
- Components include realistic PlayBooky examples.
- Components are safe to reuse in product components.

### Exit Criteria

- Core component documentation is complete enough for implementation without guessing.
- Core components required by Phase 4 product components are `Approved` or `Current`.
- Accessibility blockers are resolved or documented as blockers.
- Component APIs are stable enough to support product component composition.

### Validation

- Validate every component against the component page quality gate.
- Validate all interactive states: default, hover, focus, active, disabled, loading, error, selected, expanded, and collapsed where applicable.
- Validate desktop, tablet, and mobile previews.
- Validate keyboard navigation and screen reader expectations.
- Validate examples against the documented props/data contract.

## Phase 4: Product Components

### Purpose

Build PlayBooky-specific composed components that express product concepts while reusing approved core components, layout primitives, and foundation tokens.

Product components must not become a separate ungoverned UI library. They are governed components with product-specific anatomy, content, data contracts, and usage rules.

### Dependencies

- Phase 1 foundation tokens.
- Phase 2 layout primitives.
- Phase 3 core components.
- Product vision and product vocabulary.
- Related pattern documents where available.

### Estimated Build Order

1. Recommendation Card
2. Diagnosis Card
3. Builder Card
4. Workshop Card

### Deliverables

| Deliverable | Required output |
| --- | --- |
| Recommendation Card | Recommendation summary, rationale, status, action, evidence, and usage rules. |
| Diagnosis Card | Diagnosis title, signal, explanation, severity, action, and validation behaviour. |
| Builder Card | Builder item summary, configuration state, progress, action, and dependency indicators. |
| Workshop Card | Workshop title, audience, format, duration, facilitator notes, and action rules. |

### Acceptance Criteria

- Every product component has purpose, user need, and success criteria.
- Every product component uses documented core components and layout primitives.
- Product-specific data contracts are documented.
- Content rules define required labels, empty states, truncation, and fallback behaviour.
- Responsive behaviour is documented for desktop, tablet, and mobile.
- Product components include decision history and used-in expectations.

### Exit Criteria

- Product components are ready to support Phase 5 patterns.
- Product component APIs are stable enough for flow-level composition.
- Product-specific language and data requirements are documented.
- No product component relies on an undocumented core component, token, or layout primitive.

### Validation

- Validate product components against the standard component page template.
- Validate data contracts against realistic PlayBooky content.
- Validate composition against approved core component usage rules.
- Validate responsive behaviour at all required breakpoints.
- Validate accessibility for interactive card behaviour and nested actions.

## Phase 5: Patterns

### Purpose

Build reusable product and interaction patterns that combine foundations, layouts, core components, and product components into coherent flows.

Patterns define how PlayBooky experiences behave across multi-step or multi-component contexts.

### Dependencies

- Phase 1 foundation tokens.
- Phase 2 layout primitives.
- Phase 3 core components.
- Phase 4 product components.
- Product vision and product roadmap context.

### Estimated Build Order

1. Recommendation Flow
2. Diagnosis Flow
3. Builder
4. Facilitator Guide
5. Export

### Deliverables

| Deliverable | Required output |
| --- | --- |
| Recommendation Flow | Entry points, recommendation selection, evidence display, action flow, and completion states. |
| Diagnosis Flow | Input signals, diagnosis output, severity handling, recommended action, and review states. |
| Builder | Build steps, configuration, validation, progress, save states, and completion behaviour. |
| Facilitator Guide | Guide structure, session flow, prompts, timing, notes, and handoff behaviour. |
| Export | Export triggers, formats, preview, progress, errors, success states, and file naming rules. |

### Acceptance Criteria

- Every pattern defines purpose, user need, success criteria, entry points, exit points, and failure states.
- Patterns reference the components and product components they require.
- Patterns define responsive behaviour across desktop, tablet, and mobile.
- Patterns define loading, empty, error, success, and recovery behaviour.
- Patterns define accessibility expectations across the full interaction flow.
- Patterns do not introduce undocumented components or local visual rules.

### Exit Criteria

- Patterns are complete enough for product screen planning.
- Pattern dependencies are documented and approved.
- Pattern-specific blockers are resolved or recorded.
- Patterns can be represented in the Design Portal with examples and decision history.

### Validation

- Validate pattern flows against documented components and product components.
- Validate start, middle, completion, error, and recovery states.
- Validate keyboard and screen reader continuity across the flow.
- Validate mobile and tablet behaviour as explicit flow states.
- Validate that pattern guidance does not conflict with product vision or design system governance.

## Phase 6: Portal

### Purpose

Build the Design Portal capabilities that make the PlayBooky Design System navigable, searchable, reviewable, and maintainable.

The portal must become the live implementation layer for approved and current design system decisions.

### Dependencies

- Phase 1 foundation tokens.
- Phase 2 layout primitives.
- Phase 3 core components.
- Phase 4 product components.
- Phase 5 patterns.
- Design Portal information architecture.
- Design Portal navigation rules.
- Component page template.

### Estimated Build Order

1. Portal Navigation
2. Search
3. Filters
4. Component Viewer
5. Responsive Preview
6. Decision History

### Deliverables

| Deliverable | Required output |
| --- | --- |
| Portal Navigation | Primary navigation, section navigation, active states, breadcrumbs, and mobile behaviour. |
| Search | Search input, indexing rules, result presentation, empty results, and ranking expectations. |
| Filters | Status, category, confidence, type, and dependency filters where useful. |
| Component Viewer | Preview area, anatomy, props, variants, states, code, accessibility, and usage guidance. |
| Responsive Preview | Desktop, tablet, and mobile preview controls with stable viewport rules. |
| Decision History | Rejected, Improved, Approved, and Current decision views with dates, owners, and reasons. |

### Acceptance Criteria

- Portal navigation exposes every documentation area and component category.
- Search can find documents, components, patterns, tokens, and product components.
- Filters support review workflows without hiding required governance information.
- Component viewer presents all required component page sections.
- Responsive preview supports desktop, tablet, and mobile views.
- Decision history supports the canonical decision tabs: Rejected, Improved, Approved, and Current.
- Portal pages reflect approved and current documentation without becoming a separate source of undocumented rules.

### Exit Criteria

- The Design Portal can serve as the live implementation layer for approved and current design system decisions.
- Component and pattern pages can be reviewed inside the portal without relying on hidden context.
- Portal capabilities support human review and AI-assisted implementation.
- Documentation and portal content have a clear synchronization process.

### Validation

- Validate navigation against the documented information architecture.
- Validate search and filters with representative token, component, pattern, and product component content.
- Validate component viewer completeness against the component page template.
- Validate responsive preview at desktop, tablet, and mobile sizes.
- Validate decision history against required lifecycle statuses.
- Validate that portal pages do not contradict documentation.

## Cross-Phase Validation

Before any phase is marked complete:

- Required documents must exist.
- Required deliverables must be documented.
- Dependencies must be complete or explicitly blocked.
- Acceptance criteria must be testable.
- Exit criteria must be satisfied.
- Accessibility expectations must be documented.
- Responsive behaviour must be documented where applicable.
- AI behaviour must be clear enough to prevent guessing.

Before a later phase begins:

- Earlier phase blockers that affect the later phase must be resolved.
- Any exception must be recorded with owner, date, reason, and impact.
- The later phase must not invent missing tokens, layout rules, components, or patterns.

## Roadmap Status Tracking

Each roadmap item should eventually carry:

- Status.
- Confidence.
- Owner.
- Last updated date.
- Dependencies.
- Current blocker, if any.
- Link to source-of-truth documentation.
- Link to Design Portal page when implemented.
- Link to implementation when built.

Recommended tracking statuses:

- Not started.
- In specification.
- In design review.
- In implementation.
- In QA.
- Approved.
- Current.
- Blocked.
- Deprecated.

## AI Behaviour

AI agents using this roadmap must:

- Start with the earliest incomplete dependency before implementing a requested item.
- Read the relevant foundation, layout, component, pattern, and portal documents before changing implementation.
- Treat this roadmap as sequencing guidance, not permission to skip required specifications.
- Flag requests that try to build a later phase before required earlier phase dependencies exist.
- Create or update documentation before implementation when required specifications are missing.
- Avoid introducing new roadmap phases or deliverables unless explicitly requested or documented as a proposed change.
- Preserve the distinction between the design system build roadmap and the product roadmap.

## Acceptance Criteria For This Roadmap

This roadmap is complete when:

- It defines all six requested design system build phases.
- Each phase includes purpose, dependencies, acceptance criteria, exit criteria, validation, estimated build order, and deliverables.
- It clearly distinguishes design system build sequencing from product roadmap sequencing.
- It can guide humans and AI agents through implementation order without relying on private context.
- It does not modify the product roadmap or any existing documentation.
