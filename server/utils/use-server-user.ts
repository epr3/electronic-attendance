export function useServerUser() {
  const user = useUser();

  if (!user.value) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Not logged in.",
    });
  }

  return user;
}
