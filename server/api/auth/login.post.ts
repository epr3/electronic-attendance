import { PASSPORT_TYPE, ROLE } from "@prisma/client";

import { object, string } from "zod";
import * as bcrypt from "bcrypt";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const input = await useValidatedBody(
    event,
    object({
      email: string().email(),
      password: string().min(8),
    })
  );

  try {
    const user = await prisma.user.findFirst({
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
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "The provided credentials are invalid.",
      });
    }

    const ok = bcrypt.compareSync(
      input.password,
      user.userPassports[0].password as string
    );

    if (!ok) {
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "The provided credentials are invalid.",
      });
    }
    event.context.session.user = user;
    await event.context.session.save();

    return {
      hasMfa: !!user.mfa,
      mfaRequired: user.school.some(
        (item) =>
          item.role === ROLE.ADMIN ||
          item.role === ROLE.DIRECTOR ||
          item.role === ROLE.TEACHER
      ),
    };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
