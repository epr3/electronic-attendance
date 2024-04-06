import { now } from "@internationalized/date";
import { verifyRequestOrigin } from "oslo/request";
import type { SchoolUser, User, UserSession } from "~/database/schema";

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== "GET") {
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return event.node.res.writeHead(403).end();
    }
  }

  const sessionId = getCookie(event, COOKIE_NAME) ?? null;
  if (!sessionId) {
    event.context.session = null;
    event.context.user = null;
    return;
  }

  const data = await getServerUser(sessionId);
  const session = data?.session ?? null;
  const user = data?.user ?? null;
  if (session) {
    const cookie = createCookie(
      sessionId,
      now("UTC")
        .add({ days: Number(process.env.SESSION_EXPIRY_DAYS as string) })
        .toDate()
    );

    setCookie(event, COOKIE_NAME, cookie.value, {
      ...cookie.attributes,
    });
  }
  if (!session) {
    setCookie(event, COOKIE_NAME, "", { ...COOKIE_ATTRIBUTES, maxAge: -1 });
  }
  console.log("server middleware", data);
  event.context.session = session;
  event.context.user = user;
});

declare module "h3" {
  interface H3EventContext {
    user:
      | (Omit<User, "createdAt" | "updatedAt" | "verifiedAt" | "address"> & {
          schools: SchoolUser[];
        })
      | null;
    session: UserSession | null;
  }
}
