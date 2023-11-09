import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (session) {
    const userRoles = await db.query.schoolsUsers.findMany({
      where: (schoolUsers, { eq }) => eq(schoolUsers.userId, session.user.id),
    });

    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(schema.userMfas)
      .where(eq(schema.userMfas.userId, session.user.id));

    return {
      ...session.user,
      mfa: result[0].count > 0,
      mfaVerified: session.mfa_verified,
      verified: session.user.verified_at !== null,
      roles: userRoles.map((schoolUser) => schoolUser.role),
    };
  }
  return {
    user: null,
  };
});
