import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ongoing':
      return <Badge variant="default"> Em andamento </Badge>;
    case 'scheduled':
      return <Badge variant="secondary"> Agendado </Badge>;
    case 'completed':
      return <Badge variant="outline"> Finalizado </Badge>;
    default:
      return null;
  }
};
