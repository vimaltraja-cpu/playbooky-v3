# Design Portal Information Architecture

## Purpose

This document defines the full information architecture for the PlayBooky V3 Design Portal.

The Design Portal is the single source of truth for PlayBooky V3. It must help humans and AI agents understand the system, inspect live decisions, trace rules back to documentation, and connect approved design decisions to implementation code.

The portal must work as both:

- A practical design system for building PlayBooky.
- A case-study-quality artefact that shows the quality, coherence, and reasoning behind the product system.

The portal is not a marketing site, a loose gallery, or a separate playground. It is the operational home for PlayBooky V3 foundations, layout, components, product components, patterns, motion, assets, AI rules, and product decisions.

## Scope

This information architecture applies to:

- The `/design-system` route and all child routes.
- All Design Portal navigation.
- All portal page types.
- All portal-to-documentation links.
- All portal-to-code links.
- Component pages.
- Pattern pages.
- Foundation token pages.
- Layout pages.
- Motion pages.
- Asset pages.
- AI rule pages.
- Product decision pages.

This document does not build product screens. Product screens must not be introduced as part of portal IA work.

## Navigation Model

The Design Portal uses a persistent section-based navigation model.

Primary navigation is organized by top-level portal sections. Each top-level section maps to a major source-of-truth area and should mirror the `docs/` hierarchy where practical.

The portal navigation must support:

- Fast scanning by humans.
- Predictable traversal by AI agents.
- Deep links to every source-of-truth page.
- Status-aware browsing.
- Responsive behaviour on desktop, tablet, and mobile.

Navigation must not hide core system areas behind informal labels. Section labels should be stable, literal, and aligned with documentation folder names.

## Top-Level Sections

The Design Portal top-level sections are:

1. Foundation
2. Design System
3. Foundations
4. Layout
5. Components
6. Product Components
7. Patterns
8. Motion
9. Assets
10. AI
11. Product

### Foundation

Foundation contains the governing rules for PlayBooky V3.

Pages include:

- Constitution.
- Principles.
- AI behaviour.

This section maps to `docs/01-foundation/`.

### Design System

Design System contains the operating model for the Design Portal itself.

Pages include:

- Information architecture.
- Page template.
- Navigation.
- Documentation standards.

This section maps to `docs/02-design-system/`.

### Foundations

Foundations contains the base design token categories and visual rules.

Each foundation token category gets its own page.

Pages include:

- Colours.
- Typography.
- Spacing.
- Radius.
- Elevation.
- Motion tokens.
- Breakpoints.

This section maps to `docs/03-foundations/` and the future token implementation in `lib/tokens/`.

### Layout

Layout contains reusable layout primitives and composition rules.

Pages include:

- Page.
- Stack.
- Grid.
- Container.
- Section.
- Surface.

This section maps to `docs/04-layout/` and future layout components in `components/layout/`.

### Components

Components contains foundational UI components.

Each component gets its own page.

Component pages should be grouped by category where useful, including:

- UI.
- Navigation.
- Forms.
- Feedback.

This section maps to `docs/05-components/` and future shared components in `components/ui/`.

### Product Components

Product Components contains PlayBooky-specific components that are reusable across product surfaces.

Each product component gets its own page.

Product Components must not become product screens. They are reusable system parts with documented purpose, user need, success criteria, variants, states, responsive behaviour, accessibility, props, code examples, and decision history.

This section maps to `docs/05-components/product/` and future product components in `components/product/`.

### Patterns

Patterns contains reusable workflows and multi-component behaviours.

Each pattern gets its own page.

Pages include:

- Recommendation.
- Diagnosis.
- Builder.
- Facilitator guide.

This section maps to `docs/06-patterns/`.

### Motion

Motion contains motion rules, examples, and system behaviour that goes beyond individual token definitions.

Pages may include:

- Motion principles.
- Transition patterns.
- Loading behaviour.
- Interaction feedback.
- Reduced-motion rules.

Motion token definitions remain in Foundations. Motion behaviour guidance lives in the Motion section.

### Assets

Assets contains governed visual and brand assets.

Pages include:

- Icons.
- Illustrations.
- Logos.

This section maps to `docs/07-assets/` and future assets in `assets/`.

### AI

AI contains build, review, and quality rules for AI-assisted work.

Pages include:

- Build rules.
- Review process.
- Quality gate.

This section maps to `docs/08-ai/`.

### Product

Product contains high-level product direction and approved product decisions.

