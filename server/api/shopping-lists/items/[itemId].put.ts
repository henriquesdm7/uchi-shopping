// server/api/shopping-lists/items/[itemId].put.ts
import { shoppingListService } from '#server/utils/services/shoppingList.service';
import { UpdateShoppingListItemSchema } from '#shared/utils/shoppingList.schema';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const itemId = getRouterParam(event, 'itemId');
  if (!itemId) throw createError({ statusCode: 400, statusMessage: 'ID do item inválido' });

  const body = await readValidatedBody(event, (body) => UpdateShoppingListItemSchema.safeParse(body));

  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: body.error.issues });
  }

  return shoppingListService.updateItem(itemId, body.data);
});
