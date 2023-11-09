import "lucia/polyfill/node";
import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import { lucia } from "lucia";
import { h3 } from "lucia/middleware";
import postgres from "postgres";

const runtimeConfig = useRuntimeConfig();
const sql = postgres(runtimeConfig.databaseUrl);

export const auth = lucia({
  adapter: postgresAdapter(sql, {
    user: "users",
    key: "user_keys",
    session: "user_sessions",
  }),
  env: process.dev ? "DEV" : "PROD",
  middleware: h3(),

  getUserAttributes: (data) => {
    return {
      ...data,
    };
  },
  getSessionAttributes: (databaseSession) => {
    return {
      ...databaseSession,
    };
  },
});

export type Auth = typeof auth;
