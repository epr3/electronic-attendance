import type { ROLE, SchoolUser, User, UserSession } from "~/database/schema";

export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();
  if (!user.value) {
    const { data, error } = await useFetch<
      User & {
        roles: ROLE[];
        session: UserSession;
        schools: SchoolUser[];
      }
    >(api.auth.session);
    if (error.value) {
      return abortNavigation(error.value);
    }

    user.value = data.value ?? null;
  }
});
