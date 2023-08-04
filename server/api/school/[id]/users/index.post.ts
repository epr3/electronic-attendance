import { ROLE, TOKEN_TYPE } from "@prisma/client";
import { nativeEnum, object, string } from "zod";
import dayjs from "dayjs";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  const input = await useValidatedBody(
    event,
    object({
      firstName: string().min(1),
      lastName: string().min(1),
      email: string().email(),
      role: nativeEnum(ROLE),
      telephone: string().min(1),
    })
  );

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email: input.email },
        create: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          telephone: input.telephone,
        },
        update: {},
      });
      if (dayjs(user.createdAt).isSame(user.updatedAt)) {
        await tx.token.create({
          data: {
            email: input.email,
            tokenType: TOKEN_TYPE.RESET_PASSWORD,
          },
        });
      }

      const schoolUser = await tx.schoolUser.create({
        data: {
          schoolId: id,
          userId: user.id,
          role: input.role,
        },
      });
      return { ...user, role: schoolUser.role };
    });
    event.node.res.statusCode = 201;
    return user;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
