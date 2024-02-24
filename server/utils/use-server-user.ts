import type { H3Event } from "h3";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export async function getServerUser(event: H3Event) {
  const cookie = getCookie(event, COOKIE_NAME);

  if (!cookie) {
    return null;
  }

  const session = await db
    .selectFrom("userSessions")
    .selectAll()
    .where("userSessions.id", "=", cookie)
    .executeTakeFirst();

  if (!session) {
    return null;
  }

  const isSessionExpired = dayjs().isAfter(dayjs(session.expiresAt));

  if (isSessionExpired) {
    await db
      .deleteFrom("userSessions")
      .where("userSessions.id", "=", cookie)
      .executeTakeFirst();

    setCookie(event, COOKIE_NAME, "", { ...COOKIE_ATTRIBUTES, maxAge: -1 });
    return null;
  }
  const user = await db
    .selectFrom("users")
    .select((eb) => [
      "id",
      "firstName",
      "lastName",
      "email",
      "telephone",
      "mfaEnabled",
      jsonArrayFrom(
        eb
          .selectFrom("schoolsUsers")
          .selectAll()
          .whereRef("schoolsUsers.userId", "=", "users.id")
      ).as("schools"),
    ])
    .where("users.id", "=", session.userId)
    .executeTakeFirst();

  if (!user) {
    return null;
  }

  return { ...user, session };
}

export async function useServerUser(event: H3Event) {
  const user = await getServerUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Not logged in.",
    });
  }

  return user;
}
