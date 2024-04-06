import { ROLE } from "~/database/schema";

export default defineNuxtRouteMiddleware(async () => {
  const data = useUserSession();

  console.log("protected", data.value);
  if (!data.value || !data.value.user || !data.value.session) {
    return navigateTo("/login");
  }

  if (
    data.value &&
    data.value.user &&
    !data.value.user.mfaEnabled &&
    data.value.user.schools.some((item) =>
      [ROLE.ADMIN, ROLE.DIRECTOR, ROLE.TEACHER].includes(item.role)
    )
  ) {
    return navigateTo(routes.auth.mfa);
  }

  if (data.value && data.value.session && !data.value.session.mfaVerified) {
    return navigateTo(routes.auth.mfaVerify);
  }
});