import { toDataURL } from "qrcode";
import { createTOTPKeyURI } from "oslo/otp";
import { decodeHex } from "oslo/encoding";

export default defineEventHandler(async (event) => {
  try {
    const user = await useServerUser(event);

    const mfa = await db.query.userMfas.findFirst({
      where: (mfa, { eq }) => eq(mfa.userId, user.id),
    });

    console.log(mfa);

    if (!mfa) {
      return createError({
        statusCode: 401,
        statusMessage: "UNAUTHORIZED",
        message: "Invalid session.",
      });
    }

    const uri = createTOTPKeyURI(
      "Electronic Attendance",
      user!.email,
      decodeHex(mfa.secret)
    );
    console.log(uri);
    const qrCode = await toDataURL(uri);

    return { qrCode };
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An error has occured while generating the QR Code",
    });
  }
});
