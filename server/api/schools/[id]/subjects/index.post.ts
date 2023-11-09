import { object, string } from "zod";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  const input = await useValidatedBody(
    event,
    object({
      name: string(),
    })
  );

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    event.node.res.statusCode = 201;
    const subject = await db
      .insert(schema.subjects)
      .values({
        name: input.name,
        schoolId: id,
      })
      .returning();
    return subject;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
