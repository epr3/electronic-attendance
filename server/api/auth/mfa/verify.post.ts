import { object, string } from "zod";
import { authenticator } from "otplib";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = await useServerAuth(event);
  const input = await useValidatedBody(
    event,
    object({
      token: string(),
    })
  );
  try {
    const userObject = await prisma.user.findFirstOrThrow({
      where: { email: user.email },
      include: { mfa: true, school: { include: { school: true } } },
    });

    const isValid = authenticator.verify({
      token: input.token,
      secret: userObject.mfa!.mfaSecret,
    });

    if (!isValid) {
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "The provided code is invalid.",
      });
    }
    const session = await useServerSession(event);

    session.mfaVerified = true;
    await session.save();

    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "The provided code is invalid.",
    });
  }
});
