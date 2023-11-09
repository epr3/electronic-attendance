import { ROLE } from "~/drizzle/schema";

export async function useUserRoleSchool(
  schoolId: string,
  roles: ROLE[] = [ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER]
) {
  const user = useServerUser();

  const schoolUser = await db.query.schoolsUsers.findFirst({
    where: (schoolUser, { eq, and }) =>
      and(
        eq(schoolUser.schoolId, schoolId),
        eq(schoolUser.userId, user.value!.id)
      ),
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
