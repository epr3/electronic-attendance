import type { Selectable, Insertable, Updateable } from "kysely";
import { ROLE } from "./user";

export interface SchoolsTable {
  id: string;
  name: string;
}

export type School = Selectable<SchoolsTable>;
export type NewSchool = Insertable<SchoolsTable>;
export type SchoolUpdate = Updateable<SchoolsTable>;

export interface SchoolsUsersTable {
  id: string;
  userId: string;
  schoolId: string;
  role: ROLE;
}

export type SchoolUser = Selectable<SchoolsUsersTable>;
export type NewSchoolUser = Insertable<SchoolsUsersTable>;
export type SchoolUserUpdate = Updateable<SchoolsUsersTable>;

export interface ParentsTable {
  id: string;
  parentId: string;
  studentId: string;
}

export type Parent = Selectable<ParentsTable>;
export type NewParent = Insertable<ParentsTable>;
export type ParentUpdate = Updateable<ParentsTable>;

export interface SchoolTermsTable {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  schoolId: string;
}

export type SchoolTerm = Selectable<SchoolTermsTable>;
export type NewSchoolTerm = Insertable<SchoolTermsTable>;
export type SchoolTermUpdate = Updateable<SchoolTermsTable>;

export interface SchoolHolidaysTable {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  schoolId: string;
}

export type SchoolHoliday = Selectable<SchoolHolidaysTable>;
export type NewSchoolHoliday = Insertable<SchoolHolidaysTable>;
export type SchoolHolidayUpdate = Updateable<SchoolHolidaysTable>;
