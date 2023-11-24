import { generateRandomString, alphabet } from "oslo/random";
import { nativeEnum, object, string } from "zod";

import { ROLE, TOKEN_TYPE } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  const input = await useValidatedBody(
    event,
    object({
      firstName: string().min(1),
      lastName: string().min(1),
      email: string().email(),
      role: nativeEnum(ROLE),
      telephone: string().min(1),
    })
  );

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const user = await db.transaction(async (tx) => {
      const user = await tx
        .insert(schema.users)
        .values({
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          telephone: input.telephone,
          createdAt: dayjs().utc().toDate(),
          updatedAt: dayjs().utc().toDate(),
        })
        .returning()
        .onConflictDoNothing();
      if (dayjs(Number(user[0].createdAt)).isSame(Number(user[0].updatedAt))) {
        await tx.insert(schema.tokens).values({
          email: input.email,
          tokenType: TOKEN_TYPE.RESET_PASSWORD,
          createdAt: dayjs().utc().toDate(),
          token: generateRandomString(63, alphabet("a-z", "0-9")),
        });
      }

      const schoolUser = await tx
        .insert(schema.schoolsUsers)
        .values({
          schoolId: id,
          userId: user[0].id,
          role: input.role,
        })
        .returning();
      return { ...user[0], role: schoolUser[0].role };
    });
    event.node.res.statusCode = 201;
    return user;
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
