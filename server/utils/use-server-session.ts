import { getIronSession, type IronSession } from "iron-session";
import type { H3Event } from "h3";
import { User } from "@prisma/client";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
    mfaVerified?: boolean;
  }
}

export async function useServerSession(event: H3Event): Promise<IronSession> {
  // const config = useRuntimeConfig();
  if (event.context.session) {
    return event.context.session;
  }
  const session = await getIronSession(event.node.req, event.node.res, {
    cookieName: "electronic_attendance",
    password: "complex_password_at_least_32_characters_long",
  });
  event.context.session = session;
  return session;
}
