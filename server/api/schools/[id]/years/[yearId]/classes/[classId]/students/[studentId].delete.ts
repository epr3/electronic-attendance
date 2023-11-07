import { and, eq } from "drizzle-orm";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const { $db, $schema } = useNuxtApp();
  const id = event.context.params!.id;
  const classId = event.context.params!.classId;
  const studentId = event.context.params!.studentId;

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await $db
      .delete($schema.classesStudents)
      .where(
        and(
          eq($schema.classesStudents.classId, classId),
          eq($schema.classesStudents.studentId, studentId)
        )
      );

    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
