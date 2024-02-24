import { ROLE } from "~/database/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const userId = event.context.params!.userId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await db
      .deleteFrom("schoolsUsers")
      .where(({ and, eb }) =>
        and([
          eb("schoolsUsers.userId", "=", userId),
          eb("schoolsUsers.schoolId", "=", id),
        ])
      )
      .execute();
    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
