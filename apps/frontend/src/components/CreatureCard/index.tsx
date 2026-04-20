import Link from "next/link";
import type { Document as RichTextDocument } from "@contentful/rich-text-types";
import CmsImage from "../CmsImage";
import type { CreatureCard } from "@/lib/contentful/types";

const CARD_BACKGROUND_COLORS = [
  "#EFF6FF",
  "#EAF4FF",
  "#F2F7FF",
  "#EEF2FF",
  "#F3F0FF",
  "#EAFBF5",
  "#F2FBF2",
  "#FFF7E8",
  "#FFF1E8",
  "#FDF0F5",
];

function getDeterministicIndex(value: string, length: number): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash % length;
}

function getPlainTextFromRichText(content: RichTextDocument | null): string {
  if (!content || content.nodeType !== "document") {
    return "";
  }

  const textParts: string[] = [];

  function visitNode(node: unknown) {
    if (!node || typeof node !== "object") {
      return;
    }

    if ("value" in node && typeof node.value === "string" && node.value.trim()) {
      textParts.push(node.value.trim());
    }

    if ("content" in node && Array.isArray(node.content)) {
      node.content.forEach(visitNode);
    }
  }

  visitNode(content);

  return textParts.join(" ").replace(/\s+/g, " ").trim();
}

function getExcerpt(content: RichTextDocument | null, maxLength = 96): string {
  const plainText = getPlainTextFromRichText(content);

  if (!plainText) {
    return "";
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

type CreatureCardP = {
  creature: CreatureCard;
};

const CreatureCardView = ({ creature }: CreatureCardP) => {
  const excerpt = getExcerpt(creature.shortDescription);
  const backgroundColor =
    CARD_BACKGROUND_COLORS[
      getDeterministicIndex(`${creature.id}-${creature.slug}`, CARD_BACKGROUND_COLORS.length)
    ];


  return (
    <li className="snap-start" key={creature.id}>
      <Link className="group block h-full" href={`/bestiary/${creature.slug}`}>
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-black/5 transition-transform duration-200 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
          {creature.image ? (
            <div className="relative bg-white/10 backdrop-blur supports-backdrop-filter:bg-white/10">
              <CmsImage
                image={creature.image}
                alt={creature.image.alt || creature.name}
                className="aspect-[5/4] w-full object-contain p-3"
                sizes="(min-width: 1024px) 20rem, (min-width: 640px) 60vw, 84vw"
              />
            </div>
          ) : (
            <div className="flex aspect-[5/4] items-end bg-linear-to-br from-stone-100 via-stone-50 to-amber-100 p-4">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-black/55">
                Featured entry
              </span>
            </div>
          )}

          <div className="flex flex-1 flex-col gap-3 p-4" style={{ backgroundColor }}>
            {creature.creatureIndex !== null || creature.rating !== null ? (
              <div className="flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-black/60">
                {creature.creatureIndex !== null ? (
                  <span className="rounded-full border border-black/10 px-2.5 py-1">
                    #{creature.creatureIndex}
                  </span>
                ) : null}
                {creature.rating !== null ? (
                  <span className="rounded-full border border-black/10 px-2.5 py-1">
                    Rating {creature.rating}
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <h3 className="text-lg font-semibold leading-snug">{creature.name}</h3>
              <p className="text-sm leading-6 text-gray-700">{excerpt || null}</p>
            </div>
          </div>
        </article>
      </Link>
    </li>
  );
};

export default CreatureCardView;
