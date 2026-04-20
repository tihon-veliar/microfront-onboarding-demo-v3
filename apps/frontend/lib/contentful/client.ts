import { createClient } from "contentful";

import { contentfulConfig } from "./config";

export const contentfulClient = createClient({
  space: contentfulConfig.spaceId!,
  accessToken: contentfulConfig.accessToken!,
  environment: contentfulConfig.environment!,
});
