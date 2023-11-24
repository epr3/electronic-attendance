import { ROLE } from "~/drizzle/schema";
import type {
  SelectSchoolType,
  SelectSchoolUserType,
  SelectUserSessionType,
  SelectUserType,
} from "~/drizzle/types";

export default defineNuxtRouteMiddleware(async (to) => {
  const { $api } = useNuxtApp();
  const user = useUser();
  if (!user.value && to.meta.layout === "auth") {
    const { data, error } = await useFetch<
      SelectUserType & {
        roles: ROLE[];
        session: SelectUserSessionType;
        schools: (SelectSchoolUserType & { school: SelectSchoolType })[];
      }
    >($api.auth.session);
    if (error.value) {
      throw createError("Failed to fetch data");
    }

    user.value = data.value ?? null;
  }
});
