import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface EventHeaderProps {
  eventName: string;
  eventDate: Date;
  status: 'em_andamento' | 'salva';
}

const statusLabels = {
  em_andamento: 'Em andamento',
  salva: 'Finalizada',
};

const statusVariants = {
  em_andamento: 'default',
  salva: 'outline',
} as const;

const EventHeader = ({ eventName, eventDate, status }: EventHeaderProps) => {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-card-foreground">{eventName}</h3>
            <p className="text-sm text-muted-foreground">
              {format(eventDate, "dd 'de' MMMM, yyyy")}
            </p>
          </div>
          <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventHeader;
