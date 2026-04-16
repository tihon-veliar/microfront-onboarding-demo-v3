module.exports = function (migration) {
  const taxonomyTerm = migration
    .createContentType("taxonomyTerm")
    .name("taxonomyTerm")
    .description(
      "Reusable classification unit used for filtering and grouping entities (e.g., element, habitat, rarity). Supports hierarchical structure.",
    )
    .displayField("title");

  taxonomyTerm.createField("title").name("title").type("Symbol").required(true);

  taxonomyTerm
    .createField("slug")
    .name("slug")
    .type("Symbol")
    .validations([{ unique: true }]);

  taxonomyTerm
    .createField("type")
    .name("type")
    .type("Symbol")
    .validations([
      {
        in: ["element", "habitat", "shape", "egg-group"],
      },
    ]);

  taxonomyTerm
    .createField("parent")
    .name("parent")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["taxonomyTerm"] }]);
};
