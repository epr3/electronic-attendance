import { type H3Event } from "h3";
import { ZodError, type ZodTypeAny } from "zod";
import { fromZodError } from "zod-validation-error";

export async function useValidatedBody(event: H3Event, schema: ZodTypeAny) {
  try {
    const body = await readBody(event);

    return await schema.parseAsync(body);
  } catch (e) {
    throw createError({
      statusCode: 422,
      statusMessage: "VALIDATION_ERROR",
      message: fromZodError(e as ZodError).message,
    });
  }
}
