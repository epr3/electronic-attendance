import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, sessionCookieController.cookieName);

  if (!cookie) {
    return null;
  }

  const session = await db.query.userSessions.findFirst({
    where: (sessionObj, { eq }) => eq(sessionObj.id, cookie),
  });

  if (!session) {
    return null;
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
    return null;
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
      with: {
        schools: {
          with: {
            school: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return { ...user, session: session[0] };
  } else {
    const user = await db.query.users.findFirst({
      where: (userObj, { eq }) => eq(userObj.id, session.userId),
      with: {
        schools: {
          with: {
            school: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return { ...user, session };
  }
});
