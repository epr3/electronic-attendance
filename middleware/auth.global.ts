import type { NuxtError } from "#app";
import type { SchoolUser, User, UserSession } from "~/database/schema";

export default defineNuxtRouteMiddleware(async () => {
  const sessionData = useUserSession();

  try {
    const data = await useRequestFetch()<{
      user: User & {
        schools: SchoolUser[];
      };
      session: UserSession;
    }>(api.auth.session);

    console.log("middleware", data);
    sessionData.value = data;
  } catch (error) {
    return abortNavigation(error as NuxtError);
  }
});