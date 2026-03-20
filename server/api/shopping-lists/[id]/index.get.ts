// server/api/shopping-lists/[id]/index.get.ts
import { shoppingListService } from '#server/utils/services/shoppingList.service';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID da lista inválido' });
  
  return shoppingListService.getListById(id);
});
