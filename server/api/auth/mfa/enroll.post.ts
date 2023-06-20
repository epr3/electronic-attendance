import { object, string, boolean } from "zod";

export default defineEventHandler(async (event) => {
  const user = useServerAuth(event);
  const input = await useValidatedBody(
    event,
    object({
      secret: string(),
      smsOnly: boolean(),
    })
  );
  try {
    const userObject = await event.context.prisma.user.findFirstOrThrow({
      where: { email: user.email },
      include: { mfa: true },
    });

    await event.context.prisma.userMfa.upsert({
      where: {
        userId: userObject.id,
      },
      update: {
        mfaSmsOnly: input.smsOnly,
      },
      create: {
        userId: userObject.id,
        mfaSecret: input.secret,
        mfaSmsOnly: input.smsOnly,
      },
    });

    return null;
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
