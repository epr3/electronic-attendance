import { ROLE } from "~/database/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const subjectId = event.context.params!.subjectId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await db
      .deleteFrom("subjects")
      .where("subjects.id", "=", subjectId as string)
      .executeTakeFirst();
    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
