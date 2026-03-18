import {getProductStats} from "#server/utils/services/product";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID missing' });
  }

  const result = await getProductStats(id);
  if (!result) {
    throw createError({ statusCode: 404, message: 'Product not found' });
  }

  return result;
})
