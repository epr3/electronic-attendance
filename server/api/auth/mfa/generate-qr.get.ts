import { toDataURL } from "qrcode";
import { createTOTPKeyURI } from "oslo/otp";
import { encodeHex } from "oslo/encoding";
import { HMAC } from "oslo/crypto";

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;

    const secret = await new HMAC("SHA-1").generateKey();

    const uri = createTOTPKeyURI("Electronic Attendance", user!.email, secret);

    const qrCode = await toDataURL(uri);

    return { qrCode, secret: encodeHex(secret) };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An error has occured while generating the QR Code",
    });
  }
});
