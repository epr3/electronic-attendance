import { ROLE } from "@prisma/client";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const classId = event.context.params!.classId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const [schedules, count] = await Promise.all([
      prisma.subjectTeacherClass.findMany({
        where: { classId },
        include: {
          teacher: true,
          subject: true,
          students: {
            include: {
              student: true,
            },
          },
        },
      }),
      prisma.subjectTeacherClass.count({
        where: { classId },
      }),
    ]);

    return { schedules, count };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
