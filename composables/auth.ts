import {
  type UserSession,
  type SchoolUser,
  type User,
} from "~/database/schema";

export const useUserSession = () => {
  const data = useState<{
    user: User & {
      schools: SchoolUser[];
    };
    session: UserSession;
  } | null>("user", () => null);

  return data;
};