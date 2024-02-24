import { decodeHex } from "oslo/encoding";

export default defineEventHandler(async (event) => {
  try {
    const user = await useServerUser(event);

    const mfa = await db
      .selectFrom("userMfas")
      .select(["secret", "emailOnly"])
      .where("userMfas.userId", "=", user.id)
      .executeTakeFirstOrThrow();

    if (!mfa) {
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "Invalid session.",
      });
    }

    const token = await totpController.generate(decodeHex(mfa.secret));
    if (mfa.emailOnly) {
      // re-enable when have money
      const from = "CatalogID";
      const to = user.telephone.split("+")[1];
      const text = `Your verification code is ${token}`;
      return { from, to, text };
      // await ctx.vonage.send({ from, to, text });
    }

    return sendNoContent(event, 204);
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
