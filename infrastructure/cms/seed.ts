import { createClient } from "contentful-management";

import { seedTaxonomies } from "./seeds/taxonomy";
import { seedCreatures } from "./seeds/creature";

export function createManagementClient() {
  return createClient(
    {
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
    },
    {
      type: "plain",
      defaults: {
        spaceId: process.env.CONTENTFUL_SPACE_ID!,
        environmentId: process.env.CONTENTFUL_ENV!,
      },
    },
  );
}

export async function runSeed(): Promise<void> {
  const client = createManagementClient();

  await seedTaxonomies(client);
  await seedCreatures(client);
}
