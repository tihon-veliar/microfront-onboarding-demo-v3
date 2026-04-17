import type { MigrationFunction } from "contentful-migration";
import { CONTENT_TYPE_IDS, IMAGE_TEXT_BLOCK_FIELD_IDS } from "../constants";

const migration: MigrationFunction = (migration) => {
  const block = migration
    .createContentType(CONTENT_TYPE_IDS.imageTextBlock)
    .name("imageTextBlock")
    .description("Section combining image and text with configurable layout (image position).")
    .displayField(IMAGE_TEXT_BLOCK_FIELD_IDS.title);

  block.createField(IMAGE_TEXT_BLOCK_FIELD_IDS.title).name("title").type("Symbol").required(true);

  block
    .createField(IMAGE_TEXT_BLOCK_FIELD_IDS.content)
    .name("content")
    .type("RichText")
    .required(true);

  block
    .createField(IMAGE_TEXT_BLOCK_FIELD_IDS.image)
    .name("image")
    .type("Link")
    .linkType("Asset")
    .required(true);

  block
    .createField(IMAGE_TEXT_BLOCK_FIELD_IDS.imageAlignment)
    .name("imageAlignment")
    .type("Symbol")
    .validations([
      {
        in: ["left", "right", "top", "bottom"],
      },
    ])
    .defaultValue({
      "en-US": "left",
    });
};

export = migration;
