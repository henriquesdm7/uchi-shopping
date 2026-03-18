import {z} from 'zod';

export const CreateMarketSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export const UpdateMarketSchema = CreateMarketSchema.partial()

export type CreateMarketInput = z.infer<typeof CreateMarketSchema>;
export type UpdateMarketInput = z.infer<typeof UpdateMarketSchema>;

