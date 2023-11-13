import { and, eq } from "drizzle-orm";
import { decodeHex } from "oslo/encoding";
import { object, string, boolean } from "zod";

export default defineEventHandler(async (event) => {
  const input = await useValidatedBody(
    event,
    object({
      secret: string(),
      token: string(),
      smsOnly: boolean(),
    })
  );

  try {
    const ok = await totpController.verify(
      input.token,
      decodeHex(input.secret)
    );

    if (!ok) {
      console.log("secret bad");
      throw createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "Invalid token",
      });
    }

    const user = await useServerUser(event);

    await db.transaction(async (tx) => {
      await tx
        .delete(schema.userMfas)
        .where(eq(schema.userMfas.userId, user.id));

      await tx.insert(schema.userMfas).values({
        secret: input.secret,
        userId: user.id,
        smsOnly: input.smsOnly,
      });

      await tx
        .update(schema.userSessions)
        .set({ mfaVerified: true })
        .where(
          and(
            eq(schema.userSessions.userId, user.id),
            eq(schema.userSessions.id, user.session.id)
          )
        );
    });

    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
