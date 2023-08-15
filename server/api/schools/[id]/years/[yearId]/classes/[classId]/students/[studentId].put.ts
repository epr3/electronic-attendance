import { ROLE } from "@prisma/client";
import { object, string } from "zod";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const studentId = event.context.params!.studentId;

  const input = await useValidatedBody(
    event,
    object({
      classId: string().uuid(),
    })
  );

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    // TODO: remove the join table record if the student has events for the class
    await prisma.classStudent.create({
      data: { classId: input.classId, studentId },
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
