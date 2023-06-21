import { ROLE } from "@prisma/client";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) ?? 1;
  const pageSize = parseInt(query.pageSize as string) ?? 12;
  const role = query.role;
  const id = event.context.params!.id;

  let roleObject = {};

  if (role) {
    roleObject = { role };
  }

  const user = await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const [users, count] = await Promise.all([
      prisma.schoolUser.findMany({
        where: {
          schoolId: id,
          userId: { not: user.id },
          ...roleObject,
        },
        include: { user: true },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.schoolUser.count({
        where: {
          schoolId: id,
          userId: { not: user.id },
          ...roleObject,
        },
      }),
    ]);

    return {
      users: users.map((item) => ({
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
