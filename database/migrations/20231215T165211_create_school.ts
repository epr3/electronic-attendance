import { Kysely, sql } from "kysely";
import { ROLE } from "../schema";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createType("role").asEnum(Object.values(ROLE)).execute();

  await db.schema
    .createTable("schools")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("schools_users")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("user_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("school_id", "varchar", (col) =>
      col.notNull().references("schools.id").onDelete("cascade")
    )
    .addColumn("role", sql`role`, (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("parents")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("parent_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("student_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .execute();

  await db.schema
    .createTable("school_terms")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("start_date", "date", (col) => col.notNull())
    .addColumn("end_date", "date", (col) => col.notNull())
    .addColumn("school_id", "varchar", (col) =>
      col.notNull().references("schools.id").onDelete("cascade")
    )
    .execute();

  await db.schema
    .createTable("school_holidays")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("start_date", "date", (col) => col.notNull())
    .addColumn("end_date", "date", (col) => col.notNull())
    .addColumn("school_id", "varchar", (col) =>
      col.notNull().references("schools.id").onDelete("cascade")
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("school_holidays").execute();
  await db.schema.dropTable("school_terms").execute();
  await db.schema.dropTable("schools_users").execute();
  await db.schema.dropTable("schools").execute();
}
