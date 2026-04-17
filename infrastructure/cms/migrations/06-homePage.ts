import type { MigrationFunction } from "contentful-migration";
import { CONTENT_TYPE_IDS, HOME_PAGE_FIELD_IDS } from "../constants";

const migration: MigrationFunction = (migration) => {
  const page = migration
    .createContentType(CONTENT_TYPE_IDS.homePage)
    .name("homePage")
    .description(
      "Landing page containing hero section, featured content, and promotional sections.",
    )
    .displayField(HOME_PAGE_FIELD_IDS.title);

  page.createField(HOME_PAGE_FIELD_IDS.title).name("title").type("Symbol").required(true);

  page
    .createField(HOME_PAGE_FIELD_IDS.slug)
    .name("slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  page
    .createField(HOME_PAGE_FIELD_IDS.hero)
    .name("hero")
    .type("Link")
    .linkType("Entry")
    .required(true)
    .validations([{ linkContentType: [CONTENT_TYPE_IDS.heroBlock] }]);

  page
    .createField(HOME_PAGE_FIELD_IDS.imageTextSection)
    .name("imageTextSection")
    .type("Link")
    .linkType("Entry")
    .required(true)
    .validations([{ linkContentType: [CONTENT_TYPE_IDS.imageTextBlock] }]);

  page
    .createField(HOME_PAGE_FIELD_IDS.featuredSection)
    .name("featuredSection")
    .type("Link")
    .linkType("Entry")
    .required(true)
    .validations([{ linkContentType: [CONTENT_TYPE_IDS.featuredCreaturesBlock] }]);
};

export = migration;
