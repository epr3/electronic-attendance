import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const authCookie = getCookie(event, sessionCookieController.cookieName);

  if (!authCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Not logged in.",
    });
  }

  // check if user is authenticated
  const session = await db
    .delete(schema.userSessions)
    .where(eq(schema.userSessions.id, authCookie));
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
