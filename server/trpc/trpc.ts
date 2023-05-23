import { ROLE, PrismaClient, School, SchoolUser, User } from "@prisma/client";
/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { initTRPC, TRPCError } from "@trpc/server";
import { object, string, ZodError } from "zod";
import superjson from "superjson";
import { Context } from "~/server/trpc/context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;

const isAuthed = middleware(({ ctx, next }) => {
  const user = ctx.session.user;
  if (!user || !user.verifiedAt) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not logged in",
    });
  }

  return next({ ctx: { ...ctx, user } });
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const schoolProcedure = protectedProcedure.input(
  object({ schoolId: string().uuid() })
);

export const yearProcedure = schoolProcedure.input(
  object({
    yearId: string().uuid(),
  })
);

export const getSchool = async (schoolId: string, prisma: PrismaClient) => {
  const school = await prisma.school.findFirstOrThrow({
    where: { id: schoolId },
    include: {
      users: true,
    },
  });

  return school;
};

export const checkIfUserAuthorized = (
  user: User,
  school: School & {
    users: SchoolUser[];
  }
) => {
  const index = school.users.findIndex((item) => item.userId === user.id);

  if (index === -1) {
    return false;
  }

  return (
    school.users[index].role === ROLE.ADMIN ||
    school.users[index].role === ROLE.DIRECTOR
  );
};
