# Workshop OS - Codex Build Brief

# Workshop OS - Codex Build Brief

## Product Overview

Workshop OS is an AI-powered workshop recommendation, planning and decision-support platform for Product Managers and Product Designers.

The system helps users move from an ambiguous problem to a recommended workshop, framework, workshop plan and action plan.

The goal is to reduce the time and effort required to identify the right workshop, facilitate it effectively and turn findings into decisions.

---

# MVP Goal

Allow a user to:

1. Describe a problem
2. Receive a recommended workshop
3. Receive a recommended framework
4. Generate a workshop plan
5. Generate a facilitation guide

The user should be able to go from problem statement to workshop plan within 10 minutes.

---

# Target Users

Primary Users:

- Product Managers
- Product Designers

Secondary Users:

- UX Researchers
- Service Designers
- Product Leaders
- Consultants

---

# Core User Flow

## Step 1

User enters:

- Problem Statement
- Problem Signals
- Participants
- Desired Outcome

Example:

Problem Statement:

Users are confused about bonus eligibility.

Problem Signals:

- Users are confused
- Support tickets increasing

Participants:

- Product
- Design
- Support

Desired Outcome:

Understand root causes and identify improvements.

---

## Step 2

System evaluates Decision Engine.

Returns:

Recommended Workshop

Example:

Journey Mapping Workshop

Recommended Framework

Example:

Reality Gap Framework

Reasoning

Expected Outputs

Risks

---

## Step 3

System retrieves activities.

Example:

- Journey Stage Mapping
- Pain Point Identification
- Root Cause Exploration
- Opportunity Mapping
- Recommendation Creation

---

## Step 4

System runs Workshop Plan Generator prompt.

Returns:

- Workshop Objective
- Workshop Agenda
- Activity Instructions
- Facilitation Guidance
- Expected Outputs
- Success Criteria

---

## Step 5

User reviews and exports workshop plan.

---

# MVP Screens

## Dashboard

Purpose:

Entry point.

Actions:

- Create Workshop
- View Previous Workshops

---

## Define Challenge

Fields:

Problem Statement

Problem Signals

Participants

Desired Outcome

CTA:

Generate Recommendation

---

## Recommendation Screen

Display:

Recommended Workshop

Recommended Framework

Reasoning

Expected Outputs

Risks

CTA:

Generate Workshop Plan

---

## Workshop Plan Screen

Display:

Workshop Objective

Agenda

Activities

Facilitation Notes

Expected Outputs

Success Criteria

CTA:

Export Workshop Plan

---

# Existing Knowledge Model

The recommendation engine is powered by the following datasets.

---

## Workshop Types

Examples:

- Discovery Workshop
- Journey Mapping Workshop
- System Alignment Workshop
- Opportunity Mapping Workshop
- MVP Definition Workshop

Purpose:

Stores workshop metadata and recommendations.

---

## Framework Library

Examples:

- Reality Gap Framework
- Hidden Dependencies Framework
- Operational Friction Framework
- Opportunity Prioritisation Framework
- Layered MVP Framework

Purpose:

Provides thinking models and analysis structures.

---

## Decision Engine

Maps:

Problem Signal

↓

Workshop

↓

Framework

Example:

Users are confused

↓

Journey Mapping Workshop

↓

Reality Gap Framework

---

## Activity Library

Maps:

Workshop

+

Framework

↓

Activities

Example:

Journey Mapping Workshop

+

Reality Gap Framework

↓

Journey Stage Mapping

Pain Point Identification

Root Cause Exploration

Opportunity Mapping

Recommendation Creation

---

## Prompt Library

Stores AI prompts.

Prompts include:

- Workshop Recommendation
- Workshop Plan Generator
- Facilitation Guide Generator
- Workshop Synthesis Generator
- Decision Recommendation Generator
- Action Plan Generator

---

# Technical Architecture

Frontend:

Next.js

Backend:

Supabase

AI:

OpenAI

Authentication:

Clerk

Deployment:

Vercel

---

# Suggested Database Tables

workshop_types

frameworks

decision_rules

activities

prompts

workshops

generated_outputs

---

# Recommendation Logic

Input:

Problem Statement

Problem Signals

Desired Outcome

Process:

1. Match problem signals against decision_rules
2. Identify workshop
3. Identify framework
4. Retrieve activities
5. Pass data into AI prompt

Output:

Workshop Recommendation

Framework Recommendation

Workshop Plan

---

# AI Generation Logic

Workshop Plan Generator Prompt receives:

Problem Statement

Workshop

Framework

Activities

Participants

Desired Outcome

Returns:

Workshop Objective

Agenda

Activity Instructions

Facilitation Guidance

Expected Outputs

Success Criteria

---

# Success Criteria

A first-time user can:

1. Describe a product problem
2. Receive a recommendation
3. Generate a workshop plan

within 10 minutes.

The output should be detailed enough that a PM or Product Designer could facilitate the workshop without additional preparation.

---

# Future Roadmap (Out of Scope For MVP)

Phase 2

- FigJam Template Generation
- Workshop Export Packs
- Workshop Library

Phase 3

- FigJam Integration
- Transcript Upload
- Workshop Synthesis
- Decision Recommendations
- Action Plan Generation

Phase 4

- Live Workshop Copilot
- Real-Time Theme Detection
- Real-Time Facilitation Guidance
- Stakeholder Alignment Tracking
- Decision Tracking