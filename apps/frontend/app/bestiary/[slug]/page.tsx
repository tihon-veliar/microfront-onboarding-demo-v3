import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { fromCreature } from "@/lib/metadata/fromCreature";
import CreaturePage from "@/src/features/creature";
import { getCreatureBySlug } from "@/services/cms/getCreatureBySlug";
import { getTaxonomyTerms } from "@/services/cms/getTaxonomyTerms";

type CreatureRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: CreatureRouteProps): Promise<Metadata> {
  const { slug } = await props.params;
  const creature = await getCreatureBySlug(slug);

  if (!creature) {
    notFound();
  }

  return fromCreature(creature);
}

export default async function Creature(props: CreatureRouteProps) {
  const { slug } = await props.params;
  const creature = await getCreatureBySlug(slug);

  if (!creature) {
    notFound();
  }

  const taxonomyTerms = creature.taxonomyIds.length
    ? (await getTaxonomyTerms()).filter((term) => creature.taxonomyIds.includes(term.id))
    : [];

  return <CreaturePage creature={creature} taxonomyTerms={taxonomyTerms} />;
}
