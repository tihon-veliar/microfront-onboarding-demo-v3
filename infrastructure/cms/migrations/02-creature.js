module.exports = function (migration) {
  const creature = migration
    .createContentType("creature")
    .name("creature")
    .description(
      "Main domain entity representing a creature with descriptive content, media, classification, and metadata",
    )
    .displayField("name");

  creature.createField("name").name("name").type("Symbol").required(true);

  creature
    .createField("slug")
    .name("slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  creature.createField("shortDescription").name("shortDescription").type("RichText").required(true);

  creature.createField("description").name("description").type("RichText").required(true);

  creature
    .createField("coverImage")
    .name("coverImage")
    .type("Link")
    .linkType("Asset")
    .required(true);

  creature
    .createField("creatureIndex")
    .name("creatureIndex")
    .type("Integer")
    .required(true)
    .validations([{ unique: true }]);

  creature.createField("height").name("height").type("Integer").required(true);

  creature.createField("weight").name("weight").type("Integer").required(true);

  creature.createField("abilities").name("abilities").type("Array").items({ type: "Symbol" });

  creature.createField("externalResourceLink").name("externalResourceLink").type("Symbol");

  creature
    .createField("taxonomies")
    .name("taxonomies")
    .type("Array")
    .items({
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: ["taxonomyTerm"] }],
    });

  creature.createField("rating").name("rating").type("Integer");
};
