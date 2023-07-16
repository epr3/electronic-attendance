import { ROLE } from "@prisma/client";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) ?? 1;
  const pageSize = parseInt(query.page as string) ?? 12;
  const id = event.context.params!.id;
  const yearId = event.context.params!.yearId;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const [classes, count] = await Promise.all([
      prisma.class.findMany({
        where: {
          schoolId: id,
          schoolYearId: yearId,
        },
        include: {
          headTeacher: true,
          _count: {
            select: {
              students: true,
            },
          },
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.class.count({
        where: {
          schoolId: id,
          schoolYearId: yearId,
        },
      }),
    ]);
    return { classes, count };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
