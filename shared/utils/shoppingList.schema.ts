import { z } from 'zod';

export const CreateShoppingListSchema = z.object({
  name: z.string().min(1, 'O nome da lista é obrigatório')
});

export type CreateShoppingListInput = z.infer<typeof CreateShoppingListSchema>;

export const AddShoppingListItemSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório'),
  productId: z.string().optional(),
  quantity: z.number().positive('A quantidade deve ser positiva').optional().default(1)
});

export type AddShoppingListItemInput = z.infer<typeof AddShoppingListItemSchema>;

export const UpdateShoppingListItemSchema = z.object({
  checked: z.boolean().optional(),
  quantity: z.number().positive().optional()
});

export type UpdateShoppingListItemInput = z.infer<typeof UpdateShoppingListItemSchema>;
