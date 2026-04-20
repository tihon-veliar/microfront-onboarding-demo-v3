import { CreatureCard, HomePageData } from "@/lib/contentful/types";
import Banner from "@/src/components/Banner";
import RichText from "@/src/components/RichText";
import Link from "next/link";

type HomePageProps = {
  homePage: HomePageData;
  featuredCreatures: CreatureCard[];
};

const HomePage = ({ homePage, featuredCreatures }: HomePageProps) => {
  const { title, slug, hero, imageTextSection } = homePage;

  console.log(hero);
  console.log(imageTextSection);

  return (
    <div className="p-0 md:p-8">
      <Banner image={imageTextSection?.image} />

      <h1 className="mb-4 text-center text-4xl font-bold">{title}</h1>

      <div className="mb-4 [&_p]:text-center">
        <RichText content={imageTextSection?.content} />
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/bestiary">
          <p className="text-[20px] md:text-[30px]">Research</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
