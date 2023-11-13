import { eq, and, or, ne, isNull } from "drizzle-orm";
import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) ?? 1;
  const pageSize = parseInt(query.pageSize as string) ?? 12;
  const role = query.role;
  const excludeYear = query.excludeYear;
  const includeClass = query.includeClass;
  const id = event.context.params!.id;

  let conditions;
  if (role) {
    if (excludeYear) {
      if (role === ROLE.STUDENT) {
        conditions = eq(schema.classes.schoolYearId, excludeYear as string);
      } else if (role === ROLE.TEACHER) {
        conditions = or(
          isNull(schema.classes.headTeacherId),
          ne(schema.classes.schoolYearId, excludeYear as string)
        );
      }

      if (includeClass) {
        if (role === ROLE.STUDENT) {
          conditions = or(
            eq(schema.classesStudents.classId, includeClass as string),
            eq(schema.classes.schoolYearId, excludeYear as string)
          );
        } else if (role === ROLE.TEACHER) {
          conditions = or(
            eq(schema.classes.id, includeClass as string),
            eq(schema.classes.schoolYearId, excludeYear as string)
          );
        }
      }
    }
  }

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const response = await db
      .select()
      .from(schema.users)
      .leftJoin(
        schema.schoolUsers,
        eq(schema.users.id, schema.schoolUsers.userId)
      )
      .leftJoin(
        schema.schools,
        eq(schema.schoolUsers.schoolId, schema.schools.id)
      )
      .leftJoin(
        schema.schoolYears,
        eq(schema.schoolYears.schoolId, schema.schools.id)
      )
      .leftJoin(
        schema.classes,
        eq(schema.classes.schoolYearId, schema.schoolYears.id)
      )
      .leftJoin(
        schema.classesStudents,
        eq(schema.classesStudents.classId, schema.classes.id)
      )
      .where(
        and(
          eq(schema.schools.id, id),
          eq(schema.schoolUsers.role, role as ROLE),
          conditions
        )
      )
      .limit(pageSize)
      .offset(page - 1);
    console.log(response);

    return {
      users: [],
      count: 0,
    };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
