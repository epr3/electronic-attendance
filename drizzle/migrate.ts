/* eslint-disable no-console */
import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// for migrations
const client = postgres(process.env.DATABASE_URL as string, { max: 1 });

const db = drizzle(client);
async function main() {
  try {
    await migrate(db, {
      migrationsFolder: "./drizzle/migrations",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

main();
