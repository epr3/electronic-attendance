import { ROLE } from "~/database/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const userId = event.context.params!.userId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const schoolUser = await db
      .selectFrom("schoolsUsers")
      .innerJoin("users as user", "user.id", "schoolsUsers.userId")
      .selectAll()
      .where(({ and, eb }) =>
        and([
          eb("schoolsUsers.userId", "=", userId),
          eb("schoolsUsers.schoolId", "=", id),
        ])
      )
      .executeTakeFirst();

    if (!schoolUser) {
      return createError({
        statusMessage: "NOT_FOUND",
        statusCode: 404,
        message: "User not found",
      });
    }

    return {
      firstName: schoolUser.firstName,
      lastName: schoolUser.lastName,
      email: schoolUser.email,
      telephone: schoolUser.telephone,
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
