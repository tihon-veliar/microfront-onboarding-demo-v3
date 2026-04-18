import type { BestiaryPageViewData } from "@/services/cms/pages/getBestiaryPageData";

type BestiaryGridProps = {
  items: BestiaryPageViewData["creatures"];
};

const BestiaryGrid = ({ items }: BestiaryGridProps) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full">
      {items.map((item) => (
        <li key={item.id}>
          <article>
            <h2>{item.name}</h2>
            <p>{item.slug}</p>
            {item.creatureIndex !== null ? <p>#{item.creatureIndex}</p> : null}
          </article>
        </li>
      ))}
    </ul>
  );
};

export default BestiaryGrid;
