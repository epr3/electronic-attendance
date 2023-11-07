import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const { $db } = useNuxtApp();
  const id = event.context.params!.id;
  const subjectId = event.context.params!.subjectId;

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const subject = await $db.query.subjects.findFirst({
      where: (subjects, { eq, and }) =>
        and(eq(subjects.id, subjectId), eq(subjects.schoolId, id)),
    });

    return subject;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
