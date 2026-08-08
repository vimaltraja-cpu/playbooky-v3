# Workshop OS - Diagnosis Logic V1

## Purpose

The Diagnosis Logic Engine converts user inputs into a structured diagnosis.

Its purpose is to determine:

- Primary Stage
- Secondary Stage
- Confidence Score
- Workshop Design Requirements

The diagnosis is used by the Workshop Design Engine to generate a bespoke workshop.

---

# Diagnosis Flow

User Input

↓

Signal Detection

↓

Stage Scoring

↓

Primary Stage

↓

Secondary Stage

↓

Workshop Generation

---

# Stage Scorecard

Workshop OS evaluates seven stages:

- Goals
- Understand
- Frame
- Ideas
- Evaluate
- Decide
- Discuss

Each stage starts at:

Goals = 0

Understand = 0

Frame = 0

Ideas = 0

Evaluate = 0

Decide = 0

Discuss = 0

Signals increase one or more stage scores.

The highest score becomes the Primary Stage.

The second highest score becomes the Secondary Stage.

---

# Input Area 1 - Challenge

Question:

What challenge are you trying to solve?

Purpose:

Understand the nature of the problem.

---

## Example Signals

User says:

"We don't know what success looks like."

Scoring:

Goals +3

---

User says:

"We don't understand why users are dropping off."

Scoring:

Understand +3

---

User says:

"The problem feels too broad."

Scoring:

Frame +3

---

User says:

"We need more ideas."

Scoring:

Ideas +3

---

User says:

"We have too many opportunities."

Scoring:

Evaluate +3

---

User says:

"We need a decision."

Scoring:

Decide +3

---

User says:

"Stakeholders disagree."

Scoring:

Discuss +3

---

# Input Area 2 - Current State

Question:

What do you already know?

Purpose:

Measure certainty and maturity.

---

## Example Signals

No research completed

Understand +3

---

Research partially completed

Understand +2

Frame +1

---

Research completed

Evaluate +2

Decide +1

---

Ideas already identified

Evaluate +2

---

Opportunities already identified

Evaluate +3

---

Problem clearly defined

Ideas +2

---

Decision still required

Decide +3

---

# Input Area 3 - Desired Outcome

Question:

What do you need by the end of the workshop?

---

Shared understanding

Understand +2

Discuss +2

---

Problem definition

Frame +3

---

New ideas

Ideas +3

---

Prioritised opportunities

Evaluate +3

---

Decision

Decide +3

---

Action plan

Decide +2

Goals +1

---

Alignment

Discuss +3

---

Roadmap

Decide +2

Evaluate +1

---

# Input Area 4 - Blockers

Question:

What is currently preventing progress?

---

No clear direction

Goals +3

---

Too many assumptions

Understand +3

---

Problem unclear

Frame +3

---

No ideas

Ideas +3

---

Too many ideas

Evaluate +3

---

No decision

Decide +3

---

Stakeholder disagreement

Discuss +3

---

Ownership unclear

Decide +2

Discuss +1

---

# Input Area 5 - Constraints

Question:

What constraints exist?

Purpose:

Constraints do not affect stage scoring.

Constraints affect workshop design.

Examples:

- Duration
- Participant count
- Remote/In Person
- Cross-functional attendance
- Leadership involvement

These inputs are passed directly to the Workshop Design Engine.

---

# Primary Stage Rules

The stage with the highest score becomes the Primary Stage.

Example:

Goals = 1

Understand = 2

Frame = 1

Ideas = 0

Evaluate = 7

Decide = 5

Discuss = 2

Result:

Primary Stage = Evaluate

---

# Secondary Stage Rules

The stage with the second highest score becomes the Secondary Stage.

Example:

Evaluate = 7

Decide = 5

Discuss = 2

Result:

Secondary Stage = Decide

---

# Confidence Scoring

High Confidence

Primary Stage is 3+ points ahead of all other stages.

---

Medium Confidence

Primary Stage is 1-2 points ahead of the next highest stage.

---

Low Confidence

Multiple stages have the same score.

The user may need additional diagnostic questions.

---

# Example Diagnosis

Input:

Research completed.

20 opportunities identified.

Need prioritisation.

Need stakeholder alignment.

Need decision.

90 minute workshop.

---

Scores:

Goals = 0

Understand = 0

Frame = 0

Ideas = 1

Evaluate = 8

Decide = 6

Discuss = 3

---

Output:

Primary Stage = Evaluate

Secondary Stage = Decide

Confidence = High

Workshop Requirements:

90 minutes

8 participants

Remote

Cross-functional

---

# Future Vision

Future versions of the Diagnosis Engine may:

- Use AI reasoning rather than fixed scoring
- Analyse uploaded research
- Analyse workshop transcripts
- Learn from previously generated workshops
- Adapt recommendations based on outcomes

Diagnosis Logic V1 provides a transparent and explainable foundation that can later evolve into a more advanced AI-driven system.