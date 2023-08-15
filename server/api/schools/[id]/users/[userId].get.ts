import { ROLE } from "@prisma/client";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const userId = event.context.params!.userId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const schoolUser = await prisma.schoolUser.findFirstOrThrow({
      where: {
        userId,
        schoolId: id,
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
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
