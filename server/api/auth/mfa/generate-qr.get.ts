import { authenticator } from "otplib";
import { toDataURL } from "qrcode";

export default defineEventHandler(async (event) => {
  const user = await useServerAuth(event);

  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(
    user.email,
    "electronic-attendance",
    secret
  );

  try {
    const qrCode = await toDataURL(otpauth);

    return { qrCode, secret };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An error has occured while generating the QR Code",
    });
  }
});
