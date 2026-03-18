import {CreateMarketSchema} from "#shared/utils/market.schema";
import {createMarket} from "#server/utils/services/market";
import {z} from "zod";

export default defineEventHandler(async (event) => {
  const validated = await readValidatedBody(event, (body) => CreateMarketSchema.safeParse(body));

  if (!validated.success) {
    throw createError({
      status: 400,
      message: 'Erro de validação',
      data: z.treeifyError(validated.error),
    })
  }

  return await createMarket(validated.data);
})

