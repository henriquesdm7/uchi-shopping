import {CreateUserSchema} from "#shared/utils/user.schema";
import {z} from "zod";

export default defineEventHandler(async (event) => {
  const validated = await readValidatedBody(event, (body) => CreateUserSchema.safeParse(body));

  if (!validated.success) {
    throw createError({
      status: 400,
      message: 'Erro de validação',
      data: z.treeifyError(validated.error),
    })
  }

  return await createUser(validated.data);
})
