import {
  type UserSession,
  type SchoolUser,
  type User,
} from "~/database/schema";

export const useUser = () => {
  const user = useState<
    | (User & {
        session: UserSession;
        schools: SchoolUser[];
      })
    | null
  >("user", () => null);

  return user;
};
