Тогда в README пиши через package scripts, не через `ts-node`.

Готовый блок:

---

## CMS: Migrations & Seeding

### Migrations

Content models are defined via migration scripts.

They are used to:

* create and update content types
* define fields and validations
* ensure consistent schema across environments

#### Run migrations

From the monorepo root:

```bash
pnpm --filter @infra/cms migrate
```

---

### Seeding

Seed scripts are used for **bulk data population**.

They cover:

* taxonomy terms
* creatures (entities)
* asset uploads and linking

Seed is designed for:

* repeatable environment setup
* fast demo preparation
* avoiding manual entry of large datasets

#### Run seed

From the monorepo root:

```bash
pnpm --filter @infra/cms seed
```

#### Select target in CLI

```text
0 - Exit
1 - Creatures
2 - Taxonomies
3 - All
```

---

### Why not seed everything?

Not all content is seeded intentionally.

We distinguish between:

#### Structured / high-volume data

→ handled via seed
(e.g. taxonomies, creatures)

#### Editorial / low-volume content

→ created manually in CMS
(e.g. landing page, listing page)

Reason:

* small number of entries
* content is inherently editorial
* reflects real-world CMS workflows
* avoids unnecessary seed complexity

---

### Workflow

1. Run migrations → create schema
2. Run seed → populate core data
3. Create editorial pages manually in CMS

---

Если у тебя scripts названы иначе, просто скинь `package.json` пакета `@infra/cms`, и я дам точный финальный блок.
