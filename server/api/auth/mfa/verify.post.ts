import { object, string } from "zod";
import { decodeHex } from "oslo/encoding";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const input = await useValidatedBody(
    event,
    object({
      token: string(),
    })
  );
  try {
    const user = await useServerUser(event);

    const mfa = await db.query.userMfas.findFirst({
      where: (mfa, { eq }) => eq(mfa.userId, user.id),
    });

    if (!mfa) {
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "The provided code is invalid.",
      });
    }

    const validOTP = await totpController.verify(
      input.token,
      decodeHex(mfa.secret)
    );

    if (!validOTP) {
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "The provided code is invalid.",
      });
    }

    await db
      .update(schema.userSessions)
      .set({ mfaVerified: true })
      .where(eq(schema.userSessions.id, user.session.id));

    return sendNoContent(event, 204);
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "The provided code is invalid.",
    });
  }
});
