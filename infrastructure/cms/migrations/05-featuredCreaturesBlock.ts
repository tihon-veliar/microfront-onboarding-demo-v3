import type { MigrationFunction } from "contentful-migration";
import { CONTENT_TYPE_IDS, FEATURED_CREATURES_BLOCK_FIELD_IDS } from "../constants";

const migration: MigrationFunction = (migration) => {
  const block = migration
    .createContentType(CONTENT_TYPE_IDS.featuredCreaturesBlock)
    .name("featuredCreaturesBlock")
    .description("Section displaying a curated list of selected creatures on a page.")
    .displayField(FEATURED_CREATURES_BLOCK_FIELD_IDS.tile);

  block
    .createField(FEATURED_CREATURES_BLOCK_FIELD_IDS.tile)
    .name("tile")
    .type("Symbol")
    .required(true);

  block
    .createField(FEATURED_CREATURES_BLOCK_FIELD_IDS.creatures)
    .name("creatures")
    .type("Array")
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: [CONTENT_TYPE_IDS.creature] }],
    });
};

export = migration;
