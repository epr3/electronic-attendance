import { sql, eq } from "drizzle-orm";

import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) ?? 1;
  const pageSize = parseInt(query.pageSize as string) ?? 5;
  const id = event.context.params!.id;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const [subjects, result] = await Promise.all([
      db.query.subjects.findMany({
        where: (subjects, { eq }) => eq(subjects.schoolId, id),
        limit: pageSize,
        offset: page * pageSize,
      }),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.subjects)
        .where(eq(schema.subjects.schoolId, id)),
    ]);
    return { subjects, count: result[0].count };
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
