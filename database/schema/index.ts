import {
  type Class,
  type ClassStudent,
  type ClassStudentUpdate,
  type ClassUpdate,
  type ClassesStudentsTable,
  type ClassesTable,
  EDUCATION_LEVEL,
  type NewClass,
  type NewClassStudent,
  type NewSchedule,
  type NewSubject,
  type Schedule,
  type ScheduleUpdate,
  type SchedulesTable,
  type Subject,
  type SubjectUpdate,
  type SubjectsTable,
  type SchedulesStudentsTable,
  type NewScheduleStudent,
  type ScheduleStudent,
  type ScheduleStudentUpdate,
} from "./attendance";
import {
  ABSENCE_TYPE,
  APPROVAL_STATUS,
  type Absence,
  type AbsenceDocsTable,
  type AbsenceUpdate,
  type AbsencesTable,
  type Approval,
  type ApprovalUpdate,
  type ApprovalsTable,
  EVENT_TYPE,
  type Event,
  type EventUpdate,
  type EventsTable,
  type Grade,
  type GradeUpdate,
  type GradesTable,
  type Mark,
  type MarkUpdate,
  type MarksTable,
  type NewAbsence,
  type NewApproval,
  type NewEvent,
  type NewGrade,
  type NewMark,
  PRIMARY_SCHOOL_MARKS,
} from "./event";
import type {
  NewSchool,
  NewSchoolUser,
  School,
  SchoolHolidaysTable,
  SchoolTermsTable,
  SchoolUpdate,
  SchoolUser,
  SchoolUserUpdate,
  SchoolsTable,
  SchoolsUsersTable,
} from "./school";
import {
  ROLE,
  TOKEN_TYPE,
  type UsersTable,
  type TokensTable,
  type UserKeysTable,
  type UserSessionsTable,
  type NewToken,
  type NewUser,
  type NewUserKey,
  type Token,
  type TokenUpdate,
  type User,
  type UserKey,
  type UserKeyUpdate,
  type UserUpdate,
  type UserMfasTable,
  type NewUserSession,
  type UserSession,
  type UserSessionUpdate,
  type NewUserMfa,
  type UserMfa,
  type UserMfaUpdate,
} from "./user";

export interface Database {
  users: UsersTable;
  userKeys: UserKeysTable;
  userSessions: UserSessionsTable;
  userMfas: UserMfasTable;
  tokens: TokensTable;
  subjects: SubjectsTable;
  schedules: SchedulesTable;
  schedulesStudents: SchedulesStudentsTable;
  schools: SchoolsTable;
  schoolsUsers: SchoolsUsersTable;
  schoolTerms: SchoolTermsTable;
  schoolHolidays: SchoolHolidaysTable;
  events: EventsTable;
  absences: AbsencesTable;
  absenceDocs: AbsenceDocsTable;
  grades: GradesTable;
  marks: MarksTable;
  approvals: ApprovalsTable;
  classes: ClassesTable;
  classesStudents: ClassesStudentsTable;
}

export {
  ROLE,
  TOKEN_TYPE,
  EDUCATION_LEVEL,
  ABSENCE_TYPE,
  EVENT_TYPE,
  APPROVAL_STATUS,
  PRIMARY_SCHOOL_MARKS,
};

export type {
  UserMfa,
  NewUserMfa,
  UserMfaUpdate,
  School,
  NewSchool,
  SchoolUpdate,
  Token,
  NewToken,
  TokenUpdate,
  User,
  NewUser,
  UserUpdate,
  UserKey,
  NewUserKey,
  UserKeyUpdate,
  UserSession,
  NewUserSession,
  UserSessionUpdate,
  SchoolUser,
  NewSchoolUser,
  SchoolUserUpdate,
  Subject,
  NewSubject,
  SubjectUpdate,
  Class,
  NewClass,
  ClassUpdate,
  ClassStudent,
  NewClassStudent,
  ClassStudentUpdate,
  Schedule,
  NewSchedule,
  ScheduleUpdate,
  Event,
  NewEvent,
  EventUpdate,
  Absence,
  NewAbsence,
  AbsenceUpdate,
  Grade,
  NewGrade,
  GradeUpdate,
  Mark,
  NewMark,
  MarkUpdate,
  Approval,
  NewApproval,
  ApprovalUpdate,
  ScheduleStudent,
  NewScheduleStudent,
  ScheduleStudentUpdate,
};
