# Workshop Types

| Field | Value |
| --- | --- |
| Status | In Specification |
| Confidence | 1 Foundation |
| Version | 0.1.0 |
| Owner | Product |
| Last updated | 2026-07-08 |

---

## Canonical Source

CSV:
`data/canonical/workshop-types.csv`

Future database table:
`workshop_types`

Sync rule:
The CSV is the source of truth until Supabase is introduced. Product documentation explains how the system works; the CSV contains the actual product knowledge.

---

# Purpose

The Workshop Types Library defines the structural blueprint of a workshop.

While Frameworks describe the strategic approach to solving a challenge, Workshop Types describe how that strategy is delivered as a facilitation experience.

Workshop Types determine the overall shape, pacing and composition of a workshop before individual activities are selected.

---

# Responsibilities

The Workshop Types Library is responsible for:

- Defining reusable workshop structures.
- Establishing workshop flow.
- Defining expected workshop outputs.
- Providing constraints for activity selection.
- Supporting consistent workshop generation.

Workshop Types are independent of specific activities and can be reused across multiple frameworks.

---

# Inputs

Consumes:

- Decision Engine recommendations.
- Framework Library metadata.

Reference Sources:

- Workshop Types CSV.
- Product knowledge.

---

# Outputs

Produces:

- Workshop structure.
- Workshop phases.
- Activity requirements.
- Timing guidance.
- Expected outcomes.

Consumed by:

- Activity Library.
- Workshop Builder.

---

# Design Principles

The Workshop Types Library follows these principles.

- Workshop Types describe structure rather than content.
- Workshop Types should remain reusable.
- Multiple frameworks may share the same Workshop Type.
- Workshop Types should scale across different durations and team sizes.
- Workshop structure should remain independent from individual activities.

---

# Relationship to the Product System

Consumes:

- Framework Library.

Produces:

- Workshop structure.

Consumed by:

- Activity Library.
- Workshop Builder.

The Workshop Types Library bridges strategic thinking and workshop execution.

---

# Future Evolution

Future versions may support:

- Organisation-specific workshop templates.
- Dynamic workshop structures.
- AI-generated workshop sequencing.
- Workshop optimisation.
- Workshop effectiveness analytics.

The Workshop Types Library should remain the canonical source of workshop structure.
