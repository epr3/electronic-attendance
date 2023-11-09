import { array, object, string } from "zod";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const yearId = event.context.params!.yearId;

  const input = await useValidatedBody(
    event,
    object({
      title: string().min(1),
      headTeacherId: string().uuid(),
      students: array(string().uuid()),
    })
  );

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    event.node.res.statusCode = 201;
    const classObj = await db.transaction(async (tx) => {
      const group = await tx
        .insert(schema.classes)
        .values({
          title: input.title,
          headTeacherId: input.headTeacherId,
          isActive: true,
          schoolId: id,
          schoolYearId: yearId,
        })
        .returning();

      await tx.insert(schema.classesStudents).values(
        input.students.map((item: string) => ({
          studentId: item,
          classId: group[0].id,
        }))
      );

      const classWithStudents = await tx.query.classes.findFirst({
        where: (classObj, { eq }) => eq(classObj.id, group[0].id),
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
    });

    return classObj;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
