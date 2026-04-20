import type { BestiaryPageViewData } from "@/services/cms/pages/getBestiaryPageData";
import CreatureCardView from "@/src/components/CreatureCard";

type BestiaryGridProps = {
  items: BestiaryPageViewData["creatures"];
};

const BestiaryGrid = ({ items }: BestiaryGridProps) => {
  return (
    <ul className="grid grid-cols-1 w-full gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2">
      {items.map((item) => (
        <CreatureCardView creature={item} key={item.id} />
      ))}
    </ul>
  );
};

export default BestiaryGrid;
