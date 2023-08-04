import { ROLE } from "@prisma/client";
import { object, string } from "zod";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const subjectId = event.context.params!.subjectId;

  const input = await useValidatedBody(
    event,
    object({
      name: string(),
    })
  );

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await prisma.subject.update({
      data: { name: input.name },
      where: { id: subjectId },
    });
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
