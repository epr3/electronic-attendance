import { TRPCError } from "@trpc/server";
import { object, string, number } from "zod";

import {
  router,
  schoolProcedure,
  getSchool,
  checkIfUserAuthorized,
} from "../trpc";

export const subjectRouter = router({
  deleteSubject: schoolProcedure
    .input(object({ subjectId: string().uuid() }))
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
        await ctx.prisma.subject.delete({ where: { id: input.subjectId } });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  addSubject: schoolProcedure
    .input(
      object({
        name: string().min(1),
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
        await ctx.prisma.subject.create({
          data: {
            name: input.name,
            schoolId: input.schoolId,
          },
        });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  editSubject: schoolProcedure
    .input(
      object({
        name: string().min(1),
        subjectId: string().uuid(),
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
        await ctx.prisma.subject.update({
          data: { name: input.name },
          where: { id: input.subjectId },
        });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getSubject: schoolProcedure
    .input(object({ subjectId: string().uuid() }))
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
        const subject = await ctx.prisma.subject.findFirstOrThrow({
          where: { schoolId: input.schoolId, id: input.subjectId },
        });

        return subject;
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getSubjects: schoolProcedure
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
        const [subjects, count] = await Promise.all([
          ctx.prisma.subject.findMany({
            where: {
              schoolId: input.schoolId,
            },

            take: pageSize,
            skip: (page - 1) * pageSize,
          }),
          ctx.prisma.subject.count({
            where: {
              schoolId: input.schoolId,
            },
          }),
        ]);
        return { subjects, count };
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});

// export type definition of API
export type SubjectRouter = typeof subjectRouter;
