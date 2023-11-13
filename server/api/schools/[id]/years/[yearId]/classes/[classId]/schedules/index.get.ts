import { sql, eq } from "drizzle-orm";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const classId = event.context.params!.classId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const [schedules, result] = await Promise.all([
      db.query.subjectsTeachersClasses.findMany({
        where: (subject, { eq }) => eq(subject.classId, classId),
        with: {
          teacher: true,
          subject: true,
          students: {
            include: {
              student: true,
            },
          },
        },
      }),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.subjectsTeachersClasses)
        .where(eq(schema.subjectsTeachersClasses.classId, classId)),
    ]);

    return { schedules, count: result[0].count };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
