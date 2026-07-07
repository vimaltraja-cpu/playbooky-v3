# Radius

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.1.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

This document defines the architecture for PlayBooky radius tokens.

Radius tokens control corner shape across surfaces, controls, cards, inputs, overlays, and product-specific interface elements.

This document does not define final radius values.

## Philosophy

Radius is part of PlayBooky's shape language.

Corner radius should help communicate containment, affordance, hierarchy, and surface type. It must not be adjusted locally to make individual elements feel softer, sharper, friendlier, or more premium without a governed system reason.

Radius decisions must support:

- Consistent component shape.
- Clear distinction between controls, surfaces, and overlays.
- Predictable nesting.
- Accessible focus and border treatments.
- Durable visual identity across desktop, tablet, and mobile.

All product-facing radius usage must come from approved radius tokens or component contracts.

## Primitive Radius Scale

Primitive radius tokens define raw corner radius steps.

Primitive radius tokens must use this naming shape:

```text
radius.primitive.{scale}
```

The primitive scale must support:

- `0` for square corners.
- Small radius for compact controls or subtle surfaces.
- Standard radius for common controls and surfaces.
- Larger radius for prominent surfaces or overlays.
- Fully rounded treatment only when the shape language approves it.

Example naming shape only:

```text
radius.primitive.0
radius.primitive.1
radius.primitive.2
radius.primitive.3
radius.primitive.4
radius.primitive.full
```

These names do not approve final radius values.

Primitive radius rules:

- Primitive radius tokens must not encode raw values in their names.
- Primitive radius tokens must not be used directly by product pages.
- Primitive radius tokens must feed semantic radius tokens.
- New primitive radius steps require token governance review.
- Radius primitives must not be created for one component only unless a reusable system need is approved first.

## Semantic Radius

Semantic radius tokens give purpose to primitive radius.

Semantic radius tokens must use this naming shape:

```text
radius.{semantic-family}.{role}.{state-or-scale}
```

Approved semantic radius families:

- `surface`
- `container`
- `card`
- `control`
- `input`
- `modal`
- `popover`
- `media`
- `badge`

Example naming shape only:

```text
radius.surface.default
radius.container.default
radius.card.default
radius.control.default
radius.input.default
radius.modal.default
radius.popover.default
radius.media.default
radius.badge.default
```

These names do not approve final radius values.

Semantic radius rules:

- Semantic radius tokens must map to approved primitive radius tokens or approved token aliases.
- Semantic radius tokens must document purpose and allowed use.
- Semantic radius tokens must not duplicate another semantic token with a different name.
- Component tokens may reference semantic radius tokens.
- Product pages must not consume primitive radius tokens directly.

## Component Usage

Component radius must be defined by component contracts.

Rules:

- Every component with visible corners must document radius usage.
- Component radius must reference semantic radius tokens or component tokens that map to semantic radius tokens.
- Component variants must document radius changes.
- Component states must document radius changes when shape changes.
- Product pages must not override component radius.
- Component nesting must avoid doubled or conflicting corner shapes.

## Interactive Elements

Interactive elements use radius to communicate affordance and touchability.

Interactive element rules:

- Buttons, segmented controls, tabs, menu items, selects, and clickable cards must use approved control or component radius tokens.
- Focus treatments must remain visible at the approved radius.
- Hover, active, selected, disabled, and loading states must not change radius unless the component contract explicitly defines the shape change.
- Hit areas must not become unclear because visual radius differs from interaction bounds.
- Fully rounded interactive elements require an approved semantic role.

## Cards

Cards use radius to communicate grouped content and selectable surfaces.

Card rules:

- Cards must use approved card radius tokens.
- Card radius must coordinate with border, elevation, surface, and spacing tokens.
- Nested cards must not create visual clutter through repeated corner shapes.
- Clickable cards must document whether radius belongs to the card surface, inner media, or both.
- Product pages must not tune card radius locally.

## Inputs

Inputs use radius to communicate editable fields and form controls.

Input rules:

- Text inputs, selects, textareas, checkable controls, and form containers must use approved input or control radius tokens.
- Input radius must preserve visible focus, error, disabled, and validation states.
- Error states must not rely on radius changes alone.
- Dense form layouts must not reduce input radius locally.
- Product-specific forms must use approved form components before product use.

## Modals

Modals use radius to communicate elevated, temporary surfaces.

Modal rules:

- Dialogs, sheets, popovers, and overlays must use approved modal, popover, or surface radius tokens.
- Modal radius must coordinate with elevation, border, surface, and spacing tokens.
- Desktop, tablet, and mobile modal shapes must be documented.
- Full-screen mobile modal or sheet treatments must document whether radius is removed, preserved, or applied only to specific corners.
- Product pages must not define modal radius locally.

## Usage Rules

Radius usage must follow the governed token system.

Rules:

- No random radii.
- No hardcoded product radius.
- No component may define new radius values locally.
- New radius needs must be added to the foundation system before product use.
- Use primitive radius only when defining semantic radius.
- Use semantic radius when defining component, layout, pattern, or product radius contracts.
- Do not encode raw radius values in token names.
- Do not create one-off radius tokens for visual preference.
- Do not change radius across responsive breakpoints unless the behaviour is documented.
- Do not use radius to compensate for unclear spacing, border, or elevation decisions.

## AI Behaviour

AI contributors must treat radius as a governed foundation token category.

AI must:

- Read this radius document before making radius decisions.
- Use approved radius tokens or component contracts.
- Determine whether the need is primitive, semantic, component, layout, pattern, or product radius.
- Preserve documented desktop, tablet, and mobile radius behaviour.
- Flag missing radius tokens instead of inventing values.
- Propose new radius tokens through the foundation approval workflow.
- Report conflicts between radius documentation, portal pages, and code.

AI must not:

- Invent arbitrary radius values.
- Use raw radius values in product pages.
- Create component-local radius scales.
- Treat visual screenshots or prototypes as approved radius sources.
- Use primitive radius tokens directly in product pages.
- Adjust radius locally for aesthetic preference.

## Acceptance Criteria

This radius system is accepted when:

- Radius philosophy is defined.
- Primitive radius scale architecture is defined without final values.
- Semantic radius families are defined.
- Component usage rules are documented.
- Interactive element, card, input, and modal rules are documented.
- Usage rules prevent random radii.
- AI behaviour rules prevent arbitrary radius decisions.
