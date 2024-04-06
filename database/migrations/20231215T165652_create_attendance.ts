import { Kysely, sql } from "kysely";
import { EDUCATION_LEVEL } from "../schema";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("education_level")
    .asEnum(Object.values(EDUCATION_LEVEL))
    .execute();

  await db.schema
    .createTable("subjects")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("school_id", "varchar", (col) =>
      col.notNull().references("schools.id").onDelete("cascade")
    )
    .execute();

  await db.schema
    .createTable("classes")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("is_active", "boolean", (col) => col.notNull().defaultTo(true))
    .addColumn("education_level", sql`education_level`, (col) => col.notNull())
    .addColumn("year", "integer", (col) => col.notNull())
    .addColumn("head_teacher_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .execute();

  await db.schema
    .createTable("classes_students")
    .addColumn("id", "varchar", (col) => col.primaryKey())

    .addColumn("class_id", "varchar", (col) =>
      col.notNull().references("classes.id").onDelete("cascade")
    )
    .addColumn("student_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .execute();

  await db.schema
    .createTable("schedules")
    .addColumn("id", "varchar", (col) => col.primaryKey())

    .addColumn("class_id", "varchar", (col) =>
      col.notNull().references("classes.id").onDelete("cascade")
    )
    .addColumn("subject_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("teacher_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("calendar_rule", "varchar", (col) => col.notNull())
    .addColumn("start_time", "varchar", (col) => col.notNull())
    .addColumn("end_time", "varchar", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("schedules_students")
    .addColumn("id", "varchar", (col) => col.primaryKey())

    .addColumn("student_id", "varchar", (col) =>
      col.notNull().references("users.id").onDelete("cascade")
    )
    .addColumn("schedule_id", "varchar", (col) =>
      col.notNull().references("schedules.id").onDelete("cascade")
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("schedules_students").execute();
  await db.schema.dropTable("schedules").execute();
  await db.schema.dropTable("classes_students").execute();
  await db.schema.dropTable("school_terms").execute();
  await db.schema.dropTable("parents").execute();
  await db.schema.dropTable("classes").execute();
  await db.schema.dropTable("subjects").execute();
}