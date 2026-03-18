import {getPurchaseById} from "#server/utils/services/purchase";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID is required' });
  }
  const purchase = await getPurchaseById(id);
  if (!purchase) {
    throw createError({ statusCode: 404, message: 'Purchase not found' });
  }
  return purchase;
})

