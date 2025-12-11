import { z } from 'zod';
import { SECTIONS } from '@/types';

export const loginSchema = z.object({
  userId: z.string().min(1, 'ID é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    userId: z.string().min(3, 'ID deve ter pelo menos 3 caracteres'),
    role: z.string().min(1, 'Selecione uma função'),
    section: z.enum(SECTIONS as [string, ...string[]], {
      error: () => ({ message: 'Selecione uma seção válida' }),
    }),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

export const scoutSchema = z.object({
  scoutId: z.string().min(1, 'ID é obrigatório'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  section: z.enum(SECTIONS as [string, ...string[]], {
    error: () => ({ message: 'Selecione uma seção Válida' }),
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ScoutFormData = z.infer<typeof scoutSchema>;
