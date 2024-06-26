import { ROLE } from "@prisma/client";
import { type H3Event } from "h3";
import { prisma } from "~/prisma/db";

export async function useUserRoleSchool(
  event: H3Event,
  schoolId: string,
  roles: ROLE[] = [ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER]
) {
  const user = await useServerAuth(event);

  const schoolUser = await prisma.schoolUser.findFirst({
    where: { userId: user.id, schoolId },
  });

  if (!schoolUser || !roles.includes(schoolUser.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: "FORBIDDEN",
      message: "You are not allowed to perform this action",
    });
  }

  return user;
}
