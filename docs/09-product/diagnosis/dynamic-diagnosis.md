# Dynamic Diagnosis

| Field | Value |
| --- | --- |
| Status | Current |
| Confidence | 2 Product Direction |
| Version | 1.0.0 |
| Owner | Product |
| Last updated | 2026-08-07 |

---

# Purpose

Dynamic Diagnosis defines how PlayBooky turns a free-text Composer challenge into a shorter, smarter Diagnosis flow.

PlayBooky must not ask every diagnosis question by default when the user has already described the challenge.

The Composer statement is reviewed first. Diagnosis only asks what the Composer did not already make clear.

---

# Product Rule

1. The user describes a challenge in the Composer.
2. PlayBooky reviews that text against the Diagnosis Questions and option library.
3. Matched diagnosis options are captured as structured answers.
4. Diagnosis only presents questions that remain unanswered or unclear.
5. If the Composer already covers every required diagnosis category with enough confidence, PlayBooky may skip the remaining questionnaire and continue into recommendation loading.

Diagnosis remains the structured collection layer.

The Composer does not replace Diagnosis.

The Composer reduces unnecessary Diagnosis.

---

# Why This Exists

A fixed five-question diagnosis creates friction when the user has already said enough.

Dynamic Diagnosis:

- respects what the user already typed
- reduces cognitive load
- keeps diagnosis structured for the Diagnosis Engine
- makes the Composer feel intelligent rather than decorative
- prepares PlayBooky for stronger AI matching later without changing the product contract

---

# Inputs

Consumes:

- Composer challenge text
- Diagnosis Questions
- Diagnosis option labels, descriptions, and identifiers

Future inputs may include:

- organisation language
- prior workshop history
- conversational follow-up

---

# Processing

Dynamic Diagnosis evaluates the Composer challenge against each diagnosis category:

- Goals
- Challenges
- Context
- Participants
- Outcome

For each category it decides:

- **Matched** — enough evidence exists to pre-select one or more options
- **Unclear** — the category still needs to be asked

Matched options become structured diagnosis answers.

Unclear categories become the live Diagnosis Questions shown to the user.

Matching may begin as deterministic keyword / phrase matching and later move to AI-assisted interpretation. The product behaviour stays the same either way:

> Ask only what the Composer did not already answer.

---

# Outputs

Produces:

- Challenge statement
- Pre-filled diagnosis answers
- Remaining diagnosis questions to ask
- Final structured diagnosis responses after the user completes any remaining questions

Consumed by:

- Diagnosis Questions UI
- Diagnosis Engine
- Journey handoff into Recommendation Loading

---

# Journey Behaviour

```text
Composer challenge
↓
Dynamic Diagnosis review
↓
Pre-filled answers + remaining questions
↓
Diagnosis UI asks only remaining questions
↓
Complete structured diagnosis responses
↓
Recommendation Loading
```

Rules:

- Composer text must persist into Diagnosis.
- Diagnosis must be able to show the challenge context so the user understands why questions were shortened.
- Pre-filled answers remain editable when the related question is shown.
- Skipped matched answers must still be saved into the diagnosis payload.
- “Guide me instead” may enter Diagnosis with no Composer challenge and therefore ask the full question set.

---

# Relationship To Other Systems

## Composer

Owns free-text challenge capture.

Does not own diagnosis option selection.

## Diagnosis Questions

Owns the structured question and option library.

Becomes adaptive in presentation, not in purpose.

## Diagnosis Engine

Still consumes structured diagnosis responses.

Dynamic Diagnosis prepares cleaner input; it does not replace the Diagnosis Engine.

## Decision Engine

Remains downstream. It should not read raw Composer text as its primary contract once structured diagnosis responses exist.

---

# Implementation Notes

Phase 1 (current journey wiring):

- Persist Composer challenge into the internal journey handoff.
- Surface the challenge on the Diagnosis stage.
- Run a first-pass matcher against diagnosis option labels and descriptions.
- Ask only unmatched questions.
- Save matched + user-completed answers for the next journey stage.

Later phases:

- Stronger AI extraction
- Confidence thresholds and explainability
- Partial matches that suggest rather than hard-select
- Organisation-specific synonym libraries

---

# Non-Goals

Dynamic Diagnosis must not:

- invent new diagnosis categories outside the approved question set
- browse activities directly from Composer text
- skip the Diagnosis Engine
- treat Activity Cards as the source of diagnosis truth
- permanently delete skipped questions from the product system

---

# Success Criteria

- Typing a clear challenge in Composer reduces the number of diagnosis questions asked.
- Ambiguous challenges still receive the full useful diagnosis set.
- Diagnosis answers remain structured and engine-ready.
- The user can see that PlayBooky used their Composer text.
- Composer, Diagnosis, Loading, Reveal, and Activity Grid share the same approved journey background shell.
