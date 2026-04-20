import type { CreatureDetail, TaxonomyTerm } from "@/lib/contentful/types";
import Link from "next/link";

import CmsImage from "@/src/components/CmsImage";
import RichText from "@/src/components/RichText";

type CreaturePageProps = {
  creature: CreatureDetail;
  taxonomyTerms?: TaxonomyTerm[];
};

const SURFACE_BACKGROUND_COLORS = [
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
  const pageAccentColor =
    SURFACE_BACKGROUND_COLORS[
      getDeterministicIndex(`${creature.id}-${creature.slug}`, SURFACE_BACKGROUND_COLORS.length)
    ];
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
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-0 py-2 md:gap-8 md:px-8 md:py-8">
      <div>
        <Link className="inline-flex min-h-11 items-center justify-center " href="/bestiary">
          {"< "} Back to bestiary
        </Link>
      </div>

      <section
        style={{ backgroundColor: pageAccentColor }}
        className="flex! relative m-auto mt-5 max-w-980 flex-row overflow-hidden rounded-[2rem] border border-slate-900/10 shadow-[0_24px_60px_rgba(15,23,42,0.12)] max-[1020px]:flex-col"
      >
        <div className="flex flex-col flex-2 px-5 pt-5 md:px-8 md:pt-8">
          <section className=" bg-white/10 backdrop-blur supports-backdrop-filter:bg-white/1">
            <div className="overflow-hidden">
              <div className="relative ">
                {creature.image ? (
                  <CmsImage
                    image={creature.image}
                    alt={creature.image.alt || creature.name}
                    className="h-auto w-full object-contain p-5 md:p-8"
                    preload
                    sizes="(min-width: 1024px) 896px, 100vw"
                  />
                ) : null}
              </div>
            </div>
          </section>
          <div className="flex-1" style={{ backgroundColor: pageAccentColor }}>
            {hasTaxonomyTerms ? (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-950 md:text-2xl">Taxonomy</h2>
                <div className="flex flex-wrap gap-3">
                  {taxonomyTerms.map((term) => (
                    <Link
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-900/10 px-3.5 py-2 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-950/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/70 focus-visible:ring-offset-2"
                      href={`/bestiary?selectedTerms=${term.id}`}
                      key={term.id}
                      style={{
                        backgroundColor:
                          SURFACE_BACKGROUND_COLORS[
                            getDeterministicIndex(
                              `${term.id}-${term.title}`,
                              SURFACE_BACKGROUND_COLORS.length,
                            )
                          ],
                      }}
                    >
                      <span aria-hidden="true" className="text-slate-700">
                        [#]
                      </span>
                      <span>{term.title}</span>
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  Click a taxonomy tag to open the bestiary filtered by that term.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex-3">
          <header className="border-b border-slate-900/10 px-5 py-6 md:px-8 md:py-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
                  {creature.name}
                </h1>
              </div>

              {metrics.length > 0 ? (
                <div className="flex flex-wrap gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-black/60">
                  {metrics.map((metric) => (
                    <span
                      className="rounded-full border border-black/10 px-2.5 py-1"
                      key={metric.label}
                      style={{ backgroundColor: pageAccentColor }}
                    >
                      {metric.label} {metric.value}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {hasShortDescription ? (
              <div className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 md:text-base">
                <RichText content={creature.shortDescription} />
              </div>
            ) : null}
          </header>

          <section className="space-y-8 px-5 py-5 md:px-8 md:py-8">
            {hasDescription ? (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-950 md:text-2xl">Description</h2>
                <div className="rounded-[1.5rem] border border-slate-900/10 px-5 py-5 text-slate-700 bg-white">
                  <div className="prose prose-slate max-w-none">
                    <RichText content={creature.description} />
                  </div>
                </div>
              </div>
            ) : null}

            {hasAbilities ? (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-slate-950 md:text-2xl">Abilities</h2>
                <ul className="flex flex-wrap gap-3">
                  {creature.abilities.map((ability) => (
                    <li key={ability}>
                      <span
                        className="inline-flex min-h-11 items-center rounded-full border border-slate-900/10 px-4 py-2 text-sm font-medium text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                        style={{
                          backgroundColor:
                            SURFACE_BACKGROUND_COLORS[
                              getDeterministicIndex(ability, SURFACE_BACKGROUND_COLORS.length)
                            ],
                        }}
                      >
                        {ability}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {hasExternalLink ? (
              <div>
                <a
                  className="inline-flex min-h-11 items-center"
                  href={creature.externalResourceLink}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  External resource
                </a>
              </div>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
};

export default CreaturePage;
