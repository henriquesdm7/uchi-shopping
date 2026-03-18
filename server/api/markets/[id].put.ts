import {updateMarket} from "#server/utils/services/market";
import {UpdateMarketSchema} from "#shared/utils/market.schema";
import {z} from "zod";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({
      status: 400,
      message: 'ID inválido',
    })
  }

  const validated = await readValidatedBody(event, (body) => UpdateMarketSchema.safeParse(body));

  if (!validated.success) {
    throw createError({
      status: 400,
      message: 'Erro de validação',
      data: z.treeifyError(validated.error),
    })
  }

  return await updateMarket(id, validated.data);
})

