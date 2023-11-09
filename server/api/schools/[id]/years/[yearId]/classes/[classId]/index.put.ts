import { eq } from "drizzle-orm";
import { object, string, array } from "zod";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const yearId = event.context.params!.yearId;
  const classId = event.context.params!.classId;

  const input = await useValidatedBody(
    event,
    object({
      classId: string().uuid(),
      title: string().min(1),
      headTeacherId: string().uuid(),
      students: array(string().uuid()),
    })
  );

  await useUserRoleSchool(id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const classes = await db.transaction(async (tx) => {
      const group = await tx
        .update(schema.classes)
        .set({
          title: input.title,
          headTeacherId: input.headTeacherId,
          isActive: true,
          schoolId: id,
          schoolYearId: yearId,
        })
        .where(eq(schema.classes.id, classId))
        .returning();

      await tx
        .delete(schema.classesStudents)
        .where(eq(schema.classesStudents.classId, group[0].id));

      await tx.insert(schema.classesStudents).values(
        input.students.map((item: string) => ({
          studentId: item,
          classId: group[0].id,
        }))
      );

      const classWithStudents = await tx.query.classes.findFirst({
        where: (classes, { eq }) => eq(classes.id, group[0].id),
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
    return classes;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
