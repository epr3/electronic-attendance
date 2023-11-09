import { eq } from "drizzle-orm";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const subjectId = event.context.params!.subjectId;

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await db
      .delete(schema.subjects)
      .where(eq(schema.subjects.id, subjectId as string));
    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
