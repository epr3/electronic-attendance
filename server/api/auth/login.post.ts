import { object, string } from "zod";

import { ROLE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const { $db } = useNuxtApp();
  const input = await useValidatedBody(
    event,
    object({
      email: string().email(),
      password: string().min(8),
    })
  );

  try {
    const key = await auth.useKey("email", input.email, input.password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {
        mfaVerified: false,
      },
    });
    const authRequest = auth.handleRequest(event);
    authRequest.setSession(session);
    const user = await $db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, key.userId),
      with: {
        mfa: true,
        schools: true,
      },
    });

    if (user) {
      return {
        hasMfa: !!user.mfa,
        mfaRequired: user.schools.some(
          (item) =>
            item.role === ROLE.ADMIN ||
            item.role === ROLE.DIRECTOR ||
            item.role === ROLE.TEACHER
        ),
      };
    }

    return createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "Invalid email or password",
    });
  } catch (e) {
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
