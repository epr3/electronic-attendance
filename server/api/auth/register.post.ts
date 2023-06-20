import { PASSPORT_TYPE, ROLE, TOKEN_TYPE } from "@prisma/client";

import { object, string } from "zod";
import * as bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const input = await useValidatedBody(
    event,
    object({
      email: string().email(),
      password: string().min(8),
      firstName: string().min(1),
      lastName: string().min(1),
      telephone: string().min(1),
      schoolName: string().min(1),
      schoolAcronym: string().min(1),
    })
  );

  try {
    await event.context.prisma.$transaction(async (tx) => {
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
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
