import { generateRandomString, alphabet } from "oslo/random";
import { object, string } from "zod";

import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const input = await useValidatedBody(
    event,
    object({
      email: string().email(),
      password: string().min(8),
    })
  );

  try {
    const key = await db.query.userKeys.findFirst({
      where: (key, { eq }) => eq(key.id, `email:${input.email}`),
    });
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
    const expirationDate = sessionController.createExpirationDate();

    await db
      .insert(schema.userSessions)
      .values({
        id: sessionId,
        userId: key.userId,
        expiresAt: dayjs(expirationDate).utc().toDate(),
      })
      .returning();

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, key.userId),
      with: {
        mfa: true,
        schools: true,
      },
    });

    const cookie = sessionCookieController.createSessionCookie(sessionId);

    setCookie(event, sessionCookieController.cookieName, cookie.value, {
      ...cookie.attributes,
    });

    if (user) {
      return {
        hasMfa: !!user.mfa,
        mfaRequired: user.schools.some(
          (item) =>
            item.role === ROLE.ADMIN ||
            item.role === ROLE.DIRECTOR ||
            item.role === ROLE.TEACHER
        ),
      };
    }

    return createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Invalid email or password",
    });
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
