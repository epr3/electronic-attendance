import { now, parseAbsolute } from "@internationalized/date";
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
          createdAt: now("UTC").toAbsoluteString(),
          updatedAt: now("UTC").toAbsoluteString(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      if (
        parseAbsolute(user.createdAt, "UTC").compare(
          parseAbsolute(user.updatedAt, "UTC")
        ) === 0
      ) {
        await tx
          .insertInto("tokens")
          .values({
            id: createId(),
            email: input.email,
            token: generateRandomString(63, alphabet("a-z", "0-9")),
            type: TOKEN_TYPE.RESET_PASSWORD,
            expiresAt: now("UTC").add({ days: 1 }).toAbsoluteString(),
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
