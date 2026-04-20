import type { SeoFields } from "@/lib/contentful/types";

import { buildMetadata } from "./buildMetadata";

export function fromSeo(seo: SeoFields | null | undefined) {
  return buildMetadata({
    title: seo?.title,
    description: seo?.description,
    image: seo?.image,
  });
}
