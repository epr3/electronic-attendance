import { eq, and, ne, SQL, sql } from "drizzle-orm";

import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) ?? 0;
  const pageSize = parseInt(query.pageSize as string) ?? 5;
  const role = query.role;
  // const excludeYear = query.excludeYear;
  // const includeClass = query.includeClass;
  const id = event.context.params!.id;

  const user = await useServerUser(event);

  const conditions: (SQL<unknown> | undefined)[] = [
    eq(schema.schoolsUsers.schoolId, id),
    ne(schema.users.id, user.id),
  ];

  if (role) {
    conditions.push(eq(schema.schoolsUsers.role, role as ROLE));
    // if (excludeYear) {
    //   if (role === ROLE.STUDENT) {
    //     conditions.push(eq(schema.classes.schoolYearId, excludeYear as string));
    //   } else if (role === ROLE.TEACHER) {
    //     conditions.push(
    //       or(
    //         isNull(schema.classes.headTeacherId),
    //         ne(schema.classes.schoolYearId, excludeYear as string)
    //       )
    //     );
    //   }

    //   if (includeClass) {
    //     if (role === ROLE.STUDENT) {
    //       conditions.push(
    //         or(
    //           eq(schema.classesStudents.classId, includeClass as string),
    //           eq(schema.classes.schoolYearId, excludeYear as string)
    //         )
    //       );
    //     } else if (role === ROLE.TEACHER) {
    //       conditions.push(
    //         or(
    //           eq(schema.classes.id, includeClass as string),
    //           eq(schema.classes.schoolYearId, excludeYear as string)
    //         )
    //       );
    //     }
    //   }
    // }
  }

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const response = await db.transaction(async (tx) => {
      const users = await tx.query.users.findMany({
        where: (userObj, { ne }) => ne(userObj.id, user.id),
        with: {
          schools: {
            where: (schoolUser, { eq }) => eq(schoolUser.schoolId, id),
          },
        },
        limit: pageSize,
        offset: page * pageSize,
      });
      const count = await tx
        .select({ count: sql<string>`COUNT(*)` })
        .from(schema.users)
        .innerJoin(
          schema.schoolsUsers,
          eq(schema.users.id, schema.schoolsUsers.userId)
        )
        .where(
          and(
            ne(schema.users.id, user.id),
            eq(schema.schoolsUsers.schoolId, id)
          )
        );

      return { users, count: parseInt(count[0].count) };
    });

    return {
      ...response,
    };
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
