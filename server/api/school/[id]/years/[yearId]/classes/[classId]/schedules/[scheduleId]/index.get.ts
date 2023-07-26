import { ROLE } from "@prisma/client";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const classId = event.context.params!.classId;
  const scheduleId = event.context.params!.scheduleId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const schedule = await prisma.subjectTeacherClass.findFirstOrThrow({
      where: { id: scheduleId, classId },
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

    return schedule;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
