import path from "node:path";
import { runMigration } from "contentful-migration";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const rootDir = path.resolve(__dirname, "..");

const files = [
  "01-taxonomyTerm.ts",
  "02-creature.ts",
  "03-heroBlock.ts",
  "04-imageTextBlock.ts",
  "05-featuredCreaturesBlock.ts",
  "06-homePage.ts",
  "07-archivePage.ts",
];

async function main() {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID, CONTENTFUL_MANAGEMENT_TOKEN } =
    process.env;

  for (const file of files) {
    console.log(`Running migration: ${file}`);

    await runMigration({
      filePath: path.join(rootDir, "migrations", file),
      spaceId: CONTENTFUL_SPACE_ID,
      environmentId: CONTENTFUL_ENVIRONMENT_ID,
      accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
      yes: true,
    });
  }

  console.log("All migrations completed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
