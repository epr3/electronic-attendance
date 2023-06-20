import { object, string } from "zod";
import { authenticator } from "otplib";

export default defineEventHandler(async (event) => {
  const user = useServerAuth(event);
  const input = await useValidatedBody(
    event,
    object({
      token: string(),
    })
  );
  try {
    await event.context.prisma.user.findFirstOrThrow({
      where: { email: user.email },
      include: { mfa: true, school: { include: { school: true } } },
    });
  } catch (e) {
    return createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "The provided code is invalid.",
    });
  }

  const isValid = authenticator.verify({
    token: input.token,
    secret: user.mfa!.mfaSecret,
  });

  if (!isValid) {
    return createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "The provided code is invalid.",
    });
  }

  event.context.session.mfaVerified = true;
  await event.context.session.save();

  return null;
});
