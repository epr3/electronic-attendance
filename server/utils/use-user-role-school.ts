import type { H3Event } from "h3";
import { ROLE } from "~/drizzle/schema";

export async function useUserRoleSchool(
  event: H3Event,
  schoolId: string,
  roles: ROLE[] = [ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER]
) {
  const user = await useServerUser(event);

  const schoolUser = await db.query.schoolsUsers.findFirst({
    where: (schoolUser, { eq, and }) =>
      and(eq(schoolUser.schoolId, schoolId), eq(schoolUser.userId, user!.id)),
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
