# Elevation

| Field        | Value             |
| ------------ | ----------------- |
| Status       | Current           |
| Confidence   | 4 Usability ready |
| Version      | 1.1.0             |
| Owner        | Design System     |
| Last updated | 2026-07-07        |

## Purpose

Elevation defines how PlayBooky interfaces communicate depth, separation, hierarchy, temporary focus, and fixed product surfaces.

The elevation system exists so components do not invent local shadows, blur effects, glass effects, or layering rules. Every raised surface must have a clear purpose and must support readability, accessibility, and predictable composition.

## Philosophy

PlayBooky elevation should feel calm, soft, premium, and functional.

Elevation is used to:

* Separate interactive or temporary surfaces from their background.
* Clarify which surface is active or closest to the user.
* Support scanning in dense interfaces.
* Reinforce overlay hierarchy for menus, popovers, modals, and portal previews.
* Support fixed AI composer surfaces on mobile and desktop.
* Create gentle separation without making the interface feel card-heavy.

Elevation must not be used to:

* Make flat content feel decorative.
* Create a card-heavy page when layout or spacing would provide enough structure.
* Compensate for weak visual hierarchy.
* Add depth without a documented component, layout, or interaction purpose.
* Make PlayBooky feel heavy, noisy, or overly dashboard-like.

## Elevation Scale

The elevation scale uses semantic tokens instead of arbitrary shadow values.

| Token                   | Use                                               | Shadow strategy                                         | Typical surfaces                                                           |
| ----------------------- | ------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `elevation.none`        | No elevation.                                     | No shadow.                                              | Page backgrounds, flat sections, inline content.                           |
| `elevation.ambient`     | Soft atmospheric separation.                      | Very soft broad shadow or subtle background separation. | Homepage hero surfaces, soft illustration containers, quiet layout groups. |
| `elevation.raised`      | Low separation from surrounding content.          | Soft, close shadow with low opacity.                    | Quiet cards, surface groups, inactive panels.                              |
| `elevation.interactive` | Interactive affordance or active hover elevation. | Slightly stronger close shadow.                         | Clickable cards, selectable panels, active tiles.                          |
| `elevation.composer`    | Fixed AI composer surface.                        | Soft but confident shadow with clear page separation.   | Bottom composer, prompt input dock, mobile fixed input surface.            |
| `elevation.floating`    | Detached temporary UI.                            | Medium shadow with broader spread.                      | Dropdowns, tooltips, popovers, floating controls.                          |
| `elevation.overlay`     | Blocking or high-priority overlay.                | Stronger shadow with clear background separation.       | Modals, drawers, command surfaces.                                         |
| `elevation.portal`      | Design Portal preview and inspection surfaces.    | Stable medium shadow designed for review context.       | Component viewer, responsive preview frame, decision panels.               |

Implementation values must be defined in code tokens before production use. Until implementation values exist, documents and mockups must reference the semantic token names above.

## Shadow Strategy

Shadows must be quiet and legible.

Rules:

* Use semantic elevation tokens only.
* Prefer one shadow token per surface.
* Use the lowest elevation that communicates the required relationship.
* Shadows should feel soft, diffused, and premium.
* Do not stack multiple custom shadows on a single surface unless the token explicitly defines layered shadow values.
* Do not use coloured shadows unless a future approved token explicitly allows them.
* Do not use heavy drop shadows on dense product surfaces.
* Do not use shadow as the only way to communicate state.
* Keep shadows consistent across light and dark surfaces if dark mode is introduced.

State rules:

* Default static surfaces should use `elevation.none`, `elevation.ambient`, or `elevation.raised`.
* Hover elevation may move from `elevation.raised` to `elevation.interactive` only when the component is clickable.
* Focus state must use an accessible focus indicator, not elevation alone.
* Disabled elements must not gain elevation on hover or focus.
* Loading surfaces should not pulse shadow unless motion rules explicitly allow it.
* Fixed composer surfaces should not jump elevation between idle, focused, and typing states unless a component specification defines that behaviour.

## Composer Elevation

The AI composer is a primary PlayBooky product surface.

It may appear fixed to the bottom of the viewport on mobile and desktop. It requires stronger separation than a normal card because it remains present while the page content moves behind or above it.

Rules:

* Use `elevation.composer` for fixed composer surfaces.
* The composer must feel attached to the product experience, not like a modal.
* The composer must remain readable above illustrated, textured, or content-rich backgrounds.
* The composer may use a soft shadow, subtle border, or solid surface treatment to maintain separation.
* The composer must not rely on glass blur alone.
* The composer must not obscure critical content without safe spacing or bottom padding.
* Mobile layouts must account for keyboard, safe area, and bottom viewport spacing.
* Composer elevation should stay visually calmer than modal or drawer elevation.

Use `elevation.composer` for:

* AI prompt composer.
* Fixed bottom input dock.
* Mobile prompt surface.
* Persistent creation input.

Do not use `elevation.composer` for:

* Ordinary cards.
* Static form fields.
* Small search inputs.
* Modal dialogs.
* Floating menus.

## Layering

Layering defines visual depth and interaction priority. Elevation and z-index are related but not the same.

Rules:

* Elevation communicates visual depth.
* Z-index controls stacking order.
* A surface with stronger elevation should usually have a higher z-index, but z-index must follow the documented z-index scale when available.
* Temporary surfaces must appear above persistent page surfaces.
* Blocking surfaces must visually and programmatically prevent interaction with covered content.
* Nested raised surfaces should be avoided unless the relationship is essential.
* Fixed composer surfaces must sit above scrolling content but below blocking overlays.
* Floating menus triggered from the composer may sit above the composer.

