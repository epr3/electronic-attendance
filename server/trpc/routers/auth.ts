import { PASSPORT_TYPE, ROLE, TOKEN_TYPE } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { object, string } from "zod";
import * as bcrypt from "bcrypt";

import { publicProcedure, router, protectedProcedure } from "../trpc";

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return { user: ctx.session.user };
  }),
  logout: publicProcedure.query(({ ctx }) => {
    ctx.session.destroy();
  }),
  register: publicProcedure
    .input(
      object({
        email: string().email(),
        password: string().min(8),
        firstName: string().min(1),
        lastName: string().min(1),
        telephone: string().min(1),
        schoolName: string().min(1),
        schoolAcronym: string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: input.email,
            firstName: input.firstName as string,
            lastName: input.lastName as string,
            telephone: input.telephone,
          },
        });
        await tx.token.create({
          data: {
            email: input.email,
            tokenType: TOKEN_TYPE.VALIDATION,
          },
        });
        await tx.userPassport.create({
          data: {
            password: bcrypt.hashSync(input.password, 10),
            passportType: PASSPORT_TYPE.PASSWORD,
            userId: user.id,
          },
        });
        const school = await tx.school.create({
          data: {
            name: input.schoolName as string,
            acronym: input.schoolAcronym as string,
          },
        });
        await tx.schoolUser.create({
          data: {
            schoolId: school.id,
            userId: user.id,
            role: ROLE.DIRECTOR,
          },
        });
      });
    }),
  login: publicProcedure
    .input(
      object({
        email: string().email(),
        password: string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email, verifiedAt: { not: null } },
        include: {
          school: { include: { school: true } },
          userPassports: {
            where: { passportType: PASSPORT_TYPE.PASSWORD },
            select: { password: true },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "The provided credentials are invalid.",
        });
      }

      const ok = bcrypt.compareSync(
        input.password,
        user.userPassports[0].password as string
      );

      if (!ok) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "The provided credentials are invalid.",
        });
      }

      ctx.session.user = user;
      await ctx.session.save();
      return null;
    }),
});

// export type definition of API
export type AuthRouter = typeof authRouter;
