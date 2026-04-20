# CMS Infrastructure

`@infra/cms` contains the Contentful schema and data bootstrapping workflow for the demo.

It is responsible for:

- defining content models through migration scripts
- creating repeatable demo data through seed scripts
- preparing a Contentful environment that the frontend can consume

## Content Model

Migrations create the following content types:

- `taxonomyTerm`
- `creature`
- `heroBlock`
- `imageTextBlock`
- `featuredCreaturesBlock`
- `homePage`
- `archivePage`

## Environment Variables

Create `infrastructure/cms/.env` with:

```bash
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token
CONTENTFUL_ENVIRONMENT_ID=master
CONTENTFUL_ENV=master
```

Notes:

- `migrate` reads `CONTENTFUL_ENVIRONMENT_ID`
- `seed` currently reads `CONTENTFUL_ENV`
- until those names are unified in code, set both variables to the same Contentful environment

## Run Migrations

From the monorepo root:

```bash
pnpm --filter @infra/cms migrate
```

This runs the migration files in order and creates or updates the schema in Contentful.

## Run Seed

From the monorepo root:

```bash
pnpm --filter @infra/cms seed
```

The seed runner is interactive and lets you choose:

```text
0 - Exit
1 - Creatures
2 - Taxonomies
3 - All
```

Seed covers:

- taxonomy terms
- creature entries
- asset upload/import for creature images

Recommended flow:

1. Run migrations
2. Run seed
3. Create editorial pages manually in Contentful

## What Is Seeded vs Manual

Seeded content:

- high-volume taxonomy data
- creature entities
- linked creature images

Manual content in Contentful:

- home page editorial structure
- archive page editorial copy
- hero and marketing-style blocks used by pages

This split keeps demo setup repeatable without over-automating low-volume editorial content.

## Useful Commands

```bash
pnpm --filter @infra/cms migrate
pnpm --filter @infra/cms seed
```

## Current Caveats

- `seedTaxonomies` should be reviewed before production use, because it appears to create entries with the `creature` content type instead of `taxonomyTerm`
- editorial pages are not created by seed, so the frontend will not be fully functional until those entries exist
