import { getCreaturesByIds } from "@/services/cms/getCreaturesByIds";
import { getHomePage } from "@/services/cms/getHomePage";
import type { CreatureCard, HomePageData } from "@/lib/contentful/types";

export type HomePageViewData = {
  homePage: HomePageData;
  featuredCreatures: CreatureCard[];
};

export async function getHomePageData(): Promise<HomePageViewData | null> {
  const homePage = await getHomePage();

  if (!homePage) {
    return null;
  }

  const featuredCreatureIds = homePage.featuredSection?.creatureIds ?? [];
  const featuredCreatures =
    featuredCreatureIds.length > 0 ? await getCreaturesByIds(featuredCreatureIds) : [];

  return {
    homePage,
    featuredCreatures,
  };
}
