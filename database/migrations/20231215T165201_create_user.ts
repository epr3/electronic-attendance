import { Kysely, sql } from "kysely";
import { TOKEN_TYPE } from "../schema";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("first_name", "varchar", (col) => col.notNull())
    .addColumn("last_name", "varchar", (col) => col.notNull())
    .addColumn("telephone", "varchar", (col) => col.notNull())
    .addColumn("address", "varchar")
    .addColumn("email", "varchar", (col) => col.notNull().unique())
    .addColumn("mfa_enabled", "boolean", (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("verified_at", "timestamp")
    .execute();

  await db.schema
    .createTable("user_keys")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("user_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("hashed_password", "varchar", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("user_mfas")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("user_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("secret", "varchar", (col) => col.notNull())
    .addColumn("email_only", "boolean", (col) => col.notNull().defaultTo(true))
    .execute();

  await db.schema
    .createType("token_type")
    .asEnum(Object.values(TOKEN_TYPE))
    .execute();

  await db.schema
    .createTable("tokens")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("email", "varchar", (col) =>
      col.notNull().references("users.email").onDelete("cascade")
    )
    .addColumn("token", "varchar", (col) => col.notNull())
    .addColumn("type", sql`token_type`, (col) => col.notNull())
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("user_sessions")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("user_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("mfa_verified", "boolean", (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn("created_at", "timestamp", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user_sessions").execute();
  await db.schema.dropTable("tokens").execute();
  await db.schema.dropTable("user_mfas").execute();
  await db.schema.dropTable("user_keys").execute();
  await db.schema.dropTable("users").execute();
}
