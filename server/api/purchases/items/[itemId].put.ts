import {updatePurchaseItem} from "#server/utils/services/purchase";
import {z} from "zod";

const UpdateItemSchema = z.object({
  quantity: z.number().optional(),
  unitPrice: z.number().optional()
});

export default defineEventHandler(async (event) => {
  const itemId = getRouterParam(event, 'itemId');
  if (!itemId) {
    throw createError({ statusCode: 400, message: 'Item ID is required' });
  }

  const result = await readValidatedBody(event, body => UpdateItemSchema.safeParse(body));

  if (!result.success) {
    throw createError({ statusCode: 400, message: 'Invalid data' });
  }

  // Cast result.data to match expected type with optional properties
  const updateData: { quantity?: number; unitPrice?: number } = result.data;

  // Use updateData instead of result.data
  return await updatePurchaseItem(itemId, updateData);
})
