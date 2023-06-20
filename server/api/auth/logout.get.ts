export default defineEventHandler((event) => {
  useServerAuth(event);
  event.context.session.destroy();
});
