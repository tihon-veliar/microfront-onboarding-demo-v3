import type { CreatureDetail, TaxonomyTerm } from "@/lib/contentful/types";
import Link from "next/link";

import CmsImage from "@/src/components/CmsImage";
import RichText from "@/src/components/RichText";

type CreaturePageProps = {
  creature: CreatureDetail;
  taxonomyTerms?: TaxonomyTerm[];
};

function formatMetric(value: number | null, label: string) {
  if (value === null) {
    return null;
  }

  return {
    label,
    value,
  };
}

const CreaturePage = ({ creature, taxonomyTerms = [] }: CreaturePageProps) => {
  const metrics = [
    formatMetric(creature.creatureIndex, "Index"),
    formatMetric(creature.height, "Height"),
    formatMetric(creature.weight, "Weight"),
    formatMetric(creature.rating, "Rating"),
  ].filter((metric): metric is { label: string; value: number } => metric !== null);

  const hasShortDescription = creature.shortDescription?.nodeType === "document";
  const hasDescription = creature.description?.nodeType === "document";
  const hasAbilities = creature.abilities.length > 0;
  const hasTaxonomyTerms = taxonomyTerms.length > 0;
  const hasExternalLink = creature.externalResourceLink.trim().length > 0;

  return (
    <main className="w-full max-w-4xl p-0 md:p-8">
      <div className="mb-6">
        <Link className="inline-block" href="/bestiary">
          Back to bestiary
        </Link>
      </div>

      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold">{creature.name}</h1>
        {hasShortDescription ? <RichText content={creature.shortDescription} /> : null}
      </header>

      {creature.image ? (
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-md border">
            <CmsImage
              image={creature.image}
              alt={creature.image.alt || creature.name}
              className="h-auto w-full"
              preload
              sizes="(min-width: 1024px) 896px, 100vw"
            />
          </div>
        </section>
      ) : null}

      {hasTaxonomyTerms || metrics.length > 0 ? (
        <section className="mb-8 space-y-4">
          {hasTaxonomyTerms ? (
            <div className="flex flex-wrap gap-2">
              {taxonomyTerms.map((term) => (
                <span className="rounded border px-3 py-1 text-sm" key={term.id}>
                  {term.title}
                </span>
              ))}
            </div>
          ) : null}

          {metrics.length > 0 ? (
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {metrics.map((metric) => (
                <div className="rounded border p-3" key={metric.label}>
                  <dt className="text-sm text-gray-600">{metric.label}</dt>
                  <dd className="text-lg font-semibold">{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-6">
        {hasDescription ? (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Description</h2>
            <div className="space-y-3">
              <RichText content={creature.description} />
            </div>
          </div>
        ) : null}

        {hasAbilities ? (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Abilities</h2>
            <ul className="list-disc space-y-1 pl-5">
              {creature.abilities.map((ability) => (
                <li key={ability}>{ability}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {hasExternalLink ? (
          <div>
            <a
              className="underline"
              href={creature.externalResourceLink}
              rel="noreferrer noopener"
              target="_blank"
            >
              External resource
            </a>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default CreaturePage;
