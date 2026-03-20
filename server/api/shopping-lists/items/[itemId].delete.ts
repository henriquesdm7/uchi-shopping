// server/api/shopping-lists/items/[itemId].delete.ts
import { shoppingListService } from '#server/utils/services/shoppingList.service';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const itemId = getRouterParam(event, 'itemId');
  if (!itemId) throw createError({ statusCode: 400, statusMessage: 'ID do item inválido' });

  return shoppingListService.deleteItem(itemId);
});
