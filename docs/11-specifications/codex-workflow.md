# Codex Workflow

| Field | Value |
| --- | --- |
| Status | Active |
| Applies To | All PlayBooky implementation work |

---

# Purpose

This document defines the engineering workflow for implementing PlayBooky.

Its purpose is to ensure all implementation work is consistent, predictable and faithful to the approved designs.

---

# Source of Truth Priority

Always work in this order.

1. Approved Figma design
2. Component Specification
3. Component Implementation Specification
4. Canonical Product Data (CSV)
5. Product Documentation

Never reverse this order.

---

# Engineering Principles

## Reproduce

Your job is to reproduce approved designs.

Do not redesign.

Do not optimise.

Do not reinterpret.

If something appears unusual, assume it is intentional.

---

## Existing Assets First

Always inspect existing assets before creating placeholders.

Never invent new naming conventions.

Never duplicate assets.

Never reorganise folders unless explicitly instructed.

---

## Canonical Data

Use the canonical CSV files.

Never hardcode production content.

Never invent activity data.

If required data is missing, report it.

---

## Component First

Never create duplicate components.

Always extend the existing reusable component.

Use variants instead of creating separate implementations where appropriate.

---

## Fidelity Before Features

Visual fidelity always comes before adding functionality.

A component must first match the approved design before:

- variants
- motion
- interactions
- responsiveness
- accessibility
- optimisation

are introduced.

---

## Validate Before Complete

Never mark work complete simply because it builds successfully.

Completion requires:

- Visual comparison with the approved Figma.
- Correct assets.
- Correct data.
- Correct spacing.
- Correct typography.
- Correct behaviour.

---

## Report Problems

If implementation cannot continue because of:

- missing assets
- missing data
- conflicting specifications

stop and report the issue.

Do not invent a solution.

---

# Git Workflow

Every implementation task should:

- create or use the correct feature branch
- run lint
- run typecheck
- run build
- commit changes
- push branch
- return branch name
- return commit hash
- return Vercel Preview URL

---

# Definition of Done

Work is complete only when:

✓ Matches the approved design.

✓ Uses the correct assets.

✓ Uses canonical data.

✓ Passes lint.

✓ Passes typecheck.

✓ Passes build.

✓ Has been committed.

✓ Has been pushed.

✓ Is available on Vercel Preview.