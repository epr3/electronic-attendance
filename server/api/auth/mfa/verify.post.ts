import { object, string } from "zod";
import { decodeHex } from "oslo/encoding";

export default defineEventHandler(async (event) => {
  const input = await useValidatedBody(
    event,
    object({
      token: string(),
    })
  );
  try {
    const user = await useServerUser(event);

    const mfa = await db
      .selectFrom("userMfas")
      .select(["secret"])
      .where("userMfas.userId", "=", user.id)
      .executeTakeFirst();

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
      .updateTable("userSessions")
      .set({ mfaVerified: true })
      .where("userSessions.id", "=", user.session.id)
      .executeTakeFirst();

    const school = await db
      .selectFrom("schoolsUsers")
      .select(["schoolId"])
      .where("schoolsUsers.userId", "=", user.id)
      .executeTakeFirst();

    if (school) {
      return { schoolId: school.schoolId };
    }

    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "The provided code is invalid.",
    });
  }
});
