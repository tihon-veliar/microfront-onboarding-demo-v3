import type { Metadata } from "next";

import type { ContentfulImage } from "@/lib/contentful/types";

import {
  fallbackDescription,
  fallbackImage,
  fallbackTitle,
  metadataBase,
} from "./defaults";

type BuildMetadataParams = {
  title?: string;
  description?: string;
  image?: ContentfulImage | null;
  pathname?: string;
};

function resolveImage(image?: ContentfulImage | null): NonNullable<Metadata["openGraph"]>["images"] {
  if (!image?.url) {
    return fallbackImage;
  }

  return [
    {
      url: image.url,
      width: image.width,
      height: image.height,
      alt: image.alt || fallbackTitle,
    },
  ];
}

export function buildMetadata({
  title,
  description,
  image,
  pathname,
}: BuildMetadataParams): Metadata {
  const resolvedTitle = title?.trim() || fallbackTitle;
  const resolvedDescription = description?.trim() || fallbackDescription;
  const resolvedImages = resolveImage(image);

  return {
    metadataBase,
    title: title?.trim()
      ? resolvedTitle
      : {
          default: fallbackTitle,
          template: `%s | ${fallbackTitle}`,
        },
    description: resolvedDescription,
    alternates: pathname
      ? {
          canonical: pathname,
        }
      : undefined,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      type: "website",
      url: pathname,
      images: resolvedImages,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: resolvedImages,
    },
  };
}
