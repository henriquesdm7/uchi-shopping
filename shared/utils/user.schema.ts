import {z} from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.email('Email inválido'),
  password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres'),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
