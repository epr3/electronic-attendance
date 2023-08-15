import { ROLE } from "@prisma/client";
import { object, string, array } from "zod";
import { prisma } from "~/prisma/db";

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
    return await prisma.$transaction(async (tx) => {
      const schedule = await tx.subjectTeacherClass.update({
        where: {
          id: scheduleId,
        },
        data: {
          teacherId: input.teacherId,
          subjectId: input.subjectId,
          classId,
          startTime: input.startTime,
          endTime: input.endTime,
          calendarRule: input.calendarRule,
        },
      });

      await tx.subjectStudent.deleteMany({
        where: { subjectId: schedule.id },
      });

      await tx.subjectStudent.createMany({
        data: input.students.map((item: string) => ({
          studentId: item,
          subjectId: schedule.id,
        })),
      });

      const scheduleWithStudents =
        await tx.subjectTeacherClass.findFirstOrThrow({
          where: { id: schedule.id, classId },
          include: {
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
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
