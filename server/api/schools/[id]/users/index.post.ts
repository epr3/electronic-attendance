import { createId } from "@paralleldrive/cuid2";
import { generateRandomString, alphabet } from "oslo/crypto";
import { nativeEnum, object, string } from "zod";
import { ROLE, TOKEN_TYPE } from "~/database/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

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
    const user = await db.transaction().execute(async (tx) => {
      const user = await tx
        .insertInto("users")
        .values({
          id: createId(),
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          telephone: input.telephone,
          createdAt: dayjs().utc().toDate(),
          updatedAt: dayjs().utc().toDate(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      if (dayjs(Number(user.createdAt)).isSame(Number(user.updatedAt))) {
        await tx
          .insertInto("tokens")
          .values({
            id: createId(),
            email: input.email,
            token: generateRandomString(63, alphabet("a-z", "0-9")),
            type: TOKEN_TYPE.RESET_PASSWORD,
            expiresAt: dayjs().utc().add(1, "day").toDate(),
          })
          .executeTakeFirst();
      }

      const schoolUser = await tx
        .insertInto("schoolsUsers")
        .values({
          id: createId(),
          schoolId: id,
          userId: user.id,
          role: input.role,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      return { ...user, role: schoolUser.role };
    });
    event.node.res.statusCode = 201;
    return user;
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
