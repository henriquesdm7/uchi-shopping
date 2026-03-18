import {getPurchases} from "#server/utils/services/purchase";

export default defineEventHandler(async (event) => {
  return await getPurchases();
})

