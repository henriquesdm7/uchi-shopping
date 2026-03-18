import {getCategoryById} from "#server/utils/services/category";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, message: 'ID missing'});
  }
  const category = await getCategoryById(id);
  if (!category) {
    throw createError({statusCode: 404, message: 'Category not found'});
  }
  return category;
});

