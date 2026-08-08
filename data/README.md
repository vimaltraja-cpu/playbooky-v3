# PlayBooky Data

`data/canonical` contains the source-of-truth CSV exports for PlayBooky Product System knowledge.

`data/generated` will contain generated JSON or other derived files created from the canonical CSV data.

`data/schemas` will contain validation schemas for canonical and generated data.

Markdown documentation explains the architecture, responsibilities, relationships, and usage rules for the Product System.

CSV data contains the actual product knowledge.

Do not recreate, invent, or manually duplicate product knowledge in code or docs. Product knowledge should be read from the canonical CSV data until a database source of truth replaces it.
