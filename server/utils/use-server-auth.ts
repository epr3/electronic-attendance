import { type H3Event } from "h3";
import { User } from "@prisma/client";

export async function useServerAuth(event: H3Event): Promise<User> {
  const session = await useServerSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "UNAUTHORIZED",
      message: "You are not authenticated",
    });
  }

  return session.user;
}
