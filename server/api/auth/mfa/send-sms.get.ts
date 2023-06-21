import { authenticator } from "otplib";
import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = useServerAuth(event);

  try {
    const userObject = await prisma.user.findFirstOrThrow({
      where: { email: user.email },
      include: { mfa: true },
    });
    if (user.mfa?.mfaSmsOnly) {
      const token = authenticator.generate(userObject.mfa!.mfaSecret);
      // re-enable when have money
      const from = "CatalogID";
      const to = user.telephone.split("+")[1];
      const text = `Your verification code is ${token}`;
      console.log(from, to, text);
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
