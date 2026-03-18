import {getProducts} from "#server/utils/services/product";

export default defineEventHandler(async (event) => {
  return await getProducts();
})
