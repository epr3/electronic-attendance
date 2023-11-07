import { toDataURL } from "qrcode";
import { createTOTPKeyURI } from "oslo/otp";

export default defineEventHandler(async () => {
  const { $db } = useNuxtApp();
  const user = useServerUser();

  const mfa = await $db.query.userMfas.findFirst({
    where: (mfa, { eq }) => eq(mfa.userId, user.value!.id),
  });

  if (!mfa) {
    return createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Invalid session.",
    });
  }

  const uri = createTOTPKeyURI(
    "Electronic Attendance",
    user.value!.email,
    new TextEncoder().encode(mfa.secret)
  );

  try {
    const qrCode = await toDataURL(uri);

    return { qrCode };
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An error has occured while generating the QR Code",
    });
  }
});
