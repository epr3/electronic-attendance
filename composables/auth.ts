import { ROLE } from "~/drizzle/schema";
import {
  SelectSchoolType,
  SelectSchoolUserType,
  SelectUserSessionType,
  SelectUserType,
} from "~/drizzle/types";

export const useUser = () => {
  const user = useState<
    | (SelectUserType & {
        roles: ROLE[];
        session: SelectUserSessionType;
        schools: (SelectSchoolUserType & { school: SelectSchoolType })[];
      })
    | null
  >("user", () => null);
  return user;
};

export const useAuthenticatedUser = () => {
  const user = useUser();
  return computed(() => {
    const userValue = unref(user);
    if (!userValue) {
      throw createError(
        "useAuthenticatedUser() can only be used in protected pages"
      );
    }
    return userValue;
  });
};
