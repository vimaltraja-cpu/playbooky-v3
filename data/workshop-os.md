# Workshop OS Data Structure

Status: Proposed Phase 1 structure

Source specification:
`docs/notion-export/`

Historical naming note:
Some source documents refer to the product as North. North and PlayBooky are treated as the same product.

## Proposed Folders

```text
data/
  canonical/
    workshop-os/
      building-block-library.csv
      building-block-steps.csv
      workshop-design-logic.csv
      diagnosis-signals.csv
      prompt-library.csv
      activity-library-v3.csv

  generated/
    workshop-os/
      building-blocks.json
      building-block-steps.json
      workshop-design-logic.json
      generated-workshop-flow.example.json

  schemas/
    workshop-os/
      diagnosis.schema.json
      building-block.schema.json
      building-block-step.schema.json
      workshop-design-logic.schema.json
      generated-workshop-flow.schema.json
```

## Rules

- `docs/notion-export/` is the source specification during Phase 1.
- `data/canonical/workshop-os/` should contain source-of-truth CSVs once the Notion export is normalised.
- `data/generated/workshop-os/` should contain derived JSON that the app can consume safely.
- `data/schemas/workshop-os/` should contain machine-readable validation schemas once the TypeScript contracts are approved.
- Product screens must not consume raw Notion export files.
- Prompt execution, APIs, Supabase, and product screens remain out of scope for Phase 1.

## Current Phase 1 Implementation

The current Phase 1 implementation keeps source-derived fixture data in:

`lib/workshop-os/fixtures.ts`

The deterministic generator lives in:

`lib/workshop-os/generate-workshop-flow.ts`

The TypeScript contracts and lightweight schema definitions live in:

`lib/workshop-os/types.ts`
`lib/workshop-os/schemas.ts`
