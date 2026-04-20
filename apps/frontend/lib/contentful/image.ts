import type { ContentfulImage } from "./types";

export type ContentfulImageFormat = "jpg" | "png" | "webp" | "avif";

export type ContentfulImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: ContentfulImageFormat;
  progressive?: boolean;
};

type ContentfulImageLike = Pick<ContentfulImage, "url">;

function toPositiveInteger(value?: number): number | null {
  if (!Number.isFinite(value) || !value || value <= 0) {
    return null;
  }

  return Math.round(value);
}

function getSafeUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function getContentfulImageUrl(
  image?: ContentfulImageLike | null,
  options: ContentfulImageTransformOptions = {},
): string | null {
  if (!image?.url) {
    return null;
  }

  const url = getSafeUrl(image.url);

  if (!url) {
    return image.url;
  }

  const width = toPositiveInteger(options.width);
  const height = toPositiveInteger(options.height);
  const quality = toPositiveInteger(options.quality);

  if (width) {
    url.searchParams.set("w", String(width));
  }

  if (height) {
    url.searchParams.set("h", String(height));
  }

  if (quality) {
    url.searchParams.set("q", String(quality));
  }

  if (options.format) {
    url.searchParams.set("fm", options.format);
  }

  if (options.progressive) {
    url.searchParams.set("fl", "progressive");
  }

  return url.toString();
}

export function getContentfulBlurImageUrl(
  image?: ContentfulImageLike | null,
  options: ContentfulImageTransformOptions = {},
): string | null {
  return getContentfulImageUrl(image, {
    width: options.width ?? 24,
    height: options.height ?? 24,
    quality: options.quality ?? 20,
    format: options.format ?? "jpg",
  });
}
