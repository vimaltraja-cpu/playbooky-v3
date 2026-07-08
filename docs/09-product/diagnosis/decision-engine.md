# Decision Engine

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
`data/canonical/decision-engine.csv`

Future database table:
`decision_rules`

Sync rule:
The CSV is the source of truth until Supabase is introduced. Product documentation explains how the system works; the CSV contains the actual product knowledge.

---

# Purpose

The Decision Engine is the intelligence layer of PlayBooky.

Its responsibility is to evaluate structured diagnostic signals and determine the most appropriate workshop design.

Rather than selecting a predefined workshop template, the Decision Engine assembles a recommendation by combining frameworks, workshop structures and facilitation activities.

It represents the reasoning layer between understanding a challenge and designing the right workshop.

---

# Responsibilities

The Decision Engine is responsible for:

- Evaluating diagnostic signals.
- Matching challenges to workshop frameworks.
- Selecting appropriate workshop types.
- Choosing the most relevant activities.
- Producing explainable recommendations.
- Balancing multiple competing signals.
- Building the foundation for workshop generation.

The Decision Engine never renders user interfaces or creates workshop content directly.

Its output is structured decision data consumed by downstream systems.

---

# Inputs

Consumes:

- Diagnostic signals
- Challenge profile
- Confidence scores

Reference Libraries:

- Framework Library
- Workshop Types
- Activity Library
- Prompt Library

---

# Decision Process

The Decision Engine evaluates the challenge using a series of structured reasoning steps.

1. Interpret diagnostic signals.
2. Determine the dominant workshop objective.
3. Select appropriate frameworks.
4. Identify suitable workshop structures.
5. Recommend facilitation activities.
6. Validate recommendation consistency.
7. Produce a complete recommendation package.

Each recommendation should remain transparent and explainable.

---

# Outputs

Produces:

- Recommended framework
- Recommended workshop type
- Recommended activities
- Workshop configuration
- Recommendation confidence

Consumed by:

- Workshop Builder

---

# Design Principles

The Decision Engine follows these principles.

- Diagnose before deciding.
- Every recommendation should be explainable.
- Recommendations should be evidence-based.
- Multiple valid solutions may exist.
- Activities remain independent reusable building blocks.
- Workshop quality is more important than recommendation speed.
- Human facilitators always retain control.

---

# Relationship to the Product System

Consumes:

- Diagnosis Engine

Produces:

- Workshop recommendations

Consumed by:

- Framework Library
- Workshop Types
- Activity Library
- Workshop Builder

The Decision Engine is the bridge between diagnosis and workshop creation.

---

# Future Evolution

Future versions may support:

- Organisation-specific recommendation models.
- Learning from completed workshops.
- Team preference modelling.
- Recommendation optimisation.
- AI reasoning transparency.
- Continuous recommendation improvement.
- Multi-objective optimisation.

The Decision Engine should evolve without changing its responsibility within the product architecture.

---

# Success Criteria

The Decision Engine succeeds when:

- Similar challenges produce consistent recommendations.
- Recommendations are understandable.
- Facilitators trust the reasoning.
- Workshops require minimal manual adjustment.
- Different recommendation paths remain traceable and explainable.

Success is measured by recommendation quality rather than recommendation quantity.
