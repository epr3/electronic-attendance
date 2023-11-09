import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const yearId = event.context.params!.yearId;

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const schoolYear = await db.query.schoolYears.findFirst({
      where: (schoolYear, { and, eq }) =>
        and(eq(schoolYear.schoolId, id), eq(schoolYear.id, yearId)),
      with: {
        holidays: true,
      },
    });

    return schoolYear;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
