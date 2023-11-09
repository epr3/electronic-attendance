import { and, eq } from "drizzle-orm";
import { nativeEnum, object, string } from "zod";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const userId = event.context.params!.userId;

  const input = await useValidatedBody(
    event,
    object({
      firstName: string().min(1),
      lastName: string().min(1),
      email: string().email(),
      role: nativeEnum(ROLE),
      telephone: string().min(1),
    })
  );

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(schema.users)
        .set({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          telephone: input.telephone,
        })
        .where(eq(schema.users.id, userId));

      await tx
        .update(schema.schoolUsers)
        .set({ role: input.role })
        .where(
          and(
            eq(schema.schoolUsers.userId, userId),
            eq(schema.schoolUsers.schoolId, id)
          )
        );
    });
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
