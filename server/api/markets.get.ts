import {getMarkets} from "#server/utils/services/market";

export default defineEventHandler((event) => {
  return getMarkets();
})

