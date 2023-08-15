import { ROLE } from "@prisma/client";
import { array, object, string } from "zod";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const yearId = event.context.params!.yearId;

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
    return await prisma.$transaction(async (tx) => {
      await tx.schoolYear.update({
        where: { id: yearId },
        data: {
          schoolDateRule: input.schoolDateRule,
        },
      });

      await tx.schoolYearHolidays.deleteMany({
        where: { schoolYearId: yearId },
      });

      await tx.schoolYearHolidays.createMany({
        data: input.holidayDateRules.map(
          (item: { name: string; rule: string }) => ({
            name: item.name,
            holidayDateRule: item.rule,
          })
        ),
      });
      return await tx.schoolYear.findFirstOrThrow({
        where: {
          schoolId: id,
          id: yearId,
        },
        include: {
          holidays: true,
        },
      });
    });
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
