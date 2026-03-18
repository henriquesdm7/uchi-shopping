import {getMarketById} from "#server/utils/services/market";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({
      status: 400,
      message: 'ID inválido',
    })
  }
  const market = await getMarketById(id);
  if (!market) {
    throw createError({
      status: 404,
      message: 'Mercado não encontrado',
    })
  }
  return market;
})

