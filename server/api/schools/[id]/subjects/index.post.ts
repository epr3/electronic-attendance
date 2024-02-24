import { createId } from "@paralleldrive/cuid2";
import { object, string } from "zod";
import { ROLE } from "~/database/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  const input = await useValidatedBody(
    event,
    object({
      name: string(),
    })
  );

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    event.node.res.statusCode = 201;
    const subject = await db
      .insertInto("subjects")
      .values({
        id: createId(),
        name: input.name,
        schoolId: id,
      })
      .returningAll()
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
