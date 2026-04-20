import type { MigrationFunction } from "contentful-migration";
import { CONTENT_TYPE_IDS, TAXONOMY_TERM_FIELD_IDS, TAXONOMY_TYPES } from "../constants";

const migration: MigrationFunction = (migration) => {
  const taxonomyTerm = migration
    .createContentType(CONTENT_TYPE_IDS.taxonomyTerm)
    .name("taxonomyTerm")
    .description(
      "Reusable classification unit used for filtering and grouping entities (e.g., element, habitat, rarity). Supports hierarchical structure.",
    )
    .displayField(TAXONOMY_TERM_FIELD_IDS.title);

  taxonomyTerm
    .createField(TAXONOMY_TERM_FIELD_IDS.title)
    .name("title")
    .type("Symbol")
    .required(true);

  taxonomyTerm
    .createField(TAXONOMY_TERM_FIELD_IDS.slug)
    .name("slug")
    .type("Symbol")
    .validations([{ unique: true }]);

  taxonomyTerm
    .createField(TAXONOMY_TERM_FIELD_IDS.type)
    .name("type")
    .type("Symbol")
    .validations([
      {
        in: [
          TAXONOMY_TYPES.element,
          TAXONOMY_TYPES.habitat,
          TAXONOMY_TYPES.shape,
          TAXONOMY_TYPES.eggGroup,
        ],
      },
    ]);

  taxonomyTerm
    .createField(TAXONOMY_TERM_FIELD_IDS.parent)
    .name("parent")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: [CONTENT_TYPE_IDS.taxonomyTerm] }]);
};

export = migration;
