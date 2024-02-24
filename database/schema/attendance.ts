import type { Insertable, Selectable, Updateable } from "kysely";

export enum EDUCATION_LEVEL {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}

export interface SubjectsTable {
  id: string;
  name: string;
  schoolId: string;
}

export type Subject = Selectable<SubjectsTable>;
export type NewSubject = Insertable<SubjectsTable>;
export type SubjectUpdate = Updateable<SubjectsTable>;

export interface ClassesTable {
  id: string;
  title: string;
  isActive: boolean;
  educationLevel: EDUCATION_LEVEL;
  schoolId: string;
  year: number;
  headTeacherId: string;
}

export type Class = Selectable<ClassesTable>;
export type NewClass = Insertable<ClassesTable>;
export type ClassUpdate = Updateable<ClassesTable>;

export interface ClassesStudentsTable {
  id: string;
  classId: string;
  studentId: string;
}

export type ClassStudent = Selectable<ClassesStudentsTable>;
export type NewClassStudent = Insertable<ClassesStudentsTable>;
export type ClassStudentUpdate = Updateable<ClassesStudentsTable>;

export interface SchedulesTable {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  calendarRule: string;
  startTime: string;
  endTime: string;
}

export type Schedule = Selectable<SchedulesTable>;
export type NewSchedule = Insertable<SchedulesTable>;
export type ScheduleUpdate = Updateable<SchedulesTable>;

export interface SchedulesStudentsTable {
  id: string;
  studentId: string;
  scheduleId: string;
}

export type ScheduleStudent = Selectable<SchedulesStudentsTable>;
export type NewScheduleStudent = Insertable<SchedulesStudentsTable>;
export type ScheduleStudentUpdate = Updateable<SchedulesStudentsTable>;
