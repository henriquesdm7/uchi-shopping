import { z } from 'zod'

export const unifyProductSchema = z.object({
  baseProductId: z.string().uuid('ID do produto principal inválido'),
  duplicateProductId: z.string().uuid('ID do produto duplicado inválido')
}).refine(data => data.baseProductId !== data.duplicateProductId, {
  message: 'O produto base e o duplicado não podem ser o mesmo.',
  path: ['duplicateProductId']
});
