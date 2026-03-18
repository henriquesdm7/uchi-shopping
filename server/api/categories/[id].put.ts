import {updateCategory} from "#server/utils/services/category";
import {UpdateCategorySchema} from "#shared/utils/category.schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, message: 'ID missing'});
  }

  const result = await readValidatedBody(event, body => UpdateCategorySchema.safeParse(body));
  if (!result.success) {
    throw createError({statusCode: 400, message: 'Invalid data'});
  }

  return await updateCategory(id, result.data);
});

