import Image, { type ImageProps } from "next/image";

import {
  getContentfulImageUrl,
  getContentfulBlurImageUrl,
  type ContentfulImageTransformOptions,
} from "@/lib/contentful/image";
import type { ContentfulImage } from "@/lib/contentful/types";

type CmsImageProps = Omit<
  ImageProps,
  "src" | "alt" | "width" | "height" | "blurDataURL" | "placeholder" | "loader"
> & {
  image?: ContentfulImage | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  transform?: ContentfulImageTransformOptions;
  blurTransform?: ContentfulImageTransformOptions;
  enableBlur?: boolean;
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

const CmsImage = ({
  image,
  alt,
  width,
  height,
  className,
  imageClassName,
  transform,
  blurTransform,
  enableBlur = true,
  fill,
  ...props
}: CmsImageProps) => {
  if (!image?.url) {
    return null;
  }

  const resolvedAlt = alt ?? image.alt ?? "";
  const resolvedWidth = width ?? image.width;
  const resolvedHeight = height ?? image.height;
  const resolvedSrc = getContentfulImageUrl(image, transform) ?? image.url;
  const blurDataURL = enableBlur ? getContentfulBlurImageUrl(image, blurTransform) : null;

  if (!fill && (!resolvedWidth || !resolvedHeight)) {
    return null;
  }

  console.log(blurDataURL);
  return (
    <Image
      {...props}
      alt={resolvedAlt}
      blurDataURL={blurDataURL ?? undefined}
      className={joinClassNames(className, imageClassName) || undefined}
      fill={fill}
      height={fill ? undefined : resolvedHeight}
      placeholder={blurDataURL ? "blur" : "empty"}
      src={resolvedSrc}
      width={fill ? undefined : resolvedWidth}
    />
  );
};

export default CmsImage;
