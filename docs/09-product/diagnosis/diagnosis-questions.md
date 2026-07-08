# Diagnosis Questions

| Field | Value |
| --- | --- |
| Status | In Specification |
| Confidence | 1 Foundation |
| Version | 0.1.0 |
| Owner | Product |
| Last updated | 2026-07-08 |

---

# Purpose

The Diagnosis Questions define the information required for PlayBooky to understand a user's challenge.

Rather than collecting arbitrary information, the questions are designed to capture the minimum structured input needed for the Diagnosis Engine to accurately interpret the problem and generate meaningful recommendations.

The quality of the recommendation is directly influenced by the quality of the diagnosis.

---

# Responsibilities

The Diagnosis Questions are responsible for:

- Capturing the user's challenge.
- Collecting structured workshop requirements.
- Reducing ambiguity.
- Gathering enough information for confident recommendation.
- Preparing structured input for the Diagnosis Engine.

The Diagnosis Questions do not generate recommendations.

They only collect information.

---

# Inputs

Consumes:

- User challenge.
- User responses.

Input methods:

- Guided questionnaire.
- Future conversational AI.

---

# Outputs

Produces:

- Structured diagnosis responses.

Consumed by:

- Diagnosis Engine.

---

# Question Categories

The diagnosis is organised into five core areas.

- Goals
- Challenges
- Context
- Participants
- Outcomes

Each category contributes a different perspective on the workshop challenge.

Together they create a complete diagnostic profile.

---

# Design Principles

The Diagnosis Questions follow these principles.

- Ask only what is necessary.
- Progress from broad understanding to specific detail.
- Reduce cognitive load.
- Questions should remain understandable.
- Questions should produce structured outputs.
- Every question should improve recommendation quality.

---

# Relationship to the Product System

Consumes:

- User challenge.

Produces:

- Structured responses.

Consumed by:

- Diagnosis Engine.

The Diagnosis Questions are the entry point into the PlayBooky Product System.

---

# Future Evolution

Future versions may support:

- Conversational diagnosis.
- Adaptive questioning.
- AI-generated follow-up questions.
- Organisation-specific diagnosis.
- Context-aware recommendations.

The Diagnosis Questions should remain the primary method of understanding workshop challenges before recommendation.