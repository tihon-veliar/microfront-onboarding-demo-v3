import { notFound } from "next/navigation";
import HomePage from "@/src/features/home";
import { getHomePageData } from "@/services/cms/pages/getHomePageData";

export default async function Home() {
  const data = await getHomePageData();

  if (!data) {
    notFound();
  }

  return <HomePage homePage={data.homePage} featuredCreatures={data.featuredCreatures} />;
}
