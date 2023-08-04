import { ROLE } from "@prisma/client";
import { object, string } from "zod";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const classId = event.context.params!.classId;
  const studentId = event.context.params!.studentId;

  const input = await useValidatedBody(
    event,
    object({
      classId: string().uuid(),
    })
  );

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await prisma.classStudent.update({
      where: { studentId_classId: { studentId, classId } },
      data: { classId: input.classId },
    });
    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
