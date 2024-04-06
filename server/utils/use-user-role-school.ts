import type { H3Event } from "h3";
import { ROLE } from "~/database/schema";

export async function useUserRoleSchool(
  event: H3Event,
  schoolId: string,
  roles: ROLE[] = [
    ROLE.ADMIN,
    ROLE.DIRECTOR,
    ROLE.TEACHER,
    ROLE.STUDENT,
    ROLE.PARENT,
  ]
) {
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "You need to be authenticated to perform this action",
    });
  }

  const schoolUser = await db
    .selectFrom("schoolsUsers")
    .selectAll()
    .where(({ and, eb }) =>
      and([
        eb("schoolsUsers.userId", "=", user.id),
        eb("schoolsUsers.schoolId", "=", schoolId),
      ])
    )
    .executeTakeFirst();

  if (!schoolUser || !roles.includes(schoolUser.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: "FORBIDDEN",
      message: "You are not allowed to perform this action",
    });
  }

  return user;
}