import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export enum TOKEN_TYPE {
  VALIDATION = "VALIDATION",
  RESET_PASSWORD = "RESET_PASSWORD",
}

export enum ROLE {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  DIRECTOR = "DIRECTOR",
  SCHOOL = "SCHOOL",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export enum ABSENCE_TYPE {
  MEDICAL = "MEDICAL",
  PARENT = "PARENT",
  TEACHER = "TEACHER",
}

export enum EVENT_TYPE {
  ABSENCE = "ABSENCE",
  GRADE = "GRADE",
}

export enum APPROVAL_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const role = pgEnum("role", [
  ROLE.SUPERADMIN,
  ROLE.ADMIN,
  ROLE.DIRECTOR,
  ROLE.SCHOOL,
  ROLE.TEACHER,
  ROLE.STUDENT,
]);

export const approvalStatus = pgEnum("approval_status", [
  APPROVAL_STATUS.APPROVED,
  APPROVAL_STATUS.REJECTED,
  APPROVAL_STATUS.PENDING,
]);

export const eventType = pgEnum("event_type", [
  EVENT_TYPE.ABSENCE,
  EVENT_TYPE.GRADE,
]);

export const absenceType = pgEnum("absence_type", [
  ABSENCE_TYPE.MEDICAL,
  ABSENCE_TYPE.PARENT,
  ABSENCE_TYPE.TEACHER,
]);

export const tokenType = pgEnum("token_type", [
  TOKEN_TYPE.RESET_PASSWORD,
  TOKEN_TYPE.VALIDATION,
]);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  telephone: varchar("telephone", { length: 100 }).notNull(),
  mfaEnabled: boolean("mfa_enabled").default(false),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userKeys = pgTable("user_keys", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  hashedPassword: text("hashed_password"),
});

export const userSessions = pgTable("user_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  mfaVerified: boolean("mfa_verified").default(false),
  expiresAt: timestamp("expires_at").notNull().defaultNow(),
});

export const tokens = pgTable("tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: varchar("email")
    .references(() => users.email, { onDelete: "cascade" })
    .notNull(),
  tokenType: tokenType("token_type").notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const schools = pgTable("schools", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 100 }).notNull(),
  acronym: varchar("acronym", { length: 10 }).notNull(),
  logo: text("logo"),
});

export const schoolsUsers = pgTable("schools_users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  schoolId: text("school_id")
    .references(() => schools.id, {
      onDelete: "cascade",
    })
    .notNull(),
  role: role("role").notNull(),
});

export const userMfas = pgTable("user_mfas", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  secret: text("secret").notNull(),
  smsOnly: boolean("mfa_sms_only").default(true),
});

