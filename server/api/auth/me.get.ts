import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = await useServerAuth(event);
  try {
    const userObject = await prisma.user.findFirst({
      where: { id: user.id, verifiedAt: { not: null } },
      include: {
        mfa: true,
        school: { include: { school: true } },
      },
    });

    return userObject;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
