import { toDataURL } from "qrcode";
import { PASSPORT_TYPE, ROLE, TOKEN_TYPE } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { boolean, object, string } from "zod";
import * as bcrypt from "bcrypt";
import { authenticator } from "otplib";

import { publicProcedure, router, protectedProcedure } from "../trpc";

authenticator.options = { window: 1 };

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return { user: ctx.session.user };
  }),
  generateQR: protectedProcedure.query(async ({ ctx }) => {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(
      ctx.user.email,
      "electronic-attendance",
      secret
    );

    try {
      const qrCode = await toDataURL(otpauth);

      return { qrCode, secret };
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error generating QR",
      });
    }
  }),
  sendVerificationSms: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { email: ctx.user.email },
        include: { mfa: true },
      });
      if (user.mfa?.mfaSmsOnly) {
        const token = authenticator.generate(user.mfa.mfaSecret);
        // re-enable when have money
        const from = "CatalogID";
        const to = user.telephone.split("+")[1];
        const text = `Your verification code is ${token}`;
        console.log(from, to, text);
        return { from, to, text };
        // await ctx.vonage.send({ from, to, text });
      }

      return null;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error sending token with SMS",
      });
    }
  }),
  mfaVerify: protectedProcedure
    .input(object({ token: string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { email: ctx.user.email },
        include: { mfa: true, school: { include: { school: true } } },
      });

      const isValid = authenticator.verify({
        token: input.token,
        secret: user.mfa!.mfaSecret,
      });

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "The provided code is invalid.",
        });
      }

      ctx.session.mfaVerified = true;
      await ctx.session.save();

      return null;
    }),
  mfaEnroll: protectedProcedure
    .input(object({ secret: string(), smsOnly: boolean() }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findFirstOrThrow({
          where: { email: ctx.user.email },
          include: { mfa: true },
        });

        await ctx.prisma.userMfa.upsert({
          where: {
            userId: user.id,
          },
          update: {
            mfaSmsOnly: input.smsOnly,
          },
          create: {
            userId: user.id,
            mfaSecret: input.secret,
            mfaSmsOnly: input.smsOnly,
          },
        });

        return null;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error enrolling MFA",
        });
      }
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
        return user;
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
          mfa: true,
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

      return {
        hasMfa: !!user.mfa,
        mfaRequired: user.school.some(
          (item) =>
            item.role === ROLE.ADMIN ||
            item.role === ROLE.DIRECTOR ||
            item.role === ROLE.TEACHER
        ),
      };
    }),
});

// export type definition of API
export type AuthRouter = typeof authRouter;
