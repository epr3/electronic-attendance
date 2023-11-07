export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  // check if user is authenticated
  const session = await authRequest.validate();
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Invalid session.",
    });
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);
  // delete session cookie
  authRequest.setSession(null);
  return sendRedirect(event, "/login");
});
