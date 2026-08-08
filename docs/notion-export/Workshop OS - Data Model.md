# Workshop OS - Data Model

# Workshop OS - Data Model

## Purpose

This page explains how the Workshop OS databases connect together and how they become the logic for the future web app.

---

# Core Flow

User enters a problem.

↓

Decision Engine matches the problem signal.

↓

Workshop OS recommends a Workshop Type.

↓

Workshop OS recommends a Framework.

↓

Workshop OS pulls related Activities.

↓

Workshop OS selects the right Prompt.

↓

AI generates the Workshop Plan, Facilitation Guide, Decisions and Action Plan.

---

# Database 1: Workshop Types

Purpose:
Stores the available workshop types.

Used to answer:
What workshop should the user run?

Examples:

- Discovery Workshop
- Journey Mapping Workshop
- System Alignment Workshop
- Opportunity Mapping Workshop
- MVP Definition Workshop

---

# Database 2: Framework Library

Purpose:
Stores the thinking models used to guide the workshop.

Used to answer:
How should the problem be understood?

Examples:

- Reality Gap Framework
- Hidden Dependencies Framework
- Operational Friction Framework
- Opportunity Prioritisation Framework
- Layered MVP Framework

Connected to:
Workshop Types

---

# Database 3: Decision Engine

Purpose:
Maps problem signals to the correct workshop and framework.

Used to answer:
Given this problem, what should Workshop OS recommend?

Example:
Users are confused
→ Journey Mapping Workshop
→ Reality Gap Framework

Connected to:
Workshop Types
Framework Library

---

# Database 4: Activity Library

Purpose:
Stores workshop activities.

Used to answer:
What activities should be included in the workshop plan?

Example:
Journey Mapping Workshop + Reality Gap Framework
→ Journey Stage Mapping
→ Pain Point Identification
→ Root Cause Exploration
→ Opportunity Mapping
→ Recommendation Creation

Connected to:
Workshop Types
Framework Library

---

# Database 5: Prompt Library

Purpose:
Stores the AI prompts used to generate outputs.

Used to answer:
What should AI generate at each stage?

Examples:

- Workshop Recommendation
- Workshop Plan Generator
- Facilitation Guide Generator
- Workshop Synthesis Generator
- Decision Recommendation Generator
- Action Plan Generator

---

# Web App Logic

## Step 1: User Input

The user enters:

- Problem Statement
- Problem Signals
- Participants
- Desired Outcome

## Step 2: Recommendation

The app searches the Decision Engine.

It finds:

- Recommended Workshop
- Recommended Framework

## Step 3: Activity Selection

The app searches the Activity Library.

It finds activities linked to:

- Recommended Workshop
- Recommended Framework

## Step 4: Prompt Selection

The app selects the correct prompt from the Prompt Library.

Example:
If user clicks “Generate Workshop Plan”
→ use Workshop Plan Generator prompt.

## Step 5: AI Generation

The app sends the selected data to AI:

- Problem Statement
- Workshop
- Framework
- Activities
- Participants
- Desired Outcome

AI generates:

- Workshop Objective
- Agenda
- Activity Instructions
- Facilitation Guide
- Expected Outputs
- Success Criteria

---

# Future App Tables

Workshop Types
→ workshop_types

Framework Library
→ frameworks

Decision Engine
→ decision_rules

Activity Library
→ activities

Prompt Library
→ prompts

User Workshops
→ workshops

Generated Outputs
→ generated_outputs