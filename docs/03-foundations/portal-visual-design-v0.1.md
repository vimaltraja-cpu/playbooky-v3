# Portal Visual Design

| Field | Value |
| --- | --- |
| Status | Exploring |
| Confidence | 3 Visually directional |
| Version | 0.1.0 |
| Owner | Design System |
| Last updated | 2026-07-07 |

## Purpose

This document defines the visual language of the PlayBooky Design Portal.

Where **Design Portal UX Architecture** defines behaviour, this document defines appearance.

It governs the visual design of the portal itself—not the product being documented.

---

# Design Philosophy

The Design Portal should feel like a premium internal product.

It should communicate:

- Calmness
- Precision
- Trust
- Craft
- Maturity

The interface should feel closer to Linear, Apple Human Interface Guidelines, and modern developer tooling than a marketing website.

The portal should never compete with the design being inspected.

The inspected content is always the hero.

---

# Visual Principles

The portal should be:

- Quiet
- Spacious
- Highly legible
- Predictable
- Low distraction
- Content-first

Avoid:

- Decorative gradients
- Heavy shadows
- Bright accent colours
- Excessive glass effects
- Animation that competes with inspected content

---

# Colour Usage

The portal inherits the Design System colour tokens.

Guidelines:

- Neutral surfaces dominate.
- Brand colours are reserved for emphasis.
- Status colours communicate governance.
- Preview surfaces remain visually separate from portal chrome.

---

# Typography

Use Geist throughout the portal UI.

Use Newsreader only for editorial documentation pages when introducing major sections.

Never use Newsreader inside:

- Navigation
- Tables
- Inspectors
- Search
- Code viewers
- Property panels

---

# Portal Layout

The portal consists of five persistent regions:

1. Global Header
2. Navigation Sidebar
3. Main Documentation Area
4. Inspection Panel
5. Utility Footer

The documentation area should always remain visually dominant.

---

# Header

Contains:

- Portal logo
- Search
- Current section
- User controls

Height should remain consistent across all pages.

---

# Sidebar

The sidebar is the primary navigation surface.

Rules:

- Fixed on desktop.
- Collapsible.
- Current page clearly highlighted.
- Section hierarchy always visible.
- Search available.

---

# Documentation Area

The documentation column should maximise readability.

Recommended content width:

- Reading pages: 720–840px
- Specification pages: 960px
- Interactive pages: fluid

Long-form documentation should avoid excessive line length.

---

# Inspection Panels

Inspection tools should appear visually secondary.

Examples:

- Accessibility
- Code
- Motion
- Responsive Preview
- Tokens
- Related Components

Panels should remain visually lightweight.

---

# Preview Surfaces

Component previews should appear inside clearly defined canvases.

Preview surfaces should:

- Use subtle borders.
- Use minimal elevation.
- Never imitate browser chrome.
- Support Desktop, Tablet and Mobile switching.

---

# Cards

Portal cards should use:

- Small radius
- Soft elevation
- Clear headings
- Compact metadata

Cards exist to organise information—not decorate it.

---

# Tables

Tables should prioritise scanning.

Requirements:

- Comfortable row height
- Clear zebra or divider rhythm
- Sticky headers where appropriate
- Consistent alignment

---

# Status Presentation

Lifecycle status should always appear before confidence.

Order:

Status

Confidence

Version

Owner

Last Updated

Status should never rely on colour alone.

---

# Icons

Use the PlayBooky icon system.

Icons support:

- Navigation
- Status
- Inspection
- Documentation

Icons should remain secondary to text.

---

# Motion

Portal motion should remain subtle.

Recommended:

- Fade
- Small translate
- Opacity
- Soft expand

Avoid:

- Bounce
- Spring-heavy movement
- Decorative transitions

---

# Empty States

Empty states should:

- Explain why nothing is shown.
- Suggest the next action.
- Use PlayBooky illustration language sparingly.

---

# Visual Density

The portal should optimise for long working sessions.

Use:

- Comfortable spacing
- Predictable rhythm
- Moderate information density

Avoid:

- Oversized marketing layouts
- Excessive whitespace
- Crowded dashboards

---

# Accessibility

Portal visual design must support:

- WCAG compliant contrast
- Visible focus
- Keyboard navigation
- Responsive layouts
- Reduced motion

---

# Acceptance Criteria

The Portal Visual Design is complete when:

- Every portal page shares a consistent visual language.
- Navigation and inspection tools feel cohesive.
- Documentation remains the primary visual focus.
- Component previews remain visually separate from portal chrome.
- The portal feels premium without distracting from the system being documented.

## Related Documents

- Design Portal UX Architecture
- Token Portal Experience
- Colour
- Typography
- Elevation
- Motion
- Spacing
