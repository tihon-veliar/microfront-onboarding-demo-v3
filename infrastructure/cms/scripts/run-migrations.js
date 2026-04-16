const path = require('node:path');
const { runMigration } = require('contentful-migration');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const rootDir = path.resolve(__dirname, '..');

const files = [
  '01-taxonomyTerm.js',
  '02-creature.js',
  '03-heroBlock.js',
  '04-imageTextBlock.js',
  '05-featuredCreaturesBlock.js',
  '06-homePage.js',
  '07-archivePage.js',
];

async function main() {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID, CONTENTFUL_MANAGEMENT_TOKEN } = process.env;

  for (const file of files) {
    console.log(`Running migration: ${file}`);

    await runMigration({
      filePath: path.join(rootDir, 'migrations', file),
      spaceId: CONTENTFUL_SPACE_ID,
      environmentId: CONTENTFUL_ENVIRONMENT_ID,
      accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
      yes: true,
    });
  }

  console.log('All migrations completed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});