import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Eye, Download } from 'lucide-react';
import type { Event } from '../types';

interface PastEventsTabProps {
  events: Event[];
  onViewDetails: (event: Event) => void;
  onDownload: (event: Event) => void;
}

const PastEventsTab = ({
  events,
  onViewDetails,
  onDownload,
}: PastEventsTabProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Badge variant="default">Em andamento</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Agendado</Badge>;
      case 'completed':
        return <Badge variant="outline">Finalizado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3 pt-4">
      {events.map((event) => (
        <Card
          key={event.id}
          className="border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onViewDetails(event)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-card-foreground">
                    {event.name}
                  </h3>
                  {getStatusBadge(event.status)}
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.date + 'T12:00:00').toLocaleDateString(
                      'pt-BR'
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </span>
                </div>
                <p className="mt-2 text-sm text-primary">
                  {event.attendees} participantes
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(event);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(event);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PastEventsTab;
