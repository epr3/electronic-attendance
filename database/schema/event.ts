import type { Insertable, Selectable, Updateable } from "kysely";

export enum ABSENCE_TYPE {
  MEDICAL = "MEDICAL",
  PARENT = "PARENT",
  TEACHER = "TEACHER",
}

export enum EVENT_TYPE {
  ABSENCE = "ABSENCE",
  GRADE = "GRADE",
  MARK = "MARK",
}

export enum APPROVAL_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum PRIMARY_SCHOOL_MARKS {
  FB = "FB",
  B = "B",
  S = "S",
  I = "I",
}

export interface EventsTable {
  id: string;
  schedule_student_id: string;
  created_at: string;
  date: string;
  event_type: EVENT_TYPE;
}

export type Event = Selectable<EventsTable>;
export type NewEvent = Insertable<EventsTable>;
export type EventUpdate = Updateable<EventsTable>;

export interface AbsencesTable {
  id: string;
  accounted: boolean;
  eventId: string;
  absenceType: ABSENCE_TYPE;
}

export type Absence = Selectable<AbsencesTable>;
export type NewAbsence = Insertable<AbsencesTable>;
export type AbsenceUpdate = Updateable<AbsencesTable>;

export interface AbsenceDocsTable {
  id: string;
  absenceId: string;
  docUrl: string;
}

export type AbsenceDoc = Selectable<AbsenceDocsTable>;
export type NewAbsenceDoc = Insertable<AbsenceDocsTable>;
export type AbsenceDocUpdate = Updateable<AbsenceDocsTable>;

export interface GradesTable {
  id: string;
  eventId: string;
  grade: number;
  description?: string;
}

export type Grade = Selectable<GradesTable>;
export type NewGrade = Insertable<GradesTable>;
export type GradeUpdate = Updateable<GradesTable>;

export interface MarksTable {
  id: string;
  eventId: string;
  description?: string;
  mark: PRIMARY_SCHOOL_MARKS;
}

export type Mark = Selectable<MarksTable>;
export type NewMark = Insertable<MarksTable>;
export type MarkUpdate = Updateable<MarksTable>;

export interface ApprovalsTable {
  id: string;
  eventId: string;
  status: APPROVAL_STATUS;
}

export type Approval = Selectable<ApprovalsTable>;
export type NewApproval = Insertable<ApprovalsTable>;
export type ApprovalUpdate = Updateable<ApprovalsTable>;