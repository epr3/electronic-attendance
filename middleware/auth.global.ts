import { ROLE } from "@prisma/client";

export default defineNuxtRouteMiddleware((to) => {
  const session = useAuth();

  if (to.meta.layout === "auth") {
    // if (!session.value.user || !session.value.user.verifiedAt) {
    if (!session.value || !session.value.user) {
      return navigateTo("/login");
    }

    if (
      !session.value.user.mfa &&
      [ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER].includes(
        session.value.user.role
      )
    ) {
      return navigateTo("/mfa");
    }

    if (!session.value.mfaVerified) {
      return navigateTo("/mfa/verify");
    }
  }
});
