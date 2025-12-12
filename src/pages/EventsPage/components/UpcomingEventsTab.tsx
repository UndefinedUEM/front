import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import type { Event } from '../types';

interface UpcomingEventsTabProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string, name: string) => void;
  onViewDetails: (event: Event) => void;
  canManage: boolean;
}

const UpcomingEventsTab = ({
  events,
  onEdit,
  onDelete,
  onViewDetails,
  canManage,
}: UpcomingEventsTabProps) => {
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
                {event.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
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
              </div>

              {canManage && (
                <div
                  className="flex gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(event)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(event.id, event.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {event.status === 'ongoing' && (
              <div onClick={(e) => e.stopPropagation()}>
                <Link to="/attendance">
                  <Button className="mt-3 w-full" size="sm">
                    Marcar Presença
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UpcomingEventsTab;
