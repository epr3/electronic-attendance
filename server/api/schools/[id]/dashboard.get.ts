export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  try {
    await useUserRoleSchool(event, id);

    const school = await db
      .selectFrom("schools")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();

    // TODO: create a dashboard materialised view
    return { ...school };
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
