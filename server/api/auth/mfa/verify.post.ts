import { object, string } from "zod";

export default defineEventHandler(async (event) => {
  const { $db, $totpController } = useNuxtApp();
  const user = useServerUser();
  const input = await useValidatedBody(
    event,
    object({
      token: string(),
    })
  );
  try {
    const mfa = await $db.query.userMfas.findFirst({
      where: (mfa, { eq }) => eq(mfa.userId, user.value!.id),
    });

    if (!mfa) {
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "The provided code is invalid.",
      });
    }

    const validOTP = await $totpController.verify(
      input.token,
      new TextEncoder().encode(mfa.secret)
    );

    if (!validOTP) {
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "The provided code is invalid.",
      });
    }

    const authRequest = auth.handleRequest(event);
    // check if user is authenticated
    const session = await authRequest.validate();
    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "The provided code is invalid.",
      });
    }

    const newSession = await auth.updateSessionAttributes(session.id, {
      mfaVerified: true,
    });

    authRequest.setSession(newSession);

    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "The provided code is invalid.",
    });
  }
});
