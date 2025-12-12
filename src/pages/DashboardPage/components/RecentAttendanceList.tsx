import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { recentAttendance } from '@/mock-list';
import { getSectionColor } from '@/utils/getSectionColor';

const RecentAttendanceList = () => {
  return (
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
};

export default RecentAttendanceList;
