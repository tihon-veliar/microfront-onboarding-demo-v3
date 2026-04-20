import Link from "next/link";

import type { BestiaryPageViewData } from "@/services/cms/pages/getBestiaryPageData";
import CmsImage from "@/src/components/CmsImage";

type BestiaryGridProps = {
  items: BestiaryPageViewData["creatures"];
};

const BestiaryGrid = ({ items }: BestiaryGridProps) => {
  return (
    <ul className="grid grid-cols-1 w-full gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={`/bestiary/${item.slug}`}>
            <article className="space-y-3">
              {item.image ? (
                <div className="overflow-hidden rounded-md border">
                  <CmsImage
                    image={item.image}
                    alt={item.image.alt || item.name}
                    className="aspect-[4/3] w-full object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              ) : null}
              <h2>{item.name}</h2>
              {item.creatureIndex !== null ? <p>#{item.creatureIndex}</p> : null}
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default BestiaryGrid;
