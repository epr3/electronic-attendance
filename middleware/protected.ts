import { ROLE } from "~/database/schema";

export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();

  console.log(user.value);
  if (!user.value) {
    return navigateTo("/login");
  }

  if (
    user.value &&
    !user.value.mfaEnabled &&
    user.value.schools.some((item) =>
      [ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER].includes(item.role)
    )
  ) {
    return navigateTo(routes.auth.mfa);
  }

  if (user.value && !user.value.session.mfaVerified) {
    return navigateTo(routes.auth.mfaVerify);
  }
});