Pages include:

- Vision.
- Roadmap.

Product pages in the Design Portal are decision records and strategy references. They are not product screens.

This section maps to `docs/09-product/`.

## Page Hierarchy

The portal hierarchy must follow this model:

```text
/design-system
  /foundation
    /constitution
    /principles
    /ai-behaviour
  /design-system
    /information-architecture
    /page-template
    /navigation
    /documentation-standards
  /foundations
    /colours
    /typography
    /spacing
    /radius
    /elevation
    /motion-tokens
    /breakpoints
  /layout
    /page
    /stack
    /grid
    /container
    /section
    /surface
  /components
    /ui
      /[component]
    /navigation
      /[component]
    /forms
      /[component]
    /feedback
      /[component]
  /product-components
    /[component]
  /patterns
    /recommendation
    /diagnosis
    /builder
    /facilitator-guide
  /motion
    /[motion-rule]
  /assets
    /icons
    /illustrations
    /logos
  /ai
    /build-rules
    /review-process
    /quality-gate
  /product
    /vision
    /roadmap
```

Each leaf page is a source-of-truth page.

Index pages may summarize a section, but they must not replace the detailed leaf pages.

## URL Structure

URLs must be lowercase and kebab-case.

Routes must use stable, descriptive names that match documentation filenames where practical.

Examples:

- `/design-system/foundation/constitution`
- `/design-system/design-system/information-architecture`
- `/design-system/foundations/colours`
- `/design-system/layout/grid`
- `/design-system/components/ui/button`
- `/design-system/product-components/playbook-card`
- `/design-system/patterns/recommendation`
- `/design-system/assets/icons`
- `/design-system/ai/quality-gate`
- `/design-system/product/vision`

URLs should not include lifecycle status, version labels, dates, or implementation details unless the page itself is specifically a version or decision-history record.

## Left Sidebar Behaviour

On desktop, the Design Portal uses a persistent left sidebar.

The sidebar must show:

- Top-level sections.
- Expanded children for the current section.
- Current page state.
- Component or page status where useful.
- Search entry point.

The sidebar should support scanning without overwhelming the user. Large sections may use nested groups, collapsible subsections, or status filters, but source-of-truth pages must remain findable.

Behaviour rules:

- The active top-level section must be visually clear.
- The active page must be visually clear.
- The sidebar must preserve navigation context while moving between related pages.
- Collapsed sections must not hide the current active page.
- Component categories should be grouped consistently with docs and code structure.

## Search Behaviour

Search must help humans and AI agents find source-of-truth pages quickly.

Search should index:

- Page titles.
- Section names.
- Component names.
- Pattern names.
- Status tags.
- Confidence ratings.
- Props.
- Variants.
- States.
- Related docs.
- Related code paths.
- Used-in references.
- Decision history entries where practical.

Search results should display:

- Page title.
- Section.
- Status.
- Confidence rating where relevant.
- Short description.
- Matching reason.

Search must prefer source-of-truth pages over incidental examples.

Search must not create an alternate navigation model. It is a fast access layer over the same IA.

## Status Filtering

The portal must support status-aware browsing for components, product components, and patterns.

Supported lifecycle statuses:

- Exploring.
- Improved.
- Current.
- Approved.
- Rejected.
- Deprecated.

Status filtering should allow users to:

- View only product-eligible items.
- Find Exploring or Improved work.
- Identify Rejected items.
- Identify Deprecated items.
- Understand archived historical records when deprecated items are removed from active navigation.

Product-eligible filters must include only Current and Approved components unless a page explicitly explains a different rule.

Status filters must not change the underlying source-of-truth status. They only change what is displayed.

## Breadcrumbs

Every leaf page must include breadcrumbs.

Breadcrumbs must show the page's location in the portal hierarchy.

Examples:

- Design Portal / Foundations / Colours
- Design Portal / Components / UI / Button
- Design Portal / Patterns / Recommendation
- Design Portal / AI / Quality Gate

Breadcrumbs must use the same labels as the sidebar and URL hierarchy.

Breadcrumbs are required on desktop, tablet, and mobile.

## Related Links

Portal pages must include related links when they help users understand dependencies and impact.

Related links may include:

- Supporting documentation.
- Related token pages.
- Related layout pages.
- Related components.
- Related patterns.
- Related product decisions.
- Used-in pages.
- Code implementation.
- Decision history.

Related links must be directional and purposeful. They should not become a generic list of nearby pages.

Examples:

