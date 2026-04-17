import type { MigrationFunction } from "contentful-migration";
import { CONTENT_TYPE_IDS, CREATURE_FIELD_IDS } from "../constants";

const migration: MigrationFunction = (migration) => {
  const creature = migration
    .createContentType(CONTENT_TYPE_IDS.creature)
    .name("creature")
    .description(
      "Main domain entity representing a creature with descriptive content, media, classification, and metadata",
    )
    .displayField(CREATURE_FIELD_IDS.name);

  creature.createField(CREATURE_FIELD_IDS.name).name("name").type("Symbol").required(true);

  creature
    .createField(CREATURE_FIELD_IDS.slug)
    .name("slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  creature
    .createField(CREATURE_FIELD_IDS.shortDescription)
    .name("shortDescription")
    .type("RichText")
    .required(true);

  creature
    .createField(CREATURE_FIELD_IDS.description)
    .name("description")
    .type("RichText")
    .required(true);

  creature
    .createField(CREATURE_FIELD_IDS.coverImage)
    .name("coverImage")
    .type("Link")
    .linkType("Asset")
    .required(true);

  creature
    .createField(CREATURE_FIELD_IDS.creatureIndex)
    .name("creatureIndex")
    .type("Integer")
    .required(true)
    .validations([{ unique: true }]);

  creature.createField(CREATURE_FIELD_IDS.height).name("height").type("Integer").required(true);

  creature.createField(CREATURE_FIELD_IDS.weight).name("weight").type("Integer").required(true);

  creature
    .createField(CREATURE_FIELD_IDS.abilities)
    .name("abilities")
    .type("Array")
    .items({ type: "Symbol" });

  creature
    .createField(CREATURE_FIELD_IDS.externalResourceLink)
    .name("externalResourceLink")
    .type("Symbol");

  creature
    .createField(CREATURE_FIELD_IDS.taxonomies)
    .name("taxonomies")
    .type("Array")
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: [CONTENT_TYPE_IDS.taxonomyTerm] }],
    });

  creature.createField(CREATURE_FIELD_IDS.rating).name("rating").type("Integer");
};

export = migration;
