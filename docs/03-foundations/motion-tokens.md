# Motion Tokens

| Field | Value |
| --- | --- |
| Status | Current |
| Confidence | 4 Usability ready |
| Version | 1.0.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

Motion tokens define how PlayBooky interfaces move, respond, and transition.

The motion system exists to make interaction feedback clear without making the interface feel busy. Motion must support comprehension, preserve performance, and respect reduced-motion preferences.

## Motion Philosophy

PlayBooky motion is quiet, purposeful, and fast.

Motion should:

- Confirm that an interaction happened.
- Clarify where a temporary surface came from or where it went.
- Help users understand state changes.
- Support loading and progress when waiting cannot be avoided.
- Preserve spatial continuity during layout changes.

Motion must not:

- Delay task completion.
- Hide important content.
- Become the only way a state change is communicated.
- Create decorative movement unrelated to user intent.
- Run continuously unless it represents real progress or system activity.
- Ignore reduced-motion preferences.

## Duration Tokens

Use duration tokens instead of arbitrary timing values.

| Token | Duration | Use |
| --- | --- | --- |
| `motion.duration.instant` | `0ms` | Reduced motion, immediate state changes, no-animation fallbacks. |
| `motion.duration.fast` | `100ms` | Small state feedback such as hover, press, and simple opacity changes. |
| `motion.duration.base` | `160ms` | Standard component transitions such as menu open, control reveal, and state swaps. |
| `motion.duration.moderate` | `240ms` | Larger surface transitions such as dropdowns, popovers, side panels, and preview changes. |
| `motion.duration.slow` | `320ms` | Modals, drawers, major layout transitions, and movement that needs spatial clarity. |
| `motion.duration.progress` | Variable | Progress indicators where duration is controlled by actual task progress. |

Rules:

- Prefer `motion.duration.fast` or `motion.duration.base` for common component feedback.
- Use `motion.duration.slow` only when the surface is large enough to need spatial clarity.
- Do not use fixed decorative delays.
- Do not exceed `320ms` for interface transitions without explicit approval.
- Use `motion.duration.instant` when reduced motion requires the transition to be removed.

## Easing Tokens

Use easing tokens to make motion consistent.

| Token | Curve | Use |
| --- | --- | --- |
| `motion.easing.linear` | `linear` | Progress movement, skeleton shimmer when allowed, and non-spatial continuous motion. |
| `motion.easing.standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default UI transitions. |
| `motion.easing.enter` | `cubic-bezier(0, 0, 0.2, 1)` | Surfaces or content entering the view. |
| `motion.easing.exit` | `cubic-bezier(0.4, 0, 1, 1)` | Surfaces or content leaving the view. |
| `motion.easing.emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | Larger layout or overlay transitions that need clarity. |

Rules:

- Use `motion.easing.standard` unless a more specific token applies.
- Use `motion.easing.enter` for appearance transitions.
- Use `motion.easing.exit` for dismissal transitions.
- Use `motion.easing.linear` only when constant speed is meaningful.
- Do not create bounce, elastic, or spring curves without a documented component need.

## Token Usage

Motion must be defined by pairing duration, easing, and animated properties.

Required format for component motion documentation:

```md
| Trigger | Properties | Duration | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| Open dropdown | opacity, transform | motion.duration.base | motion.easing.enter | Show instantly with no transform. |
```

Recommended property rules:

- Prefer `opacity` and `transform`.
- Avoid animating layout-heavy properties such as width, height, top, left, margin, and padding.
- Do not animate colour alone to communicate state.
- Do not animate text size during normal interaction.
- Keep transform distances small and purposeful.

Common usage:

| Interaction | Duration | Easing | Properties |
| --- | --- | --- | --- |
| Hover or press feedback | `motion.duration.fast` | `motion.easing.standard` | opacity, transform, background token change |
| Dropdown open | `motion.duration.base` | `motion.easing.enter` | opacity, transform |
| Dropdown close | `motion.duration.fast` | `motion.easing.exit` | opacity, transform |
| Modal open | `motion.duration.moderate` | `motion.easing.enter` | opacity, transform |
| Modal close | `motion.duration.fast` | `motion.easing.exit` | opacity, transform |
| Responsive preview change | `motion.duration.moderate` | `motion.easing.standard` | transform, opacity |
| Loading indicator | `motion.duration.progress` | `motion.easing.linear` | progress position or rotation |

## Reduced Motion

PlayBooky must respect reduced-motion preferences.

Rules:

- If the user prefers reduced motion, remove non-essential movement.
- Essential state changes may still occur, but they should happen instantly or with a simple opacity change.
- Do not use parallax, large movement, auto-scrolling, or continuous decorative motion when reduced motion is active.
- Loading indicators must remain understandable without continuous motion.
- Motion must not be required to understand navigation, validation, or completion.

Reduced-motion replacements:

| Original motion | Reduced-motion behaviour |
| --- | --- |
| Slide or scale entrance | Instant appearance or short opacity fade. |
| Layout movement | Immediate layout change. |
| Continuous shimmer | Static loading state or progress text. |
| Animated success state | Static success state with text or icon. |
| Scroll-linked movement | Disabled. |

## Performance Rules

Motion must preserve interface responsiveness.

Rules:

- Prefer compositor-friendly properties: `opacity` and `transform`.
- Avoid animating expensive layout or paint properties.
- Do not run unnecessary motion on hidden elements.
- Do not use long-running animation loops unless they communicate real activity.
- Keep motion independent from data fetching where possible.
- Avoid motion that causes cumulative layout shift.
- Test motion on mobile-sized viewports.
- Ensure animation does not block user input.

Performance validation:

- Check that transitions do not cause visible jank.
- Check that interaction remains responsive while motion runs.
- Check that animations stop when components unmount or become hidden.
- Check that reduced-motion mode removes unnecessary animation work.

## Usage Rules

- Use motion only when it clarifies interaction or state.
- Document motion for every interactive component with non-instant transitions.
- Use approved duration and easing tokens.
- Keep motion consistent for repeated component roles.
- Pair motion with visible state, text, icon, or structure when communicating meaning.
- Do not add decorative entrance animations to ordinary page sections.
- Do not make approval dependent on motion polish before accessibility and usability requirements are met.

## Validation Rules

Motion work must be validated by checking:

- Duration and easing use documented tokens.
- Motion has a clear trigger and purpose.
- Reduced-motion behaviour is documented.
- Animated properties are performance-safe.
- Motion does not hide focus, validation, or content changes.
- Motion does not create text overlap or layout instability.
- Motion still works at desktop, tablet, and mobile sizes.

## AI Behaviour

AI agents must:

- Use documented duration and easing tokens.
- Avoid adding motion when no motion behaviour is specified.
- Include reduced-motion behaviour when documenting or implementing motion.
- Flag custom timing values as undocumented unless they are approved tokens.
- Prefer no motion over guessed decorative motion.
- Validate performance and accessibility before treating motion as production ready.

## Acceptance Criteria

This motion system is ready when:

- Duration tokens are documented.
- Easing tokens are documented.
- Motion philosophy is clear.
- Reduced-motion rules are explicit.
- Performance rules are testable.
- Token usage examples are documented.
- Humans and AI agents can specify motion without inventing local timing or easing values.
