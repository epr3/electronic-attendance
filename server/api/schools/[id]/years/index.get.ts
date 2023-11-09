import { sql, eq } from "drizzle-orm";

import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) ?? 1;
  const pageSize = parseInt(query.page as string) ?? 12;
  const id = event.context.params!.id;

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const [years, result] = await Promise.all([
      db.query.schoolYears.findMany({
        where: (schoolYear, { eq }) => eq(schoolYear.schoolId, id),
        with: {
          holidays: true,
        },
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.schoolYears)
        .where(eq(schema.schoolYears.schoolId, id)),
    ]);

    return { years, count: result[0].count };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
