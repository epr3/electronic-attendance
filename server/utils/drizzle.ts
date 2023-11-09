import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "~/drizzle/schema";

const runtimeConfig = useRuntimeConfig();
const queryClient = postgres(runtimeConfig.databaseUrl);
const db = drizzle(queryClient, { schema });

export { db, schema };
