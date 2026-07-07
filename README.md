# PlayBooky V3

PlayBooky V3 is the single source of truth for the PlayBooky Design Portal and the future product experience.

The repository starts with the design system foundation only. Product screens, old asset imports, and database connections are intentionally out of scope for this first setup.

## Source Of Truth

- Documentation lives in `docs/`.
- The Design Portal lives at `/design-system`.
- There is no separate playground.
- Product screens must use approved, current components from the design system.

## Tech Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- ESLint
- Prettier

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000/design-system`.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```
