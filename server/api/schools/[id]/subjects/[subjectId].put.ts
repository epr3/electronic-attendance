import { eq } from "drizzle-orm";
import { object, string } from "zod";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const { $db, $schema } = useNuxtApp();
  const id = event.context.params!.id;
  const subjectId = event.context.params!.subjectId;

  const input = await useValidatedBody(
    event,
    object({
      name: string(),
    })
  );

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await $db
      .update($schema.subjects)
      .set({
        name: input.name,
      })
      .where(eq($schema.subjects.id, subjectId));
    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
