import { object, string } from "zod";
import { generateRandomString, alphabet } from "oslo/random";
import { HMAC } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { ROLE, TOKEN_TYPE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
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
    await db.transaction(async (tx) => {
      const user = await tx
        .insert(schema.users)
        .values({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          telephone: input.telephone,
        })
        .returning();

      await tx.insert(schema.userKeys).values({
        id: `email:${user[0].email}`,
        userId: user[0].id,
        hashedPassword: await argon2id.hash(input.password),
      });

      if (dayjs(Number(user[0].createdAt)).isSame(Number(user[0].updatedAt))) {
        await tx.insert(schema.tokens).values({
          email: input.email,
          token: generateRandomString(63, alphabet("a-z", "0-9")),
          tokenType: TOKEN_TYPE.VALIDATION,
        });

        const secret = await new HMAC("SHA-1").generateKey();

        await tx.insert(schema.userMfas).values({
          userId: user[0].id,
          secret: encodeHex(secret),
          smsOnly: false,
        });

        const school = await tx
          .insert(schema.schools)
          .values({
            name: input.schoolName,
            acronym: input.schoolAcronym,
          })
          .returning();
        await tx.insert(schema.schoolsUsers).values({
          schoolId: school[0].id,
          userId: user[0].id,
          role: ROLE.DIRECTOR,
        });
        return user;
      }
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
