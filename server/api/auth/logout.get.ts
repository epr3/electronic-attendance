import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const authCookie = getCookie(event, sessionCookieController.cookieName);

  const sessionCookie = sessionCookieController.parseCookies(authCookie);
  if (!sessionCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Invalid session.",
    });
  }
  // check if user is authenticated
  const session = await db
    .delete(schema.userSessions)
    .where(eq(schema.userSessions.id, sessionCookie));
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Invalid session.",
    });
  }

  const blankCookie = sessionCookieController.createBlankSessionCookie();

  setCookie(event, sessionCookieController.cookieName, blankCookie.serialize());

  return sendRedirect(event, "/login");
});
