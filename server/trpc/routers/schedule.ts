import { TRPCError } from "@trpc/server";
import { object, string, array, number } from "zod";

import {
  router,
  yearProcedure,
  getSchool,
  checkIfUserAuthorized,
} from "../trpc";

export const scheduleRouter = router({
  removeStudentFromSchedule: yearProcedure
    .input(
      object({
        classId: string().uuid(),
        subjectId: string().uuid(),
        studentId: string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const school = await getSchool(input.schoolId, ctx.prisma);
      const isAuthorized = checkIfUserAuthorized(ctx.user, school);
      if (!isAuthorized) {
        return new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized for this action",
        });
      }
      try {
        await ctx.prisma.subjectStudent.delete({
          where: {
            studentId_subjectId: {
              studentId: input.studentId,
              subjectId: input.subjectId,
            },
          },
        });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  addSchedule: yearProcedure
    .input(
      object({
        classId: string().uuid(),
        calendarRule: string().min(1),
        startTime: string().min(1),
        endTime: string().min(1),
        students: array(string().uuid()),
        subjectId: string().uuid(),
        teacherId: string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const school = await getSchool(input.schoolId, ctx.prisma);
      const isAuthorized = checkIfUserAuthorized(ctx.user, school);
      if (!isAuthorized) {
        return new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized for this action",
        });
      }
      try {
        return await ctx.prisma.$transaction(async (tx) => {
          const subjectTeacherClass = await tx.subjectTeacherClass.create({
            data: {
              subjectId: input.subjectId,
              classId: input.classId,
              teacherId: input.teacherId,
              calendarRule: input.calendarRule,
              startTime: input.startTime,
              endTime: input.endTime,
            },
          });
          await tx.subjectStudent.createMany({
            data: input.students.map((item) => ({
              studentId: item,
              subjectId: subjectTeacherClass.id,
            })),
          });

          return subjectTeacherClass;
        });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  deleteSchedule: yearProcedure
    .input(object({ classId: string().uuid(), subjectId: string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const school = await getSchool(input.schoolId, ctx.prisma);
      const isAuthorized = checkIfUserAuthorized(ctx.user, school);
      if (!isAuthorized) {
        return new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized for this action",
        });
      }
      try {
        await ctx.prisma.subjectTeacherClass.delete({
          where: { id: input.subjectId },
        });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  editSchedule: yearProcedure
    .input(
      object({
        scheduleId: string().uuid(),
        classId: string().uuid(),
        calendarRule: string().min(1),
        startTime: string().min(1),
        endTime: string().min(1),
        students: array(string().uuid()),
        subjectId: string().uuid(),
        teacherId: string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const school = await getSchool(input.schoolId, ctx.prisma);
      const isAuthorized = checkIfUserAuthorized(ctx.user, school);
      if (!isAuthorized) {
        return new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized for this action",
        });
      }
      try {
        return await ctx.prisma.$transaction(async (tx) => {
          const subjectTeacherClass = await tx.subjectTeacherClass.update({
            where: {
              id: input.scheduleId,
            },
            data: {
              subjectId: input.subjectId,
              classId: input.classId,
              teacherId: input.teacherId,
              calendarRule: input.calendarRule,
              startTime: input.startTime,
              endTime: input.endTime,
            },
          });

          await tx.subjectStudent.deleteMany({
            where: {
              subjectId: input.scheduleId,
            },
          });

          await tx.subjectStudent.createMany({
            data: input.students.map((item) => ({
              studentId: item,
              subjectId: subjectTeacherClass.id,
            })),
          });

          return subjectTeacherClass;
        });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getSchedule: yearProcedure
    .input(object({ scheduleId: string().uuid() }))
    .query(async ({ ctx, input }) => {
      const school = await getSchool(input.schoolId, ctx.prisma);
      const isAuthorized = checkIfUserAuthorized(ctx.user, school);
      if (!isAuthorized) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized for this action",
        });
      }
      try {
        const subjectWithStudents =
          await ctx.prisma.subjectTeacherClass.findFirstOrThrow({
            where: { id: input.scheduleId },
            include: {
              teacher: true,
              students: true,
            },
          });
        return subjectWithStudents;
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getSchedules: yearProcedure
    .input(
      object({
        classId: string().uuid(),
        page: number().min(1).optional(),
        pageSize: number().min(12).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const school = await getSchool(input.schoolId, ctx.prisma);
      const isAuthorized = checkIfUserAuthorized(ctx.user, school);
      if (!isAuthorized) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized for this action",
        });
      }
      const page = input.page ?? 1;
      const pageSize = input.pageSize ?? 12;
      try {
        const [schedules, count] = await Promise.all([
          ctx.prisma.subjectTeacherClass.findMany({
            where: {
              classId: input.classId,
            },
            include: {
              teacher: true,
              subject: true,
              _count: {
                select: {
                  students: true,
                },
              },
            },
            take: pageSize,
            skip: (page - 1) * pageSize,
          }),
          ctx.prisma.subjectTeacherClass.count({
            where: {
              classId: input.classId,
            },
          }),
        ]);
        return { schedules, count };
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});

// export type definition of API
export type ScheduleRouter = typeof scheduleRouter;