export const schoolYears = pgTable("school_years", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  schoolDateRule: text("school_date_rule").notNull(),
  schoolId: text("school_id")
    .references(() => schools.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const schoolYearHolidays = pgTable("school_year_holidays", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 100 }).notNull(),
  holidayDateRule: text("holiday_date_rule").notNull(),
  schoolYearId: text("school_year_id")
    .references(() => schoolYears.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const parentsStudents = pgTable("parents_students", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  parentId: text("parent_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  studentId: text("student_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const subjects = pgTable("subjects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 100 }).notNull(),
  schoolId: text("school_id")
    .references(() => schools.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const classes = pgTable("classes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar("name", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true),
  schoolId: text("school_id")
    .references(() => schools.id, {
      onDelete: "cascade",
    })
    .notNull(),
  schoolYearId: text("school_year_id")
    .references(() => schoolYears.id, {
      onDelete: "cascade",
    })
    .notNull(),
  headTeacherId: text("head_teacher_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const subjectsStudents = pgTable("subjects_students", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  subjectId: text("subject_id")
    .references(() => subjects.id, {
      onDelete: "cascade",
    })
    .notNull(),
  studentId: text("student_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const classesStudents = pgTable("classes_students", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  classId: text("class_id")
    .references(() => classes.id, {
      onDelete: "cascade",
    })
    .notNull(),
  studentId: text("student_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const subjectsTeachersClasses = pgTable("subjects_teachers_classes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  calendarRule: text("calendar_rule").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  subjectId: text("subject_id")
    .references(() => subjects.id, {
      onDelete: "cascade",
    })
    .notNull(),
  teacherId: text("teacher_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  classId: text("class_id")
    .references(() => classes.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const events = pgTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  studentId: text("student_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  subjectId: text("subject_id")
    .references(() => subjects.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  eventType: eventType("event_type").notNull(),
});

export const absences = pgTable("absences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  accounted: boolean("accounted").default(false),
  eventId: text("event_id")
    .references(() => events.id, {
      onDelete: "cascade",
    })
    .notNull(),
  absenceType: absenceType("absence_type").notNull(),
});

export const absenceDocs = pgTable("absence_docs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  absenceId: text("absence_id")
    .references(() => absences.id, {
      onDelete: "cascade",
    })
    .notNull(),
  docUrl: text("doc_url").notNull(),
});

export const grades = pgTable("grades", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: text("event_id")
    .references(() => events.id, {
      onDelete: "cascade",
    })
    .notNull(),
  grade: varchar("grade", { length: 100 }).notNull(),
  description: text("description"),
});

export const approvals = pgTable("approvals", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  eventId: text("event_id")
    .references(() => events.id, {
      onDelete: "cascade",
    })
    .notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  description: text("description"),
  approvalStatus: approvalStatus("approval_status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  requestorId: text("requestor_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const userRelations = relations(users, ({ many, one }) => ({
  keys: many(userKeys),
  sessions: many(userSessions),
  mfa: one(userMfas, {
    fields: [users.id],
    references: [userMfas.userId],
  }),
  schools: many(schoolsUsers),
  classes: many(classesStudents),
}));

export const userKeysRelations = relations(userKeys, ({ one }) => ({
  user: one(users, {
    fields: [userKeys.userId],
    references: [users.id],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const schoolRelations = relations(schools, ({ many }) => ({
  users: many(schoolsUsers),
  years: many(schoolYears),
}));

export const schoolsUserRelations = relations(schoolsUsers, ({ one }) => ({
  school: one(schools, {
    fields: [schoolsUsers.schoolId],
    references: [schools.id],
  }),
  user: one(users, {
    fields: [schoolsUsers.userId],
    references: [users.id],
  }),
}));

export const schoolYearRelations = relations(schoolYears, ({ one, many }) => ({
  holidays: many(schoolYearHolidays),
  school: one(schools, {
    fields: [schoolYears.schoolId],
    references: [schools.id],
  }),
}));

export const schoolYearHolidaysRelations = relations(
  schoolYearHolidays,
  ({ one }) => ({
    schoolYear: one(schoolYears, {
      fields: [schoolYearHolidays.schoolYearId],
      references: [schoolYears.id],
    }),
  })
);

export const classesStudentsRelations = relations(
  classesStudents,
  ({ one }) => ({
    class: one(classes, {
      fields: [classesStudents.classId],
      references: [classes.id],
    }),
    student: one(users, {
      fields: [classesStudents.studentId],
      references: [users.id],
    }),
  })
);

export const schema = {
  users,
  userKeys,
  userSessions,
  userRelations,
  userKeysRelations,
  userSessionsRelations,
  schoolRelations,
  schoolsUserRelations,
  schoolYearRelations,
  userMfas,
  tokens,
  schools,
  schoolsUsers,
  schoolYears,
  schoolYearHolidays,
  schoolYearHolidaysRelations,
  parentsStudents,
  subjects,
  classes,
  classesStudentsRelations,
  subjectsStudents,
  classesStudents,
  subjectsTeachersClasses,
  events,
  absences,
  absenceDocs,
  grades,
  approvals,
  tokenType,
  absenceType,
  eventType,
  approvalStatus,
  role,
};
