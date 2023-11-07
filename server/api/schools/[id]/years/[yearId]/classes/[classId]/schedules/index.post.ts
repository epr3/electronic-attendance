import { array, object, string } from "zod";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const { $db, $schema } = useNuxtApp();
  const id = event.context.params!.id;
  const classId = event.context.params!.classId;

  const input = await useValidatedBody(
    event,
    object({
      startTime: string().min(1),
      subjectId: string().uuid(),
      endTime: string().min(1),
      calendarRule: string().min(1),
      teacherId: string().uuid(),
      students: array(string().uuid()),
    })
  );

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    event.node.res.statusCode = 201;
    const schedule = await $db.transaction(async (tx) => {
      const schedule = await tx
        .insert($schema.subjectsTeachersClasses)
        .values({
          teacherId: input.teacherId,
          subjectId: input.subjectId,
          classId,
          startTime: input.startTime,
          endTime: input.endTime,
          calendarRule: input.calendarRule,
        })
        .returning();

      await tx.insert($schema.subjectsStudents).values(
        input.students.map((item: string) => ({
          studentId: item,
          subjectId: schedule[0].id,
        }))
      );

      const scheduleWithStudents =
        await tx.query.subjectsTeachersClasses.findFirst({
          where: (subject, { eq, and }) =>
            and(eq(subject.id, schedule[0].id), eq(subject.classId, classId)),
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

      return scheduleWithStudents;
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
