import {getCategories} from "#server/utils/services/category";

export default defineEventHandler(async (event) => {
  return await getCategories();
});

