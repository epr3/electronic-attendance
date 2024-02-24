import { ROLE } from "~/database/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const subjectId = event.context.params!.subjectId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const subject = await db
      .selectFrom("subjects")
      .selectAll()
      .where(({ eb, and }) =>
        and([eb("id", "=", subjectId), eb("schoolId", "=", id)])
      )
      .executeTakeFirst();

    return subject;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
