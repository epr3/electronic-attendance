export default defineEventHandler(async (event) => {
  const authCookie = getCookie(event, COOKIE_NAME);

  if (!authCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Not logged in.",
    });
  }

  // check if user is authenticated
  const session = await db
    .deleteFrom("userSessions")
    .where("userSessions.id", "=", authCookie)
    .executeTakeFirst();

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Invalid session.",
    });
  }

  setCookie(event, COOKIE_NAME, "", { ...COOKIE_ATTRIBUTES, maxAge: -1 });
  event.context.user = null;
  event.context.session = null;

  return sendRedirect(event, "/login");
});