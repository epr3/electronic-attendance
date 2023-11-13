import { object, string, array } from "zod";
import { eq } from "drizzle-orm";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const classId = event.context.params!.classId;
  const scheduleId = event.context.params!.scheduleId;

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

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const schedule = await db.transaction(async (tx) => {
      const schedule = await tx
        .update(schema.subjectsTeachersClasses)
        .set({
          teacherId: input.teacherId,
          subjectId: input.subjectId,
          classId,
          startTime: input.startTime,
          endTime: input.endTime,
          calendarRule: input.calendarRule,
        })
        .where(eq(schema.subjectsTeachersClasses.id, scheduleId))
        .returning();

      await tx
        .delete(schema.subjectsStudents)
        .where(eq(schema.subjectsStudents.subjectId, schedule[0].id));

      await tx.insert(schema.subjectsStudents).values(
        input.students.map((item: string) => ({
          studentId: item,
          subjectId: schedule[0].id,
        }))
      );

      const scheduleWithStudents =
        await tx.query.subjectsTeachersClasses.findFirst({
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
