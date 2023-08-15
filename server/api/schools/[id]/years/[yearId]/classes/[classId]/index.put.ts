import { ROLE } from "@prisma/client";
import { object, string, array } from "zod";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const yearId = event.context.params!.yearId;
  const classId = event.context.params!.classId;

  const input = await useValidatedBody(
    event,
    object({
      classId: string().uuid(),
      title: string().min(1),
      headTeacherId: string().uuid(),
      students: array(string().uuid()),
    })
  );

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    return await prisma.$transaction(async (tx) => {
      const group = await tx.class.update({
        where: {
          id: classId,
        },
        data: {
          title: input.title,
          headTeacherId: input.headTeacherId,
          isActive: true,
          schoolId: id,
          schoolYearId: yearId,
        },
      });

      await tx.classStudent.deleteMany({ where: { classId: group.id } });

      await tx.classStudent.createMany({
        data: input.students.map((item: string) => ({
          studentId: item,
          classId: group.id,
        })),
      });

      const classWithStudents = await tx.class.findFirstOrThrow({
        where: { id: group.id },
        include: {
          headTeacher: true,
          students: {
            include: {
              student: true,
            },
          },
        },
      });

      return classWithStudents;
    });
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
