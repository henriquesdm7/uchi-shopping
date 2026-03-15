import {z} from 'zod';

export const PasswordLoginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(8, 'Senha deve conter pelo menos 8 caracteres'),
})

export type PasswordLoginInput = z.infer<typeof PasswordLoginSchema>;
