import { now, parseAbsolute } from "@internationalized/date";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export async function getServerUser(sessionId: string) {
  const session = await db
    .selectFrom("userSessions")
    .selectAll()
    .where("userSessions.id", "=", sessionId)
    .executeTakeFirst();

  if (!session) {
    return null;
  }

  const nowDate = now("UTC");
  const sessionCreated = parseAbsolute(session.createdAt, "UTC");
  const isSessionExpired =
    nowDate.compare(
      sessionCreated.add({
        days: Number(process.env.SESSION_EXPIRY_DAYS as string),
      })
    ) >= 0;

  if (isSessionExpired) {
    await db
      .deleteFrom("userSessions")
      .where("userSessions.id", "=", sessionId)
      .executeTakeFirst();

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
          .selectAll("schoolsUsers")
          .whereRef("schoolsUsers.userId", "=", "users.id")
      ).as("schools"),
    ])
    .where("users.id", "=", session.userId)
    .executeTakeFirst();

  if (!user) {
    return null;
  }

  return { user, session };
}
