import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck } from 'lucide-react';

interface AttendanceStatsProps {
  total: number;
  present: number;
}

const AttendanceStats = ({ total, present }: AttendanceStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="border-border bg-card">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-card-foreground">{total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-full bg-chart-2/20 p-2">
            <UserCheck className="h-5 w-5 text-chart-2" />
          </div>
          <div>
            <p className="text-xl font-bold text-card-foreground">{present}</p>
            <p className="text-xs text-muted-foreground">Presentes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;
