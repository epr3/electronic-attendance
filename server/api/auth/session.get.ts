export default defineEventHandler(async (event) => {
  try {
    const session = await useServerSession(event);
    return session;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
