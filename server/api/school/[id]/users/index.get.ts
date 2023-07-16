import { ROLE } from "@prisma/client";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) ?? 1;
  const pageSize = parseInt(query.pageSize as string) ?? 12;
  const role = query.role;
  const excludeYear = query.excludeYear;
  const includeClass = query.includeClass;
  const id = event.context.params!.id;

  let filterObject = {};

  if (role) {
    filterObject = { role };
    if (excludeYear) {
      filterObject = {
        ...filterObject,
        user:
          role === ROLE.STUDENT
            ? {
                classes: {
                  none: {
                    class: {
                      schoolYearId: excludeYear as string,
                    },
                  },
                },
              }
            : {
                OR: [
                  { headTeacherClass: null },
                  {
                    headTeacherClass: {
                      schoolYearId: {
                        not: excludeYear,
                      },
                    },
                  },
                ],
              },
      };

      if (includeClass) {
        filterObject = {
          ...filterObject,
          user:
            role === ROLE.STUDENT
              ? {
                  OR: [
                    {
                      classes: {
                        some: {
                          classId: includeClass as string,
                        },
                      },
                    },
                    {
                      classes: {
                        none: {
                          class: {
                            schoolYearId: excludeYear as string,
                          },
                        },
                      },
                    },
                  ],
                }
              : {
                  OR: [
                    { headTeacherClass: { id: includeClass as string } },
                    {
                      headTeacherClass: {
                        isNot: {
                          schoolYearId: excludeYear as string,
                        },
                      },
                    },
                  ],
                },
        };
      }
    }
  }

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const [users, count] = await Promise.all([
      prisma.schoolUser.findMany({
        where: {
          schoolId: id,
          ...filterObject,
        },
        include: { user: true },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.schoolUser.count({
        where: {
          schoolId: id,
          ...filterObject,
        },
      }),
    ]);

    return {
      users: users.map((item) => ({
        id: item.userId,
        firstName: item.user.firstName,
        lastName: item.user.lastName,
        email: item.user.email,
        telephone: item.user.telephone,
        role: item.role,
      })),
      count,
    };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
