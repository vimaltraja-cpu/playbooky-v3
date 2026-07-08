# Product Architecture

| Field | Value |
| --- | --- |
| Status | In Specification |
| Confidence | 1 Foundation |
| Version | 0.1.0 |
| Owner | Product |
| Last updated | 2026-07-08 |

---

# Purpose

This document defines the architecture of the PlayBooky product.

It explains how information flows through the platform, how recommendations are generated, and how each product system contributes to transforming a workshop challenge into a facilitation-ready experience.

This document is the canonical reference for designers, developers and AI agents working on PlayBooky.

It intentionally describes how the product thinks rather than how the interface looks.

---

# Product Philosophy

PlayBooky is not an activity library.

It is a workshop intelligence platform that transforms an organisational challenge into a structured, facilitator-ready workshop.

Rather than asking users to manually browse activities, frameworks or templates, PlayBooky diagnoses the challenge, reasons about the workshop design and assembles the most appropriate workshop automatically.

Every recommendation should be understandable.

Every activity should be reusable.

Every workshop should remain editable by the facilitator.

Artificial Intelligence should reduce facilitator effort without removing facilitator control.

---

# Product Architecture

```text
                           PLAYBOOKY

                     User Challenge
                           │
                           ▼
                 Diagnosis Questions
                           │
                           ▼
                  Diagnosis Engine
                           │
                           ▼
                   Decision Engine
                           │
            ┌──────────────┴──────────────┐
            │                             │
            ▼                             ▼
     Framework Library             Workshop Types
            │                             │
            └──────────────┬──────────────┘
                           ▼
                   Activity Library
                           │
                           ▼
                    Prompt Library
                           │
                           ▼
                   Workshop Builder
                           │
                           ▼
                  Facilitator Guide
                           │
                           ▼
                     PlayBooky Live
```

This architecture represents the complete product pipeline.

Each system is responsible for transforming information into a richer, more structured output for the next stage.

No stage should duplicate responsibility already owned elsewhere.

---

# Product Systems

## User Challenge

The starting point of every PlayBooky journey.

Represents the real organisational problem the user is trying to solve.

Produces:

- Challenge statement

Consumed by:

- Diagnosis Questions

---

## Diagnosis Questions

Collect structured information about the user's challenge through guided questioning.

Produces:

- User responses

Consumed by:

- Diagnosis Engine

---

## Diagnosis Engine

Transforms user responses into structured diagnostic signals.

Responsible for interpreting the challenge rather than recommending solutions.

Produces:

- Diagnostic signals

Consumed by:

- Decision Engine

---

## Decision Engine

Evaluates diagnostic signals against PlayBooky's recommendation logic.

Responsible for selecting the most appropriate workshop characteristics.

Produces:

- Framework recommendations
- Workshop type recommendations
- Activity candidates

Consumed by:

- Framework Library
- Workshop Types

---

## Framework Library

Provides structured workshop frameworks used during workshop generation.

Produces:

- Framework metadata

Consumed by:

- Activity Library

---

## Workshop Types

Defines the overall structure of a workshop.

Produces:

- Workshop structure

Consumed by:

- Activity Library

---

## Activity Library

Provides reusable facilitation activities.

Activities are independent building blocks which can be reused across multiple workshop types.

Produces:

- Activity sequence

Consumed by:

- Prompt Library
- Workshop Builder

---

## Prompt Library

Provides AI prompts and facilitator guidance required to support workshop delivery.

Produces:

- Structured facilitation content

Consumed by:

- Workshop Builder

---

## Workshop Builder

Combines activities, prompts and workshop structure into a complete workshop.

Produces:

- Workshop

Consumed by:

- Facilitator Guide

---

## Facilitator Guide

Transforms a workshop into a facilitator-ready experience.

Produces:

- Facilitator guide

Consumed by:

- PlayBooky Live

---

## PlayBooky Live

Supports the live delivery of the workshop.

Represents the operational experience used during facilitation.

Produces:

- Live workshop experience

---

# Information Flow

PlayBooky progressively enriches information throughout the product.

```text
Challenge

↓

Responses

↓

Diagnostic Signals

↓

Recommendations

↓

Framework

↓

Workshop Type

↓

Activities

↓

Facilitation Prompts

↓

Workshop

↓

Facilitator Guide

↓

PlayBooky Live
```

Every stage consumes the output of the previous stage while adding additional intelligence.

---

# Product Principles

The architecture is governed by the following principles.

- Diagnose before recommending.
- Recommendations should always be explainable.
- Activities are reusable building blocks.
- Workshops are generated rather than manually assembled.
- Every generated workshop remains editable.
- Artificial Intelligence supports facilitator expertise rather than replacing it.
- Product knowledge should exist in one canonical source.
- Every system owns a clearly defined responsibility.
- Data should flow forwards through the architecture without duplication.

---

# System Relationships

| System | Consumes | Produces |
| --- | --- | --- |
| Diagnosis Questions | User Challenge | User Responses |
| Diagnosis Engine | User Responses | Diagnostic Signals |
| Decision Engine | Diagnostic Signals | Recommendations |
| Framework Library | Decision Output | Framework Metadata |
| Workshop Types | Decision Output | Workshop Structure |
| Activity Library | Framework + Workshop Type | Activity Sequence |
| Prompt Library | Activities | Facilitation Prompts |
| Workshop Builder | Activities + Prompts | Workshop |
| Facilitator Guide | Workshop | Facilitator Guide |
| PlayBooky Live | Facilitator Guide | Live Workshop Experience |

---

# Future Evolution

This architecture has been designed to evolve without changing the overall product pipeline.

Future capabilities may include:

- Adaptive recommendations
- Organisational knowledge
- Workshop analytics
- AI-assisted facilitation
- Team memory
- Continuous learning from completed workshops

These capabilities should extend existing systems rather than introduce parallel architectures.