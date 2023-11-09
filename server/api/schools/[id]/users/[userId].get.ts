import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const userId = event.context.params!.userId;

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const schoolUser = await db.query.schoolUsers.findFirst({
      where: (schoolUser, { and, eq }) =>
        and(eq(schoolUser.userId, userId), eq(schoolUser.schoolId, id)),
      with: { user: true },
    });

    if (!schoolUser) {
      return createError({
        statusMessage: "NOT_FOUND",
        statusCode: 404,
        message: "User not found",
      });
    }

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
