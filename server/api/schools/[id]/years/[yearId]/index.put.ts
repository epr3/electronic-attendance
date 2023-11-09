import { eq } from "drizzle-orm";
import { array, object, string } from "zod";
import { ROLE } from "~/drizzle/schema";

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

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const year = await db.transaction(async (tx) => {
      await tx
        .update(schema.schoolYears)
        .set({
          schoolDateRule: input.schoolDateRule,
        })
        .where(eq(schema.schoolYears.id, yearId));

      await tx
        .delete(schema.schoolYearHolidays)
        .where(eq(schema.schoolYearHolidays.schoolYearId, yearId));

      await tx.insert(schema.schoolYearHolidays).values(
        input.holidayDateRules.map((item: { name: string; rule: string }) => ({
          name: item.name,
          holidayDateRule: item.rule,
        }))
      );
      return await tx.query.schoolYears.findFirst({
        where: (schoolYear, { and, eq }) =>
          and(eq(schoolYear.schoolId, yearId), eq(schoolYear.schoolId, id)),
        with: {
          holidays: true,
        },
      });
    });

    return year;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
