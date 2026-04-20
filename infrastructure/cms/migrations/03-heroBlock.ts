import type { MigrationFunction } from "contentful-migration";
import { CONTENT_TYPE_IDS, HERO_BLOCK_FIELD_IDS } from "../constants";

const migration: MigrationFunction = (migration) => {
  const hero = migration
    .createContentType(CONTENT_TYPE_IDS.heroBlock)
    .name("heroBlock")
    .description(
      "Top section of a page with headline, supporting text, background image, and optional call-to-action.",
    )
    .displayField(HERO_BLOCK_FIELD_IDS.title);

  hero.createField(HERO_BLOCK_FIELD_IDS.title).name("title").type("Symbol").required(true);

  hero.createField(HERO_BLOCK_FIELD_IDS.subtitle).name("subtitle").type("Symbol");

  hero
    .createField(HERO_BLOCK_FIELD_IDS.backgroundImage)
    .name("backgroundImage")
    .type("Link")
    .linkType("Asset")
    .required(true);

  hero.createField(HERO_BLOCK_FIELD_IDS.ctaText).name("ctaText").type("Symbol");

  hero.createField(HERO_BLOCK_FIELD_IDS.ctaLink).name("ctaLink").type("Symbol");
};

export = migration;
