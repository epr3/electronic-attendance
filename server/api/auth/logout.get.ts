export default defineEventHandler(async (event) => {
  const session = await useServerSession(event);
  await useServerAuth(event);

  await session.destroy();
  return sendNoContent(event, 204);
});
