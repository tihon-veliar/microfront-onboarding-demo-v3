import type { Document } from "@contentful/rich-text-types";

import type { CreatureDetail } from "@/lib/contentful/types";

import { buildMetadata } from "./buildMetadata";

function getRichTextPlainText(node: unknown): string {
  if (!node || typeof node !== "object") {
    return "";
  }

  if ("value" in node && typeof node.value === "string") {
    return node.value;
  }

  if (!("content" in node) || !Array.isArray(node.content)) {
    return "";
  }

  return node.content.map((child) => getRichTextPlainText(child)).join(" ");
}

function toPlainText(document?: Document | null): string {
  return getRichTextPlainText(document).replace(/\s+/g, " ").trim();
}

export function fromCreature(creature: CreatureDetail) {
  return buildMetadata({
    title: creature.name,
    description: toPlainText(creature.shortDescription),
    image: creature.image,
    pathname: `/bestiary/${creature.slug}`,
  });
}
