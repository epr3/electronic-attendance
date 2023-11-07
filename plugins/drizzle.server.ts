import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "~/drizzle/schema";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const queryClient = postgres(config.databaseUrl);
  const db = drizzle(queryClient, { schema });

  return {
    provide: {
      db,
      schema,
    },
  };
});