Layer priority:

| Priority | Layer type                  | Expected elevation                                    |
| -------- | --------------------------- | ----------------------------------------------------- |
| 1        | Page background             | `elevation.none`                                      |
| 2        | Ambient visual surface      | `elevation.ambient`                                   |
| 3        | Section or static surface   | `elevation.none` or `elevation.raised`                |
| 4        | Interactive content surface | `elevation.interactive` when active or hovered        |
| 5        | Fixed composer surface      | `elevation.composer`                                  |
| 6        | Floating surface            | `elevation.floating`                                  |
| 7        | Blocking overlay            | `elevation.overlay`                                   |
| 8        | Portal inspection surface   | `elevation.portal` when used inside the Design Portal |

## Glass Effects

Glass effects are transparent or blurred surfaces that show content behind them.

PlayBooky may use glass effects only when they improve orientation, softness, or context. They are not a default styling pattern.

Allowed uses:

* Portal preview chrome where background context helps explain the preview boundary.
* Temporary overlays where the background must remain recognisable but de-emphasised.
* Navigation surfaces only when text contrast and readability remain reliable.
* Composer surfaces only when paired with a reliable solid or semi-solid surface fallback.

Rules:

* Glass effects must include a solid or semi-solid fallback.
* Text on glass must meet contrast requirements against all expected backgrounds.
* Background blur must not be required to understand content.
* Do not place dense text, form fields, or critical instructions on heavily transparent glass.
* Do not use glass effects on disabled or error states.
* Do not combine glass effects with strong shadows unless a component specification explicitly allows it.
* Glass should feel calm and premium, not frosted for decoration.
* If readability becomes uncertain, remove the glass effect before increasing shadow intensity.

## Mobile Elevation

Mobile elevation must be especially restrained because the viewport is small and fixed surfaces can quickly dominate the experience.

Rules:

* Use fewer raised surfaces on mobile.
* Avoid nested cards on mobile.
* Use spacing, grouping, and surface colour before adding elevation.
* Fixed composer surfaces must include safe-area spacing.
* Bottom fixed surfaces must not obscure primary actions or content.
* Floating menus must avoid clipping against viewport edges.
* Modals and drawers must clearly separate from page content.
* Shadows must not create muddy edges on small screens.

## Portal Examples

Design Portal examples should make elevation visible without turning elevation into decoration.

Required examples:

* A flat page section using `elevation.none`.
* A soft atmospheric surface using `elevation.ambient`.
* A static documentation surface using `elevation.raised`.
* A clickable component example using `elevation.interactive`.
* A fixed AI composer using `elevation.composer`.
* A dropdown or popover using `elevation.floating`.
* A modal or blocking example using `elevation.overlay`.
* A component viewer or responsive preview frame using `elevation.portal`.

Example validation:

* Each example must label the elevation token used.
* Each example must explain why elevation is needed.
* Examples must include enough surrounding content to show separation.
* Examples must not rely on shadow alone to indicate interactivity.
* Composer examples must show both desktop and mobile treatment.

## Usage Rules

* Use the lowest elevation that communicates the required relationship.
* Use spacing, typography, colour, and layout before adding elevation.
* Use elevation consistently for the same component role.
* Do not use elevation to create unrelated visual emphasis.
* Do not put UI cards inside other cards unless a component specification explicitly allows it.
* Do not use a raised surface for every section on a page.
* Document any new elevation need before creating a token.
* Use `elevation.composer` only for persistent AI input surfaces.
* Use `elevation.ambient` only for soft visual separation, not actionable hierarchy.

## Validation Rules

Elevation work must be validated by checking:

* The selected token matches the surface purpose.
* The surface remains readable against its background.
* Interactive states are not communicated by elevation alone.
* Overlays appear above the correct content.
* Focus indicators remain visible.
* Disabled states do not appear raised or actionable.
* Glass effects meet contrast and fallback requirements.
* Composer surfaces do not obscure content.
* Mobile fixed surfaces respect viewport and safe-area constraints.
* Portal examples match the documented token names.

## AI Behaviour

AI agents must:

* Use documented elevation tokens instead of inventing shadow values.
* Prefer no elevation unless the component or layout purpose requires depth.
* Use `elevation.composer` for fixed AI composer surfaces.
* Use `elevation.ambient` for soft atmospheric separation only when needed.
* Flag custom shadows as undocumented unless they map to an approved token.
* Avoid adding glass effects unless the relevant component, portal page, or layout specification requires them.
* Validate that elevation does not conflict with accessibility, z-index, or responsive layout rules.
* Avoid making PlayBooky feel card-heavy or over-shadowed.

AI agents must not:

* Invent local shadow values.
* Add strong shadows for decoration.
* Use elevation as the only signal for interaction, focus, error, or selection.
* Use glass effects when contrast cannot be guaranteed.
* Place blocking overlays below composer or floating surfaces.
* Treat the composer as a normal card.

## Acceptance Criteria

This elevation system is ready when:

* The elevation philosophy is clear.
* The semantic elevation scale is documented.
* Ambient and composer elevation are defined.
* Shadow strategy and state rules are defined.
* Layering rules separate visual depth from stacking order.
* Composer layering is defined for fixed AI input surfaces.
* Mobile elevation rules are documented.
* Glass effects are restricted and validated.
* Portal examples identify required elevation demonstrations.
* Humans and AI agents can apply elevation without inventing local shadows.
