# Vercel Deployment Workflow

## Purpose

PlayBooky V3 uses Vercel so the Design Portal can be reviewed from stable preview URLs instead of local development servers.

## Repository

- GitHub repository: `vimaltraja-cpu/playbooky-v3`
- Production branch: `main`
- Stable review branch: `staging`

## Vercel Project Settings

Use these settings when importing the GitHub repository into Vercel:

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave empty in Vercel project settings

The project uses `next.config.ts` with `distDir: ".next-portal"`. Vercel should run the Next.js build through the framework preset instead of treating the build output as a static directory.

## Deployment Behaviour

- Commits merged into `main` create production deployments.
- Commits pushed to `staging` create stable preview deployments for review.
- Every feature branch and pull request creates a Vercel preview deployment URL.
- Pull requests should be visually reviewed using the Vercel preview URL before merge.

## Staging Branch

The `staging` branch is kept as a long-lived review branch. Use it when a stable review URL is needed before promoting work to production.

Recommended flow:

1. Work on a feature branch.
2. Open a pull request for preview deployment review.
3. Merge or fast-forward approved work into `staging` for stable review.
4. Merge `staging` into `main` when ready for production.

## Environment Variables

No runtime environment variables are required yet.

When a future variable is introduced:

- Add it to `.env.example`.
- Add it to the Vercel project for Preview and Production environments as needed.
- Document whether `staging` needs the same value as Preview or a branch-specific value.
- Do not commit real secrets.

## One-Time Vercel Setup

Vercel account access is required for the first connection.

1. Open Vercel and choose **Add New Project**.
2. Import `vimaltraja-cpu/playbooky-v3` from GitHub.
3. Confirm the project settings listed above.
4. Confirm the Production environment tracks `main`.
5. Push or connect the `staging` branch and use it as the stable review branch.
6. Confirm preview deployments are enabled for pull requests and non-production branches.

## Acceptance Criteria

- The GitHub repository is connected to a Vercel project.
- `main` is the production branch.
- `staging` exists as a long-lived stable review branch.
- Pull requests generate preview deployment URLs.
- The Vercel build uses `npm install` and `npm run build`.
- The project has no required environment variables unless documented in `.env.example`.
