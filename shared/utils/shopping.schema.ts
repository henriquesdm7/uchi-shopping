import {z} from 'zod';

export const RegisterShoppingSchema = z.object({
  marketId: z.string(),
  date: z.string(),
  file: z.instanceof(File),
})

export type RegisterShoppingInput = z.infer<typeof RegisterShoppingSchema>;
