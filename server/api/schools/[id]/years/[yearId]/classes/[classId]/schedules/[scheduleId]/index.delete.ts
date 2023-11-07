import { eq } from "drizzle-orm";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const { $db, $schema } = useNuxtApp();
  const id = event.context.params!.id;
  const scheduleId = event.context.params!.scheduleId;

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await $db
      .delete($schema.subjectsTeachersClasses)
      .where(eq($schema.subjectsTeachersClasses.id, scheduleId));

    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
