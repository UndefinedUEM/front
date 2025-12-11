import { Role } from '@/types';

export const getRoleColor = (role: Role): string => {
  switch (role) {
    case Role.MASTER:
      return 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30';

    case Role.CHEFE_SECAO:
      return 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border-indigo-500/30';

    case Role.MONITOR:
      return 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30';

    default:
      return 'bg-secondary text-secondary-foreground';
  }
};
