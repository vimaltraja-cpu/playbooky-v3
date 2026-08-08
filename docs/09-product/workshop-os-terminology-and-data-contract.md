# Workshop OS Terminology and Data Contract

| Field | Value |
| --- | --- |
| Status | In Specification |
| Confidence | 1 Foundation |
| Owner | Product System |
| Last updated | 2026-07-09 |

---

# Purpose

This document defines the core Workshop OS vocabulary used by PlayBooky documentation, data contracts, generated workshop flows and future implementation work.

Workshop OS is the system that turns a user challenge into an executable workshop flow.

Some historical source documents refer to the product as North. Treat North and PlayBooky as the same product.

---

# Core Terms

## Workshop OS

Workshop OS is the product intelligence system that transforms a user challenge into an executable workshop flow.

It is responsible for:

- understanding the challenge
- diagnosing the team’s current stage
- selecting appropriate building blocks
- expanding building blocks into ordered steps
- producing a workshop flow that a facilitator can review, edit and run

Workshop OS is not an activity browser and not a static template library.

---

## Workshop

A Workshop is the generated container that a facilitator can review, adapt and run.

It includes:

- objective
- diagnosis
- agenda
- selected building blocks
- ordered steps
- timing
- expected outputs
- success criteria

A Workshop is the output of Workshop OS, not the starting point.

---

## Building Block

A Building Block is an engine/execution unit used by Workshop OS to construct a workshop.

Building Blocks are selected by diagnosis and workshop design logic, then expanded into Building Block Steps.

Examples:

- Five Whys
- Problem Statement
- Priority Map
- Who, What, When

Building Block is the preferred term inside engine code, workshop flow contracts and execution logic.

---

## Activity

An Activity is user-facing and library-facing language.

Activities are how facilitators and users understand reusable workshop exercises in browsing, review and selection contexts.

Activity is appropriate for:

- Activity Library
- Activity Explorer
- Activity Card
- facilitator-facing descriptions

Activity must not become the execution-layer source of truth when generating a workshop flow. The execution layer should use Building Blocks and Building Block Steps.

---

## Building Block Step

A Building Block Step is an ordered executable instruction within a Building Block.

It includes:

- parent building block
- order
- duration
- purpose
- instructions
- facilitator notes
- optional technique

Building Block Steps are what make a generated workshop runnable.

---

## Technique

A Technique is a facilitation method or pattern that can be used inside a Building Block or Step.

Examples:

- Theme Sort
- Blind Vote
- Dot Vote
- Parking Lot

Techniques can be reusable across many Building Blocks. A Technique may also appear as a Building Block when the source data treats it as a runnable unit.

---

## Layout

A Layout is the visual or spatial structure required to run a Building Block or Step.

Examples:

- matrix
- columns
- voting area
- journey map
- action table

Layouts describe how participants interact with the workshop surface. Layouts are not prompts, activities or cards.

---

## Prompt

A Prompt is an AI instruction used to generate or enrich Workshop OS outputs.

Prompts may support:

- workshop recommendation
- workshop plan generation
- facilitation guide generation
- synthesis
- decision recommendation
- action planning

Prompts should consume structured data from Workshop OS. Prompts must not replace the structured workshop flow contract.

---

## Illustration

An Illustration is a visual asset associated with a user-facing Activity or library item.

Illustrations help recognition, browsing and review. They do not define workshop logic and must not be used as identifiers for the engine.

---

## Activity Card

An Activity Card is a presentation component.

It displays selected Activity information in the Design Portal or future product UI.

Activity Card must not become:

- the source of truth for activity content
- the execution model for workshop generation
- the data model for the Builder
- the authority for timing, steps, prompts or layouts

Activity Card presents approved data. It does not own the data.

---

# Relationship Model

```text
User Challenge
↓
Diagnosis
↓
Workshop Design Logic
↓
Building Block
↓
Building Block Step
↓
Layout
↓
Prompt
↓
Generated Workshop Flow
↓
Workshop
```

Supporting presentation and asset layer:

```text
Activity
↓
Illustration
↓
Activity Card
```

The two layers connect through approved data mapping, but they have different responsibilities.

---

# Data Contract Rules

- Use Activity for user-facing/library language.
- Use Building Block for engine and execution language.
- Use Building Block Step for runnable workshop instructions.
- Use Technique for reusable facilitation methods.
- Use Layout for visual workshop structure.
- Use Prompt for AI generation instructions.
- Use Illustration for visual assets.
- Use Activity Card for presentation only.
- Generated Workshop Flow must contain executable blocks and steps, not just activity metadata.
- Product screens must not hardcode workshop knowledge.
- Activity Card visuals must not define data contracts.

---

# Phase 2 Implications

Before Phase 2 implementation starts:

- Generated Workshop Flow should gain explicit layout requirements.
- Building Block Steps should reference layouts where needed.
- Prompt references should be added as structured metadata, not inline prompt text.
- Activity-to-Building-Block mapping should be documented before Activity Cards are connected to generated flows.
