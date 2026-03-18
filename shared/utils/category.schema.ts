import {z} from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  icon: z.string().optional(),
})

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

