import { Section } from '@/types';

export const getSectionColor = (section: Section): string => {
  switch (section) {
    case Section.ALCATEIA_JANGAL:
    case Section.ALCATEIA_FLOR_VERMELHA:
    case Section.ALCATEIA_LOBO_GUARA:
      return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    case Section.TROPA_ESCOTEIRA_ESCORPIAO:
    case Section.TROPA_ESCOTEIRA_FENIX:
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30';
    case Section.TROPA_SENIOR_KAINGANG:
      return 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30';
    case Section.CLA_PIONEIRO_AGNIRAM:
      return 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/30';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};
