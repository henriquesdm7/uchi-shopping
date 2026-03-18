import {deleteCategory} from "#server/utils/services/category";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, message: 'ID missing'});
  }
  return await deleteCategory(id);
});

