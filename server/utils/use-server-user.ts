import { eq } from "drizzle-orm";
import type { H3Event } from "h3";

export async function useServerUser(event: H3Event) {
  const cookie = getCookie(event, sessionCookieController.cookieName);

  if (!cookie) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Not logged in.",
    });
  }

  const session = await db.query.userSessions.findFirst({
    where: (sessionObj, { eq }) => eq(sessionObj.id, cookie),
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Not logged in.",
    });
  }

  const sessionState = sessionController.getSessionState(session.expiresAt);

  if (sessionState === "expired") {
    await db
      .delete(schema.userSessions)
      .where(eq(schema.userSessions.id, cookie));
    const blankCookie = sessionCookieController.createBlankSessionCookie();
    setCookie(event, sessionCookieController.cookieName, blankCookie.value, {
      ...blankCookie.attributes,
    });
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Not logged in.",
    });
  } else if (sessionState === "idle") {
    const session = await db
      .update(schema.userSessions)
      .set({
        expiresAt: dayjs(sessionController.createExpirationDate())
          .utc()
          .toDate(),
      })
      .where(eq(schema.userSessions.id, cookie))
      .returning();

    const updatedCookie = sessionCookieController.createSessionCookie(cookie);
    setCookie(event, sessionCookieController.cookieName, updatedCookie.value, {
      ...updatedCookie.attributes,
    });

    const user = await db.query.users.findFirst({
      where: (userObj, { eq }) => eq(userObj.id, session[0].userId),
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "Not logged in.",
      });
    }

    return { ...user, session: session[0] };
  } else {
    const user = await db.query.users.findFirst({
      where: (userObj, { eq }) => eq(userObj.id, session.userId),
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "Not logged in.",
      });
    }

    return { ...user, session };
  }
}
