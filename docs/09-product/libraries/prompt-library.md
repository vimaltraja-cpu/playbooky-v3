# Prompt Library

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
`data/canonical/prompt-library.csv`

Future database table:
`prompts`

Sync rule:
The CSV is the source of truth until Supabase is introduced. Product documentation explains how the system works; the CSV contains the actual product knowledge.

---

# Purpose

The Prompt Library contains the reusable AI instructions that enable PlayBooky to reason, recommend and generate workshop content.

Rather than containing workshop knowledge itself, the Prompt Library defines how Artificial Intelligence should use the knowledge contained within the Product System.

It is the communication layer between PlayBooky's structured data and its AI capabilities.

---

# Responsibilities

The Prompt Library is responsible for:

- Providing reusable prompt templates.
- Standardising AI behaviour.
- Ensuring consistent recommendation quality.
- Supporting workshop generation.
- Supporting facilitator guidance.
- Supporting future AI capabilities.

The Prompt Library never replaces structured product data.

It consumes structured product knowledge and transforms it into AI instructions.

---

# Inputs

Consumes:

- Framework Library
- Workshop Types
- Activity Library
- Decision Engine outputs

Reference Sources:

- Prompt Library CSV
- Product knowledge
- AI prompt definitions

---

# Outputs

Produces:

- Recommendation prompts
- Workshop generation prompts
- Facilitation prompts
- Content generation prompts

Consumed by:

- Workshop Builder
- Facilitator Guide
- PlayBooky Live
- Future AI services

---

# Prompt Categories

The Prompt Library is organised into reusable categories.

Typical categories include:

- Diagnosis
- Recommendation
- Workshop Generation
- Activity Guidance
- Facilitation
- Reflection
- Continuous Improvement

Each prompt category has a clearly defined purpose and should remain independent from user interface implementation.

---

# Design Principles

The Prompt Library follows these principles.

- Prompts should be reusable.
- Prompts should remain modular.
- Prompts should consume structured data.
- Prompt behaviour should be deterministic where possible.
- Prompt wording should remain independent from product logic.
- Structured product data is always the source of truth.

---

# Relationship to the Product System

Consumes:

- Framework Library
- Workshop Types
- Activity Library

Produces:

- AI instructions

Consumed by:

- Workshop Builder
- Facilitator Guide
- PlayBooky Live

The Prompt Library enables PlayBooky's intelligence layer to transform structured workshop knowledge into meaningful AI interactions.

---

# Future Evolution

Future versions may support:

- Dynamic prompt composition.
- Multi-model prompting.
- Organisation-specific prompts.
- Prompt versioning.
- Prompt analytics.
- Continuous prompt optimisation.
- AI orchestration.

The Prompt Library should remain the canonical source of AI behaviour across the PlayBooky platform.
