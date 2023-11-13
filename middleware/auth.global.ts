import { ROLE } from "~/drizzle/schema";
import {
  SelectSchoolType,
  SelectSchoolUserType,
  SelectUserSessionType,
  SelectUserType,
} from "~/drizzle/types";

export default defineNuxtRouteMiddleware(async () => {
  const { $api } = useNuxtApp();
  const user = useUser();
  if (!user.value) {
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
