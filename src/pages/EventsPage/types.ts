import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  location: z.string().min(1, 'Local é obrigatório'),
  description: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

export type EventStatus = 'ongoing' | 'scheduled' | 'completed';

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  status: EventStatus;
  attendees?: number;
}

export interface Attendee {
  id: string;
  name: string;
  role?: string;
  section?: string;
  isPresent: boolean;
}

export interface EventDetails {
  scouts: Attendee[];
  leaders: Attendee[];
}
