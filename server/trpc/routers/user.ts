import { ROLE, SchoolUser, TOKEN_TYPE, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { object, string, number, nativeEnum } from "zod";

import {
  router,
  schoolProcedure,
  getSchool,
  checkIfUserAuthorized,
} from "../trpc";

export const userRouter = router({
  deleteUser: schoolProcedure
    .input(object({ userId: string().uuid() }))
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
        await ctx.prisma.user.delete({ where: { id: input.userId } });
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  addUser: schoolProcedure
    .input(
      object({
        firstName: string().min(1),
        lastName: string().min(1),
        email: string().email(),
        role: nativeEnum(ROLE),
        telephone: string().min(1),
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
          const user = await tx.user.create({
            data: {
              firstName: input.firstName,
              lastName: input.lastName,
              email: input.email,
              telephone: input.telephone,
            },
          });
          await tx.token.create({
            data: {
              email: input.email,
              tokenType: TOKEN_TYPE.RESET_PASSWORD,
            },
          });

          await tx.schoolUser.create({
            data: {
              schoolId: input.schoolId,
              userId: user.id,
              role: input.role,
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
  editUser: schoolProcedure
    .input(
      object({
        userId: string().uuid(),
        firstName: string().min(1),
        lastName: string().min(1),
        email: string().email(),
        role: nativeEnum(ROLE),
        telephone: string().min(1),
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
        const result: { schoolUser: SchoolUser; user: User } =
          await ctx.prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
              where: {
                id: input.userId,
              },
              data: {
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                telephone: input.telephone,
              },
            });

            const schoolUser = await tx.schoolUser.update({
              where: {
                schoolId_userId: {
                  userId: input.userId,
                  schoolId: input.schoolId,
                },
              },
              data: {
                role: input.role,
              },
            });

            return { schoolUser, user };
          });

        return { ...result.user, role: result.schoolUser.role };
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getUser: schoolProcedure
    .input(object({ userId: string().uuid() }))
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
        const schoolUser = await ctx.prisma.schoolUser.findFirstOrThrow({
          where: {
            userId: input.userId,
            schoolId: input.schoolId,
          },
          include: { user: true },
        });

        return {
          firstName: schoolUser.user.firstName,
          lastName: schoolUser.user.lastName,
          email: schoolUser.user.email,
          telephone: schoolUser.user.telephone,
          role: schoolUser.role,
        };
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getUsers: schoolProcedure
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
        const [users, count] = await Promise.all([
          ctx.prisma.schoolUser.findMany({
            where: {
              schoolId: input.schoolId,
              NOT: [{ userId: { equals: ctx.user.id } }],
            },
            include: { user: true },
            take: pageSize,
            skip: (page - 1) * pageSize,
          }),
          ctx.prisma.schoolUser.count({
            where: {
              schoolId: input.schoolId,
              NOT: [{ userId: { equals: ctx.user.id } }],
            },
          }),
        ]);
        return { users, count };
      } catch (e) {
        throw new TRPCError({
          message: JSON.stringify(e),
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});

// export type definition of API
export type UserRouter = typeof userRouter;
