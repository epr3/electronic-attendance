import { sql, eq, and } from "drizzle-orm";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) ?? 1;
  const pageSize = parseInt(query.page as string) ?? 12;
  const id = event.context.params!.id;
  const yearId = event.context.params!.yearId;

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const [classes, result] = await Promise.all([
      db.query.classes.findMany({
        where: (classObj, { and, eq }) =>
          and(eq(classObj.schoolId, id), eq(classObj.schoolYearId, yearId)),
        with: {
          headTeacher: true,
        },
        offset: (page - 1) * pageSize,
        limit: pageSize,
      }),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.schoolYears)
        .where(
          and(
            eq(schema.schoolYears.schoolId, id),
            eq(schema.schoolYears.id, yearId)
          )
        ),
    ]);
    return { classes, count: result[0].count };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
