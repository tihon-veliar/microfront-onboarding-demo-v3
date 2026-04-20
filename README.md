# microfront-onboarding-demo-v3

Monorepo for a Contentful-backed demo made of:

- a public Next.js frontend in [`apps/frontend`](./apps/frontend/README.md)
- Contentful schema and seed tooling in [`infrastructure/cms`](./infrastructure/cms/README.md)

## Workspace Structure

```text
apps/
  frontend/         Next.js application
infrastructure/
  cms/              Contentful migrations and seed scripts
```

The repo uses:

- `pnpm` workspaces
- `turbo` for task orchestration
- TypeScript across app and infrastructure code

## Prerequisites

- Node.js 20+
- `pnpm`
- a Contentful space
- Contentful API tokens for delivery and management

## Setup

Install dependencies from the repository root:

```bash
pnpm install
```

Then configure environment files for both packages:

- `apps/frontend/.env`
- `infrastructure/cms/.env`

See package-level README files for the exact variables.

## Local Development Flow

1. Run CMS migrations:

```bash
pnpm --filter @infra/cms migrate
```

2. Seed data:

```bash
pnpm --filter @infra/cms seed
```

3. Create the remaining editorial entries manually in Contentful:

- `homePage` with slug `home`
- `archivePage` with slug `bestiary`
- linked block entries required by those pages

4. Start the frontend:

```bash
pnpm --filter @apps/frontend dev
```

Open `http://localhost:3000`.

## Common Commands

```bash
pnpm --filter @apps/frontend dev
pnpm --filter @apps/frontend build
pnpm --filter @apps/frontend lint
pnpm --filter @infra/cms migrate
pnpm --filter @infra/cms seed
pnpm lint
pnpm format
```

## Architecture Summary

- `apps/frontend` reads published Contentful content and renders the website
- `infrastructure/cms` defines the schema and prepares repeatable demo data
- the frontend mixes Delivery API and GraphQL depending on the data shape it needs
- bestiary filtering is driven by taxonomy terms stored in Contentful

## Current Notes

- the frontend README and CMS README are intended to be the package-level source of truth
- for CMS environment variables, set both `CONTENTFUL_ENVIRONMENT_ID` and `CONTENTFUL_ENV` for now because the scripts do not yet use a single shared name
- the repo currently contains local `.env` files with real-looking secrets, so treat them as sensitive and avoid copying values into documentation or commits
