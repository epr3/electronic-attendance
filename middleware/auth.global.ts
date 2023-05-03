export default defineNuxtRouteMiddleware((to) => {
  const session = useAuth();

  if (to.meta.layout === "auth") {
    if (!session.value.user || !session.value.user.verifiedAt) {
      return navigateTo("/login");
    }
  }
});
