import Link from "next/link";

import type { CreatureCard } from "@/lib/contentful/types";

import CreatureCardView from "@/src/components/CreatureCard";

type FeaturedCreaturesSectionProps = {
  creatures: CreatureCard[];
  title?: string;
};

const FeaturedCreaturesSection = ({
  creatures,
  title = "Featured Creatures",
}: FeaturedCreaturesSectionProps) => {
  if (creatures.length === 0) {
    return null;
  }

  console.log(creatures);

  return (
    <section className="mt-12 space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
        </div>
        <p className="max-w-2xl text-sm text-gray-700 md:text-base">
          A quick field guide to the most curious entries from the archive.
        </p>
      </div>

      <div className="scrollbar-featured -mx-4 overflow-x-auto bg-transparent px-4 pb-4 md:mx-0 md:px-0">
        <ul className=" p-1 grid grid-flow-col auto-cols-[84%] gap-4 snap-x snap-mandatory sm:auto-cols-[60%] lg:auto-cols-[20rem]">
          {creatures.map((creature) => (
            <CreatureCardView creature={creature} key={creature.id} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeaturedCreaturesSection;
