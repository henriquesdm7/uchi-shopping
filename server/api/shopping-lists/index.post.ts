// server/api/shopping-lists/index.post.ts
import { shoppingListService } from '#server/utils/services/shoppingList.service';
import { CreateShoppingListSchema } from '#shared/utils/shoppingList.schema';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const body = await readValidatedBody(event, (body) => CreateShoppingListSchema.safeParse(body));

  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', data: body.error.issues });
  }

  return shoppingListService.createList(body.data, session.user.id);
});
