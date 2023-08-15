import { ROLE } from "@prisma/client";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) ?? 1;
  const pageSize = parseInt(query.page as string) ?? 12;
  const id = event.context.params!.id;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const [subjects, count] = await Promise.all([
      prisma.subject.findMany({
        where: {
          schoolId: id,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.subject.count({
        where: {
          schoolId: id,
        },
      }),
    ]);
    return { subjects, count };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
