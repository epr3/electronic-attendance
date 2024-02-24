export default defineEventHandler(async (event) => {
  const user = await getServerUser(event);

  if (!user) {
    return null;
  }
  return user;
});
