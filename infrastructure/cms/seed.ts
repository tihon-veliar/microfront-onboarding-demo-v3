import inquirer from "inquirer";
import { createClient } from "contentful-management";

import { seedTaxonomies } from "./seeds/taxonomy";
import { seedCreatures } from "./seeds/creature";

type SeedTarget = "all" | "taxonomies" | "creatures" | "exit";

type SeedOption = {
  key: string;
  value: SeedTarget;
  label: string;
  description: string;
};

const SEED_OPTIONS: SeedOption[] = [
  {
    key: "0",
    value: "exit",
    label: "❌ Exit",
    description: "Close the seed runner",
  },
  {
    key: "1",
    value: "creatures",
    label: "🧬 Creatures",
    description: "Seed core entities (requires taxonomies)",
  },
  {
    key: "2",
    value: "taxonomies",
    label: "🏷️  Taxonomies",
    description: "Seed classification structure",
  },
  {
    key: "3",
    value: "all",
    label: "🚀 All",
    description: "Full seed pipeline (taxonomies → creatures)",
  },
];

function renderSeedOptions(): void {
  const lines = SEED_OPTIONS.map(
    (option) => `  ${option.key}) ${option.label}\n     ${option.description}`,
  ).join("\n\n");

  console.log(`
========================================
   MACH CMS SEED RUNNER
========================================

Select seed target:

${lines}

----------------------------------------
Use ↑ ↓ arrows or press 0 / 1 / 2 / 3
----------------------------------------
`);
}

const seedChoices = SEED_OPTIONS.map((option) => ({
  name: `${option.key}) ${option.label}`,
  value: option.value,
  description: option.description,
}));

async function promptTarget(): Promise<SeedTarget> {
  renderSeedOptions();

  const answer = await inquirer.prompt([
    {
      type: "select",
      name: "target",
      message: "Choose option",
      choices: seedChoices,
      loop: false,
    },
  ]);

  return answer.target as SeedTarget;
}

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

  const target = await promptTarget();

  if (target === "exit") {
    console.log("Exit.");
    return;
  }

  if (target === "all" || target === "taxonomies") {
    await seedTaxonomies(client);
  }

  if (target === "all" || target === "creatures") {
    if (target === "creatures") {
      console.warn("Ensure taxonomies are seeded first");
    }
    await seedCreatures(client);
  }
}
