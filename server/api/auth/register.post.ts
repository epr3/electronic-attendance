import { object, string } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { generateRandomString, alphabet } from "oslo/random";
import { ROLE, TOKEN_TYPE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const { $db, $schema, $dayjs, $verificationTokenController } = useNuxtApp();
  const input = await useValidatedBody(
    event,
    object({
      email: string().email(),
      password: string().min(8),
      firstName: string().min(1),
      lastName: string().min(1),
      telephone: string().min(1),
      schoolName: string().min(1),
      schoolAcronym: string().min(1),
    })
  );

  try {
    const user = await auth.createUser({
      userId: createId(),
      key: {
        providerId: "email",
        providerUserId: input.email,
        password: input.password,
      },
      attributes: {
        firstName: input.firstName,
        lastName: input.lastName,
        telephone: input.telephone,
        email: input.email,
      },
    });

    const verificationToken = $verificationTokenController.createToken(
      generateRandomString(63, alphabet("a-z", "0-9")),
      user.email
    );

    await $db.transaction(async (tx) => {
      await tx.insert($schema.tokens).values({
        email: user.email,
        tokenType: TOKEN_TYPE.VALIDATION,
        createdAt: BigInt($dayjs.utc().unix()),
        token: verificationToken.value,
      });

      const school = await tx
        .insert($schema.schools)
        .values({
          name: input.schoolName,
          acronym: input.schoolAcronym,
        })
        .returning();
      await tx.insert($schema.schoolUsers).values({
        schoolId: school[0].id,
        userId: user.id,
        role: ROLE.DIRECTOR,
      });
      return user;
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
