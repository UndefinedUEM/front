import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, ClipboardCheck, TrendingUp } from 'lucide-react';
import { initialScouts } from '@/mock-list';

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

const StatsGrid = () => {
  return (
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
};

export default StatsGrid;
