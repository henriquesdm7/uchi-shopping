// server/api/shopping-lists/index.get.ts
import { shoppingListService } from '#server/utils/services/shoppingList.service';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  return shoppingListService.getAllLists(session.user.id);
});
