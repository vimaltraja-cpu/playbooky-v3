# Workshop Builder

| Field | Value |
| --- | --- |
| Status | In Specification |
| Confidence | 1 Foundation |
| Version | 0.1.0 |
| Owner | Product |
| Last updated | 2026-07-08 |

---

# Purpose

The Workshop Builder is responsible for transforming recommended activities into a complete, facilitator-ready workshop.

It provides the environment where facilitators can review, customise and refine the workshop before delivery.

Rather than creating workshops from scratch, the Workshop Builder assembles reusable activities into a coherent workshop experience.

---

# Responsibilities

The Workshop Builder is responsible for:

- Assembling workshop activities.
- Sequencing activities into a logical flow.
- Managing workshop timings.
- Supporting workshop customisation.
- Preserving recommendation integrity while allowing facilitator control.
- Producing a complete workshop definition.

The Workshop Builder does not determine recommendations.

Recommendations are provided by the Decision Engine.

---

# Inputs

Consumes:

- Decision Engine recommendations.
- Activity Library.
- Prompt Library.
- Workshop Types.

Reference Sources:

- Workshop configuration.
- Activity metadata.
- Prompt metadata.

---

# Outputs

Produces:

- Workshop definition.
- Activity sequence.
- Workshop timing.
- Workshop configuration.

Consumed by:

- Facilitator Guide.
- PlayBooky Live.

---

# Builder Principles

The Workshop Builder follows these principles.

- Workshops begin with AI recommendations.
- Facilitators remain in complete control.
- Activities remain modular.
- Workshop sequencing should be flexible.
- Workshop changes should remain traceable.
- Editing should never compromise workshop integrity.

---

# Relationship to the Product System

Consumes:

- Decision Engine.
- Activity Library.
- Prompt Library.

Produces:

- Workshop.

Consumed by:

- Facilitator Guide.
- PlayBooky Live.

The Workshop Builder transforms recommendation into a facilitation-ready workshop.

---

# Future Evolution

Future versions may support:

- Collaborative workshop editing.
- AI-assisted workshop refinement.
- Version history.
- Workshop templates.
- Workshop comparison.
- Workshop analytics.
- Real-time collaboration.

The Workshop Builder should remain the canonical environment for workshop assembly.