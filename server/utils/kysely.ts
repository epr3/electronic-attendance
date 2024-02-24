import { type Database } from "~/database/schema"; // this is the Database interface we defined earlier
import pg from "pg";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";

const { Pool } = pg;

const runtimeConfig = useRuntimeConfig();
const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: runtimeConfig.databaseUrl,
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
