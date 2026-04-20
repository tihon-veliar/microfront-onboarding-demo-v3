import { notFound } from "next/navigation";

import CreaturePage from "@/src/features/creature";
import { getCreatureBySlug } from "@/services/cms/getCreatureBySlug";
import { getTaxonomyTerms } from "@/services/cms/getTaxonomyTerms";

type CreatureRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

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
