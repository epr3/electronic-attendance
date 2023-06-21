import { ROLE } from "@prisma/client";
import { array, object, string } from "zod";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const yearId = event.context.params!.subjectId;

  const input = await useValidatedBody(
    event,
    object({
      schoolDateRule: string().min(1),
      holidayDateRules: array(
        object({ name: string(), rule: string().min(1) })
      ),
      yearId: string().uuid(),
    })
  );

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.schoolYear.update({
        data: {
          schoolDateRule: input.schoolDateRule,
        },
        where: { id: yearId },
      });

      await tx.schoolYearHolidays.deleteMany({
        where: {
          schoolYearId: yearId,
        },
      });

      await tx.schoolYearHolidays.createMany({
        data: input.holidayDateRules.map(
          (item: { name: string; rule: string }) => ({
            name: item.name,
            holidayDateRule: item.rule,
            schoolYearId: yearId,
          })
        ),
      });
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
