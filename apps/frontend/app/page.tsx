import { notFound } from "next/navigation";
import HomePage from "@/src/features/home";
import { getHomePageData } from "@/services/cms/pages/getHomePageData";
import { fromSeo } from "@/lib/metadata/fromSeo";
import { getHomePage } from "@/services/cms/getHomePage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage();

  return fromSeo(homePage?.seo);
}

export default async function Home() {
  const data = await getHomePageData();

  if (!data) {
    notFound();
  }

  return <HomePage homePage={data.homePage} featuredCreatures={data.featuredCreatures} />;
}
