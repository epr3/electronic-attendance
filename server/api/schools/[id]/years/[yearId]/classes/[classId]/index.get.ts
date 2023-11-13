import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const classId = event.context.params!.classId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const classWithStudents = await db.query.classes.findFirst({
      where: (classObj, { eq }) => eq(classObj.id, classId),
      with: {
        headTeacher: true,
        students: {
          include: {
            student: true,
          },
        },
      },
    });

    return classWithStudents;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
