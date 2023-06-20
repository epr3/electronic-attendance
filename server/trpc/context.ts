import { User } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import type { H3Event } from "h3";
import { IronSessionData, IronSession } from "iron-session";
import { Auth } from "@vonage/auth";
import { SMS } from "@vonage/sms";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = (event: H3Event) => {
  const config = useRuntimeConfig();
  const prisma = event.context.prisma;
  const session = event.context.session as IronSession & IronSessionData;

  const auth = new Auth({
    apiKey: config.vonageApiKey as string,
    apiSecret: config.vonageApiSecret as string,
  });

  const vonage = new SMS(auth);

  return { prisma, session, vonage };
};

export type Context = inferAsyncReturnType<typeof createContext>;
