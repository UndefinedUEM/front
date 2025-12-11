export type UserRole = 'master' | 'chefe_secao' | 'monitor';

export enum Section {
  ALCATEIA_JANGAL = 'Alcateia Jângal',
  ALCATEIA_FLOR_VERMELHA = 'Alcateia Flor Vermelha',
  ALCATEIA_LOBO_GUARA = 'Alcateia Lobo Guará',
  TROPA_ESCOTEIRA_ESCORPIAO = 'Tropa Escoteira Escorpião',
  TROPA_ESCOTEIRA_FENIX = 'Tropa Escoteira Fênix',
  TROPA_SENIOR_KAINGANG = 'Tropa Sênior Kaingang',
  CLA_PIONEIRO_AGNIRAM = 'Clã Pioneiro Agniram',
}

export const SECTIONS = Object.values(Section);

export enum Role {
  MASTER = 'Master',
  CHEFE_SECAO = 'Chefe de Seção',
  MONITOR = 'Monitor',
}

export const ROLES = Object.values(Role);

export interface Member {
  id: string;
  name: string;
  role: Role;
  section: Section;
  email: string;
  password: string;
  isPresent?: boolean;
}

export interface Scout {
  id: string;
  scoutId: string;
  name: string;
  section: Section;
  birthDate?: string;
  attendance?: number;
  isPresent?: boolean;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  status: 'scheduled' | 'ongoing' | 'completed';
}

export interface AttendanceRecord {
  eventId: string;
  scoutId: string;
  isPresent: boolean;
  timestamp: string;
}
