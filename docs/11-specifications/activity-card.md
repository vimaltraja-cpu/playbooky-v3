# Activity Card

| Field | Value |
| --- | --- |
| Status | Approved |
| Component | Activity Card |
| Owner | Design System |
| Version | 1.0.0 |

---

# Design Intent

The Activity Card is the primary visual representation of a workshop activity within PlayBooky.

It should feel premium, calm and illustration-led.

The illustration is the hero of the composition.

The card is designed to create curiosity, not expose every piece of workshop information.

Detailed information belongs elsewhere.

The goal of this component is to faithfully reproduce the approved Figma design.

Do not redesign or reinterpret the component.

---

# Purpose

Display a workshop activity consistently across:

- Activity Library
- Workshop Builder

Future:

- Recommendation
- PlayBooky Live

---

# Variants

## Builder

Includes the drag handle.

## Library

Identical to Builder.

Remove only the drag handle.

No other visual changes are permitted.

---

# Layout

## Card

Width

256px

Height

370px

Padding

6px

Gap

2px

Position

relative

Background

#FCFBFA

Border Radius

16px

Shadow

0px 4px 8px -2px rgba(0,0,0,0.10)

0px 2px 4px -2px rgba(0,0,0,0.06)

---

# Anatomy

The component contains exactly two vertical sections.

1.

Illustration

244 × 230

2.

Content

244 × 125

Nothing else.

---

# Illustration

Width

244px

Height

230px

The illustration fills the available width.

Do not introduce additional padding.

Do not reduce the illustration size.

Do not create placeholders if artwork exists.

Artwork is loaded from:

public/assets/activities/

Use the exact filenames.

Examples

Problem Framing.png

Pain Point Identification.png

Roadmap Sequencing.png

Commitment Check.png

Priority Mapping.png

Reflection & Learning.png

Do not invent naming conventions.

---

# Content

Height

125px

Width

244px

Bottom padding

8px

Gap

4px

---

# Title

Source

Activity Name

Typography

Newsreader

22px

600

24px line-height

Colour

#324236

Left padding

12px

Rule

Always display as two lines.

Never one.

Never three.

---

# Description

Source

Purpose

Typography

Geist

10px

400

16px line-height

Colour

#1F3E29

Maximum height

32px

Left padding

12px

---

# Metadata

Display only:

Duration

|

Workshop Type

Typography

Geist

10px

300

Gold Gradient

No chips.

No buttons.

No icons.

No additional metadata.

---

# Drag Handle

Builder only.

Position

Absolute

Top

6px

Left

112px

Width

32px

Height

24px

Background

#FCFBFA

Radius

8px

Contains two grip lines.

---

# Data Mapping

Activity Name

↓

Title

Purpose

↓

Description

Duration

↓

Duration

Stage or Layout Type

↓

Workshop Type

---

# Hidden Fields

Do not display:

Best Used When

Instructions

Facilitator Notes

Inputs Required

Outputs Produced

Remote Friendly

---

# Asset Mapping

Artwork location

public/assets/activities/

Use exact filenames.

Do not generate slug folders.

Do not rename assets.

---

# Grid

Card

256 × 370

Gap

22px

Wrapping layout

Use real activities only.

---

# Acceptance Criteria

- Matches approved Figma layout.
- Card size is exactly 256 × 370.
- Illustration area is exactly 244 × 230.
- Illustration uses the correct PNG.
- No placeholder if artwork exists.
- Content area is exactly 244 × 125.
- Title always renders as two lines.
- Metadata displays only Duration and Workshop Type.
- Builder variant shows drag handle.
- Library variant removes only the drag handle.
- No chips.
- No buttons.
- No additional metadata.
- No redesign.