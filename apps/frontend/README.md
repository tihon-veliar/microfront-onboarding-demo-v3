# Frontend App

`@apps/frontend` is a Next.js 16 application that renders the public demo experience on top of Contentful content.

## What It Includes

- Home page at `/`
- Bestiary listing at `/bestiary`
- Creature details at `/bestiary/[slug]`
- JSON API for incremental loading at `/api/bestiary`

The app uses:

- Contentful Delivery API via the `contentful` SDK for collection queries
- Contentful GraphQL API for creature detail queries
- App Router with server components
- Tailwind CSS v4 and Chakra UI

## Environment Variables

Create `apps/frontend/.env` with:

```bash
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_DELIVERY_TOKEN=your_content_delivery_token
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=master
```

Notes:

- `NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT` is optional in code and defaults to `master`
- the app throws on startup if the space ID or delivery token is missing

## Run Locally

From the monorepo root:

```bash
pnpm install
pnpm --filter @apps/frontend dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
pnpm --filter @apps/frontend dev
pnpm --filter @apps/frontend build
pnpm --filter @apps/frontend start
pnpm --filter @apps/frontend lint
```

## Content Dependencies

The frontend expects the following Contentful content to exist:

- `homePage` entry with slug `home`
- `archivePage` entry with slug `bestiary`
- `creature` entries
- `taxonomyTerm` entries
- assets linked from creature and page content

If `homePage` or `archivePage` is missing, the related route falls back to `notFound()`.

## Data Flow

- `services/cms/*` contains data-fetching functions
- `lib/contentful/*` contains clients, queries, mappers, and shared types
- `src/features/*` contains page-level UI composition
- `src/components/*` contains reusable presentation components

## Notes

- Remote images are allowed from `https://images.ctfassets.net/**`
- Bestiary filtering is taxonomy-based
- The listing page supports server-rendered initial data plus client-side loading through `/api/bestiary`
