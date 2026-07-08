# Diagnosis Engine

| Field | Value |
| --- | --- |
| Status | In Specification |
| Confidence | 1 Foundation |
| Version | 0.1.0 |
| Owner | Product |
| Last updated | 2026-07-08 |

---

# Purpose

The Diagnosis Engine is responsible for interpreting a user's challenge.

Rather than recommending workshops directly, it transforms user responses into structured diagnostic signals that can be evaluated by the Decision Engine.

The Diagnosis Engine exists to understand the problem before attempting to solve it.

---

# Responsibilities

The Diagnosis Engine is responsible for:

- Interpreting user responses.
- Identifying patterns across answers.
- Producing structured diagnostic signals.
- Normalising different ways of describing the same challenge.
- Reducing ambiguity before recommendation.

The Diagnosis Engine does not recommend workshops, activities or frameworks.

Those responsibilities belong to the Decision Engine.

---

# Inputs

Consumes:

- User challenge
- Diagnosis responses

Input sources:

- Diagnosis Questions
- Future conversational AI interactions

---

# Processing

The Diagnosis Engine analyses responses to determine the underlying characteristics of the workshop challenge.

Examples include:

- Alignment
- Prioritisation
- Discovery
- Decision Making
- Problem Solving
- Strategy
- Innovation

Multiple signals may be identified from a single diagnosis.

Signals should be weighted rather than treated as absolute selections.

---

# Outputs

Produces:

- Diagnostic signals
- Confidence scores
- Challenge profile

Consumed by:

- Decision Engine

---

# Principles

The Diagnosis Engine follows the following principles.

- Understand before recommending.
- Multiple signals may coexist.
- Recommendations should be based on evidence rather than keywords.
- Confidence should increase as more information becomes available.
- Similar challenges should produce similar diagnostic outputs.

---

# Relationship to the Product System

Consumes:

- Diagnosis Questions

Produces:

- Diagnostic signals

Consumed by:

- Decision Engine

The Diagnosis Engine forms the bridge between user input and workshop intelligence.

---

# Future Evolution

Future versions of the Diagnosis Engine may support:

- Conversational diagnosis.
- Adaptive questioning.
- Organisation-specific language.
- Historical workshop context.
- AI confidence calibration.
- Continuous learning.

These enhancements should improve diagnostic quality without changing the role of the Diagnosis Engine within the overall product architecture.