import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { getSectionColor } from '@/utils/getSectionColor';
import type { Section } from '@/types';

interface AttendanceItem {
  id: string;
  name: string;
  isPresent: boolean;
  section?: Section;
  role?: string;
}

interface AttendanceListProps {
  items: AttendanceItem[];
  onToggle: (id: string) => void;
  isDisabled: boolean;
  emptyMessage?: string;
  type: 'scout' | 'leader';
}

const AttendanceList = ({
  items,
  onToggle,
  isDisabled,
  emptyMessage = 'Nenhum registro encontrado.',
  type,
}: AttendanceListProps) => {
  return (
    <Card className="border-border bg-card">
      <CardContent className="divide-y divide-border p-0">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 ${
              isDisabled ? 'cursor-default opacity-80' : 'cursor-pointer'
            }`}
            onClick={() => onToggle(item.id)}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={item.isPresent}
                onCheckedChange={() => onToggle(item.id)}
                onClick={(e) => e.stopPropagation()}
                disabled={isDisabled}
              />
              <div>
                <p className="font-medium text-card-foreground">{item.name}</p>
                {type === 'scout' && item.section ? (
                  <Badge
                    variant="outline"
                    className={`text-xs ${getSectionColor(item.section)}`}
                  >
                    {item.section}
                  </Badge>
                ) : (
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                )}
              </div>
            </div>
            <Badge variant={item.isPresent ? 'default' : 'secondary'}>
              {item.isPresent ? 'Presente' : 'Ausente'}
            </Badge>
          </div>
        ))}
        {items.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceList;
