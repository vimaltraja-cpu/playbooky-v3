# Framework Library

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
`data/canonical/framework-library.csv`

Future database table:
`frameworks`

Sync rule:
The CSV is the source of truth until Supabase is introduced. Product documentation explains how the system works; the CSV contains the actual product knowledge.

---

# Purpose

The Framework Library contains the strategic thinking models used by PlayBooky to shape workshop design.

Frameworks provide the underlying approach to solving a challenge. They describe *how* a workshop should think rather than *what* activities should be included.

The Framework Library is a reusable knowledge base consumed by the Decision Engine during recommendation generation.

---

# Responsibilities

The Framework Library is responsible for:

- Defining strategic workshop approaches.
- Providing reusable facilitation frameworks.
- Supporting consistent recommendation logic.
- Acting as a shared knowledge source across multiple workshop types.
- Remaining independent from individual activities.

Frameworks are not workshops.

Frameworks provide the structure that workshops are built upon.

---

# Inputs

Consumes:

- Decision Engine recommendations

Reference Sources:

- Framework Library CSV
- Product knowledge
- Facilitation methodology

---

# Outputs

Produces:

- Framework metadata
- Framework objectives
- Framework relationships
- Framework constraints

Consumed by:

- Workshop Types
- Activity Library

---

# Design Principles

The Framework Library follows these principles.

- Frameworks remain reusable.
- Frameworks describe thinking, not execution.
- Multiple workshop types may use the same framework.
- Frameworks should be independent of activities.
- Frameworks should evolve without affecting existing workshop definitions.

---

# Relationship to the Product System

Consumes:

- Decision Engine

Produces:

- Framework metadata

Consumed by:

- Workshop Types
- Activity Library

The Framework Library provides the strategic foundation upon which workshops are assembled.

---

# Future Evolution

Future versions may include:

- Organisation-specific frameworks.
- Industry-specific frameworks.
- AI-generated framework variations.
- Framework effectiveness analytics.
- Framework versioning.
- Continuous framework optimisation.

The Framework Library should remain the canonical source of strategic workshop knowledge.
