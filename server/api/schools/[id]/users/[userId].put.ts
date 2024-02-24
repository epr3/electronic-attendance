import { nativeEnum, object, string } from "zod";
import { ROLE } from "~/database/schema";

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

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await db.transaction().execute(async (tx) => {
      await tx
        .updateTable("users")
        .set({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          telephone: input.telephone,
        })
        .where("users.id", "=", userId)
        .executeTakeFirst();

      await tx
        .updateTable("schoolsUsers")
        .set({ role: input.role })
        .where(({ and, eb }) =>
          and([
            eb("schoolsUsers.userId", "=", userId),
            eb("schoolsUsers.schoolId", "=", id),
          ])
        )
        .executeTakeFirst();
    });
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
