import type { ContentfulImage } from "@/lib/contentful/types";
import CmsImage from "@/src/components/CmsImage";

interface BannerProps {
  image?: ContentfulImage | null;
}

const Banner = ({ image }: BannerProps) => {
  if (!image?.url) return null;

  console.log(image);
  return (
    <div className="text-center">
      <div className="relative mx-auto max-h-400 w-fit">
        <CmsImage
          image={image}
          alt={image.alt || "Banner"}
          width={500}
          height={250}
          className="rounded-md object-cover animate-pulse-banner"
          sizes="(min-width: 768px) 800px, 100vw"
        />
      </div>
    </div>
  );
};

export default Banner;
