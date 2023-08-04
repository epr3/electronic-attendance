import { ROLE } from "@prisma/client";
import { object, string, array } from "zod";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  const input = await useValidatedBody(
    event,
    object({
      schoolDateRule: string().min(1),
      holidayDateRules: array(
        object({ name: string().min(1), rule: string().min(1) })
      ),
    })
  );

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    event.node.res.statusCode = 201;
    return await prisma.$transaction(async (tx) => {
      const schoolYearObj = await tx.schoolYear.create({
        data: {
          schoolId: id,
          schoolDateRule: input.schoolDateRule,
          holidays: {
            create: input.holidayDateRules.map(
              (item: { name: string; rule: string }) => ({
                name: item.name,
                holidayDateRule: item.rule,
              })
            ),
          },
        },
      });
      return schoolYearObj;
    });
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
