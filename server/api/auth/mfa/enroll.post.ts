import { decodeHex } from "oslo/encoding";
import { object, string, boolean } from "zod";
import { createId } from "@paralleldrive/cuid2";

export default defineEventHandler(async (event) => {
  const input = await useValidatedBody(
    event,
    object({
      secret: string(),
      token: string(),
      emailOnly: boolean(),
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

    await db.transaction().execute(async (tx) => {
      await tx
        .deleteFrom("userMfas")
        .where("userMfas.userId", "=", user.id)
        .executeTakeFirst();

      await tx
        .insertInto("userMfas")
        .values({
          id: createId(),
          secret: input.secret,
          userId: user.id,
          emailOnly: input.emailOnly,
        })
        .executeTakeFirst();

      await tx
        .updateTable("userSessions")
        .set({ mfaVerified: true })
        .where(({ and, eb }) =>
          and([eb("userId", "=", user.id), eb("id", "=", user.session.id)])
        )
        .executeTakeFirst();
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
