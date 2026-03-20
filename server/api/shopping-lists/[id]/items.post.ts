// server/api/shopping-lists/[id]/items.post.ts
import { shoppingListService } from '#server/utils/services/shoppingList.service';
import { AddShoppingListItemSchema } from '#shared/utils/shoppingList.schema';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const listId = getRouterParam(event, 'id');
  if (!listId) throw createError({ statusCode: 400, statusMessage: 'ID da lista inválido' });

  const body = await readValidatedBody(event, (body) => AddShoppingListItemSchema.safeParse(body));

  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: body.error.issues });
  }

  return shoppingListService.addItem(listId, body.data);
});
