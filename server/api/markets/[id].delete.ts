import {deleteMarket} from "#server/utils/services/market";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({
      status: 400,
      message: 'ID inválido',
    })
  }

  return await deleteMarket(id);
})

