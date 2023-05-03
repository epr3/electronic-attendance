import { object, string } from "zod";
import { protectedProcedure, router } from "../trpc";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { subjectRouter } from "./subject";
import { yearRouter } from "./years";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  subject: subjectRouter,
  year: yearRouter,
  hello: protectedProcedure
    .input(
      object({
        text: string(),
      })
    )
    .query(({ input, ctx }) => {
      return {
        user: ctx.session.user,
        greeting: `hello ${input?.text ?? "world"}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
