import { TRPCError } from "@trpc/server";
import { object, string, number, array } from "zod";

import {
  router,
  schoolProcedure,
  getSchool,
  checkIfUserAuthorized,
} from "../trpc";

export const yearRouter = router({
  deleteYear: schoolProcedure
    .input(object({ yearId: string().uuid() }))
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
        await ctx.prisma.schoolYear.delete({ where: { id: input.yearId } });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  addYear: schoolProcedure
    .input(
      object({
        schoolDateRule: string().min(1),
        holidayDateRules: array(
          object({ name: string(), rule: string().min(1) })
        ),
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
        await ctx.prisma.$transaction(async (tx) => {
          const schoolYear = await tx.schoolYear.create({
            data: {
              schoolId: input.schoolId,
              schoolDateRule: input.schoolDateRule,
            },
          });
          await tx.schoolYearHolidays.createMany({
            data: input.holidayDateRules.map((item) => ({
              schoolYearId: schoolYear.id,
              name: item.name,
              holidayDateRule: item.rule,
            })),
          });
        });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  editYear: schoolProcedure
    .input(
      object({
        schoolDateRule: string().min(1),
        holidayDateRules: array(
          object({ name: string(), rule: string().min(1) })
        ),
        yearId: string().uuid(),
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
        await ctx.prisma.$transaction(async (tx) => {
          await tx.schoolYear.update({
            data: {
              schoolDateRule: input.schoolDateRule,
            },
            where: { id: input.yearId },
          });

          await tx.schoolYearHolidays.updateMany({
            data: input.holidayDateRules.map((item) => ({
              name: item.name,
              holidayDateRule: item.rule,
            })),
            where: {
              schoolYearId: input.yearId,
            },
          });
        });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getYear: schoolProcedure
    .input(object({ yearId: string().uuid() }))
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
        const schoolYear = await ctx.prisma.schoolYear.findFirstOrThrow({
          where: { schoolId: input.schoolId, id: input.yearId },
          include: {
            holidays: true,
          },
        });

        return schoolYear;
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getYears: schoolProcedure
    .input(
      object({
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
        const [years, count] = await Promise.all([
          ctx.prisma.schoolYear.findMany({
            where: {
              schoolId: input.schoolId,
            },
            include: {
              holidays: true,
            },
            take: pageSize,
            skip: (page - 1) * pageSize,
          }),
          ctx.prisma.schoolYear.count({
            where: {
              schoolId: input.schoolId,
            },
          }),
        ]);
        return { years, count };
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});

// export type definition of API
export type YearRouter = typeof yearRouter;
