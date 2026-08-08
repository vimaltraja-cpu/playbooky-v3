# Activity Card — Implementation Rules

| Field | Value |
| --- | --- |
| Status | Approved |
| Applies To | Activity Card |
| Purpose | Engineering Implementation Contract |

---

# Canonical Sources

The following sources must be used in order of priority.

1. Approved Figma component
2. Activity Card CSS
3. Activity Card specification
4. Canonical Activity Library CSV
5. Activity illustration assets

If there is any conflict, the Figma design always wins.

---

# Asset Rules

Activity illustrations are located at:

public/assets/activities/

Use the existing filenames exactly.

Examples:

- Problem Framing.png
- Pain Point Identification.png
- Roadmap Sequencing.png
- Commitment Check.png
- Priority Mapping.png
- Reflection & Learning.png

Do not:

- rename assets
- generate slug folders
- invent new file names
- create placeholder artwork when a matching illustration exists

If an illustration cannot be found, report the missing filename.

---

# Data Rules

Read activity information from the canonical Activity Library.

Use only:

Activity Name → Title

Purpose → Description

Duration → Duration

Stage or Layout Type → Workshop Type

Do not expose:

- Best Used When
- Inputs Required
- Outputs Produced
- Instructions
- Facilitator Notes
- Remote Friendly

These belong in future detail views, not on the Activity Card.

---

# Variant Rules

Builder

- Shows drag handle.

Library

- Removes only the drag handle.

No other visual differences are permitted.

---

# Implementation Rules

Do not redesign the component.

Do not optimise spacing.

Do not reinterpret the layout.

Do not introduce new UI.

Do not expose additional data.

Implement the supplied design exactly.

---

# Validation Checklist

Before implementation is considered complete:

□ Card dimensions are correct.

□ Illustration dimensions are correct.

□ Real illustration is displayed.

□ No placeholder artwork when an asset exists.

□ Typography matches the specification.

□ Metadata matches the specification.

□ Drag handle matches the specification.

□ Builder and Library variants behave correctly.

□ No additional UI has been introduced.

□ Layout visually matches the approved Figma.

If any item fails, the implementation is not complete.