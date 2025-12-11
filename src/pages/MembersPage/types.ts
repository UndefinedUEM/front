import type { Role, Section } from '@/types';
import { z } from 'zod';

export const createMemberSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  id: z.string().min(1, 'ID/Registro é obrigatório'),
  role: z.string().min(1, 'Cargo é obrigatório'),
  section: z.string().min(1, 'Seção é obrigatória'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const editMemberSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  id: z.string(),
  role: z.string().min(1, 'Cargo é obrigatório'),
  section: z.string().min(1, 'Seção é obrigatória'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type CreateMemberFormData = z.infer<typeof createMemberSchema>;
export type EditMemberFormData = z.infer<typeof editMemberSchema>;
