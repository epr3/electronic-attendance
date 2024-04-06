import { object, string } from "zod";
import { generateRandomString, alphabet } from "oslo/crypto";
import { ROLE, TOKEN_TYPE } from "~/database/schema";
import { createId } from "@paralleldrive/cuid2";
import { now, parseAbsolute } from "@internationalized/date";

export default defineEventHandler(async (event) => {
  const input = await useValidatedBody(
    event,
    object({
      email: string().email(),
      password: string().min(8),
      firstName: string().min(1),
      address: string().optional(),
      lastName: string().min(1),
      telephone: string().min(1),
      schoolName: string().min(1),
    })
  );

  try {
    await db.transaction().execute(async (tx) => {
      const user = await tx
        .insertInto("users")
        .values({
          id: createId(),
          firstName: input.firstName as string,
          lastName: input.lastName as string,
          email: input.email as string,
          telephone: input.telephone as string,
          createdAt: now("UTC").toAbsoluteString(),
          updatedAt: now("UTC").toAbsoluteString(),
          mfaEnabled: false,
        })
        .returning(["id", "email", "createdAt", "updatedAt"])
        .executeTakeFirstOrThrow();

      await tx
        .insertInto("userKeys")
        .values({
          id: `email:${user.email}`,
          userId: user.id,
          hashedPassword: await argon2id.hash(input.password),
        })
        .executeTakeFirstOrThrow();

      const createdAt = parseAbsolute(user.createdAt, "UTC");
      const updatedAt = parseAbsolute(user.updatedAt, "UTC");

      if (createdAt.compare(updatedAt) === 0) {
        await tx
          .insertInto("tokens")
          .values({
            id: createId(),
            email: input.email,
            token: generateRandomString(63, alphabet("a-z", "0-9")),
            type: TOKEN_TYPE.VALIDATION,
            expiresAt: now("UTC").add({ days: 1 }).toAbsoluteString(),
          })
          .executeTakeFirstOrThrow();

        const school = await tx
          .insertInto("schools")
          .values({
            id: createId(),
            name: input.schoolName,
          })
          .returning(["id"])
          .executeTakeFirstOrThrow();
        await tx
          .insertInto("schoolsUsers")
          .values({
            id: createId(),
            schoolId: school.id,
            userId: user.id,
            role: ROLE.DIRECTOR,
          })
          .executeTakeFirstOrThrow();
        return user;
      }
    });
    return sendNoContent(event, 204);
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
