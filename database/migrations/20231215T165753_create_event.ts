import { Kysely, sql } from "kysely";
import {
  ABSENCE_TYPE,
  APPROVAL_STATUS,
  EVENT_TYPE,
  PRIMARY_SCHOOL_MARKS,
} from "../schema";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("absence_type")
    .asEnum(Object.values(ABSENCE_TYPE))
    .execute();

  await db.schema
    .createType("event_type")
    .asEnum(Object.values(EVENT_TYPE))
    .execute();

  await db.schema
    .createType("approval_status")
    .asEnum(Object.values(APPROVAL_STATUS))
    .execute();

  await db.schema
    .createType("primary_school_marks")
    .asEnum(Object.values(PRIMARY_SCHOOL_MARKS))
    .execute();

  await db.schema
    .createTable("events")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("schedule_student_id", "varchar", (col) =>
      col.notNull().references("schedules_students.id").onDelete("cascade")
    )
    .addColumn("event_type", sql`event_type`, (col) => col.notNull())
    .addColumn("date", "date", (col) => col.notNull())

    .execute();

  await db.schema
    .createTable("absences")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("accounted", "varchar", (col) => col.notNull())
    .addColumn("absence_type", sql`absence_type`, (col) => col.notNull())
    .addColumn("year", "integer", (col) => col.notNull())
    .addColumn("event_id", "varchar", (col) =>
      col.notNull().references("events.id").onDelete("cascade")
    )
    .execute();

  await db.schema
    .createTable("absence_docs")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("absence_id", "varchar", (col) =>
      col.notNull().references("absences.id").onDelete("cascade")
    )
    .addColumn("doc_url", "varchar", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("grades")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("grade", "integer", (col) => col.notNull())
    .addColumn("description", "varchar")
    .addColumn("event_id", "varchar", (col) =>
      col.notNull().references("events.id").onDelete("cascade")
    )
    .execute();

  await db.schema
    .createTable("marks")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("mark", sql`primary_school_marks`, (col) => col.notNull())
    .addColumn("description", "varchar")
    .addColumn("event_id", "varchar", (col) =>
      col.notNull().references("events.id").onDelete("cascade")
    )
    .execute();

  await db.schema
    .createTable("approvals")
    .addColumn("id", "varchar", (col) => col.primaryKey())

    .addColumn("event_id", "varchar", (col) =>
      col.notNull().references("events.id").onDelete("cascade")
    )
    .addColumn("approval_status", sql`approval_status`, (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("approvals").execute();
  await db.schema.dropTable("marks").execute();
  await db.schema.dropTable("grades").execute();
  await db.schema.dropTable("absence_docs").execute();
  await db.schema.dropTable("absences").execute();
  await db.schema.dropTable("events").execute();
}
