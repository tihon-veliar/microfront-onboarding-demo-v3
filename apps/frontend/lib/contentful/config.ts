export const contentfulConfig = {
  spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT ?? "master",
} as const;

if (!contentfulConfig.spaceId) {
  throw new Error("Missing NEXT_PUBLIC_CONTENTFUL_SPACE_ID");
}

if (!contentfulConfig.accessToken) {
  throw new Error("Missing CONTENTFUL_DELIVERY_TOKEN");
}
