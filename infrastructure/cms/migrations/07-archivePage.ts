import type { MigrationFunction } from "contentful-migration";
import { ARCHIVE_PAGE_FIELD_IDS, CONTENT_TYPE_IDS } from "../constants";

const migration: MigrationFunction = (migration) => {
  const page = migration
    .createContentType(CONTENT_TYPE_IDS.archivePage)
    .name("archivePage")
    .description("Listing page used to display and filter a collection of creatures.")
    .displayField(ARCHIVE_PAGE_FIELD_IDS.title);

  page.createField(ARCHIVE_PAGE_FIELD_IDS.title).name("title").type("Symbol").required(true);

  page
    .createField(ARCHIVE_PAGE_FIELD_IDS.slug)
    .name("slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  page
    .createField(ARCHIVE_PAGE_FIELD_IDS.pageTitle)
    .name("pageTitle")
    .type("Symbol")
    .required(true);

  page.createField(ARCHIVE_PAGE_FIELD_IDS.pageDescription).name("pageDescription").type("Text");
};

export = migration;
