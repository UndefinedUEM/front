import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  ChevronRight,
  Clock,
  MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { initialScouts, recentAttendance } from '@/mock-list';
import { getSectionColor } from '@/utils/getSectionColor';

const stats = [
  {
    label: 'Escoteiros',
    value: initialScouts.length,
    icon: Users,
    color: 'text-primary',
  },
  {
    label: 'Eventos',
    value: '12',
    icon: Calendar,
    color: 'text-accent-foreground',
  },
  {
    label: 'Presenças hoje',
    value: '42',
    icon: ClipboardCheck,
    color: 'text-chart-2',
  },
  {
    label: 'Taxa de presença',
    value: '87%',
    icon: TrendingUp,
    color: 'text-chart-4',
  },
];

const upcomingEvents = [
  {
    id: '1',
    name: 'Reunião Semanal',
    date: '03 Dez 2025',
    time: '14:00',
    location: 'Sede do Grupo',
    status: 'ongoing',
  },
  {
    id: '2',
    name: 'Acampamento Regional',
    date: '15 Dez 2025',
    time: '08:00',
    location: 'Parque Municipal',
    status: 'scheduled',
  },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Usuário';

  const renderGreeting = () => (
    <div>
      <h2 className="text-2xl font-bold text-foreground">
        Olá, {firstName}! 👋
      </h2>
      <p className="text-muted-foreground">Bem-vindo de volta ao sistema</p>
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`rounded-full bg-primary/10 p-2 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderQuickActions = () => (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-card-foreground">
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Link to="/attendance">
          <Button className="w-full justify-start gap-2" variant="default">
            <ClipboardCheck className="h-4 w-4" />
            Marcar Presença
          </Button>
        </Link>
        <Link to="/events">
          <Button className="w-full justify-start gap-2" variant="outline">
            <Calendar className="h-4 w-4" />
            Novo Evento
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  const renderUpcomingEvents = () => (
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
      <CardContent className="space-y-3">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">{event.name}</h4>
                <Badge
                  variant={event.status === 'ongoing' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {event.status === 'ongoing' ? 'Em andamento' : 'Agendado'}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {event.date} - {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderRecentAttendance = () => (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg text-card-foreground">
          Presenças Recentes
        </CardTitle>
        <Link to="/attendance">
          <Button variant="ghost" size="sm" className="text-primary">
            Ver lista <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentAttendance.map((scout, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-background px-3 py-2"
          >
            <div>
              <p className="font-medium text-foreground">{scout.name}</p>
              <Badge
                variant="outline"
                className={`text-xs ${getSectionColor(scout.section)}`}
              >
                {scout.section}
              </Badge>
            </div>
            <Badge variant={scout.isPresent ? 'default' : 'destructive'}>
              {scout.isPresent ? 'Presente' : 'Ausente'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <AppLayout title="Início">
      <div className="space-y-6 p-4">
        {renderGreeting()}

        {renderStats()}

        {renderQuickActions()}

        {renderUpcomingEvents()}

        {renderRecentAttendance()}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
