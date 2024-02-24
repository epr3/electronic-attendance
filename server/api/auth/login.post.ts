import { generateRandomString, alphabet } from "oslo/crypto";
import { object, string } from "zod";

export default defineEventHandler(async (event) => {
  const input = await useValidatedBody(
    event,
    object({
      email: string().email(),
      password: string().min(8),
    })
  );

  try {
    const key = await db
      .selectFrom("userKeys")
      .select(["id", "hashedPassword", "userId"])
      .where("userKeys.id", "=", `email:${input.email}`)
      .executeTakeFirst();

    if (!key || !key.hashedPassword) {
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }
    const ok = await argon2id.verify(key.hashedPassword, input.password);
    if (!ok) {
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }
    const sessionId = generateRandomString(15, alphabet("a-z", "0-9"));

    await db
      .insertInto("userSessions")
      .values({
        id: sessionId,
        userId: key.userId,
        expiresAt: dayjs().add(30, "d").utc().toDate(),
      })
      .executeTakeFirst();

    const user = await db
      .selectFrom("users")
      .select(["firstName", "lastName"])
      .where("users.id", "=", key.userId)
      .executeTakeFirst();

    const cookie = createCookie(sessionId);

    setCookie(event, COOKIE_NAME, cookie.value, {
      ...cookie.attributes,
    });

    if (user) {
      return sendNoContent(event, 204);
    }

    return createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Invalid email or password",
    });
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
