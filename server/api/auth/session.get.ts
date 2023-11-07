import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { $db, $schema } = useNuxtApp();
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (session) {
    const userRoles = await $db.query.schoolUsers.findMany({
      where: (schoolUsers, { eq }) => eq(schoolUsers.userId, session.user.id),
    });

    const result = await $db
      .select({ count: sql<number>`COUNT(*)` })
      .from($schema.userMfas)
      .where(eq($schema.userMfas.userId, session.user.id));

    return {
      ...session.user,
      mfa: result[0].count > 0,
      mfaVerified: session.mfaVerified,
      verified: session.user.verifiedAt !== null,
      roles: userRoles.map((schoolUser) => schoolUser.role),
    };
  }
  return {
    user: null,
  };
});