- A Button component may link to typography, spacing, radius, focus rules, form patterns, and its code implementation.
- A Recommendation pattern may link to cards, feedback components, product decisions, and AI build rules.

## Mobile And Tablet Navigation

The portal must be responsive from the beginning.

On tablet:

- The sidebar may become narrower, collapsible, or drawer-based.
- Breadcrumbs must remain visible.
- Search must remain available.
- Section context must remain clear.

On mobile:

- Primary navigation may use a drawer, sheet, or top-level section switcher.
- Search must remain available.
- Breadcrumbs must remain available, with truncation if needed.
- Status tags must remain visible on source-of-truth pages.
- Page content must remain readable without horizontal scrolling.

Mobile navigation must not remove access to any portal section.

Responsive behaviour must be documented for major navigation components before those components are considered complete.

## Portal Pages And Docs

Portal pages and docs are connected but not identical.

Docs define detailed standards, rules, and rationale.

Portal pages present the source-of-truth experience for inspection, navigation, live examples, status, and implementation use.

Every portal page should link to its supporting documentation where relevant.

Every documentation page that governs portal behaviour should be linkable from the portal.

Mapping rules:

- Portal section pages map to matching `docs/` folders where practical.
- Portal leaf pages map to matching documentation files where practical.
- If a portal page has no matching doc yet, it must still state its purpose and source-of-truth status.
- If docs and portal content conflict, the constitution's hierarchy of trust applies.

## Portal Pages And Code

Portal pages must connect documented decisions to implementation code.

Component pages should link to:

- Component implementation.
- Props or type definitions.
- Examples.
- Tests when available.
- Token references where relevant.

Layout pages should link to:

- Layout component implementation.
- Utility functions or token definitions where relevant.

Token pages should link to:

- Token source files.
- Tailwind or CSS variables where relevant.

Asset pages should link to:

- Approved asset locations.
- Usage examples.

Code links must point to shared source-of-truth implementation, not local product overrides.

## Versions And Improvement States

The portal must show rejected, improved, approved, and current versions without creating confusion.

Version and improvement states mean:

- Rejected: a considered option that should not be used.
- Improved: a previous or draft version that was changed based on review.
- Current: the active version that reflects the present design direction.
- Approved: the stable version allowed for product use.

Rules:

- Current and Approved versions must be visually distinguished from rejected or superseded work.
- Rejected versions may be shown only as decision history or rationale, not as usable examples.
- Improved versions should explain what changed and why.
- Product pages may only use Current or Approved components.
- A component page should show the current implementation first.
- Historical versions must not appear as equal choices.

Decision history must record meaningful version changes.

## Rules For Adding New Pages

A new portal page may be added only when it has a clear source-of-truth purpose.

Before adding a page, define:

- Section.
- Page title.
- URL.
- Purpose.
- User need.
- Success criteria where relevant.
- Related docs.
- Related code if implementation exists.
- Status where relevant.
- Owner or decision source where known.

Rules:

- New component pages belong under Components or Product Components.
- New pattern pages belong under Patterns.
- New token category pages belong under Foundations.
- New layout primitive pages belong under Layout.
- New AI process pages belong under AI.
- Product decision pages belong under Product and must not become product screens.
- Page names must be lowercase and kebab-case in URLs and filenames.
- Every component, pattern, and token category must have its own page.
- Pages must not be added as dumping grounds for miscellaneous notes.

AI agents must not add pages that bypass this IA. If the IA does not have a place for a needed page, the agent must propose an IA update before creating the page.

## Acceptance Criteria

The Design Portal information architecture is valid when:

- The portal uses the defined top-level sections.
- Navigation mirrors the docs structure where practical.
- Every component has its own page.
- Every product component has its own page.
- Every pattern has its own page.
- Every foundation token category has its own page.
- URLs are lowercase, kebab-case, and stable.
- Desktop navigation includes a persistent left sidebar.
- Tablet and mobile navigation preserve access to every section.
- Search prioritizes source-of-truth pages.
- Status filtering supports lifecycle-aware browsing.
- Breadcrumbs exist on every leaf page.
- Related links connect pages to meaningful dependencies.
- Portal pages link to supporting docs where relevant.
- Portal pages link to source code where implementation exists.
- Rejected, improved, current, and approved versions are clearly distinguished.
- New pages follow the rules in this document.
- Product screens are not created as part of Design Portal IA work.
- The portal remains usable as both a working design system and a case-study-quality artefact.
