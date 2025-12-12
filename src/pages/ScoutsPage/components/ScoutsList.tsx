import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, User } from 'lucide-react';
import type { Scout } from '@/types';
import { getSectionColor } from '@/utils/getSectionColor';

interface ScoutsListProps {
  scouts: Scout[];
  onEdit: (scout: Scout) => void;
  onDelete: (scout: Scout) => void;
  canManage: boolean;
}

const ScoutsList = ({
  scouts,
  onEdit,
  onDelete,
  canManage,
}: ScoutsListProps) => {
  return (
    <div className="space-y-3">
      {scouts.map((scout) => (
        <Card key={scout.id} className="border-border bg-card">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">{scout.name}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getSectionColor(scout.section)}`}
                  >
                    {scout.section}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ID: {scout.scoutId} • {scout.attendance}% presença
                  </span>
                </div>
              </div>
            </div>

            {canManage && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(scout)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(scout)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScoutsList;
