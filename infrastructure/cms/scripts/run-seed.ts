import "dotenv/config";
import { runSeed } from "../seed";

async function main() {
  try {
    await runSeed();
    console.log("Seed completed");
  } catch (e) {
    console.error("Seed failed:", e);
    process.exit(1);
  }
}

main();
