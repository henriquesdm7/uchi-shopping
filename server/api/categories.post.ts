import {CreateCategorySchema} from "#shared/utils/category.schema";
import {createCategory} from "#server/utils/services/category";

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => CreateCategorySchema.safeParse(body));
  if (!result.success) {
    throw createError({statusCode: 400, message: 'Invalid data'});
  }
  return await createCategory(result.data);
});

