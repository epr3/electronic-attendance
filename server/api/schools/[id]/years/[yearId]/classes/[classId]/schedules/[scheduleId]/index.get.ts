import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const classId = event.context.params!.classId;
  const scheduleId = event.context.params!.scheduleId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const schedule = await db.query.subjectsTeachersClasses.findFirst({
      where: (subject, { and, eq }) =>
        and(eq(subject.id, scheduleId), eq(subject.classId, classId)),
      with: {
        teacher: true,
        subject: true,
        students: {
          include: {
            student: true,
          },
        },
      },
    });

    return schedule;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
