import { User } from "@prisma/client";
import { type H3Event } from "h3";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
    mfaVerified?: boolean;
  }
}

export function useServerAuth(event: H3Event) {
  if (!event.context.session) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "You are not authenticated",
    });
  }

  return event.context.session.user;
}
