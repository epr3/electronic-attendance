import { object, string, boolean } from "zod";

export default defineEventHandler(async (event) => {
  const input = await useValidatedBody(
    event,
    object({
      secret: string(),
      smsOnly: boolean(),
    })
  );

  try {
    const user = await useServerUser(event);

    await db
      .insert(schema.userMfas)
      .values({
        secret: input.secret,
        userId: user.id,
        smsOnly: input.smsOnly,
      })
      .onConflictDoUpdate({
        target: schema.userMfas.userId,
        set: { smsOnly: input.smsOnly },
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
