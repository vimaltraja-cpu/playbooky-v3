# Elevation

| Field | Value |
| --- | --- |
| Status | Current |
| Confidence | 4 Usability ready |
| Version | 1.0.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

Elevation defines how PlayBooky interfaces communicate depth, separation, hierarchy, and temporary focus.

The elevation system exists so components do not invent local shadows, blur effects, glass effects, or layering rules. Every raised surface must have a clear purpose and must support readability, accessibility, and predictable composition.

## Philosophy

PlayBooky elevation should feel calm, deliberate, and functional.

Elevation is used to:

- Separate interactive or temporary surfaces from their background.
- Clarify which surface is active or closest to the user.
- Support scanning in dense interfaces.
- Reinforce overlay hierarchy for menus, popovers, modals, and portal previews.

Elevation must not be used to:

- Make flat content feel decorative.
- Create a card-heavy page when layout or spacing would provide enough structure.
- Compensate for weak visual hierarchy.
- Add depth without a documented component, layout, or interaction purpose.

## Elevation Scale

The elevation scale uses semantic tokens instead of arbitrary shadow values.

| Token | Use | Shadow strategy | Typical surfaces |
| --- | --- | --- | --- |
| `elevation.none` | No elevation. | No shadow. | Page backgrounds, flat sections, inline content. |
| `elevation.raised` | Low separation from surrounding content. | Soft, close shadow with low opacity. | Quiet cards, surface groups, inactive panels. |
| `elevation.interactive` | Interactive affordance or active hover elevation. | Slightly stronger close shadow. | Clickable cards, selectable panels, active tiles. |
| `elevation.floating` | Detached temporary UI. | Medium shadow with broader spread. | Dropdowns, tooltips, popovers, floating controls. |
| `elevation.overlay` | Blocking or high-priority overlay. | Stronger shadow with clear background separation. | Modals, drawers, command surfaces. |
| `elevation.portal` | Design Portal preview and inspection surfaces. | Stable medium shadow designed for review context. | Component viewer, responsive preview frame, decision panels. |

Implementation values must be defined in code tokens before production use. Until implementation values exist, documents and mockups must reference the semantic token names above.

## Shadow Strategy

Shadows must be quiet and legible.

Rules:

- Use semantic elevation tokens only.
- Prefer one shadow token per surface.
- Do not stack multiple custom shadows on a single surface unless the token explicitly defines layered shadow values.
- Do not use coloured shadows unless a future approved token explicitly allows them.
- Do not use heavy drop shadows on dense product surfaces.
- Do not use shadow as the only way to communicate state.
- Keep shadows consistent across light and dark surfaces if dark mode is introduced.

State rules:

- Default static surfaces should use `elevation.none` or `elevation.raised`.
- Hover elevation may move from `elevation.raised` to `elevation.interactive` only when the component is clickable.
- Focus state must use an accessible focus indicator, not elevation alone.
- Disabled elements must not gain elevation on hover or focus.
- Loading surfaces should not pulse shadow unless motion rules explicitly allow it.

## Layering

Layering defines visual depth and interaction priority. Elevation and z-index are related but not the same.

Rules:

- Elevation communicates visual depth.
- Z-index controls stacking order.
- A surface with stronger elevation should usually have a higher z-index, but z-index must follow the documented z-index scale when available.
- Temporary surfaces must appear above persistent page surfaces.
- Blocking surfaces must visually and programmatically prevent interaction with covered content.
- Nested raised surfaces should be avoided unless the relationship is essential.

Layer priority:

| Priority | Layer type | Expected elevation |
| --- | --- | --- |
| 1 | Page background | `elevation.none` |
| 2 | Section or static surface | `elevation.none` or `elevation.raised` |
| 3 | Interactive content surface | `elevation.interactive` when active or hovered |
| 4 | Floating surface | `elevation.floating` |
| 5 | Blocking overlay | `elevation.overlay` |
| 6 | Portal inspection surface | `elevation.portal` when used inside the Design Portal |

## Glass Effects

Glass effects are transparent or blurred surfaces that show content behind them.

PlayBooky may use glass effects only when they improve orientation or context. They are not a default styling pattern.

Allowed uses:

- Portal preview chrome where background context helps explain the preview boundary.
- Temporary overlays where the background must remain recognisable but de-emphasised.
- Navigation surfaces only when text contrast and readability remain reliable.

Rules:

- Glass effects must include a solid or semi-solid fallback.
- Text on glass must meet contrast requirements against all expected backgrounds.
- Background blur must not be required to understand content.
- Do not place dense text, form fields, or critical instructions on heavily transparent glass.
- Do not use glass effects on disabled or error states.
- Do not combine glass effects with strong shadows unless a component specification explicitly allows it.

## Portal Examples

Design Portal examples should make elevation visible without turning elevation into decoration.

Required examples:

- A flat page section using `elevation.none`.
- A static documentation surface using `elevation.raised`.
- A clickable component example using `elevation.interactive`.
- A dropdown or popover using `elevation.floating`.
- A modal or blocking example using `elevation.overlay`.
- A component viewer or responsive preview frame using `elevation.portal`.

Example validation:

- Each example must label the elevation token used.
- Each example must explain why elevation is needed.
- Examples must include enough surrounding content to show separation.
- Examples must not rely on shadow alone to indicate interactivity.

## Usage Rules

- Use the lowest elevation that communicates the required relationship.
- Use spacing, typography, and layout before adding elevation.
- Use elevation consistently for the same component role.
- Do not use elevation to create unrelated visual emphasis.
- Do not put UI cards inside other cards unless a component specification explicitly allows it.
- Do not use a raised surface for every section on a page.
- Document any new elevation need before creating a token.

## Validation Rules

Elevation work must be validated by checking:

- The selected token matches the surface purpose.
- The surface remains readable against its background.
- Interactive states are not communicated by elevation alone.
- Overlays appear above the correct content.
- Focus indicators remain visible.
- Disabled states do not appear raised or actionable.
- Glass effects meet contrast and fallback requirements.
- Portal examples match the documented token names.

## AI Behaviour

AI agents must:

- Use documented elevation tokens instead of inventing shadow values.
- Prefer no elevation unless the component or layout purpose requires depth.
- Flag custom shadows as undocumented unless they map to an approved token.
- Avoid adding glass effects unless the relevant component, portal page, or layout specification requires them.
- Validate that elevation does not conflict with accessibility, z-index, or responsive layout rules.

## Acceptance Criteria

This elevation system is ready when:

- The elevation philosophy is clear.
- The semantic elevation scale is documented.
- Shadow strategy and state rules are defined.
- Layering rules separate visual depth from stacking order.
- Glass effects are restricted and validated.
- Portal examples identify required elevation demonstrations.
- Humans and AI agents can apply elevation without inventing local shadows.
