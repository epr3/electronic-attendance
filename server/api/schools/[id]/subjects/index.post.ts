import { ROLE } from "@prisma/client";
import { object, string } from "zod";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  const input = await useValidatedBody(
    event,
    object({
      name: string(),
    })
  );

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    event.node.res.statusCode = 201;
    return await prisma.subject.create({
      data: {
        name: input.name,
        schoolId: id,
      },
    });
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
