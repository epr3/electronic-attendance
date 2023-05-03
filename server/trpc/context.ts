import { User } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import type { H3Event } from "h3";
import { IronSessionData, IronSession } from "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = (event: H3Event) => {
  const prisma = event.context.prisma;
  const session = event.context.session as IronSession & IronSessionData;

  return { prisma, session };
};

export type Context = inferAsyncReturnType<typeof createContext>;
