export default defineEventHandler(async (event) => {
  return { session: event.context.session, user: event.context.user };
});