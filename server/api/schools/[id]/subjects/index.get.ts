import { ROLE } from "~/database/schema";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) ?? 1;
  const pageSize = parseInt(query.pageSize as string) ?? 5;
  const id = event.context.params!.id;

  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const [subjects, result] = await Promise.all([
      db
        .selectFrom("subjects")
        .selectAll()
        .where("subjects.schoolId", "=", id)
        .limit(pageSize)
        .offset(page * pageSize)
        .execute(),
      db
        .selectFrom("subjects")
        .select(({ fn }) => fn.count<number>("subjects.id").as("count"))
        .where("subjects.schoolId", "=", id)
        .executeTakeFirst(),
    ]);
    return { subjects, count: result?.count ?? 0 };
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
