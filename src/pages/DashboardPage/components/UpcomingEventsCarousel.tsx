import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { upcomingEvents } from '@/mock-list';

const UpcomingEventsCarousel = () => {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg text-card-foreground">
          Próximos Eventos
        </CardTitle>
        <Link to="/events">
          <Button variant="ghost" size="sm" className="text-primary">
            Ver todos <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="flex w-full gap-3 overflow-x-auto pb-4 scrollbar-hide md:flex-col md:overflow-visible md:pb-4">
        {upcomingEvents.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className="flex min-w-[260px] flex-none flex-col justify-between rounded-lg border border-border bg-background p-3 shadow-sm md:w-full md:min-w-0"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground line-clamp-1 mr-2">
                  {event.name}
                </h4>
                <Badge
                  variant={event.status === 'ongoing' ? 'default' : 'secondary'}
                  className="text-[10px] shrink-0"
                >
                  {event.status === 'ongoing' ? 'Em andamento' : 'Agendado'}
                </Badge>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>
                    {event.date} • {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsCarousel;
