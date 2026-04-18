import { ContentfulImage } from "@/lib/contentful/types";
import Image from "next/image";

interface BannerProps {
  image?: ContentfulImage | null;
}

const Banner = ({ image }: BannerProps) => {
  if (!image?.url) return null;

  return (
    <div className="text-center">
      <div className="relative mx-auto max-h-400 w-fit">
        <Image
          src={image.url}
          alt={image.alt || "Banner"}
          width={800} // лучше реальные размеры из CMS
          height={400}
          className="rounded-md object-cover animate-pulse-banner"
        />
      </div>
    </div>
  );
};

export default Banner;
