import { createSelectSchema } from "drizzle-zod";

import { z } from "zod";
import {
  classes,
  classesStudents,
  schoolsUsers,
  schoolYearHolidays,
  schoolYears,
  schools,
  subjects,
  subjectsTeachersClasses,
  users,
} from "./schema";

export const selectUserSchema = createSelectSchema(users);

export type SelectUserType = z.infer<typeof selectUserSchema>;

export const selectClassSchema = createSelectSchema(classes);

export type SelectClassType = z.infer<typeof selectClassSchema>;

export const selectClassStudentSchema = createSelectSchema(classesStudents);

export type SelectClassStudentType = z.infer<typeof selectClassStudentSchema>;

export const selectSchoolSchema = createSelectSchema(schools);

export type SelectSchoolType = z.infer<typeof selectSchoolSchema>;

export const selectSchoolUserSchema = createSelectSchema(schoolsUsers);

export type SelectSchoolUserType = z.infer<typeof selectSchoolUserSchema>;

export const selectSchoolYearSchema = createSelectSchema(schoolYears);

export type SelectSchoolYearType = z.infer<typeof selectSchoolYearSchema>;

export const selectSchoolYearHolidaySchema =
  createSelectSchema(schoolYearHolidays);

export type SelectSchoolYearHolidaysType = z.infer<
  typeof selectSchoolYearHolidaySchema
>;

export const selectSubjectSchema = createSelectSchema(subjects);

export type SelectSubjectType = z.infer<typeof selectSubjectSchema>;

export const selectSubjectTeacherClassSchema = createSelectSchema(
  subjectsTeachersClasses
);

export type SelectSubjectTeacherClassType = z.infer<
  typeof selectSubjectTeacherClassSchema
>;
