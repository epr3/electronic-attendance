import { ROLE } from "@prisma/client";
import { nativeEnum, object, string } from "zod";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const userId = event.context.params!.userId;

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
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          telephone: input.telephone,
        },
      });

      await tx.schoolUser.update({
        where: {
          schoolId_userId: {
            userId,
            schoolId: input.schoolId,
          },
        },
        data: {
          role: input.role,
        },
      });
    });
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
